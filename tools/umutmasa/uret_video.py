#!/usr/bin/env python3
# LTX-Video 0.9.8 distilled ile görselden video (ComfyUI, 127.0.0.1:8188). İlk ve son kare aynı görselle
# yönlendirilir: video kendiliğinden başa döner. Kareler <çıktı>/<ad>/ altına PNG olarak kopyalanır.
# kullanım: uret_video.py <isler.json> <çıktı klasörü>
# iş: ad, kaynak (ComfyUI/input altındaki dosya), gen, yuk (32'nin katı), kare (8n+1), istem, olumsuz, tohum, son_guc
import json, os, sys, time, urllib.request, shutil, glob

SUNUCU = 'http://127.0.0.1:8188'
KOK = os.path.expanduser('~/ai/ComfyUI/output')
SIGMA = '1.0, 0.9937, 0.9875, 0.9812, 0.975, 0.9094, 0.725, 0.4219, 0.0'  # 0.9.8 distilled resmi 8 adım
isler = json.load(open(sys.argv[1], encoding='utf-8'))
hedef = sys.argv[2]

for it in isler:
    ad = it['ad']
    klasor = os.path.join(hedef, ad)
    if os.path.isdir(klasor) and len(glob.glob(os.path.join(klasor, '*.png'))) >= it['kare']:
        print('VAR', ad, flush=True)
        continue
    a = {
        '1': {'class_type': 'CheckpointLoaderSimple', 'inputs': {'ckpt_name': 'ltxv-2b-0.9.8-distilled.safetensors'}},
        '2': {'class_type': 'CLIPLoaderGGUF', 'inputs': {'clip_name': 't5-v1_1-xxl-encoder-Q5_K_M.gguf', 'type': 'ltxv'}},
        '3': {'class_type': 'CLIPTextEncode', 'inputs': {'text': it['istem'], 'clip': ['2', 0]}},
        '4': {'class_type': 'CLIPTextEncode', 'inputs': {'text': it.get('olumsuz', ''), 'clip': ['2', 0]}},
        '5': {'class_type': 'LoadImage', 'inputs': {'image': it['kaynak']}},
        '6': {'class_type': 'ImageScale', 'inputs': {'image': ['5', 0], 'upscale_method': 'lanczos', 'width': it['gen'], 'height': it['yuk'], 'crop': 'center'}},
        '7': {'class_type': 'LTXVPreprocess', 'inputs': {'image': ['6', 0], 'img_compression': it.get('sikistirma', 30)}},
        '8': {'class_type': 'EmptyLTXVLatentVideo', 'inputs': {'width': it['gen'], 'height': it['yuk'], 'length': it['kare'], 'batch_size': 1}},
        '9': {'class_type': 'LTXVAddGuide', 'inputs': {'positive': ['3', 0], 'negative': ['4', 0], 'vae': ['1', 2], 'latent': ['8', 0], 'image': ['7', 0], 'frame_idx': 0, 'strength': 1.0}},
        '10': {'class_type': 'LTXVAddGuide', 'inputs': {'positive': ['9', 0], 'negative': ['9', 1], 'vae': ['1', 2], 'latent': ['9', 2], 'image': ['7', 0], 'frame_idx': -1, 'strength': it.get('son_guc', 0.8)}},
        '11': {'class_type': 'LTXVConditioning', 'inputs': {'positive': ['10', 0], 'negative': ['10', 1], 'frame_rate': 24.0}},
        '12': {'class_type': 'ManualSigmas', 'inputs': {'sigmas': SIGMA}},
        '13': {'class_type': 'KSamplerSelect', 'inputs': {'sampler_name': 'euler'}},
        '14': {'class_type': 'CFGGuider', 'inputs': {'model': ['1', 0], 'positive': ['11', 0], 'negative': ['11', 1], 'cfg': 1.0}},
        '15': {'class_type': 'RandomNoise', 'inputs': {'noise_seed': it.get('tohum', 1)}},
        '16': {'class_type': 'SamplerCustomAdvanced', 'inputs': {'noise': ['15', 0], 'guider': ['14', 0], 'sampler': ['13', 0], 'sigmas': ['12', 0], 'latent_image': ['10', 2]}},
        '17': {'class_type': 'LTXVCropGuides', 'inputs': {'positive': ['11', 0], 'negative': ['11', 1], 'latent': ['16', 0]}},
        '18': {'class_type': 'VAEDecodeTiled', 'inputs': {'samples': ['17', 2], 'vae': ['1', 2], 'tile_size': 512, 'overlap': 64, 'temporal_size': 64, 'temporal_overlap': 8}},
        '19': {'class_type': 'SaveImage', 'inputs': {'images': ['18', 0], 'filename_prefix': f'video/{ad}/k'}},
    }
    t0 = time.time()
    try:
        pid = json.loads(urllib.request.urlopen(urllib.request.Request(f'{SUNUCU}/prompt', json.dumps({'prompt': a}).encode(), {'Content-Type': 'application/json'})).read())['prompt_id']
    except urllib.error.HTTPError as ex:
        print('REDDEDILDI', ad, ex.read().decode()[:3000], flush=True)
        sys.exit(1)
    print('GONDERILDI', ad, flush=True)
    while True:
        time.sleep(4)
        h = json.loads(urllib.request.urlopen(f'{SUNUCU}/history/{pid}').read())
        if pid in h:
            durum = h[pid].get('status', {}).get('status_str')
            os.makedirs(klasor, exist_ok=True)
            n = 0
            for c in h[pid].get('outputs', {}).get('19', {}).get('images', []):
                shutil.copy(os.path.join(KOK, c.get('subfolder', ''), c['filename']), os.path.join(klasor, c['filename']))
                n += 1
            print('BITTI', ad, durum, n, 'kare', f'{time.time() - t0:.0f} sn', flush=True)
            if durum != 'success':
                print(json.dumps(h[pid].get('status', {}))[:3000], flush=True)
            break
print('VIDEO_URETIM_BITTI', flush=True)
