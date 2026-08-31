// Gerenciador de Histórico de Estados (Undo / Redo) - Pedaço do Céu Studio v2.0
export class HistoryManager {
  constructor(maxSnapshots = 50) {
    this.maxSnapshots = maxSnapshots;
    this.past = [];
    this.future = [];
  }

  push(state) {
    // Clonagem profunda segura com structuredClone
    const snapshot = structuredClone(state);
    this.past.push(snapshot);
    if (this.past.length > this.maxSnapshots) {
      this.past.shift();
    }
    this.future = []; // Limpa o futuro ao realizar nova ação
  }

  canUndo() {
    return this.past.length > 1;
  }

  canRedo() {
    return this.future.length > 0;
  }

  undo(currentState) {
    if (!this.canUndo()) return null;
    const current = structuredClone(currentState);
    this.future.push(current);
    this.past.pop(); // Remove o estado atual
    const previous = this.past[this.past.length - 1];
    return structuredClone(previous);
  }

  redo() {
    if (!this.canRedo()) return null;
    const next = this.future.pop();
    this.past.push(structuredClone(next));
    return structuredClone(next);
  }

  clear() {
    this.past = [];
    this.future = [];
  }
}
