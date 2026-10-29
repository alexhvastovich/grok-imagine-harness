import json
import tempfile
import unittest
from pathlib import Path
from continuity import extract, validate, assemble, run, probe


class ContinuityTests(unittest.TestCase):
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
