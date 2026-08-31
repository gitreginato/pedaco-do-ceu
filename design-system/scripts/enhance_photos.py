#!/usr/bin/env python3
"""
Pedaço do Céu — Pipeline de Tratamento e Aprimoramento de Fotos do Acervo
Processa e aprimora imagens de produtos holísticos, cristais, incensos e artes sacras.
"""

import os
import sys
import time
import argparse
from pathlib import Path
from typing import Tuple, Dict, Any, List, Optional

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

# Perfis de Aprimoramento Adaptativos por Universo Místico
PROFILES: Dict[str, Dict[str, Any]] = {
    'sacred_gold': {
        'name': '✦ Ouro Sagrado & Cristalino (Padrão)',
        'shadow_lift': 1.22,
        'highlight_comp': 0.96,
        'contrast': 1.12,
        'vibrance': 1.20,
        'color_enhance': 1.14,
        'sharpness_usm': {'radius': 1.8, 'percent': 130, 'threshold': 2},
        'awb_blend': 0.45,
    },
    'crystal_clarity': {
        'name': '💎 Clareza de Cristais & Gemas',
        'shadow_lift': 1.28,
        'highlight_comp': 0.94,
        'contrast': 1.18,
        'vibrance': 1.25,
        'color_enhance': 1.18,
        'sharpness_usm': {'radius': 2.0, 'percent': 150, 'threshold': 1},
        'awb_blend': 0.65,
    },
    'herbal_vitality': {
        'name': '🌿 Vitalidade Botânica & Bem-Estar',
        'shadow_lift': 1.20,
        'highlight_comp': 0.97,
        'contrast': 1.10,
        'vibrance': 1.22,
        'color_enhance': 1.16,
        'sharpness_usm': {'radius': 1.6, 'percent': 120, 'threshold': 2},
        'awb_blend': 0.50,
    },
    'celestial_blue': {
        'name': '⚔️ Chama Azul & Arcanjos',
        'shadow_lift': 1.25,
        'highlight_comp': 0.95,
        'contrast': 1.15,
        'vibrance': 1.22,
        'color_enhance': 1.15,
        'sharpness_usm': {'radius': 1.8, 'percent': 140, 'threshold': 2},
        'awb_blend': 0.55,
    },
    'balanced_natural': {
        'name': '📷 Natural & Comercial Equilibrado',
        'shadow_lift': 1.15,
        'highlight_comp': 0.98,
        'contrast': 1.08,
        'vibrance': 1.12,
        'color_enhance': 1.08,
        'sharpness_usm': {'radius': 1.5, 'percent': 110, 'threshold': 2},
        'awb_blend': 0.50,
    }
}

FOLDER_PROFILE_MAP = {
    'Arcanjo Miguel': 'celestial_blue',
    'Bem Estar': 'herbal_vitality',
    'Kailash': 'herbal_vitality',
    'NOA': 'herbal_vitality',
    'TIbate': 'sacred_gold',
    'zodiaco': 'crystal_clarity',
    'Logo': 'balanced_natural'
}


def auto_white_balance(arr: np.ndarray, blend: float = 0.5) -> np.ndarray:
    """Aplica balanço de brancos adaptativo preservando o calor dourado místico."""
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    r_p95, g_p95, b_p95 = np.percentile(r, 95), np.percentile(g, 95), np.percentile(b, 95)

    if r_p95 <= 0 or g_p95 <= 0 or b_p95 <= 0:
        return arr

    target_lum = (r_p95 + g_p95 + b_p95) / 3.0
    r_corr = np.clip(r * (1.0 + (target_lum / r_p95 - 1.0) * blend), 0, 255)
    g_corr = np.clip(g * (1.0 + (target_lum / g_p95 - 1.0) * blend), 0, 255)
    b_corr = np.clip(b * (1.0 + (target_lum / b_p95 - 1.0) * blend), 0, 255)

    return np.dstack((r_corr, g_corr, b_corr)).astype(np.uint8)


def apply_tone_curve(arr: np.ndarray, shadow_lift: float, highlight_comp: float) -> np.ndarray:
    """Recupera sombras sem estourar as altas luzes usando curva não-linear."""
    norm = arr.astype(np.float32) / 255.0
    lifted = np.power(norm, 1.0 / shadow_lift) * highlight_comp
    s_curve = 0.5 * (1.0 - np.cos(np.pi * lifted))
    result = 0.65 * lifted + 0.35 * s_curve
    return np.clip(result * 255.0, 0, 255).astype(np.uint8)


