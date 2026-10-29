"""Build the local, searchable evidence browser and portable site/API maps."""
import argparse
import html
import json
import re
from pathlib import Path
from knowledge import BRANCHES, DESCRIPTIONS, CORRECTIONS, GAPS

ROOT=Path(__file__).resolve().parent
UUID=re.compile(r'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}',re.I)


def description(name):
    if name in DESCRIPTIONS: return DESCRIPTIONS[name]
    if 'credits used' in name: return 'Quota indicator observed. 100% used does not establish whether every operation is disabled.'
    if 'Fit to view' in name: return 'Fits canvas contents in view. Nodes temporarily disappear during zoom animation; wait for the target node.'
    if name.startswith('Thumbnail '): return 'Selects this item in the detail filmstrip. Index is ephemeral; inspect its asset ID and actual image.'
    if name.startswith('Select image'): return 'Attaches existing upload. Confirm asset identity visually; filenames and indices can be duplicated.'
    if name.startswith('Use @'): return 'Attaches reusable reference named by this control. Observed, not exercised.'
    if re.search(r'\d+:\d+|\d+p$|\d+s$',name): return 'Selects the labelled setting in its parent menu; verify checked state afterward.'
    if name in ['Character','Location','Prop']: return 'Reference category option; menu observed.'
    if name in ['Thumbs up','Thumbs down','Good result','Bad result','Like','Like response','Dislike response','Report issue','Report Issue','Feedback']: return 'Feedback/report/reaction action; observed, not sent.'
    return 'Observed control. Purpose suggested by its label; resulting behavior has not been independently exercised. Re-inspect before use.'


def controls(elements):
    result={}
    for e in elements:
        role=e.get('role') or {'button':'button','a':'link','textarea':'textbox','select':'combobox','input':'input'}.get(e.get('tag'))
        if role not in ['button','link','tab','textbox','radio','menuitem','menuitemradio','option','combobox','slider','input']: continue
        name=e.get('name') or e.get('title') or e.get('placeholder') or e.get('text','').strip()
        if not name or len(name)>120: continue
        key=(role,name)
        if key not in result:
            result[key]={'role':role,'name':name,'description':description(name),'locator':f'getByRole({json.dumps(role)}, {{name: {json.dumps(name)}, exact: true}})', 'count':0,'disabled':e.get('disabled',False)}
        result[key]['count']+=1
    return list(result.values())


