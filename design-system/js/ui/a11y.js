// Gerenciador de Acessibilidade (A11y) & ARIA - Pedaço do Céu Studio v2.0
export class A11yManager {
  announce(message) {
    A11yManager.announce(message);
  }

  static announce(message) {
    let region = document.getElementById('a11yStatus');
    if (!region) {
      region = document.createElement('div');
      region.id = 'a11yStatus';
      region.className = 'a11y-live-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
    }
    region.textContent = message;
  }

  static initTabs() {
    const tabButtons = document.querySelectorAll('.tabs-nav .tab-btn');
    const tabPanels = document.querySelectorAll('.tabs-container .tab-content');

    tabButtons.forEach((btn, index) => {
      const targetId = btn.getAttribute('data-target');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('id', `tab-btn-${targetId}`);
      btn.setAttribute('aria-controls', targetId);
      btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
      btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');

      // Navegação por teclado com setas
      btn.addEventListener('keydown', (e) => {
        let newIndex = index;
        if (e.key === 'ArrowRight') {
          newIndex = (index + 1) % tabButtons.length;
        } else if (e.key === 'ArrowLeft') {
          newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        } else {
          return;
        }
        e.preventDefault();
        tabButtons[newIndex].focus();
        tabButtons[newIndex].click();
      });
    });

    tabPanels.forEach((panel) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-btn-${panel.id}`);
      panel.setAttribute('tabindex', '0');
    });
  }

  static calculateLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  static checkContrast(hexColor1, hexColor2) {
    const parse = hex => {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 0, g: 0, b: 0 };
    };
    const c1 = parse(hexColor1);
    const c2 = parse(hexColor2);
    const l1 = this.calculateLuminance(c1.r, c1.g, c1.b) + 0.05;
    const l2 = this.calculateLuminance(c2.r, c2.g, c2.b) + 0.05;
    return l1 > l2 ? l1 / l2 : l2 / l1;
  }
}
