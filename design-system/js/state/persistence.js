// Persistência Automática em LocalStorage - Pedaço do Céu Studio v2.0
export class Persistence {
  static STORAGE_KEY = 'pedaco-do-ceu-studio-state-v2';

  static save(state) {
    try {
      // Clona e remove referências a nós DOM/Imagens não-serializáveis antes de salvar
      const serializableState = { ...state };
      delete serializableState.imgObj;
      delete serializableState.bgImageObj;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializableState));
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
}
