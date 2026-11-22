# Savana Season · Konsept koleksiyon 01 — görsel istemleri (FLUX.1 schnell, UMUTMASA)
# Her ürün: iki "ana" deneme (en iyisi seçilir) + bir "detay". Üç geniş kampanya görseli.
import json

STIL = ("Studio product photograph, the object centered with generous space around it, three-quarter view, "
        "on a pure black background, single hard spotlight from above, deep shadows, "
        "high contrast black and white photography, fine film grain, luxury gothic silver jewelry campaign style, "
        "brutalist, no text, no logo, no watermark.")
DETAY = ("Extreme close-up macro photograph, shallow depth of field, pure black background, hard raking light, "
         "high contrast black and white photography, fine film grain, no text, no logo.")

MALZEME = {
    'Brüt beton': 'cast in raw grey board-formed concrete with visible air holes and rough texture',
    'Tuz beton': 'cast in smooth white concrete with fine pores',
    'Grafit beton': 'cast in dark charcoal concrete with a subtle silky sheen',
    'Ayna çelik': 'made of mirror-polished stainless steel with deeply engraved blackened lines',
    'Kara çelik': 'made of blackened steel with bright polished engraved lines',
}

# slug, malzeme, ana tarif, detay tarifi
URUNLER = [
    # KATEDRAL
    ('kemer', 'Brüt beton',
     'A pair of heavy bookends {m}; placed together they form a tall pointed gothic arch, each half with a pointed-arch window opening and carved masonry block joints',
     'the carved masonry joints and air holes on the pointed arch edge of a raw concrete bookend'),
    ('payanda', 'Kara çelik',
     'A wine bottle holder shaped like a gothic flying buttress {m}: a slanted arched beam rising from a low block to a tall square pier, a dark wine bottle resting along the top of the beam',
     'the polished engraved block lines on the blackened steel arched beam of a wine holder, a wine bottle neck resting in its cradle'),
    ('sapel', 'Brüt beton',
     'A small chapel-shaped candle lantern {m} with a pyramid roof, two narrow pointed-arch windows and a round oculus glowing with warm candlelight from inside, carved masonry joints',
     'candlelight glowing through a narrow pointed-arch window in a raw concrete wall'),
    ('gul', 'Ayna çelik',
     'A round shallow jewelry dish {m}, its base engraved with a gothic rose window pattern of circles and radiating spokes, two silver rings resting inside',
     'the engraved gothic rose window pattern on a mirror-polished steel dish, a silver ring resting on it'),
    ('demet', 'Grafit beton',
     'A tall vase {m} shaped like a gothic clustered column with eight soft vertical flutes, octagonal base and capital, a single dry thorny branch inside',
     'the soft vertical flutes and octagonal capital of a dark concrete column vase'),
    # LİMAN
    ('dalgakiran', 'Brüt beton',
     'A pair of bookends {m} shaped like harbor breakwater tetrapods, four thick conical legs with ring joints, a few hardcover books leaning between them',
     'the ring joints on the conical leg of a raw concrete tetrapod bookend'),
    ('baba', 'Kara çelik',
     'Two harbor mooring bollard candlesticks {m}, one tall and one short, mushroom-shaped caps, slender black candles burning on top',
     'the mushroom cap of a blackened steel mooring bollard candlestick with a black candle'),
    ('keson', 'Grafit beton',
     'A rectangular valet tray {m} like a harbor caisson: thick walls, inner cells of different sizes, a raised back wall, a ring and a few coins in the cells',
     'the thick walls and inner cells of a dark concrete caisson tray, a ring resting in a cell'),
    ('silo', 'Tuz beton',
     'A desk pen holder {m} made of three fused cylinders of different heights like harbor silos, ring joints, pencils and a brush inside',
     'the ring joints where three white concrete silo cylinders meet, pencils inside'),
    ('rihtim', 'Brüt beton',
     'A long low incense holder {m} shaped like a harbor quay wall with a tiny mooring bollard on top holding a stick of incense, a thin ribbon of smoke',
     'a tiny concrete mooring bollard holding a stick of incense with smoke rising'),
    ('antifer', 'Ayna çelik',
     'A heavy paperweight {m}: a cube with deep grooves on each face like a harbor antifer block, resting on folded paper',
     'the deep grooves on a mirror-polished steel cube reflecting light'),
    # FABRİKA
    ('kiris', 'Ayna çelik',
     'A pair of bookends cut from a heavy I-beam {m}, the web pierced with a gothic pointed-arch window with quatrefoil tracery, round rivet heads along the flanges',
     'round rivet heads and gothic tracery on a polished steel I-beam'),
    ('somun', 'Ayna çelik',
     'A massive hex nut used as a candle holder {m}, each face engraved with gothic quatrefoil tracery, a black pillar candle burning in the center hole',
     'engraved gothic quatrefoil tracery on the face of a polished steel hex nut'),
    ('percin', 'Kara çelik',
     'A small casket {m} built from riveted plates, a pointed gothic arch panel on each side, a lid crowned with a small spire handle',
     'polished rivet heads along the seam of a blackened steel casket'),
    ('flans', 'Kara çelik',
     'A heavy pipe flange used as a tealight holder {m}, a ring of bolt holes around the rim, the center cut as a gothic rose window, a lit tealight inside',
     'the bolt holes and rose window cut of a blackened steel flange, tealight glowing'),
    ('donati', 'Brüt beton',
     'A tall vase {m} with imprinted rebar ribs and vertical flutes like a cathedral column, a single dry branch inside',
     'imprinted rebar ribs and board-formed wood grain on a raw concrete vase'),
    ('baca', 'Grafit beton',
     'A small incense tower {m} shaped like an industrial chimney crowned with a gothic spire, narrow pointed-arch slits, a thin ribbon of smoke rising',
     'smoke rising from a narrow pointed-arch slit in a dark concrete chimney'),
]

