import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from continuity import extract, validate, assemble, run, probe, ready


class ContinuityTests(unittest.TestCase):
    def test_three_frame_preflight_rejects_missing_unreviewed_and_out_of_range_middle(self):
        # Local planning validation only: actual media decoding is exercised by
        # the separate integration test, not claimed by this metadata fixture.
        with tempfile.TemporaryDirectory() as td, patch('continuity.probe',return_value={'streams':[{'width':160,'height':90}]}):
            p=Path(td)
            for name in ('first.png','middle.png','last.png','master.png'):
                (p/name).write_bytes(b'unit metadata fixture')
            shot={'id':'s01','first_frame':'first.png','planned_last_frame':'last.png','image_review':'accepted','motion_prompt':'One action','duration_target':15,
                  'intermediate_required':True,'intermediate_frame':'middle.png','intermediate_review':'accepted','intermediate_time_seconds':22/3}
            plan={'project_name':'Film','project_details_verified':True,'project_packet_uploaded':True,
                  'characters':[{'name':'Actor','registered':True,'master':'master.png'}],'shots':[shot]}
            file=p/'plan.json'
            def check():
                file.write_text(json.dumps(plan),encoding='utf-8')
                return ready(file)
            self.assertTrue(check()['ready'])
            shot['intermediate_frame']='absent.png'
            with self.assertRaisesRegex(ValueError,'missing intermediate_frame'): check()
            shot['intermediate_frame']=None
            with self.assertRaisesRegex(ValueError,'required intermediate_frame'): check()
            shot['intermediate_frame']='middle.png'
            shot['intermediate_review']='pending'
            with self.assertRaisesRegex(ValueError,'inspect the intermediate'): check()
            shot['intermediate_review']='accepted'
            for time in (0,15,-1,'7.5',True,float('inf'),float('nan')):
                with self.subTest(time=time):
                    shot['intermediate_time_seconds']=time
                    with self.assertRaisesRegex(ValueError,'inside duration_target'): check()
            shot['intermediate_time_seconds']=22/3
            (p/'middle.png').unlink()
            with self.assertRaisesRegex(ValueError,'missing intermediate_frame'): check()

    def test_middle_dimensions_must_match_both_endpoints(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)
            for name in ('first.png','middle.png','last.png'):
                (p/name).write_bytes(b'unit metadata fixture')
            plan={'shots':[{'id':'s01','first_frame':'first.png','intermediate_frame':'middle.png','planned_last_frame':'last.png'}]}
            file=p/'plan.json';file.write_text(json.dumps(plan),encoding='utf-8')
            def metadata(file):
                return {'streams':[{'width':80 if Path(file).name=='middle.png' else 160,'height':90}]}
            with patch('continuity.probe',side_effect=metadata):
                with self.assertRaisesRegex(ValueError,'intermediate frame dimensions differ'): validate(file)

    def test_real_decode_chain_and_mixed_audio_assembly(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)
            for name,color,audio in [('a','red',True),('b','blue',False)]:
                cmd=['ffmpeg','-hide_banner','-loglevel','error','-f','lavfi','-i',f'color=c={color}:s=160x90:r=24:d=0.5']
                if audio: cmd+=['-f','lavfi','-i','sine=frequency=440:duration=0.5']
                cmd+=['-c:v','libx264','-pix_fmt','yuv420p']
                if audio: cmd+=['-c:a','aac','-shortest']
                run(cmd+[p/f'{name}.mp4'])
            a=extract(p/'a.mp4',p/'a-frames')
            b=extract(p/'b.mp4',p/'b-frames')
            self.assertEqual(a['width'],160)
            self.assertNotEqual(a['last_sha256'],b['last_sha256'])
            manifest={'shots':[
                {'id':'a','boundary':'cut','first_frame':'a-frames/first.png','planned_last_frame':'a-frames/last.png','actual_last_frame':'a-frames/last.png','clip':'a.mp4','review':'accepted'},
                {'id':'b','boundary':'continuous','first_frame':'b-frames/first.png','planned_last_frame':'b-frames/last.png','actual_last_frame':'b-frames/last.png','clip':'b.mp4','review':'accepted'}]}
            file=p/'plan.json'
            file.write_text(json.dumps(manifest))
            with self.assertRaisesRegex(ValueError,'differs from preceding'): validate(file)
            manifest['shots'][1]['boundary']='cut'
            manifest['shots'][1]['review']='pending'
            file.write_text(json.dumps(manifest))
            with self.assertRaisesRegex(ValueError,'accepted local clip'): assemble(file,p/'film.mp4',160,90,24)
            manifest['shots'][1]['review']='accepted'
            file.write_text(json.dumps(manifest))
            result=assemble(file,p/'film.mp4',160,90,24)
            self.assertAlmostEqual(result['duration'],1.0,delta=0.06)
            streams=probe(p/'film.mp4')['streams']
            self.assertEqual({s['codec_type'] for s in streams},{'video','audio'})
            self.assertEqual(int(next(s for s in streams if s['codec_type']=='video')['nb_frames']),24)
            with self.assertRaisesRegex(ValueError,'Output exists'): assemble(file,p/'film.mp4',160,90,24)
            with self.assertRaisesRegex(ValueError,'immutable'): extract(p/'a.mp4',p/'a-frames')


if __name__=='__main__': unittest.main()
