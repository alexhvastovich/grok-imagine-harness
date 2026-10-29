"""Local frame continuity and assembly. No browser credentials or private API calls."""
import argparse
import hashlib
import json
import math
import subprocess
import tempfile
from pathlib import Path


def run(args):
    return subprocess.run([str(x) for x in args], check=True, capture_output=True, text=True).stdout


def probe(file):
    return json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', file]))


def digest(file):
    with Path(file).open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def extract(video, output):
    video, output = Path(video).resolve(), Path(output).resolve()
    output.mkdir(parents=True, exist_ok=True)
    first, last = output / 'first.png', output / 'last.png'
    if first.exists() or last.exists():
        raise ValueError('Use a new extraction directory; existing endpoint files are immutable')
    info = probe(video)
    stream = next(s for s in info['streams'] if s['codec_type'] == 'video')
    run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', video, '-map', '0:v:0', '-frames:v', '1', first])
    # Decode the entire video, updating one PNG; avoids imprecise duration-minus-epsilon seeks.
    run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', video, '-map', '0:v:0', '-update', '1', '-fps_mode', 'passthrough', last])
    result = {'video_name': video.name, 'video_sha256': digest(video), 'width': stream['width'],
              'height': stream['height'], 'fps': stream['r_frame_rate'],
              'duration': float(info['format']['duration']), 'first': 'first.png', 'last': 'last.png',
              'first_sha256': digest(first), 'last_sha256': digest(last), 'visual_review': 'pending'}
    (output / 'frames.json').write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    return result


def validate(manifest, require_clips=False):
    manifest = Path(manifest).resolve()
    data = json.loads(manifest.read_text(encoding='utf-8'))
    shots = data.get('shots', [])
    if not shots:
        raise ValueError('Manifest requires at least one shot')
    seen, previous, results = set(), None, []
    for shot in shots:
        sid = shot['id']
        if sid in seen:
            raise ValueError(f'Duplicate shot id: {sid}')
        seen.add(sid)
        boundary = shot.get('boundary', 'cut')
        if boundary not in ('continuous', 'cut'):
            raise ValueError(f'{sid}: invalid boundary')
        files = {}
        for key in ('first_frame', 'planned_last_frame', 'actual_last_frame', 'clip'):
            if shot.get(key):
                file = (manifest.parent / shot[key]).resolve()
                if not file.is_file():
                    raise ValueError(f'{sid}: missing {key}: {shot[key]}')
                files[key] = file
        if 'first_frame' not in files or 'planned_last_frame' not in files:
            raise ValueError(f'{sid}: first_frame and planned_last_frame are required')
        for key in ('first_frame','planned_last_frame'):
            meta=probe(files[key])['streams'][0]
            files[key+'_dimensions']=(meta['width'],meta['height'])
        if files['first_frame_dimensions'] != files['planned_last_frame_dimensions']:
            raise ValueError(f'{sid}: first and last frame dimensions differ')
        if boundary == 'continuous':
            if previous is None:
                raise ValueError(f'{sid}: first shot cannot continue a missing shot')
            source = previous.get('actual_last_frame') or previous['planned_last_frame']
            if digest(source) != digest(files['first_frame']):
                raise ValueError(f'{sid}: first frame differs from preceding endpoint')
        if require_clips:
            if 'clip' not in files or shot.get('review') != 'accepted':
                raise ValueError(f'{sid}: an accepted local clip is required for assembly')
            if 'actual_last_frame' not in files:
                raise ValueError(f'{sid}: extract actual_last_frame before assembly')
            probe(files['clip'])
        previous = files
        results.append((shot, files))
    return data, results


def ready(manifest):
    """Whole-film preflight: no opening-scene shortcut past missing later pairs."""
    manifest=Path(manifest).resolve()
    data, shots=validate(manifest)
    if not data.get('project_name') or not data.get('project_details_verified') or not data.get('project_packet_uploaded'):
        raise ValueError('Create and fully populate the named Grok project first')
    cast=data.get('characters',[])
    if not cast or any(not c.get('registered') or not c.get('master') for c in cast):
        raise ValueError('Register all named Character masters first')
    for character in cast:
        if not (manifest.parent/character['master']).is_file():
            raise ValueError(f"Missing Character master: {character['name']}")
    for shot,files in shots:
        if shot.get('image_review')!='accepted' or not str(shot.get('motion_prompt') or '').strip():
            raise ValueError(f"{shot['id']}: inspect both images and write prompt before ANY video")
    return {'ready':True,'shots':len(shots),'characters':len(cast),
            'note':'Local files and declared UI preparation verified; this does not prove quota availability or successful motion.'}


def assemble(manifest, output, width=1920, height=1080, fps=24):
    _, shots = validate(manifest, require_clips=True)
    output = Path(output).resolve()
    if output.exists():
        raise ValueError('Output exists; choose a new versioned movie filename')
    if width <= 0 or height <= 0 or width % 2 or height % 2 or fps <= 0:
        raise ValueError('Use positive even dimensions and positive fps')
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='grok-assembly-', dir=output.parent) as temp:
        temp = Path(temp)
        names = []
        for i, (shot, files) in enumerate(shots):
            info = probe(files['clip'])
            video = next(s for s in info['streams'] if s['codec_type'] == 'video')
            duration = float(video.get('duration') or info['format']['duration'])
            if not math.isfinite(duration) or duration <= 0:
                raise ValueError(f"{shot['id']}: video duration must be finite and positive")
            has_audio = any(s['codec_type'] == 'audio' for s in info['streams'])
            clip_name = f'{i:04d}.mp4'
            args = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', files['clip']]
            if not has_audio:
                args += ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo']
            args += ['-map', '0:v:0', '-map', '0:a:0' if has_audio else '1:a:0',
                     '-vf', f'setpts=PTS-STARTPTS,scale={width}:{height}:force_original_aspect_ratio=decrease,pad={width}:{height}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps={fps}',
                     '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p',
                     # Bound padded/synthetic audio to picture duration. With only
                     # -shortest, encoder buffering can extend short clip tails.
                     '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-af', 'asetpts=PTS-STARTPTS,apad',
                     '-t', str(duration), temp / clip_name]
            run(args)
            names.append(f"file '{clip_name}'")
        concat = temp / 'clips.ffconcat'
        concat.write_text('\n'.join(names) + '\n', encoding='utf-8')
        run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '1', '-i', concat,
             '-c', 'copy', '-movflags', '+faststart', output])
    info = probe(output)
    report = {'file': output.name, 'sha256': digest(output), 'shots': [s['id'] for s, _ in shots],
              'duration': float(info['format']['duration']), 'visual_audio_review': 'pending',
              'note': 'Straight joins. No automatic dissolves, narration replacement or publishing.'}
    output.with_suffix('.assembly.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    p = commands.add_parser('extract'); p.add_argument('video'); p.add_argument('output')
    p = commands.add_parser('validate'); p.add_argument('manifest'); p.add_argument('--require-clips', action='store_true')
    p = commands.add_parser('ready'); p.add_argument('manifest')
    p = commands.add_parser('assemble'); p.add_argument('manifest'); p.add_argument('output')
    p.add_argument('--width', type=int, default=1920); p.add_argument('--height', type=int, default=1080); p.add_argument('--fps', type=int, default=24)
    args = parser.parse_args()
    if args.command == 'extract': result = extract(args.video,args.output)
    elif args.command == 'validate': result = {'valid': True, 'shots': len(validate(args.manifest,args.require_clips)[1])}
    elif args.command == 'ready': result = ready(args.manifest)
    else: result = assemble(args.manifest,args.output,args.width,args.height,args.fps)
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