istemler = []
for i, (slug, mal, ana, det) in enumerate(URUNLER):
    m = MALZEME[mal]
    istemler.append({'ad': f'{slug}-ana', 'tohum': [1000 + i * 10 + 1, 1000 + i * 10 + 2], 'gen': 1024, 'yuk': 1280,
                     'istem': ana.format(m=m) + '. ' + STIL})
    istemler.append({'ad': f'{slug}-detay', 'tohum': [2000 + i * 10 + 1], 'gen': 1024, 'yuk': 1280,
                     'istem': f'{DETAY} Subject: {det}.'})

KAMPANYA = [
    ('kampanya-katedral', 'Gothic objects of raw concrete and polished steel arranged on a massive raw concrete altar inside a dark brutalist cathedral, ribbed concrete vaults, a single shaft of light falling through a tall pointed window, dust floating in the beam, black and white photography, cinematic, high contrast, fine film grain, no people, no text, no logo.'),
    ('kampanya-fabrika', 'Polished and blackened steel objects - an I-beam bookend with a gothic window, a giant hex nut candle holder, a riveted casket - on a heavy steel workbench in a dark factory, a chain hanging from a crane hook, one hard light, black and white photography, cinematic, high contrast, fine film grain, no people, no text, no logo.'),
    ('kampanya-liman', 'Raw concrete objects shaped like breakwater tetrapods and harbor mooring bollards standing on a wet concrete pier at night, fog over dark water, a single harbor lamp light, black and white photography, cinematic, high contrast, fine film grain, no people, no text, no logo.'),
]
for j, (ad, ist) in enumerate(KAMPANYA):
    istemler.append({'ad': ad, 'tohum': [3000 + j * 10 + 1, 3000 + j * 10 + 2], 'gen': 1536, 'yuk': 864, 'istem': ist})

json.dump(istemler, open('vizyon-istemler.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(istemler), 'istem,', sum(len(x['tohum']) for x in istemler), 'görsel')
