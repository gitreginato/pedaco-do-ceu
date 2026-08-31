// Persistência Automática e Gerenciador de Templates - Pedaço do Céu Studio v2.0
export class Persistence {
  static STORAGE_KEY = 'pedaco-do-ceu-studio-state-v2';
  static TEMPLATES_KEY = 'pedaco-do-ceu-saved-templates-v2';

  static getCleanState(state) {
    const s = { ...state };
    delete s.imgObj;
    delete s.bgImageObj;
    return s;
  }

  static save(state) {
    try {
      const serializableState = this.getCleanState(state);
      // Se imgSrc for um base64 gigantesco que exceda a cota, salva sem quebrar
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializableState));
      } catch (quotaErr) {
        if (serializableState.imgSrc && serializableState.imgSrc.startsWith('data:')) {
          const fallbackState = { ...serializableState, imgSrc: 'assets/images/foto1.jpg' };
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(fallbackState));
        } else {
          throw quotaErr;
        }
      }
    } catch (e) {
      console.warn('Falha ao salvar no localStorage (limite excedido ou modo anônimo):', e);
    }
  }

  static load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Falha ao carregar estado do localStorage:', e);
      return null;
    }
  }

  static clear() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.warn('Falha ao limpar localStorage:', e);
    }
  }

  // --- Gerenciamento de Meus Templates Salvos ---

  static getTemplates() {
    try {
      const raw = localStorage.getItem(this.TEMPLATES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Falha ao obter templates salvos:', e);
      return [];
    }
  }

  static saveTemplate(name, state) {
    try {
      const templates = this.getTemplates();
      const clean = this.getCleanState(state);

      const templateId = 'tpl_' + Date.now();
      const templateName = (name && name.trim()) ? name.trim() : `Template ${clean.title || 'Místico'} (${clean.format || '1:1'})`;

      const newTemplate = {
        id: templateId,
        name: templateName,
        createdAt: new Date().toISOString(),
        format: clean.format || '1:1',
        title: clean.title || 'Sem título',
        categoryTag: clean.categoryTag || '',
        state: clean
      };

      // Adiciona o novo template no topo da lista
      templates.unshift(newTemplate);
      localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
      return newTemplate;
    } catch (e) {
      console.error('Erro ao salvar template personalizado:', e);
      return null;
    }
  }

  static deleteTemplate(id) {
    try {
      const templates = this.getTemplates().filter(t => t.id !== id);
      localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
      return true;
    } catch (e) {
      console.error('Erro ao excluir template:', e);
      return false;
    }
  }

  static exportTemplatesJSON() {
    try {
      const templates = this.getTemplates();
      return JSON.stringify(templates, null, 2);
    } catch (e) {
      console.error('Erro ao exportar templates para JSON:', e);
      return '[]';
    }
  }

  static importTemplatesJSON(jsonStr) {
    try {
      const imported = JSON.parse(jsonStr);
      if (!Array.isArray(imported)) throw new Error('O arquivo JSON deve conter uma lista de templates.');
      const current = this.getTemplates();
      const currentIds = new Set(current.map(t => t.id));

      const merged = [...current];
      for (const t of imported) {
        if (t && t.name && t.state) {
          if (!t.id || currentIds.has(t.id)) {
            t.id = 'tpl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
          }
          currentIds.add(t.id);
          merged.push(t);
        }
      }
      localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(merged));
      return merged;
    } catch (e) {
      console.error('Erro ao importar JSON de templates:', e);
      return null;
    }
  }
}