def enhance_vibrance(img: Image.Image, vibrance_factor: float) -> Image.Image:
    """Aumenta a saturação seletivamente em cores desbotadas sem saturar em excesso."""
    hsv = img.convert('HSV')
    h, s, v = hsv.split()
    s_arr = np.array(s, dtype=np.float32) / 255.0
    boost = 1.0 + (vibrance_factor - 1.0) * (1.0 - s_arr * 0.7)
    s_new = np.clip(s_arr * boost * 255.0, 0, 255).astype(np.uint8)
    return Image.merge('HSV', (h, Image.fromarray(s_new), v)).convert('RGB')


def enhance_image(img: Image.Image, profile: Dict[str, Any]) -> Image.Image:
    """Aplica o pipeline completo de aprimoramento de imagem."""
    img = ImageOps.exif_transpose(img)
    if img.mode != 'RGB':
        img = img.convert('RGB')

    arr = np.array(img)
    arr_awb = auto_white_balance(arr, blend=profile.get('awb_blend', 0.5))
    arr_toned = apply_tone_curve(
        arr_awb,
        shadow_lift=profile.get('shadow_lift', 1.20),
        highlight_comp=profile.get('highlight_comp', 0.96)
    )

    img_proc = Image.fromarray(arr_toned)
    img_proc = enhance_vibrance(img_proc, profile.get('vibrance', 1.20))
    img_proc = ImageEnhance.Color(img_proc).enhance(profile.get('color_enhance', 1.12))
    img_proc = ImageEnhance.Contrast(img_proc).enhance(profile.get('contrast', 1.10))

    usm = profile.get('sharpness_usm', {'radius': 1.8, 'percent': 130, 'threshold': 2})
    img_proc = img_proc.filter(
        ImageFilter.UnsharpMask(
            radius=usm['radius'],
            percent=usm['percent'],
            threshold=usm['threshold']
        )
    )
    return img_proc


def create_side_by_side(orig: Image.Image, enh: Image.Image) -> Image.Image:
    """Cria uma imagem comparativa lado a lado para conferência visual."""
    w, h = orig.size
    max_h = 1000
    if h > max_h:
        scale = max_h / h
        orig_s = orig.resize((int(w * scale), max_h), Image.Resampling.LANCZOS)
        enh_s = enh.resize((int(w * scale), max_h), Image.Resampling.LANCZOS)
    else:
        orig_s, enh_s = orig, enh

    sw, sh = orig_s.size
    compare = Image.new('RGB', (sw * 2 + 10, sh), color=(20, 20, 20))
    compare.paste(orig_s, (0, 0))
    compare.paste(enh_s, (sw + 10, 0))
    return compare


def resolve_profile(rel_path: Path, default_profile: str, auto_detect: bool) -> Dict[str, Any]:
    """Determina o perfil apropriado com base no nome do diretório."""
    subfolder = rel_path.parts[0] if len(rel_path.parts) > 1 else ''
    if auto_detect and subfolder in FOLDER_PROFILE_MAP:
        key = FOLDER_PROFILE_MAP[subfolder]
    else:
        key = default_profile
    return PROFILES.get(key, PROFILES['sacred_gold'])


def determine_target_path(
    img_path: Path,
    input_dir: Path,
    output_dir: Optional[Path],
    subfolder_name: Optional[str]
) -> Path:
    """Calcula o caminho de saída com suporte a subpasta local ou diretório externo."""
    rel_path = img_path.relative_to(input_dir)
    if subfolder_name:
        category = rel_path.parts[0] if len(rel_path.parts) > 1 else ''
        return input_dir / category / subfolder_name / img_path.name
    return (output_dir or input_dir) / rel_path


def process_single_image(
    img_path: Path,
    target_path: Path,
    comparison_dir: Optional[Path],
    profile: Dict[str, Any],
    max_dimension: Optional[int]
) -> bool:
    """Processa e salva uma única imagem."""
    target_path.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(img_path) as img:
        orig_img = ImageOps.exif_transpose(img)
        if orig_img.mode != 'RGB':
            orig_img = orig_img.convert('RGB')

        enhanced = enhance_image(orig_img, profile)

        if max_dimension and max(enhanced.size) > max_dimension:
            enhanced.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)

        enhanced.save(target_path, 'JPEG', quality=95, subsampling=0, optimize=True)

        if comparison_dir:
            comp_target = comparison_dir / target_path.name
            comp_target.parent.mkdir(parents=True, exist_ok=True)
            comp_img = create_side_by_side(orig_img, enhanced)
            comp_img.save(comp_target, 'JPEG', quality=88, optimize=True)

    return True


