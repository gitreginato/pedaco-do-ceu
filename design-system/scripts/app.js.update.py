import re

file_path = '/home/mat77/Projetos/Pedaço do ceu /design-system/app.js'
with open(file_path, 'r') as f:
    content = f.read()

# Substituir hexToRgb fallback
content = content.replace("state.bgColor", "state.gradientPrimary")
content = content.replace("state.bgGradient", "state.gradientSecondary")
content = content.replace("state.accentColor", "state.colorTag")

# Garantir ctx.textAlign correto
content = content.replace("ctx.textAlign = state.textAlign;", "ctx.textAlign = state.align;")
content = content.replace("ctx.textAlign = 'center';", "ctx.textAlign = state.align;")
content = content.replace("ctx.textAlign = 'left';", "ctx.textAlign = state.align;")

# Substituir state.descSize -> 100 base para não quebrar a escala
content = content.replace("state.descSize", "100")
content = content.replace("state.titleSize", "100")

# Forçar uso dos tamanhos do estado nos layouts (renderRightSplitLayout, renderBottomCardLayout, renderTopBarLayout, renderCenterCardLayout)
def replace_fonts(match):
    return match.group(0)

# Simplificar as propriedades de fonte para o novo estado
content = re.sub(r'ctx\.font = .*?"Cinzel Decorative".*?;', 'ctx.font = `700 ${state.sizeTitle}px "Cinzel Decorative", serif`;', content)
content = re.sub(r'ctx\.font = .*?"Cormorant Garamond".*?;', 'ctx.font = `italic 500 ${state.sizeSubtitle}px "Cormorant Garamond", serif`;', content)
content = re.sub(r'ctx\.font = .*?"Montserrat".*?;', 'ctx.font = `300 ${state.sizeDesc}px "Montserrat", sans-serif`;', content)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated layouts in app.js")
