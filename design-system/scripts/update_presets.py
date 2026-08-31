import re

file_path = '/home/mat77/Projetos/Pedaço do ceu /design-system/app.js'
with open(file_path, 'r') as f:
    content = f.read()

# Replace the applyPreset function
new_apply_preset = """function applyPreset(presetKey) {
  const p = {
    'bemEstar': {
      title: 'CRISTAIS E BEM ESTAR',
      subtitle: 'A Cura em Suas Mãos',
      description: 'Purifique sua casa e alinhe seus chakras com nossa coleção exclusiva de ametistas e quartzos. Sinta a energia primordial do universo.',
      categoryTag: 'COLEÇÃO',
      priceHighlight: 'R$ 149,90',
      badgeText: 'Energia Pura',
      sacredPattern: 'flowerOfLife',
      colorTitle: '#f8f9fa',
      colorSubtitle: '#eadcb9',
      colorDesc: '#f8f9fa',
      sizeTitle: 36,
      sizeSubtitle: 20
    },
    'arcanjo': {
      title: 'ARCANJO MIGUEL',
      subtitle: 'Proteção Divina e Força Celestial',
      description: 'Que a espada azul-cobalto corte todo o mal. Peça forjada com resina sacra, ideal para o altar do seu lar. Sinta a proteção.',
      categoryTag: 'ESCULTURA',
      priceHighlight: '',
      badgeText: 'Proteção',
      sacredPattern: 'metatronCube',
      colorTitle: '#64B5F6',
      colorSubtitle: '#f8f9fa',
      colorDesc: '#eadcb9',
      sizeTitle: 38,
      sizeSubtitle: 21
    },
    'zodiaco': {
      title: 'LINHA ZODÍACO',
      subtitle: 'A Força Oculta dos Astros',
      description: 'Cada signo carrega uma vibração única. Conecte-se com a sua essência astrológica através de pedras regentes e geometria cósmica.',
      categoryTag: 'ASTROLOGIA',
      priceHighlight: '',
      badgeText: 'Cosmos',
      sacredPattern: 'lunarMandala',
      colorTitle: '#f5d77f',
      colorSubtitle: '#d4af37',
      colorDesc: '#f8f9fa',
      sizeTitle: 40,
      sizeSubtitle: 20
    },
    'noa': {
      title: 'NOA ORIXÁS',
      subtitle: 'Força, Axé e Ancestralidade',
      description: 'A natureza é o próprio divino manifesto. Celebre a energia vital dos Orixás com peças que carregam o sopro da vida e a sabedoria dos mais velhos.',
      categoryTag: 'ANCESTRALIDADE',
      priceHighlight: '',
      badgeText: 'Força Maior',
      sacredPattern: 'none',
      colorTitle: '#f8f9fa',
      colorSubtitle: '#eadcb9',
      colorDesc: '#f8f9fa',
      sizeTitle: 38,
      sizeSubtitle: 22
    },
    'kailash': {
      title: 'KAILASH AROMAS',
      subtitle: 'A Magia dos Sentidos Naturais',
      description: 'Transforme o ar da sua casa com aromatizadores extraídos das resinas mais puras da Terra. Onde a fumaça sobe, o espírito se eleva.',
      categoryTag: 'AROMATERAPIA',
      priceHighlight: 'R$ 89,90',
      badgeText: 'Purificação',
      sacredPattern: 'logoPattern',
      colorTitle: '#f8f9fa',
      colorSubtitle: '#d4af37',
      colorDesc: '#f8f9fa',
      sizeTitle: 36,
      sizeSubtitle: 20
    },
    'tibete': {
      title: 'TIBETE E NEPAL',
      subtitle: 'Oração, Solidariedade e Fé',
      description: 'Nossos corações vibram pelas famílias atingidas pelas recentes inundações glaciais de agosto. Que a luz divina conforte as mais de 3.000 vidas afetadas. Dedicamos nossas preces à reconstrução, à paz e à esperança.',
      categoryTag: 'MENSAGEM DE PAZ',
      priceHighlight: '',
      badgeText: 'Apoio Maior',
      sacredPattern: 'sriYantra',
      colorTitle: '#f5d77f',
      colorSubtitle: '#f8f9fa',
      colorDesc: '#eadcb9',
      sizeTitle: 36,
      sizeSubtitle: 21,
      gradientDarkness: '#120d08',
      gradientPrimary: '#261d15'
    },
    'frasePoder': {
      title: 'SABEDORIA DO DIA',
      subtitle: 'O que você busca, busca você',
      description: '"Não procure o santuário fora de você. O universo inteiro reside no seu próprio coração." — Sabedoria Ancestral.',
      categoryTag: 'MANTRA E LUZ',
      priceHighlight: '',
      badgeText: 'Reflexão',
      sacredPattern: 'logoPattern',
      colorTitle: '#eadcb9',
      colorSubtitle: '#d4af37',
      colorDesc: '#f8f9fa',
      sizeTitle: 35,
      sizeSubtitle: 22
    }
  };
  
  if (p[presetKey]) {
    Object.assign(state, p[presetKey]);
    syncUI();
    requestRender();
  }
}"""

content = re.sub(r'function applyPreset\(presetKey\) \{.*?(?=// Renderização Principal)', new_apply_preset + '\n\n', content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)
print("Presets restored.")