def collect_images(input_dir: Path) -> List[Path]:
    """Localiza todos os arquivos de imagem válidos, ignorando subpastas de saída."""
    valid_exts = {'.jpg', '.jpeg', '.png', '.webp'}
    ignored_parts = {'tratadas', 'fotos_tratadas', 'fotos_comparacao'}
    return [
        p for p in input_dir.rglob('*')
        if p.is_file() and p.suffix.lower() in valid_exts
        and not p.name.startswith('.')
        and not any(part.lower() in ignored_parts for part in p.parts)
    ]


def process_directory(
    input_dir: Path,
    output_dir: Optional[Path],
    subfolder_name: Optional[str] = None,
    comparison_dir: Optional[Path] = None,
    default_profile: str = 'sacred_gold',
    auto_detect_profile: bool = True,
    max_dimension: Optional[int] = None
) -> Tuple[int, int]:
    """Processa recursivamente todas as fotos do diretório de entrada."""
    image_files = collect_images(input_dir)
    total = len(image_files)
    if total == 0:
        print(f"Nenhuma imagem encontrada em: {input_dir}")
        return 0, 0

    print(f"\n✨ Iniciando tratamento de {total} imagens do acervo...")
    print(f"📂 Diretório de Origem: {input_dir}")
    if subfolder_name:
        print(f"📂 Modo Subpasta:       Dentro de cada categoria em '{subfolder_name}/'")
    else:
        print(f"📂 Diretório de Destino:{output_dir}")

    success_count, fail_count = 0, 0
    start_time = time.time()

    for idx, img_path in enumerate(image_files, 1):
        rel_path = img_path.relative_to(input_dir)
        profile = resolve_profile(rel_path, default_profile, auto_detect_profile)
        target_path = determine_target_path(img_path, input_dir, output_dir, subfolder_name)

        try:
            process_single_image(
                img_path=img_path,
                target_path=target_path,
                comparison_dir=comparison_dir,
                profile=profile,
                max_dimension=max_dimension
            )
            orig_kb = img_path.stat().st_size / 1024
            new_kb = target_path.stat().st_size / 1024
            print(f"[{idx:02d}/{total:02d}] ✅ {rel_path} -> {target_path.name} ({orig_kb:.0f}KB -> {new_kb:.0f}KB) | {profile['name']}")
            success_count += 1
        except Exception as e:
            print(f"[{idx:02d}/{total:02d}] ❌ Erro em {rel_path}: {e}")
            fail_count += 1

    elapsed = time.time() - start_time
    print(f"\n🎉 Concluído em {elapsed:.2f}s! Sucessos: {success_count}/{total} | Falhas: {fail_count}/{total}\n")
    return success_count, fail_count


def main():
    parser = argparse.ArgumentParser(description="Pedaço do Céu — Aprimorador de Fotos do Acervo")
    parser.add_argument(
        '--input-dir',
        type=str,
        default="/home/mat77/Projetos/Pedaço do ceu /Fotos",
        help="Diretório das fotos originais"
    )
    parser.add_argument(
        '--output-dir',
        type=str,
        default=None,
        help="Diretório externo para salvar as fotos tratadas"
    )
    parser.add_argument(
        '--subfolder',
        type=str,
        default='Tratadas',
        help="Nome da subpasta dentro de cada categoria (ex: Tratadas)"
    )
    parser.add_argument(
        '--compare-dir',
        type=str,
        default="/home/mat77/Projetos/Pedaço do ceu /Fotos_Comparacao",
        help="Diretório para salvar antes/depois (opcional)"
    )
    parser.add_argument(
        '--profile',
        type=str,
        choices=list(PROFILES.keys()),
        default='sacred_gold',
        help="Perfil padrão de aprimoramento"
    )
    parser.add_argument(
        '--no-auto-detect',
        action='store_true',
        help="Desativa detecção automática de perfil por categoria"
    )
    parser.add_argument(
        '--max-dim',
        type=int,
        default=None,
        help="Dimensão máxima em pixels para redimensionar (opcional)"
    )

    args = parser.parse_args()
    input_p = Path(args.input_dir)
    output_p = Path(args.output_dir) if args.output_dir else None
    compare_p = Path(args.compare_dir) if args.compare_dir else None

    if not input_p.exists():
        print(f"Erro: Diretório de entrada não encontrado: {input_p}")
        sys.exit(1)

    process_directory(
        input_dir=input_p,
        output_dir=output_p,
        subfolder_name=args.subfolder,
        comparison_dir=compare_p,
        default_profile=args.profile,
        auto_detect_profile=not args.no_auto_detect,
        max_dimension=args.max_dim
    )


if __name__ == '__main__':
    main()