def build(evidence, supplements=()):
    sources=[Path(p).resolve() for p in [evidence, *supplements]]
    captures={}
    for source in sources:
        for capture in json.loads((source/'captures.json').read_text(encoding='utf-8')):
            # Last capture wins without discarding other historical states.
            captures[capture['id']]=(source,capture)
    states={}
    endpoints={}
    for evidence,c in captures.values():
        rel=evidence.relative_to(ROOT).as_posix()
        sid=c['id']; c['note']=CORRECTIONS.get(sid,c['note'])
        elements=json.loads((evidence/f'{sid}.elements.json').read_text(encoding='utf-8'))
        network=json.loads((evidence/f'{sid}.network.json').read_text(encoding='utf-8'))
        apis=[]
        for r in network.get('rows',[]):
            if not r['url'].startswith('https://grok.com/'): continue
            route=UUID.sub('{id}',r['url'].replace('https://grok.com',''))
            if not route.startswith(('/rest/','/http/','/grok_api','/prod_mc')): continue
            item=endpoints.setdefault(route,{'route':route,'methods':set(),'statuses':set(),'states':set(),'request_shapes':[]})
            if r.get('method'): item['methods'].add(r['method'])
            if r.get('status'): item['statuses'].add(r['status'])
            item['states'].add(sid)
            if r.get('requestShape') is not None and r['requestShape'] not in item['request_shapes']: item['request_shapes'].append(r['requestShape'])
            apis.append(route)
        screenshot=next((f'{rel}/{sid}.{ext}' for ext in ['jpg','png'] if (evidence/f'{sid}.{ext}').is_file()),None)
        states[sid]={**c,'controls':controls(elements),'api_routes':sorted(set(apis)),
                     'network_available':network.get('available',True),'screenshot':screenshot,
                     'dom':f'{rel}/{sid}.dom.txt','elements':f'{rel}/{sid}.elements.json','network':f'{rel}/{sid}.network.json'}
    api=[]
    for item in endpoints.values():
        for key in ['methods','statuses','states']: item[key]=sorted(item[key])
        api.append(item)
    api.sort(key=lambda x:x['route'])
    portable_states={k:{key:v for key,v in s.items() if key!='url'} for k,s in states.items()}
    capture_dates=sorted({c.get('capturedAt','2026-10-07')[:10] for _,c in captures.values()})
    data={'date':capture_dates[-1],'capture_dates':capture_dates,'evidence_sources':[p.relative_to(ROOT).as_posix() for p in sources],'scope':'Observed Imagine production surfaces; not exhaustive proof of every site feature. Network-unavailable supplementary UI captures are labelled separately.',
          'tree':BRANCHES,'states':portable_states,'api':api,'gaps':GAPS}
    (ROOT/'site-map.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (ROOT/'api-map.json').write_text(json.dumps(api,indent=2)+'\n',encoding='utf-8')
    lines=['# Grok Imagine — observed multilevel map','', 'Captured 2026-10-07. See README.md for operating instructions and coverage limits.','']
    def md_tree(tree,level=0):
        for name,value in tree.items():
            lines.append('  '*level+'- **'+name+'**')
            if isinstance(value,dict): md_tree(value,level+1)
            else:
                for sid in value:
                    if sid in states: lines.append('  '*(level+1)+f'- [{sid}](#{sid}): '+states[sid]['note'])
    md_tree(BRANCHES)
    lines[2]='Captured through '+capture_dates[-1]+'. See README.md for evidence sources and coverage limits.'
    lines+=['', 'Evidence runs: '+', '.join(p.relative_to(ROOT).as_posix() for p in sources)+'.',
            'Supplementary UI-only states do not add verified API routes; see network_available in site-map.json.', '']
    for sid,s in states.items():
        lines+=['',f'## {sid}', '',s['note'],'',f"[DOM]({s['dom']}) · [Elements]({s['elements']}) · [Network]({s['network']})"+(f" · [Screenshot]({s['screenshot']})" if s['screenshot'] else ' · Screenshot unavailable'),'', '| Role / control | Meaning |', '| --- | --- |']
        for c in s['controls']: lines.append(f"| {c['role']} / {c['name'].replace('|','/')} | {c['description'].replace('|','/')} |")
    lines+=['','## Coverage gaps','']+['- '+g for g in GAPS]
    (ROOT/'SITE-MAP.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    e=html.escape
    def html_tree(tree):
        result=''
        for name,value in tree.items():
            result+=f'<details open><summary>{e(name)}</summary>'
            result+=html_tree(value) if isinstance(value,dict) else ''.join(f'<a href="#{sid}">{e(sid)}</a>' for sid in value if sid in states)
            result+='</details>'
        return result
    cards=''
    for sid,s in states.items():
        table=''.join(f'<tr><td><b>{e(c["name"])}</b><small>{e(c["role"])} · {c["count"]} matches</small></td><td>{e(c["description"])}<code>{e(c["locator"])}</code></td></tr>' for c in s['controls'])
        shot=f'<a href="{s["screenshot"]}"><img loading="lazy" src="{s["screenshot"]}" alt="{e(sid)}"></a>' if s['screenshot'] else '<p>Screenshot unavailable; see capture error in index.</p>'
        cards+=f'<section class="state" id="{sid}"><h2>{e(sid)}</h2><p>{e(s["note"])}</p><p><a href="{s["dom"]}">DOM</a> · <a href="{s["elements"]}">Elements + bounds</a> · <a href="{s["network"]}">Network metadata</a></p>{shot}<details><summary>{len(s["controls"])} controls and selectors</summary><table>{table}</table></details><p class="muted">API paths observed: {e(", ".join(s["api_routes"])) or "None captured; this does not prove no request."}</p></section>'
    api_rows=''.join(f'<tr><td><code>{e(x["route"])}</code></td><td>{e(", ".join(x["methods"])) or "method not captured"}</td><td>{e(str(x["statuses"]))}</td></tr>' for x in api)
    document='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Grok Imagine Harness</title>
<style>body{margin:0;background:#10131a;color:#e5e9f2;font:15px/1.6 system-ui}a{color:#83caff}nav{position:fixed;inset:0 auto 0 0;width:270px;overflow:auto;background:#171d27;padding:24px}nav a{display:block;padding-left:14px;font-size:12px}main{margin-left:320px;max-width:1150px;padding:38px}h1{font-size:40px;line-height:1.1}h2{color:#b4dfce}small{display:block;color:#9ba8bc}input{width:90%;padding:12px;background:#0c1119;color:white;border:1px solid #52617a;border-radius:8px}section{background:#19212d;padding:24px;margin:24px 0;border-radius:12px;scroll-margin-top:20px}img{max-width:100%;border-radius:8px}table{border-collapse:collapse;width:100%}td{padding:12px;border-bottom:1px solid #344151;vertical-align:top}code{display:block;white-space:pre-wrap;overflow-wrap:anywhere;color:#99c5f0;font-size:12px}details{margin:8px 0}summary{cursor:pointer}.muted{color:#a1adc0}.badge{display:inline-block;background:#284137;padding:5px 12px;border-radius:20px;margin-right:8px}.warn{border-left:3px solid #ecb86c;padding-left:16px}@media(max-width:900px){nav{position:static;width:auto}main{margin:0;padding:20px}} </style>
<nav><h3>Grok Imagine harness</h3><input id="search" placeholder="Search controls or workflow…" aria-label="Search map"><p><a href="README.md">Start here</a><a href="workflows/frame-continuity.md">A → B → C workflow</a><a href="site-map.json">Machine-readable map</a><a href="#api">API catalogue</a></p>'''+html_tree(BRANCHES)+'''</nav><main><p class="muted">OBSERVED UI · 2026-10-07</p><h1>Direct the frames.<br>Generate the motion.</h1><p>Reusable operating map for Grok Imagine. Start with first/last-frame continuity; inspect evidence before reusing a selector.</p>'''+f'<span class="badge">{len(states)} captured states</span><span class="badge">{len(api)} API routes observed</span>'+'''<section><h2>Continuous sequence</h2><p>A → B &nbsp; | &nbsp; B → C &nbsp; | &nbsp; C → D</p><p>Generate and approve endpoint images. Give Grok first and last frames plus motion. Inspect the rendered ending, then carry that exact accepted frame into the next shot.</p><p class="warn">Canvas “Make Video” immediately submits. Detail “Make Video” opens a menu. Escape can leave detail view. Saved asset IDs must be checked against the actual image.</p></section>'''+cards+f'<section id="api"><h2>Observed API routes</h2><p>Passive observations, not a supported public API contract. IDs normalized; no credentials, headers, query values or media payloads retained. Never infer a generation endpoint from these read requests.</p><table>{api_rows}</table></section><section><h2>Coverage limits</h2><ul>'+''.join(f'<li>{e(g)}</li>' for g in GAPS)+'''</ul></section></main><script>document.querySelector('#search').addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('.state').forEach(s=>s.hidden=!s.textContent.toLowerCase().includes(q))});</script></html>'''
    workflow_links='<a href="SKILL.md">Main harness skill</a><a href="README.md">Setup and reuse</a><a href="workflows/shot-design.md">Shot planning</a><a href="workflows/prompting-and-generation.md">Prompting and generation</a><a href="workflows/native-editing.md">Native and Agent editing</a><a href="workflows/browser-actions.md">Browser actions</a><a href="workflows/asset-ledger.md">Asset and take ledger</a>'
    workflow_links+='<a href="workflows/frame-controls.md">Frame roles: First / Intermediate / Last / Loop / Reference (2026-10-27)</a>'
    document=document.replace('OBSERVED UI · 2026-10-07','OBSERVED UI · '+e(' / '.join(capture_dates)))
    document=document.replace('<a href="README.md">Start here</a>',workflow_links,1)
    (ROOT/'index.html').write_text(document,encoding='utf-8')
    return {'states':len(states),'screenshots':sum(bool(s['screenshot']) for s in states.values()),'control_occurrences':sum(len(s['controls']) for s in states.values()),'api_routes':len(api)}


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('evidence',nargs='?',help='Primary evidence run; omitted: preserve and merge every local capture index')
    parser.add_argument('--supplement',action='append',default=[])
    args=parser.parse_args()
    sources=[Path(args.evidence)] if args.evidence else sorted(p.parent for p in (ROOT/'evidence').rglob('captures.json'))
    sources+=list(map(Path,args.supplement))
    if not sources: parser.error('No capture indexes found')
    print(json.dumps(build(sources[0],sources[1:]),indent=2))
