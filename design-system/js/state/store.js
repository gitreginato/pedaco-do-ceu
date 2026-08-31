// Store Reativo com Proxy, Undo/Redo e Persistência - Pedaço do Céu Studio v2.0
import { HistoryManager } from './history.js';
import { Persistence } from './persistence.js';

export class Store {
  constructor(initialState) {
    this._listeners = new Set();
    this._history = new HistoryManager(50);
    this._saveTimeout = null;
    this._isRestoring = false;

    // Inicializa o estado com Proxy para interceptar mutações
    this.state = new Proxy({ ...initialState }, {
      set: (target, prop, value) => {
        const oldValue = target[prop];
        if (oldValue !== value) {
          target[prop] = value;
          this._notify(prop, value, oldValue);
          
          if (!this._isRestoring && !prop.startsWith('_') && prop !== 'imgObj' && prop !== 'bgImageObj') {
            this._debouncedHistoryPush();
            this._debouncedSave();
          }
        }
        return true;
      }
    });

    // Salva o snapshot inicial
    this._history.push(this.getSerializableState());
  }

  getSerializableState() {
    const s = { ...this.state };
    delete s.imgObj;
    delete s.bgImageObj;
    return s;
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notify(prop, value, oldValue) {
    for (const listener of this._listeners) {
      try {
        listener(prop, value, oldValue, this.state);
      } catch (err) {
        console.error('Erro em listener do Store:', err);
      }
    }
  }

  _debouncedHistoryPush() {
    clearTimeout(this._historyTimeout);
    this._historyTimeout = setTimeout(() => {
      this._history.push(this.getSerializableState());
      this._updateUndoRedoUI();
    }, 250);
  }

  _debouncedSave() {
    clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => {
      this.saveNow();
    }, 300);
  }

  saveNow() {
    Persistence.save(this.state);
  }

  undo() {
    if (!this._history.canUndo()) return false;
    const previous = this._history.undo(this.getSerializableState());
    if (previous) {
      this._applyState(previous);
      return true;
    }
    return false;
  }

  redo() {
    if (!this._history.canRedo()) return false;
    const next = this._history.redo();
    if (next) {
      this._applyState(next);
      return true;
    }
    return false;
  }

  canUndo() {
    return this._history.canUndo();
  }

  canRedo() {
    return this._history.canRedo();
  }

  _applyState(newState) {
    this._isRestoring = true;
    Object.keys(newState).forEach(key => {
      this.state[key] = newState[key];
    });
    this._isRestoring = false;
    this._notify('*', this.state, null);
    this._updateUndoRedoUI();
  }

  _updateUndoRedoUI() {
    const btnUndo = document.getElementById('btnUndo');
    const btnRedo = document.getElementById('btnRedo');
    if (btnUndo) btnUndo.disabled = !this.canUndo();
    if (btnRedo) btnRedo.disabled = !this.canRedo();
  }
}
