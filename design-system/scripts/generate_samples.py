#!/usr/bin/env python3
"""
Gerador de Exemplos em Alta Resolução de Posts para Pedaço do Céu
Com correção de rotação EXIF e tipografia nobre.
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageOps

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DESIGN_SYSTEM_DIR = os.path.dirname(BASE_DIR)
PROJ_ROOT = os.path.dirname(DESIGN_SYSTEM_DIR)
OUT_DIR = os.path.join(DESIGN_SYSTEM_DIR, "exemplos-prontos")
os.makedirs(OUT_DIR, exist_ok=True)

# Cores da Marca
COLOR_EMERALD = (0, 133, 66)
COLOR_EMERALD_DEEP = (0, 56, 28)
COLOR_OBSIDIAN = (8, 13, 10)
COLOR_GOLD = (212, 175, 55)
COLOR_GOLD_BRIGHT = (245, 215, 127)
COLOR_PARCHMENT = (234, 220, 185)
COLOR_WHITE = (248, 249, 250)

# Fontes do Sistema
FONT_TITLE_PATH = "/usr/share/fonts/truetype/noto/NotoSerifDisplay-Bold.ttf"
FONT_ITALIC_PATH = "/usr/share/fonts/truetype/noto/NotoSerif-Italic.ttf"
FONT_BODY_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_moon_and_stars(draw, cx, cy, size, color=COLOR_GOLD):
    r = size / 2
    draw.chord([cx - r, cy - r, cx + r, cy + r], -80, 80, fill=color)
    inner_r = r * 0.82
    draw.chord([cx - inner_r - r*0.4, cy - inner_r, cx + inner_r - r*0.4, cy + inner_r], -80, 80, fill=COLOR_OBSIDIAN)
    for sy in [cy - r*0.45, cy, cy + r*0.45]:
        draw.ellipse([cx - r*0.08, sy - r*0.08, cx + r*0.08, sy + r*0.08], fill=color)

def draw_baroque_corners(draw, w, h, pad=30, size=50, color=COLOR_GOLD):
    for cx, cy in [(pad, pad), (w - pad, pad), (w - pad, h - pad), (pad, h - pad)]:
        draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=color)
    draw.rectangle([pad, pad, w - pad, h - pad], outline=COLOR_GOLD, width=2)
    draw.rectangle([pad + 8, pad + 8, w - pad - 8, h - pad - 8], outline=(180, 150, 40), width=1)

def draw_flower_of_life(draw, cx, cy, radius, color=(212, 175, 55, 60)):
    r = radius / 3.2
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=1)
    for i in range(6):
        a = math.radians(i * 60)
        x = cx + r * math.cos(a)
        y = cy + r * math.sin(a)
        draw.ellipse([x - r, y - r, x + r, y + r], outline=color, width=1)

def wrap_text(text, font, max_width, draw):
    lines = []
    words = text.split(" ")
    curr_line = ""
    for w in words:
        test_line = (curr_line + " " + w).strip()
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] > max_width and curr_line:
            lines.append(curr_line)
            curr_line = w
        else:
            curr_line = test_line
    if curr_line:
        lines.append(curr_line)
    return lines

def render_sample_post(filename, photo_rel_path, tag, title, subtitle, desc, price, cta, badge, width=1080, height=1080, layout="right"):
    photo_path = os.path.join(PROJ_ROOT, photo_rel_path)
    if not os.path.exists(photo_path):
        print(f"Aviso: Foto não encontrada: {photo_path}")
        return

    img = Image.new("RGB", (width, height), COLOR_OBSIDIAN)
    draw = ImageDraw.Draw(img, "RGBA")

    # Fontes
    font_badge = get_font(FONT_TITLE_PATH, 16)
    font_tag = get_font(FONT_TITLE_PATH, 18)
    font_title = get_font(FONT_TITLE_PATH, 34)
    font_subtitle = get_font(FONT_ITALIC_PATH, 22)
    font_desc = get_font(FONT_BODY_PATH, 17)
    font_price = get_font(FONT_TITLE_PATH, 20)
    font_cta = get_font(FONT_TITLE_PATH, 15)

    # Carrega foto com correção EXIF de rotação
    raw_img = Image.open(photo_path)
    prod_img = ImageOps.exif_transpose(raw_img).convert("RGB")
    
    if layout == "right":
        split_x = int(width * 0.54)
        target_w = split_x + 90
        target_h = height
        ratio = max(target_w / prod_img.width, target_h / prod_img.height)
        new_w, new_h = int(prod_img.width * ratio), int(prod_img.height * ratio)
        resized_photo = prod_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        crop_x = (new_w - target_w) // 2
        crop_y = (new_h - target_h) // 2
        cropped = resized_photo.crop((crop_x, crop_y, crop_x + target_w, crop_y + target_h))
        img.paste(cropped, (0, 0))

        # Degradê verde esmeralda na coluna direita
        for x in range(split_x - 90, width):
            factor = (x - (split_x - 90)) / (width - (split_x - 90))
            alpha = int(245 * factor)
            draw.line([(x, 0), (x, height)], fill=(0, 45, 22, alpha), width=1)

        draw_flower_of_life(draw, width - (width - split_x) // 2, height // 2, 220)

        # Divisor vertical
        draw.line([(split_x, 70), (split_x, height - 70)], fill=(212, 175, 55, 120), width=2)

        # Textos
        tx = split_x + 40
        tw = width - tx - 50
        
        # Selo
        draw.rounded_rectangle([tx, 90, tx + 260, 130], radius=18, fill=(0, 31, 15, 220), outline=COLOR_GOLD, width=1)
        draw.text((tx + 130, 110), badge, fill=COLOR_GOLD_BRIGHT, font=font_badge, anchor="mm")

        # Categoria
        draw.text((tx, 160), tag.upper(), fill=COLOR_GOLD, font=font_tag)
        draw.line([(tx, 190), (tx + tw, 190)], fill=(212, 175, 55, 80), width=1)

        # Título
        cur_y = 215
        for line in wrap_text(title, font_title, tw, draw):
            draw.text((tx, cur_y), line, fill=COLOR_WHITE, font=font_title)
            cur_y += 42

        # Subtítulo
        cur_y += 10
        for line in wrap_text(subtitle, font_subtitle, tw, draw):
            draw.text((tx, cur_y), line, fill=COLOR_PARCHMENT, font=font_subtitle)
            cur_y += 28

        # Descrição
        cur_y += 15
        for line in wrap_text(desc, font_desc, tw, draw):
            draw.text((tx, cur_y), line, fill=COLOR_WHITE, font=font_desc)
            cur_y += 26

        # Preço
        draw.rounded_rectangle([tx, cur_y + 20, tx + tw, cur_y + 80], radius=8, fill=(0, 133, 66, 70), outline=COLOR_GOLD, width=1)
        draw.text((tx + tw // 2, cur_y + 50), price, fill=COLOR_GOLD_BRIGHT, font=font_price, anchor="mm")

        # CTA
        draw.text((tx, height - 90), cta, fill=COLOR_GOLD, font=font_cta)

    elif layout == "bottom":
        card_h = int(height * 0.46)
        card_y = height - card_h
        
        ratio = max(width / prod_img.width, height / prod_img.height)
        new_w, new_h = int(prod_img.width * ratio), int(prod_img.height * ratio)
        resized_photo = prod_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        crop_x = (new_w - width) // 2
        crop_y = (new_h - height) // 2
        cropped = resized_photo.crop((crop_x, crop_y, crop_x + width, crop_y + height))
        img.paste(cropped, (0, 0))

        for y in range(card_y - 120, height):
            factor = (y - (card_y - 120)) / (height - (card_y - 120))
            alpha = int(250 * factor)
            draw.line([(0, y), (width, y)], fill=(0, 40, 20, alpha), width=1)

        draw_flower_of_life(draw, width // 2, card_y + card_h // 2, 240)

        # Selo
        draw.rounded_rectangle([width // 2 - 140, card_y + 15, width // 2 + 140, card_y + 52], radius=18, fill=(0, 31, 15, 220), outline=COLOR_GOLD, width=1)
        draw.text((width // 2, card_y + 33), badge, fill=COLOR_GOLD_BRIGHT, font=font_badge, anchor="mm")

        # Categoria
        draw.text((width // 2, card_y + 75), tag.upper(), fill=COLOR_GOLD, font=font_tag, anchor="mm")
        draw.line([(width // 2 - 120, card_y + 90), (width // 2 + 120, card_y + 90)], fill=(212, 175, 55, 120), width=1)

        # Título
        cur_y = card_y + 115
        for line in wrap_text(title, font_title, width - 120, draw):
            draw.text((width // 2, cur_y), line, fill=COLOR_WHITE, font=font_title, anchor="mm")
            cur_y += 40

        # Subtítulo
        cur_y += 5
        for line in wrap_text(subtitle, font_subtitle, width - 120, draw):
            draw.text((width // 2, cur_y), line, fill=COLOR_PARCHMENT, font=font_subtitle, anchor="mm")
            cur_y += 28

        # Descrição
        cur_y += 5
        for line in wrap_text(desc, font_desc, width - 140, draw):
            draw.text((width // 2, cur_y), line, fill=COLOR_WHITE, font=font_desc, anchor="mm")
            cur_y += 24

        # Preço
        draw.rounded_rectangle([width // 2 - 160, cur_y + 15, width // 2 + 160, cur_y + 70], radius=8, fill=(0, 133, 66, 70), outline=COLOR_GOLD, width=1)
        draw.text((width // 2, cur_y + 42), price, fill=COLOR_GOLD_BRIGHT, font=font_price, anchor="mm")

        # CTA
        draw.text((width // 2, height - 55), cta, fill=COLOR_GOLD, font=font_cta, anchor="mm")

    # Molduras e Logo
    draw_baroque_corners(draw, width, height)
    draw_moon_and_stars(draw, width - 60, 60, 46, COLOR_GOLD_BRIGHT)

    # Salva
    out_path = os.path.join(OUT_DIR, filename)
    img.save(out_path, "PNG", quality=95)
    print(f"Gerado: {out_path}")

def main():
    print("Gerando acervo de exemplos visuais com correção de orientação e fontes...")
    
    # 1. Bem Estar & Cristais
    render_sample_post(
        "exemplo-01-bem-estar-cristais-feed1x1.png",
        "Fotos/Bem Estar/IMG_20260828_155841954.jpg",
        "Cristais & Bem-Estar",
        "Sabonetes Energéticos & Cristais",
        "Elevação vibracional e harmonia para o seu lar",
        "Infusão de óleos essenciais e pedras autênticas.",
        "RITUAL COMPLETO",
        "Pedaço do Céu • Espaço Artes",
        "ENERGIA PURA 100% NATURAL",
        1080, 1080, "right"
    )

    # 2. Arcanjo Miguel
    render_sample_post(
        "exemplo-02-arcanjo-miguel-feed4x5.png",
        "Fotos/Arcanjo Miguel/IMG_20260828_145720256.jpg",
        "Proteção & Força Espiritual",
        "Arcanjo Miguel: Espada de Luz e Defesa",
        "Consagre seu lar com a presença angelical",
        "Estatuária sacra, incensos orgânicos e orações.",
        "ACERVO EXCLUSIVO",
        "Disponível em nossa loja • Peça pelo Direct",
        "PROTEÇÃO SAGRADA",
        1080, 1350, "bottom"
    )

    # 3. Linha Zodíaco
    render_sample_post(
        "exemplo-03-zodiaco-astrologia-feed4x5.png",
        "Fotos/zodiaco/IMG_20260828_175100702.jpg",
        "Astrologia & Incensos Nobres",
        "Linha Zodíaco: O Aroma do Seu Signo",
        "Conecte-se com as forças cósmicas do seu mapa",
        "Fórmulas fitoterápicas e resinas puras dos 12 signos.",
        "7 UNIDADES ESPECIAIS",
        "Descubra seu aroma sagrado pelo direct",
        "COSMOLOGIA SAGRADA",
        1080, 1350, "bottom"
    )

    # 4. Linha NOA (Orixás)
    render_sample_post(
        "exemplo-04-noa-orixas-feed1x1.png",
        "Fotos/NOA/IMG_20260828_180047923.jpg",
        "Ancestralidade & Natureza",
        "Linha NOA: Força dos Orixás",
        "Incensos artesanais e orgânicos de alta vibração",
        "Ervas sagradas para defumação e equilíbrio.",
        "100% ARTESANAL & ORGÂNICO",
        "Pedaço do Céu • WhatsApp na Bio",
        "ANCESTRALIDADE PURA",
        1080, 1080, "bottom"
    )

    # 5. Kailash Aromas
    render_sample_post(
        "exemplo-05-kailash-aromas-feed1x1.png",
        "Fotos/Kailash/IMG_20260828_173627904.jpg",
        "Perfumaria de Ambiente",
        "Kailash: Aromas da Montanha Sagrada",
        "Difusores e cosméticos com óleos essenciais",
        "Fragrâncias exclusivas sem parabenos para o seu lar.",
        "BELEZA & BEM-ESTAR",
        "Experimente em nosso espaço",
        "ÓLEOS ESSENCIAIS NATURAIS",
        1080, 1080, "right"
    )

    # 6. Tibete & Budismo (Stories/TikTok 9:16)
    render_sample_post(
        "exemplo-06-tibete-budismo-story9x16.png",
        "Fotos/TIbate/IMG_20260828_165604350.jpg",
        "Budismo & Harmonia Zen",
        "Santuário Tibetano: Paz & Meditação",
        "Budas esculpidos e cristais de sal do Himalaia",
        "Luminárias que ionizam o ar e ancoram serenidade.",
        "PURIFICAÇÃO DO LAR",
        "Pedaço do Céu • Tudo para seu lar e espírito",
        "HARMONIA & SILÊNCIO",
        1080, 1920, "bottom"
    )

    print("Todos os exemplos foram gerados com sucesso!")

if __name__ == "__main__":
    main()
