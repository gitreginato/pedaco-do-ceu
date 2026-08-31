(() => {
  // design-system/js/state/history.js
  var HistoryManager = class {
    constructor(maxSnapshots = 50) {
      this.maxSnapshots = maxSnapshots;
      this.past = [];
      this.future = [];
    }
    push(state) {
      const snapshot = structuredClone(state);
      this.past.push(snapshot);
      if (this.past.length > this.maxSnapshots) {
        this.past.shift();
      }
      this.future = [];
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
      this.past.pop();
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
  };

  // design-system/js/state/persistence.js
  var Persistence = class {
    static STORAGE_KEY = "pedaco-do-ceu-studio-state-v2";
    static TEMPLATES_KEY = "pedaco-do-ceu-saved-templates-v2";
    static getCleanState(state) {
      const s = { ...state };
      delete s.imgObj;
      delete s.bgImageObj;
      return s;
    }
    static save(state) {
      try {
        const serializableState = this.getCleanState(state);
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializableState));
        } catch (quotaErr) {
          if (serializableState.imgSrc && serializableState.imgSrc.startsWith("data:")) {
            const fallbackState = { ...serializableState, imgSrc: "assets/images/foto1.jpg" };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(fallbackState));
          } else {
            throw quotaErr;
          }
        }
      } catch (e) {
        console.warn("Falha ao salvar no localStorage (limite excedido ou modo an\xF4nimo):", e);
      }
    }
    static load() {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.warn("Falha ao carregar estado do localStorage:", e);
        return null;
      }
    }
    static clear() {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
      } catch (e) {
        console.warn("Falha ao limpar localStorage:", e);
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
        console.warn("Falha ao obter templates salvos:", e);
        return [];
      }
    }
    static saveTemplate(name, state) {
      try {
        const templates = this.getTemplates();
        const clean = this.getCleanState(state);
        const templateId = "tpl_" + Date.now();
        const templateName = name && name.trim() ? name.trim() : `Template ${clean.title || "M\xEDstico"} (${clean.format || "1:1"})`;
        const newTemplate = {
          id: templateId,
          name: templateName,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          format: clean.format || "1:1",
          title: clean.title || "Sem t\xEDtulo",
          categoryTag: clean.categoryTag || "",
          state: clean
        };
        templates.unshift(newTemplate);
        localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
        return newTemplate;
      } catch (e) {
        console.error("Erro ao salvar template personalizado:", e);
        return null;
      }
    }
    static deleteTemplate(id) {
      try {
        const templates = this.getTemplates().filter((t) => t.id !== id);
        localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates));
        return true;
      } catch (e) {
        console.error("Erro ao excluir template:", e);
        return false;
      }
    }
    static exportTemplatesJSON() {
      try {
        const templates = this.getTemplates();
        return JSON.stringify(templates, null, 2);
      } catch (e) {
        console.error("Erro ao exportar templates para JSON:", e);
        return "[]";
      }
    }
    static importTemplatesJSON(jsonStr) {
      try {
        const imported = JSON.parse(jsonStr);
        if (!Array.isArray(imported)) throw new Error("O arquivo JSON deve conter uma lista de templates.");
        const current = this.getTemplates();
        const currentIds = new Set(current.map((t) => t.id));
        const merged = [...current];
        for (const t of imported) {
          if (t && t.name && t.state) {
            if (!t.id || currentIds.has(t.id)) {
              t.id = "tpl_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
            }
            currentIds.add(t.id);
            merged.push(t);
          }
        }
        localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(merged));
        return merged;
      } catch (e) {
        console.error("Erro ao importar JSON de templates:", e);
        return null;
      }
    }
  };

  // design-system/js/state/store.js
  var Store = class {
    constructor(initialState) {
      this._listeners = /* @__PURE__ */ new Set();
      this._history = new HistoryManager(50);
      this._saveTimeout = null;
      this._isRestoring = false;
      this.state = new Proxy({ ...initialState }, {
        set: (target, prop, value) => {
          const oldValue = target[prop];
          if (oldValue !== value) {
            target[prop] = value;
            this._notify(prop, value, oldValue);
            if (!this._isRestoring && !prop.startsWith("_") && prop !== "imgObj" && prop !== "bgImageObj") {
              this._debouncedHistoryPush();
              this._debouncedSave();
            }
          }
          return true;
        }
      });
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
          console.error("Erro em listener do Store:", err);
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
      Object.keys(newState).forEach((key) => {
        this.state[key] = newState[key];
      });
      this._isRestoring = false;
      this._notify("*", this.state, null);
      this._updateUndoRedoUI();
    }
    _updateUndoRedoUI() {
      const btnUndo = document.getElementById("btnUndo");
      const btnRedo = document.getElementById("btnRedo");
      if (btnUndo) btnUndo.disabled = !this.canUndo();
      if (btnRedo) btnRedo.disabled = !this.canRedo();
    }
  };

  // design-system/js/canvas/high-dpi.js
  var HighDPICanvas = class {
    constructor(canvasElement, targetWidth = 1080, targetHeight = 1080) {
      this.canvas = canvasElement;
      this.targetWidth = targetWidth;
      this.targetHeight = targetHeight;
      this.dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 3) : 1;
      this.ctx = null;
      this.resize(targetWidth, targetHeight);
    }
    resize(width, height) {
      this.targetWidth = width;
      this.targetHeight = height;
      this.dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 3) : 1;
      this.canvas.width = Math.round(this.targetWidth * this.dpr);
      this.canvas.height = Math.round(this.targetHeight * this.dpr);
      this.canvas.style.aspectRatio = `${this.targetWidth} / ${this.targetHeight}`;
      this.ctx = this.canvas.getContext("2d", {
        alpha: false,
        desynchronized: true
      });
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "high";
    }
    getContext() {
      return this.ctx;
    }
    getExportDataURL(format = "image/png", quality = 1) {
      try {
        return this.canvas.toDataURL(format, quality);
      } catch (err) {
        console.warn("Alerta de seguran\xE7a CORS no protocolo file://:", err.message);
        try {
          const fallbackCanvas = document.createElement("canvas");
          fallbackCanvas.width = this.targetWidth;
          fallbackCanvas.height = this.targetHeight;
          const ctx = fallbackCanvas.getContext("2d");
          ctx.fillStyle = "#050c07";
          ctx.fillRect(0, 0, this.targetWidth, this.targetHeight);
          return fallbackCanvas.toDataURL(format, quality);
        } catch (e) {
          return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        }
      }
    }
    async getExportBlob(format = "image/png", quality = 1) {
      return new Promise((resolve) => {
        try {
          if (this.dpr === 1) {
            this.canvas.toBlob((blob) => {
              resolve(blob || new Blob(["dummy"], { type: "image/png" }));
            }, format, quality);
          } else {
            const exportCanvas = document.createElement("canvas");
            exportCanvas.width = this.targetWidth;
            exportCanvas.height = this.targetHeight;
            const expCtx = exportCanvas.getContext("2d", { alpha: false });
            expCtx.imageSmoothingEnabled = true;
            expCtx.imageSmoothingQuality = "high";
            expCtx.drawImage(this.canvas, 0, 0, this.targetWidth, this.targetHeight);
            exportCanvas.toBlob((blob) => {
              resolve(blob || new Blob(["dummy"], { type: "image/png" }));
            }, format, quality);
          }
        } catch (err) {
          console.warn("Exporta\xE7\xE3o toBlob protegida contra canvas tainted no protocolo file://:", err.message);
          resolve(new Blob(["fallback"], { type: "image/png" }));
        }
      });
    }
  };

  // design-system/js/canvas/layers/base.js
  var BaseLayer = class {
    constructor(name, zIndex = 0) {
      this.name = name;
      this.zIndex = zIndex;
      this.visible = true;
      this.dirty = true;
    }
    markDirty() {
      this.dirty = true;
    }
    render(ctx, width, height, state) {
      if (!this.visible) return;
      this.draw(ctx, width, height, state);
      this.dirty = false;
    }
    draw(ctx, width, height, state) {
    }
  };

  // design-system/js/tokens.js
  var TOKENS = {
    colors: {
      sacredGold: "#d4af37",
      sacredGoldLight: "#f5d77f",
      sacredGoldBright: "#ffd700",
      sacredGoldDark: "#8c7322",
      mysticGreen: "#00381c",
      mysticGreenMid: "#008542",
      mysticGreenDeep: "#001f0f",
      mysticDarkness: "#050c07",
      obsidian: "#020503",
      textPrimary: "#f8f9fa",
      textSecondary: "#eadcb9",
      parchment: "#eadcb9"
    },
    fonts: {
      displayNoble: "'Cinzel Decorative', 'Cinzel', serif",
      serifClassic: "'Cinzel', serif",
      imperial: "'Marcellus', serif",
      editorial: "'Playfair Display', serif",
      hauteCouture: "'Bodoni Moda', serif",
      avantGarde: "'Syne', sans-serif",
      mystic: "'Cormorant Garamond', serif",
      renaissance: "'EB Garamond', serif",
      gothic: "'UnifrakturMaguntia', cursive",
      italianScript: "'Fondamento', cursive",
      runic: "'MedievalSharp', cursive",
      script: "'Great Vibes', 'Alex Brush', cursive",
      sansClean: "'Montserrat', sans-serif"
    },
    dimensions: {
      "1:1": { width: 1080, height: 1080, label: "1080 x 1080px (Feed 1:1)" },
      "4:5": { width: 1080, height: 1350, label: "1080 x 1350px (Feed 4:5)" },
      "9:16-story": { width: 1080, height: 1920, label: "1080 x 1920px (Stories)" },
      "9:16-tiktok": { width: 1080, height: 1920, label: "1080 x 1920px (TikTok)" }
    }
  };
  var DESIGN_PRESETS = {
    cristal: {
      name: "Ativa\xE7\xE3o Cristalina",
      gradientPrimary: "#00381c",
      gradientSecondary: "#008542",
      gradientDarkness: "#050c07",
      colorTitle: "#f8f9fa",
      colorTitleGlow: "#d4af37",
      colorSubtitle: "#eadcb9",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#d4af37",
      sacredPattern: "flowerOfLife",
      fitMode: "portal",
      fontTitle: "'Cinzel Decorative', serif",
      fontSubtitle: "'Cormorant Garamond', serif"
    },
    tibete: {
      name: "Prece do Tibete & Nepal",
      gradientPrimary: "#140a03",
      gradientSecondary: "#241407",
      gradientDarkness: "#080401",
      colorTitle: "#ffffff",
      colorTitleGlow: "#f5d77f",
      colorSubtitle: "#f5d77f",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#d4af37",
      sacredPattern: "sriYantra",
      fitMode: "portal",
      fontTitle: "'Cinzel', serif",
      fontSubtitle: "'Playfair Display', serif"
    },
    lunar: {
      name: "Mandala Lunar 432Hz",
      gradientPrimary: "#051329",
      gradientSecondary: "#0d284f",
      gradientDarkness: "#020612",
      colorTitle: "#ffffff",
      colorTitleGlow: "#64b5f6",
      colorSubtitle: "#b0bec5",
      colorHighlight: "#90caf9",
      colorHighlightBorder: "#64b5f6",
      sacredPattern: "lunarMandala",
      fitMode: "fusion",
      fontTitle: "'Marcellus', serif",
      fontSubtitle: "'Playfair Display', serif"
    },
    arcanjos: {
      name: "Portal dos Arcanjos",
      gradientPrimary: "#1a0033",
      gradientSecondary: "#3d0066",
      gradientDarkness: "#0a0014",
      colorTitle: "#f8f9fa",
      colorTitleGlow: "#ffd700",
      colorSubtitle: "#e1bee7",
      colorHighlight: "#ffd700",
      colorHighlightBorder: "#ba68c8",
      sacredPattern: "metatronCube",
      fitMode: "portal",
      fontTitle: "'Cinzel', serif",
      fontSubtitle: "'EB Garamond', serif"
    },
    ancestral: {
      name: "Sabedoria Ancestral",
      gradientPrimary: "#1b2612",
      gradientSecondary: "#384d20",
      gradientDarkness: "#080c05",
      colorTitle: "#fffdf5",
      colorTitleGlow: "#ffb300",
      colorSubtitle: "#d7ccc8",
      colorHighlight: "#ffe082",
      colorHighlightBorder: "#ffb300",
      sacredPattern: "sriYantra",
      fitMode: "cover",
      fontTitle: "'Bodoni Moda', serif",
      fontSubtitle: "'Cormorant Garamond', serif"
    },
    chama: {
      name: "Chama Trina Sagrada",
      gradientPrimary: "#3a0007",
      gradientSecondary: "#6b0513",
      gradientDarkness: "#140003",
      colorTitle: "#ffffff",
      colorTitleGlow: "#f5d77f",
      colorSubtitle: "#ffcdd2",
      colorHighlight: "#ffd700",
      colorHighlightBorder: "#ef5350",
      sacredPattern: "logoPattern",
      fitMode: "portal",
      fontTitle: "'UnifrakturMaguntia', cursive",
      fontSubtitle: "'Fondamento', cursive"
    }
  };
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 31, b: 15 };
  }
  function hexToRgba(hex, alpha = 1) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // design-system/js/canvas/layers/gradient-layer.js
  var GradientLayer = class extends BaseLayer {
    constructor() {
      super("gradient", 10);
      this.stars = this.generateDeterministicStars(90);
    }
    generateDeterministicStars(count) {
      const stars = [];
      let seed = 432;
      const pseudoRandom = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
      for (let i = 0; i < count; i++) {
        stars.push({
          xRatio: pseudoRandom(),
          yRatio: pseudoRandom(),
          radius: 0.6 + pseudoRandom() * 1.6,
          alpha: 0.15 + pseudoRandom() * 0.45,
          isCross: pseudoRandom() > 0.82
        });
      }
      return stars;
    }
    draw(ctx, width, height, state) {
      if (state.bgImageObj) {
        ctx.save();
        ctx.drawImage(state.bgImageObj, 0, 0, width, height);
        ctx.fillStyle = hexToRgba(state.gradientDarkness, 1 - (state.bgImageOpacity || 0.6));
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        return;
      }
      const intensity = state.gradientIntensity || 0.88;
      const cPrimary = state.gradientPrimary || "#00381c";
      const cSecondary = state.gradientSecondary || "#008542";
      const cDarkness = state.gradientDarkness || "#050c07";
      const cGold = state.colorDividers || "#d4af37";
      ctx.fillStyle = cDarkness;
      ctx.fillRect(0, 0, width, height);
      const focalX = state.layout === "right" ? width * 0.35 : state.layout === "left" ? width * 0.65 : width * 0.5;
      const focalY = state.layout === "bottom" ? height * 0.35 : state.layout === "top" ? height * 0.65 : height * 0.45;
      const focalRadius = Math.max(width, height) * 0.85;
      const radialGrad = ctx.createRadialGradient(focalX, focalY, 20, focalX, focalY, focalRadius);
      radialGrad.addColorStop(0, hexToRgba(cSecondary, 0.95 * intensity));
      radialGrad.addColorStop(0.35, hexToRgba(cPrimary, 0.85 * intensity));
      radialGrad.addColorStop(0.75, hexToRgba(cDarkness, 0.92 * intensity));
      radialGrad.addColorStop(1, hexToRgba("#010402", 0.98));
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);
      const celestialBeam = ctx.createRadialGradient(width * 0.5, 0, 10, width * 0.5, 0, height * 0.7);
      celestialBeam.addColorStop(0, hexToRgba(cGold, 0.22 * intensity));
      celestialBeam.addColorStop(0.3, hexToRgba(cSecondary, 0.12 * intensity));
      celestialBeam.addColorStop(0.7, "rgba(0, 0, 0, 0)");
      celestialBeam.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = celestialBeam;
      ctx.fillRect(0, 0, width, height);
      const cornerVignette = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.45, width / 2, height / 2, Math.max(width, height) * 0.75);
      cornerVignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      cornerVignette.addColorStop(0.6, "rgba(0, 0, 0, 0.25)");
      cornerVignette.addColorStop(1, "rgba(0, 0, 0, 0.75)");
      ctx.fillStyle = cornerVignette;
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      this.stars.forEach((star) => {
        const sx = star.xRatio * width;
        const sy = star.yRatio * height;
        ctx.fillStyle = hexToRgba(cGold, star.alpha * intensity * 0.85);
        if (star.isCross) {
          ctx.strokeStyle = hexToRgba(cGold, star.alpha * intensity * 0.9);
          ctx.lineWidth = 0.8;
          const len = star.radius * 2.2;
          ctx.beginPath();
          ctx.moveTo(sx - len, sy);
          ctx.lineTo(sx + len, sy);
          ctx.moveTo(sx, sy - len);
          ctx.lineTo(sx, sy + len);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();
    }
  };

  // design-system/js/canvas/layout-engine.js
  var LAYOUT_CONFIG = {
    right: {
      // Referência funcional — preservada
      type: "split",
      imgAnchor: "left",
      textAnchor: "right",
      imgWidthPercent: 0.6,
      imgHeightPercent: 1,
      textWidthPercent: 0.4,
      textAlign: "center",
      gradientOverlay: false
    },
    left: {
      type: "split",
      imgAnchor: "right",
      textAnchor: "left",
      imgWidthPercent: 0.6,
      imgHeightPercent: 1,
      textWidthPercent: 0.4,
      textAlign: "center",
      gradientOverlay: false
    },
    bottom: {
      type: "stack",
      imgAnchor: "top",
      textAnchor: "bottom",
      imgHeightPercent: 0.58,
      textHeightPercent: 0.42,
      textAlign: "center",
      gradientOverlay: true,
      safeAreaBottom: 60
    },
    top: {
      type: "stack",
      imgAnchor: "bottom",
      textAnchor: "top",
      imgHeightPercent: 0.58,
      textHeightPercent: 0.42,
      textAlign: "center",
      gradientOverlay: true,
      safeAreaTop: 40
    },
    center: {
      type: "overlay",
      imgAnchor: "full",
      textAnchor: "center",
      imgWidthPercent: 1,
      imgHeightPercent: 1,
      textAlign: "center",
      gradientOverlay: true,
      textBgBlur: true
    }
  };
  var SAFE_AREAS = {
    "1:1": { top: 60, bottom: 60, left: 60, right: 60 },
    "4:5": { top: 70, bottom: 70, left: 70, right: 70 },
    "9:16-story": { top: 100, bottom: 120, left: 70, right: 70 },
    "9:16-tiktok": { top: 120, bottom: 140, left: 70, right: 70 }
  };
  function calculateZones(canvasW, canvasH, layoutKey, state) {
    const config = LAYOUT_CONFIG[layoutKey] || LAYOUT_CONFIG.right;
    const zones = {};
    if (config.type === "split") {
      const splitRatio = state && state.splitRatio !== void 0 ? state.splitRatio : config.imgWidthPercent || 0.6;
      const splitX = Math.round(canvasW * splitRatio);
      if (config.imgAnchor === "right") {
        zones.text = { x: 0, y: 0, w: canvasW - splitX, h: canvasH };
        zones.img = { x: canvasW - splitX, y: 0, w: splitX, h: canvasH };
      } else {
        zones.img = { x: 0, y: 0, w: splitX, h: canvasH };
        zones.text = { x: splitX, y: 0, w: canvasW - splitX, h: canvasH };
      }
    } else if (config.type === "stack") {
      const textHPercent = state && state.textZoneHeight !== void 0 ? state.textZoneHeight : config.textHeightPercent || 0.44;
      if (config.imgAnchor === "top") {
        const imgH = Math.round(canvasH * (1 - textHPercent));
        zones.img = { x: 0, y: 0, w: canvasW, h: imgH };
        zones.text = { x: 0, y: imgH, w: canvasW, h: canvasH - imgH };
      } else {
        const textH = Math.round(canvasH * textHPercent);
        zones.text = { x: 0, y: 0, w: canvasW, h: textH };
        zones.img = { x: 0, y: textH, w: canvasW, h: canvasH - textH };
      }
    } else if (config.type === "overlay") {
      zones.img = { x: 0, y: 0, w: canvasW, h: canvasH };
      const cardW = Math.min(canvasW * 0.88, 860);
      const cardH = Math.min(canvasH * 0.78, 1060);
      zones.text = {
        x: (canvasW - cardW) / 2,
        y: (canvasH - cardH) / 2,
        w: cardW,
        h: cardH
      };
    }
    return zones;
  }
  function applySafeArea(zone, formatKey) {
    const safe = SAFE_AREAS[formatKey] || SAFE_AREAS["1:1"];
    return {
      x: zone.x + safe.left,
      y: zone.y + safe.top,
      w: Math.max(100, zone.w - safe.left - safe.right),
      h: Math.max(100, zone.h - safe.top - safe.bottom)
    };
  }
  function measureWrappedText(ctx, text, fontSize, maxWidth, fontFamily) {
    if (!text) return { height: 0, lines: [] };
    ctx.save();
    ctx.font = `${fontSize}px ${fontFamily}`;
    const words = text.split(" ");
    let line = "";
    const lines = [];
    const lineHeight = fontSize * 1.25;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());
    ctx.restore();
    return {
      height: lines.length * lineHeight,
      lines,
      lineHeight
    };
  }
  function calculateTextBlocks(ctx, state, zone, canvasW, canvasH, iteration = 0) {
    const blocks = [];
    const align = state.align || "center";
    const maxWidth = zone.w - (state.paddingSide || 20) * 2;
    const centerX = zone.x + zone.w / 2;
    const leftX = zone.x + (state.paddingSide || 20);
    const rightX = zone.x + zone.w - (state.paddingSide || 20);
    const getX = () => {
      if (align === "left") return leftX;
      if (align === "right") return rightX;
      return centerX;
    };
    const scale = iteration > 0 ? Math.pow(0.9, iteration) : 1;
    const gap = Math.round((state.blockGap || 20) * scale);
    const lineGapExtra = (state.globalLineGap || 12) * scale;
    let currentY = zone.y + Math.max(10, Math.round(((state.paddingTop || 40) - 30) * scale));
    const titleSize = Math.round((state.sizeTitle || 46) * scale);
    const subSize = Math.round((state.sizeSubtitle || 24) * scale);
    const descSize = Math.round((state.sizeDesc || 16) * scale);
    const tagSize = Math.round((state.sizeTag || 14) * scale);
    const badgeSize = Math.round((state.sizeBadge || 12) * scale);
    const highlightSize = Math.round((state.sizeHighlight || 14) * scale);
    const ctaSize = Math.round((state.sizeCta || 14) * scale);
    if (state.showBadge && state.badgeText) {
      blocks.push({
        type: "badge",
        text: state.badgeText,
        x: centerX,
        y: currentY,
        size: badgeSize,
        align: "center",
        color: state.colorBadge,
        colorBorder: state.colorBadge,
        maxWidth
      });
      currentY += Math.round(badgeSize * 2.4) + gap;
    }
    if (state.categoryTag) {
      blocks.push({
        type: "tag",
        text: state.categoryTag.toUpperCase(),
        x: getX(),
        y: currentY,
        size: tagSize,
        align,
        font: `${state.weightTag || 700} ${tagSize}px ${state.fontTag || "'Cinzel', serif"}`,
        color: state.colorTag,
        letterSpacing: state.spacingTag !== void 0 ? state.spacingTag : 2,
        maxWidth
      });
      currentY += Math.round(tagSize * 1.5) + gap + Math.round(titleSize * 0.82);
    } else {
      currentY += Math.round(titleSize * 0.82);
    }
    const titleFontFamily = state.fontTitle || "'Cinzel Decorative', 'Cinzel', serif";
    const titleFont = `${state.weightTitle || 700} ${titleSize}px ${titleFontFamily}`;
    const titleMetrics = measureWrappedText(ctx, state.title, titleSize, maxWidth, titleFontFamily);
    blocks.push({
      type: "title",
      text: state.title,
      size: titleSize,
      lines: titleMetrics.lines,
      lineHeight: titleSize * 1.12 + lineGapExtra * 0.3,
      x: getX(),
      y: currentY,
      align,
      font: titleFont,
      color: state.colorTitle,
      glow: state.glowTitle,
      glowColor: state.colorTitleGlow,
      letterSpacing: state.spacingTitle,
      maxWidth
    });
    currentY += (titleMetrics.lines.length - 1) * (titleSize * 1.12 + lineGapExtra * 0.3) + Math.round(gap * 0.5) + Math.round(subSize * 0.75);
    const subFontFamily = state.fontSubtitle || "'Cormorant Garamond', serif";
    const subFont = `${state.styleSubtitle || "italic 500"} ${subSize}px ${subFontFamily}`;
    const subMetrics = measureWrappedText(ctx, state.subtitle, subSize, maxWidth, subFontFamily);
    blocks.push({
      type: "subtitle",
      text: state.subtitle,
      size: subSize,
      lines: subMetrics.lines,
      lineHeight: subSize * 1.25 + lineGapExtra * 0.2,
      x: getX(),
      y: currentY,
      align,
      font: subFont,
      color: state.colorSubtitle,
      letterSpacing: state.spacingSubtitle !== void 0 ? state.spacingSubtitle : 0,
      maxWidth
    });
    currentY += (subMetrics.lines.length - 1) * (subSize * 1.25 + lineGapExtra * 0.2) + Math.round(gap * 0.8);
    blocks.push({
      type: "divider",
      x: centerX,
      y: currentY,
      width: Math.min(80, maxWidth * 0.3),
      color: state.colorDividers
    });
    currentY += Math.round(gap * 0.8);
    if (state.description) {
      const descFontFamily = state.fontDesc || "'Montserrat', sans-serif";
      const descFont = `${state.weightDesc || 300} ${descSize}px ${descFontFamily}`;
      const descLineH = state.lineHeightDesc ? Math.round(descSize * state.lineHeightDesc) + lineGapExtra * 0.15 : Math.round(descSize * 1.5) + lineGapExtra * 0.15;
      const descMetrics = measureWrappedText(ctx, state.description, descSize, maxWidth, descFontFamily);
      currentY += Math.round(descSize * 0.85);
      blocks.push({
        type: "description",
        text: state.description,
        size: descSize,
        lines: descMetrics.lines,
        lineHeight: descLineH,
        x: getX(),
        y: currentY,
        align,
        font: descFont,
        color: state.colorDesc,
        maxWidth
      });
      currentY += (descMetrics.lines.length - 1) * descLineH + gap;
    }
    if (state.showHighlightBox && state.highlightText) {
      blocks.push({
        type: "highlight",
        text: state.highlightText,
        size: highlightSize,
        x: leftX,
        y: currentY,
        width: maxWidth,
        align,
        color: state.colorHighlight,
        colorBorder: state.colorHighlightBorder,
        showBox: state.showHighlightBox
      });
      currentY += 46 + gap;
    }
    if (state.ctaText && state.ctaText.trim() !== "") {
      const ctaY = Math.max(currentY + gap, zone.y + zone.h - 25);
      blocks.push({
        type: "cta",
        text: state.ctaText,
        size: ctaSize,
        x: getX(),
        y: ctaY,
        align,
        font: `${state.weightCta || 600} ${ctaSize}px ${state.fontCta || "'Cinzel', serif"}`,
        color: state.colorCta || state.colorTitle,
        letterSpacing: state.spacingCta !== void 0 ? state.spacingCta : 1.5,
        maxWidth
      });
    }
    if (currentY > zone.y + zone.h + 20 && iteration < 3) {
      return calculateTextBlocks(ctx, state, zone, canvasW, canvasH, iteration + 1);
    }
    return blocks;
  }
  function renderGradientOverlay(ctx, zones, config, state, canvasW, canvasH) {
    if (!config.gradientOverlay || !zones.img) return;
    ctx.save();
    if (config.imgAnchor === "top") {
      const overlay = ctx.createLinearGradient(0, zones.img.h - 160, 0, zones.img.h + 80);
      overlay.addColorStop(0, "rgba(5, 12, 7, 0)");
      overlay.addColorStop(0.5, hexToRgba(state.gradientPrimary || "#00381c", 0.85 * (state.gradientIntensity || 0.88)));
      overlay.addColorStop(1, hexToRgba(state.gradientDarkness || "#050c07", state.gradientIntensity || 0.88));
      ctx.fillStyle = overlay;
      ctx.fillRect(0, zones.img.h - 160, canvasW, 240);
    } else if (config.imgAnchor === "bottom") {
      const overlay = ctx.createLinearGradient(0, zones.img.y - 80, 0, zones.img.y + 160);
      overlay.addColorStop(0, hexToRgba(state.gradientDarkness || "#050c07", state.gradientIntensity || 0.88));
      overlay.addColorStop(0.5, hexToRgba(state.gradientPrimary || "#00381c", 0.85 * (state.gradientIntensity || 0.88)));
      overlay.addColorStop(1, "rgba(5, 12, 7, 0)");
      ctx.fillStyle = overlay;
      ctx.fillRect(0, zones.img.y - 80, canvasW, 240);
    } else if (config.type === "overlay") {
      const radial = ctx.createRadialGradient(
        canvasW / 2,
        canvasH / 2,
        canvasW * 0.22,
        canvasW / 2,
        canvasH / 2,
        canvasW * 0.78
      );
      radial.addColorStop(0, "rgba(5, 12, 7, 0.2)");
      radial.addColorStop(0.6, hexToRgba(state.gradientDarkness || "#050c07", 0.65 * (state.gradientIntensity || 0.88)));
      radial.addColorStop(1, hexToRgba(state.gradientDarkness || "#050c07", 0.92 * (state.gradientIntensity || 0.88)));
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, canvasW, canvasH);
    }
    ctx.restore();
  }

  // design-system/js/canvas/layers/image-layer.js
  var ImageLayer = class extends BaseLayer {
    constructor() {
      super("image", 20);
    }
    draw(ctx, width, height, state) {
      if (!state.imgObj) return;
      if (state.layout === "right") {
        this.drawSplit(ctx, width, height, state, false);
        return;
      }
      if (state.layout === "left") {
        this.drawSplit(ctx, width, height, state, true);
        return;
      }
      const zones = calculateZones(width, height, state.layout, state);
      if (!zones.img) return;
      switch (state.layout) {
        case "bottom":
          this.drawBottomStack(ctx, width, height, zones.img, state);
          break;
        case "top":
          this.drawTopStack(ctx, width, height, zones.img, state);
          break;
        case "center":
          this.drawCenterOverlay(ctx, width, height, zones.img, state);
          break;
        default:
          this.drawSplit(ctx, width, height, state, false);
      }
    }
    drawSplit(ctx, W, H, state, isLeft) {
      const splitX = Math.round(W * (state.splitRatio !== void 0 ? state.splitRatio : 0.6));
      const radius = state.cardRadius !== void 0 ? state.cardRadius : 18;
      if (state.fitMode === "portal") {
        const frameX = isLeft ? W - splitX + 10 : 35;
        const frameY = 40;
        const frameW = splitX - 45;
        const frameH = H - 80;
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
        ctx.shadowBlur = 25;
        ctx.shadowOffsetY = 8;
        ctx.fillStyle = "#020904";
        this.roundRect(ctx, frameX, frameY, frameW, frameH, radius, true, false);
        ctx.shadowColor = "transparent";
        ctx.save();
        this.roundRect(ctx, frameX, frameY, frameW, frameH, radius, false, false);
        ctx.clip();
        this.drawImageCover(ctx, state.imgObj, frameX, frameY, frameW, frameH, state);
        ctx.restore();
        ctx.strokeStyle = state.colorCorners;
        ctx.lineWidth = 2.5;
        this.roundRect(ctx, frameX, frameY, frameW, frameH, radius, false, true);
        ctx.strokeStyle = hexToRgba(state.colorCorners, 0.4);
        ctx.lineWidth = 1;
        this.roundRect(ctx, frameX + 6, frameY + 6, frameW - 12, frameH - 12, Math.max(radius - 4, 4), false, true);
        ctx.restore();
      } else if (state.fitMode === "fusion") {
        ctx.save();
        ctx.beginPath();
        if (isLeft) {
          ctx.rect(W - splitX - 80, 0, splitX + 80, H);
        } else {
          ctx.rect(0, 0, splitX + 80, H);
        }
        ctx.clip();
        if (isLeft) {
          this.drawImageCover(ctx, state.imgObj, W - splitX - 80, 0, splitX + 80, H, state);
        } else {
          this.drawImageCover(ctx, state.imgObj, 0, 0, splitX + 80, H, state);
        }
        ctx.restore();
        let fadeGrad;
        if (isLeft) {
          fadeGrad = ctx.createLinearGradient(W - splitX + 160, 0, W - splitX - 80, 0);
        } else {
          fadeGrad = ctx.createLinearGradient(splitX - 160, 0, splitX + 80, 0);
        }
        fadeGrad.addColorStop(0, "rgba(0, 31, 15, 0)");
        fadeGrad.addColorStop(0.4, hexToRgba(state.gradientPrimary, 0.85 * (state.gradientIntensity || 0.88)));
        fadeGrad.addColorStop(0.8, hexToRgba(state.gradientSecondary, 0.96 * (state.gradientIntensity || 0.88)));
        fadeGrad.addColorStop(1, hexToRgba(state.gradientDarkness, state.gradientIntensity || 0.88));
        ctx.fillStyle = fadeGrad;
        if (isLeft) {
          ctx.fillRect(0, 0, W - splitX + 160, H);
        } else {
          ctx.fillRect(splitX - 160, 0, W - (splitX - 160), H);
        }
      } else {
        this.drawImageCover(ctx, state.imgObj, 0, 0, W, H, state);
        const ov = ctx.createLinearGradient(isLeft ? W : 0, 0, isLeft ? 0 : W, 0);
        ov.addColorStop(0, "rgba(0, 20, 10, 0.25)");
        ov.addColorStop(0.45, hexToRgba(state.gradientPrimary, 0.85 * (state.gradientIntensity || 0.88)));
        ov.addColorStop(1, hexToRgba(state.gradientDarkness, 0.96 * (state.gradientIntensity || 0.88)));
        ctx.fillStyle = ov;
        ctx.fillRect(0, 0, W, H);
      }
    }
    drawBottomStack(ctx, W, H, zone, state) {
      if (state.fitMode === "portal") {
        const portalW = W - 70;
        const portalH = zone.h - 50;
        const portalX = 35;
        const portalY = 35;
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
        ctx.shadowBlur = 22;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = "#020904";
        this.roundRect(ctx, portalX, portalY, portalW, portalH, 18, true, false);
        ctx.shadowColor = "transparent";
        ctx.save();
        this.roundRect(ctx, portalX, portalY, portalW, portalH, 18, false, false);
        ctx.clip();
        this.drawImageCover(ctx, state.imgObj, portalX, portalY, portalW, portalH, state);
        ctx.restore();
        ctx.strokeStyle = state.colorCorners;
        ctx.lineWidth = 2.2;
        this.roundRect(ctx, portalX, portalY, portalW, portalH, 18, false, true);
        ctx.restore();
      } else if (state.fitMode === "cover" || state.textCardStyle === "gradient" || state.textCardStyle === "transparent" || state.textCardStyle === "separated" || state.textCardStyle === "glass" || state.textCardStyle === "framed") {
        this.drawImageCover(ctx, state.imgObj, 0, 0, W, H, state);
      } else if (state.fitMode === "fusion") {
        this.drawImageCover(ctx, state.imgObj, 0, 0, W, H, state);
        const ov = ctx.createLinearGradient(0, zone.h - 100, 0, H);
        ov.addColorStop(0, "rgba(0, 0, 0, 0)");
        ov.addColorStop(0.5, hexToRgba(state.gradientPrimary || "#00381c", 0.8 * (state.gradientIntensity || 0.88)));
        ov.addColorStop(1, hexToRgba(state.gradientDarkness || "#050c07", state.gradientIntensity || 0.88));
        ctx.fillStyle = ov;
        ctx.fillRect(0, zone.h - 100, W, H - (zone.h - 100));
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.rect(zone.x, zone.y, zone.w, zone.h);
        ctx.clip();
        this.drawImageCover(ctx, state.imgObj, zone.x, zone.y, zone.w, zone.h, state);
        ctx.restore();
      }
    }
    drawTopStack(ctx, W, H, zone, state) {
      if (state.fitMode === "portal") {
        const portalW = W - 70;
        const portalH = zone.h - 50;
        const portalX = 35;
        const portalY = zone.y + 15;
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
        ctx.shadowBlur = 22;
        ctx.fillStyle = "#020904";
        this.roundRect(ctx, portalX, portalY, portalW, portalH, 18, true, false);
        ctx.shadowColor = "transparent";
        ctx.save();
        this.roundRect(ctx, portalX, portalY, portalW, portalH, 18, false, false);
        ctx.clip();
        this.drawImageCover(ctx, state.imgObj, portalX, portalY, portalW, portalH, state);
        ctx.restore();
        ctx.strokeStyle = state.colorCorners;
        ctx.lineWidth = 2.2;
        this.roundRect(ctx, portalX, portalY, portalW, portalH, 18, false, true);
        ctx.restore();
      } else if (state.fitMode === "cover" || state.textCardStyle === "gradient" || state.textCardStyle === "transparent" || state.textCardStyle === "separated" || state.textCardStyle === "glass" || state.textCardStyle === "framed") {
        this.drawImageCover(ctx, state.imgObj, 0, 0, W, H, state);
      } else if (state.fitMode === "fusion") {
        this.drawImageCover(ctx, state.imgObj, 0, 0, W, H, state);
        const ov = ctx.createLinearGradient(0, zone.y + 100, 0, 0);
        ov.addColorStop(0, "rgba(0, 0, 0, 0)");
        ov.addColorStop(0.5, hexToRgba(state.gradientPrimary || "#00381c", 0.8 * (state.gradientIntensity || 0.88)));
        ov.addColorStop(1, hexToRgba(state.gradientDarkness || "#050c07", state.gradientIntensity || 0.88));
        ctx.fillStyle = ov;
        ctx.fillRect(0, 0, W, zone.y + 100);
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.rect(zone.x, zone.y, zone.w, zone.h);
        ctx.clip();
        this.drawImageCover(ctx, state.imgObj, zone.x, zone.y, zone.w, zone.h, state);
        ctx.restore();
      }
    }
    drawCenterOverlay(ctx, W, H, zone, state) {
      this.drawImageCover(ctx, state.imgObj, 0, 0, W, H, state);
    }
    drawImageCover(ctx, img, x, y, w, h, state) {
      const imgRatio = img.width / img.height;
      const targetRatio = w / h;
      let renderW, renderH, offsetX, offsetY;
      const zoom = state.imgZoom || 1;
      const panX = state.imgPanX || 0;
      const panY = state.imgPanY || 0;
      const flipH = state.imgFlipH || false;
      const flipV = state.imgFlipV || false;
      if (imgRatio > targetRatio) {
        renderH = h * zoom;
        renderW = h * imgRatio * zoom;
      } else {
        renderW = w * zoom;
        renderH = w / imgRatio * zoom;
      }
      offsetX = x + (w - renderW) / 2 + panX;
      offsetY = y + (h - renderH) / 2 + panY;
      if (flipH || flipV) {
        ctx.save();
        const cx = x + w / 2;
        const cy = y + h / 2;
        ctx.translate(cx, cy);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.translate(-cx, -cy);
        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
        ctx.restore();
      } else {
        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
      }
    }
    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    }
  };

  // design-system/js/canvas/layers/pattern-layer.js
  var PatternLayer = class extends BaseLayer {
    constructor() {
      super("pattern", 30);
    }
    draw(ctx, width, height, state) {
      const patternKey = state.sacredPattern;
      if (!patternKey || patternKey === "none") return;
      const zones = calculateZones(width, height, state.layout, state);
      let cx = width / 2;
      let cy = height / 2;
      let radius = Math.min(width, height) * 0.38;
      if (zones && zones.text) {
        cx = zones.text.x + zones.text.w / 2;
        cy = zones.text.y + zones.text.h / 2;
        radius = Math.min(zones.text.w * 0.44, zones.text.h * 0.44);
      }
      const strokeColor = state.colorPattern || state.colorDividers || "#d4af37";
      const opacity = state.patternOpacity !== void 0 ? state.patternOpacity : 0.35;
      if (opacity <= 0.01) return;
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = strokeColor;
      ctx.lineWidth = 1.2;
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 6;
      switch (patternKey) {
        case "flowerOfLife":
          this.drawFlowerOfLife(ctx, cx, cy, radius);
          break;
        case "metatronCube":
          this.drawMetatronCube(ctx, cx, cy, radius);
          break;
        case "sriYantra":
          this.drawSriYantra(ctx, cx, cy, radius);
          break;
        case "lunarMandala":
          this.drawLunarMandala(ctx, cx, cy, radius);
          break;
        case "logoPattern":
          this.drawLogoPattern(ctx, cx, cy, radius);
          break;
        case "seedOfLife":
          this.drawSeedOfLife(ctx, cx, cy, radius);
          break;
        case "merkaba":
          this.drawMerkaba(ctx, cx, cy, radius);
          break;
        case "torus":
          this.drawTorus(ctx, cx, cy, radius);
          break;
        default:
          this.drawFlowerOfLife(ctx, cx, cy, radius);
      }
      ctx.restore();
    }
    // 1. Flor da Vida (Flower of Life)
    drawFlowerOfLife(ctx, cx, cy, R) {
      const step = R * 0.32;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.arc(cx, cy, R * 1.04, 0, Math.PI * 2);
      ctx.stroke();
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.96, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      ctx.beginPath();
      ctx.arc(cx, cy, step, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const angle = i * 60 * (Math.PI / 180);
        const x = cx + step * Math.cos(angle);
        const y = cy + step * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, step, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let i = 0; i < 6; i++) {
        const angle = i * 60 * (Math.PI / 180);
        const x = cx + 2 * step * Math.cos(angle);
        const y = cy + 2 * step * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, step, 0, Math.PI * 2);
        ctx.stroke();
        const angle2 = (i * 60 + 30) * (Math.PI / 180);
        const dist = Math.sqrt(3) * step;
        const x2 = cx + dist * Math.cos(angle2);
        const y2 = cy + dist * Math.sin(angle2);
        ctx.beginPath();
        ctx.arc(x2, y2, step, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    // 2. Cubo de Metatron (Metatron's Cube)
    drawMetatronCube(ctx, cx, cy, R) {
      const nodes = [];
      const rNode = R * 0.12;
      nodes.push({ x: cx, y: cy });
      const rInner = R * 0.45;
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 30) * (Math.PI / 180);
        nodes.push({ x: cx + rInner * Math.cos(angle), y: cy + rInner * Math.sin(angle) });
      }
      const rOuter = R * 0.85;
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 30) * (Math.PI / 180);
        nodes.push({ x: cx + rOuter * Math.cos(angle), y: cy + rOuter * Math.sin(angle) });
      }
      ctx.save();
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
        }
      }
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.lineWidth = 1.4;
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, rNode, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.arc(cx, cy, R * 1.04, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 3. Sri Yantra Sagrado
    drawSriYantra(ctx, cx, cy, R) {
      const bSize = R * 0.98;
      ctx.strokeRect(cx - bSize, cy - bSize, bSize * 2, bSize * 2);
      ctx.strokeRect(cx - bSize * 0.95, cy - bSize * 0.95, bSize * 1.9, bSize * 1.9);
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.88, 0, Math.PI * 2);
      ctx.arc(cx, cy, R * 0.82, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 16; i++) {
        const angle = i * 22.5 * (Math.PI / 180);
        const px = cx + R * 0.85 * Math.cos(angle);
        const py = cy + R * 0.85 * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(px, py, R * 0.08, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.68, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const angle = i * 45 * (Math.PI / 180);
        const px = cx + R * 0.68 * Math.cos(angle);
        const py = cy + R * 0.68 * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(px, py, R * 0.1, 0, Math.PI * 2);
        ctx.stroke();
      }
      const drawTri = (topY, bottomY, leftX, rightX, pointUp) => {
        ctx.beginPath();
        if (pointUp) {
          ctx.moveTo(cx, topY);
          ctx.lineTo(rightX, bottomY);
          ctx.lineTo(leftX, bottomY);
        } else {
          ctx.moveTo(cx, bottomY);
          ctx.lineTo(rightX, topY);
          ctx.lineTo(leftX, topY);
        }
        ctx.closePath();
        ctx.stroke();
      };
      const s = R * 0.55;
      drawTri(cy - s * 0.95, cy + s * 0.7, cx - s * 0.85, cx + s * 0.85, true);
      drawTri(cy - s * 0.65, cy + s * 0.95, cx - s * 0.82, cx + s * 0.82, false);
      drawTri(cy - s * 0.8, cy + s * 0.5, cx - s * 0.7, cx + s * 0.7, true);
      drawTri(cy - s * 0.45, cy + s * 0.8, cx - s * 0.68, cx + s * 0.68, false);
      drawTri(cy - s * 0.6, cy + s * 0.35, cx - s * 0.55, cx + s * 0.55, true);
      drawTri(cy - s * 0.3, cy + s * 0.6, cx - s * 0.52, cx + s * 0.52, false);
      drawTri(cy - s * 0.4, cy + s * 0.2, cx - s * 0.38, cx + s * 0.38, true);
      drawTri(cy - s * 0.15, cy + s * 0.42, cx - s * 0.36, cx + s * 0.36, false);
      drawTri(cy - s * 0.05, cy + s * 0.25, cx - s * 0.22, cx + s * 0.22, false);
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // 4. Mandala Lunar & Estelar Cósmica
    drawLunarMandala(ctx, cx, cy, R) {
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.98, 0, Math.PI * 2);
      ctx.arc(cx, cy, R * 0.92, 0, Math.PI * 2);
      ctx.arc(cx, cy, R * 0.65, 0, Math.PI * 2);
      ctx.arc(cx, cy, R * 0.38, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 24; i++) {
        const angle = i * 15 * (Math.PI / 180);
        const isMajor = i % 2 === 0;
        const r1 = isMajor ? R * 0.68 : R * 0.74;
        const r2 = isMajor ? R * 0.9 : R * 0.88;
        ctx.beginPath();
        ctx.moveTo(cx + r1 * Math.cos(angle), cy + r1 * Math.sin(angle));
        ctx.lineTo(cx + r2 * Math.cos(angle), cy + r2 * Math.sin(angle));
        ctx.stroke();
      }
      for (let i = 0; i < 8; i++) {
        const angle = i * 45 * (Math.PI / 180);
        const lx = cx + R * 0.52 * Math.cos(angle);
        const ly = cy + R * 0.52 * Math.sin(angle);
        const moonR = R * 0.07;
        ctx.beginPath();
        ctx.arc(lx, ly, moonR, 0, Math.PI * 2);
        ctx.stroke();
        if (i % 2 !== 0) {
          ctx.beginPath();
          ctx.arc(lx + moonR * 0.35, ly, moonR * 0.85, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
        }
      }
      this.drawStar(ctx, cx, cy, 12, R * 0.28, R * 0.14);
    }
    // 5. Símbolo da Marca Pedaço do Céu (Lua + 3 Estrelas)
    drawLogoPattern(ctx, cx, cy, R) {
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.98, 0, Math.PI * 2);
      ctx.arc(cx, cy, R * 0.94, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 36; i++) {
        const angle = i * 10 * (Math.PI / 180);
        const r1 = i % 3 === 0 ? R * 0.8 : R * 0.86;
        const r2 = R * 0.92;
        ctx.beginPath();
        ctx.moveTo(cx + r1 * Math.cos(angle), cy + r1 * Math.sin(angle));
        ctx.lineTo(cx + r2 * Math.cos(angle), cy + r2 * Math.sin(angle));
        ctx.stroke();
      }
      ctx.save();
      ctx.beginPath();
      const moonR = R * 0.48;
      ctx.arc(cx - moonR * 0.1, cy, moonR, -Math.PI * 0.65, Math.PI * 0.65, false);
      ctx.arc(cx + moonR * 0.35, cy, moonR * 0.82, Math.PI * 0.55, -Math.PI * 0.55, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      this.drawStar(ctx, cx + R * 0.22, cy - R * 0.26, 8, R * 0.12, R * 0.05, true);
      this.drawStar(ctx, cx + R * 0.35, cy, 8, R * 0.15, R * 0.06, true);
      this.drawStar(ctx, cx + R * 0.22, cy + R * 0.26, 8, R * 0.12, R * 0.05, true);
    }
    // 6. Semente da Vida (Seed of Life)
    drawSeedOfLife(ctx, cx, cy, R) {
      const step = R * 0.45;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, step, 0, Math.PI * 2);
      for (let i = 0; i < 6; i++) {
        const angle = i * 60 * (Math.PI / 180);
        ctx.arc(cx + step * Math.cos(angle), cy + step * Math.sin(angle), step, 0, Math.PI * 2);
      }
      ctx.stroke();
    }
    // 7. Veículo de Luz Merkaba
    drawMerkaba(ctx, cx, cy, R) {
      this.drawStar(ctx, cx, cy, 6, R * 0.85, R * 0.45);
      this.drawStar(ctx, cx, cy, 6, R * 0.65, R * 0.32);
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.95, 0, Math.PI * 2);
      ctx.arc(cx, cy, R * 0.22, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const angle = i * 60 * (Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + R * 0.85 * Math.cos(angle), cy + R * 0.85 * Math.sin(angle));
        ctx.stroke();
      }
    }
    // 8. Toro Cósmico (Torus Energy Field)
    drawTorus(ctx, cx, cy, R) {
      const rings = 12;
      for (let i = 0; i < rings; i++) {
        const angle = i * (360 / rings) * (Math.PI / 180);
        const ox = cx + R * 0.35 * Math.cos(angle);
        const oy = cy + R * 0.35 * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(ox, oy, R * 0.55, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.95, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Helper para desenhar estrelas de N pontas
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, fill = false) {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      if (fill) ctx.fill();
      ctx.stroke();
    }
  };

  // design-system/js/canvas/layers/overlay-layer.js
  var OverlayLayer = class extends BaseLayer {
    constructor() {
      super("overlay", 35);
    }
    draw(ctx, width, height, state) {
      const config = LAYOUT_CONFIG[state.layout];
      if (!config || !config.gradientOverlay) return;
      const zones = calculateZones(width, height, state.layout, state);
      renderGradientOverlay(ctx, zones, config, state, width, height);
    }
  };

  // design-system/js/canvas/layers/text-layer.js
  var TextLayer = class extends BaseLayer {
    constructor() {
      super("text", 40);
      this.boundingBoxes = [];
    }
    draw(ctx, width, height, state) {
      this.boundingBoxes = [];
      if (state.layout === "right" || state.layout === "left") {
        this.drawSplitLayout(ctx, width, height, state, state.layout === "left");
        return;
      }
      const zones = calculateZones(width, height, state.layout, state);
      if (!zones.text) return;
      const cardStyle = state.textCardStyle || "card";
      if (cardStyle !== "transparent" && cardStyle !== "separated") {
        if (cardStyle === "gradient") {
          this.drawGradientFadeBackground(ctx, width, height, zones.text, state);
        } else if (cardStyle === "glass") {
          this.drawGlassCardBackground(ctx, zones.text, state);
        } else if (cardStyle === "framed") {
          this.drawFramedCardBackground(ctx, zones.text, state);
        } else {
          if (state.layout === "center") {
            this.drawCenterCardBackground(ctx, zones.text, state);
          } else if (state.layout === "bottom") {
            this.drawBottomCardBackground(ctx, zones.text, state);
          } else if (state.layout === "top") {
            this.drawTopCardBackground(ctx, zones.text, state);
          }
        }
      }
      if (state.showHeader && state.headerText) {
        const align = state.align || "center";
        const headerX = align === "left" ? state.paddingSide || 60 : align === "right" ? width - (state.paddingSide || 60) : width / 2;
        ctx.save();
        ctx.textAlign = align;
        ctx.fillStyle = state.colorHeader || "#d4af37";
        ctx.font = `${state.weightHeader || 600} ${state.sizeHeader || 12}px ${state.fontHeader || "'Cinzel', serif"}`;
        ctx.letterSpacing = `${state.spacingHeader !== void 0 ? state.spacingHeader : 2}px`;
        ctx.fillText((state.headerText || "").toUpperCase(), headerX, 28);
        ctx.letterSpacing = "0px";
        ctx.restore();
      }
      const safeZone = applySafeArea(zones.text, state.format);
      const blocks = calculateTextBlocks(ctx, state, safeZone, width, height);
      this.renderCalibratedBlocks(ctx, blocks, state);
    }
    drawSplitLayout(ctx, W, H, state, isLeft) {
      const imgW = Math.round(W * (state.splitRatio !== void 0 ? state.splitRatio : 0.6));
      const textW = W - imgW;
      const colX = isLeft ? state.paddingSide || 20 : imgW + (state.paddingSide || 20);
      const innerW = textW - (state.paddingSide || 20) * 2;
      const gap = state.blockGap || 22;
      const lineGapExtra = state.globalLineGap || 12;
      let curY = state.paddingTop || 90;
      const tagX = this.getAlignX(colX, innerW, state.align);
      if (state.showHeader && state.headerText) {
        const align = state.align || "center";
        const headerX = align === "left" ? colX : align === "right" ? colX + innerW : colX + innerW / 2;
        ctx.save();
        ctx.textAlign = align;
        ctx.fillStyle = state.colorHeader || "#d4af37";
        ctx.font = `${state.weightHeader || 600} ${state.sizeHeader || 12}px ${state.fontHeader || "'Cinzel', serif"}`;
        ctx.letterSpacing = `${state.spacingHeader !== void 0 ? state.spacingHeader : 2}px`;
        ctx.fillText((state.headerText || "").toUpperCase(), headerX, Math.max(28, curY - 36));
        ctx.letterSpacing = "0px";
        ctx.restore();
      }
      if (state.showBadge && state.badgeText) {
        curY = this.drawBadgePill(ctx, tagX, curY, state.badgeText, state.align === "center", state);
        curY += gap * 0.4;
      }
      if (state.categoryTag) {
        ctx.save();
        ctx.textAlign = state.align;
        ctx.fillStyle = state.colorTag;
        const tFont = state.fontTag || "'Cinzel', serif";
        const tSize = state.sizeTag || 14;
        const tWeight = state.weightTag || 600;
        ctx.font = `${tWeight} ${tSize}px ${tFont}`;
        ctx.letterSpacing = `${state.spacingTag !== void 0 ? state.spacingTag : 2}px`;
        ctx.fillText(state.categoryTag.toUpperCase(), tagX, curY);
        ctx.letterSpacing = "0px";
        ctx.restore();
        curY += Math.round(tSize * 1.5) + gap;
      }
      if (state.title) {
        ctx.save();
        ctx.textAlign = state.align;
        ctx.fillStyle = state.colorTitle;
        const titFont = state.fontTitle || "'Cinzel Decorative', 'Cinzel', serif";
        const titSize = state.sizeTitle || 38;
        const titWeight = state.weightTitle || 700;
        ctx.font = `${titWeight} ${titSize}px ${titFont}`;
        ctx.letterSpacing = `${state.spacingTitle !== void 0 ? state.spacingTitle : 1}px`;
        if (state.glowTitle > 0) {
          ctx.shadowColor = state.colorTitleGlow || state.colorTitle;
          ctx.shadowBlur = state.glowTitle;
        }
        curY = this.drawWrappedText(ctx, state.title, tagX, curY, innerW, Math.round(titSize * 1.15) + lineGapExtra);
        ctx.shadowColor = "transparent";
        ctx.letterSpacing = "0px";
        ctx.restore();
        curY += gap;
      }
      if (state.subtitle) {
        ctx.save();
        ctx.textAlign = state.align;
        ctx.fillStyle = state.colorSubtitle;
        const subFont = state.fontSubtitle || "'Cormorant Garamond', serif";
        const subSize = state.sizeSubtitle || 24;
        const subStyle = state.styleSubtitle || "italic 500";
        ctx.font = `${subStyle} ${subSize}px ${subFont}`;
        ctx.letterSpacing = `${state.spacingSubtitle !== void 0 ? state.spacingSubtitle : 0}px`;
        curY = this.drawWrappedText(ctx, state.subtitle, tagX, curY, innerW, Math.round(subSize * 1.25) + lineGapExtra);
        ctx.letterSpacing = "0px";
        ctx.restore();
        curY += gap;
      }
      this.drawCelestialDivider(ctx, colX + innerW / 2, curY, Math.min(80, innerW * 0.4), state.colorDividers);
      curY += 26;
      if (state.description) {
        ctx.save();
        ctx.textAlign = state.align;
        ctx.fillStyle = state.colorDesc;
        const dFont = state.fontDesc || "'Montserrat', sans-serif";
        const dSize = state.sizeDesc || 15;
        const dWeight = state.weightDesc || 300;
        const dLineH = state.lineHeightDesc ? Math.round(dSize * state.lineHeightDesc) : 22;
        ctx.font = `${dWeight} ${dSize}px ${dFont}`;
        curY = this.drawWrappedText(ctx, state.description, tagX, curY, innerW, dLineH);
        ctx.restore();
        curY += gap + 6;
      }
      if (state.showHighlightBox && state.highlightText) {
        curY = this.drawHighlightBox(ctx, colX, curY, innerW, state.highlightText, state);
        curY += gap;
      }
      if (state.ctaText && state.ctaText.trim() !== "") {
        const ctaY = Math.max(curY + 10, H - 55);
        ctx.save();
        ctx.textAlign = state.align;
        ctx.fillStyle = state.colorCta || state.colorTitle;
        const cFont = state.fontCta || "'Cinzel', serif";
        const cSize = state.sizeCta || 14;
        const cWeight = state.weightCta || 600;
        ctx.font = `${cWeight} ${cSize}px ${cFont}`;
        ctx.letterSpacing = `${state.spacingCta !== void 0 ? state.spacingCta : 1}px`;
        ctx.fillText(state.ctaText, tagX, ctaY);
        ctx.letterSpacing = "0px";
        ctx.restore();
      }
    }
    drawBottomCardBackground(ctx, zone, state) {
      const opacity = state.boxOpacity !== void 0 ? state.boxOpacity : 0.95;
      const radius = state.cardRadius !== void 0 ? state.cardRadius : 16;
      const padX = state.paddingSide !== void 0 ? Math.min(state.paddingSide, 80) : 28;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 25;
      const cardGrad = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.h);
      cardGrad.addColorStop(0, hexToRgba(state.gradientPrimary || "#00381c", opacity));
      cardGrad.addColorStop(1, hexToRgba(state.gradientDarkness || "#050c07", Math.min(opacity + 0.03, 1)));
      ctx.fillStyle = cardGrad;
      this.roundRect(ctx, zone.x + padX, zone.y + 10, zone.w - padX * 2, zone.h - 38, radius, true, false);
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = hexToRgba(state.colorCorners || "#d4af37", 0.5);
      ctx.lineWidth = 1.2;
      this.roundRect(ctx, zone.x + padX, zone.y + 10, zone.w - padX * 2, zone.h - 38, radius, false, true);
      ctx.restore();
    }
    drawTopCardBackground(ctx, zone, state) {
      const opacity = state.boxOpacity !== void 0 ? state.boxOpacity : 0.95;
      const radius = state.cardRadius !== void 0 ? state.cardRadius : 16;
      const padX = state.paddingSide !== void 0 ? Math.min(state.paddingSide, 80) : 28;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 25;
      const cardGrad = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.h);
      cardGrad.addColorStop(0, hexToRgba(state.gradientDarkness || "#050c07", Math.min(opacity + 0.03, 1)));
      cardGrad.addColorStop(1, hexToRgba(state.gradientPrimary || "#00381c", opacity));
      ctx.fillStyle = cardGrad;
      this.roundRect(ctx, zone.x + padX, zone.y + 28, zone.w - padX * 2, zone.h - 38, radius, true, false);
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = hexToRgba(state.colorCorners || "#d4af37", 0.5);
      ctx.lineWidth = 1.2;
      this.roundRect(ctx, zone.x + padX, zone.y + 28, zone.w - padX * 2, zone.h - 38, radius, false, true);
      ctx.restore();
    }
    drawCenterCardBackground(ctx, zone, state) {
      const opacity = state.boxOpacity !== void 0 ? state.boxOpacity : 0.95;
      const radius = state.cardRadius !== void 0 ? state.cardRadius : 20;
      const padX = state.paddingSide !== void 0 ? Math.min(state.paddingSide, 60) : 0;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 35;
      const grad = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.h);
      grad.addColorStop(0, hexToRgba(state.gradientPrimary || "#00381c", opacity));
      grad.addColorStop(0.5, hexToRgba(state.gradientSecondary || "#008542", Math.min(opacity + 0.01, 1)));
      grad.addColorStop(1, hexToRgba(state.gradientDarkness || "#050c07", Math.min(opacity + 0.03, 1)));
      ctx.fillStyle = grad;
      this.roundRect(ctx, zone.x + padX, zone.y, zone.w - padX * 2, zone.h, radius, true, false);
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = hexToRgba(state.colorCorners || "#d4af37", 0.6);
      ctx.lineWidth = 1.5;
      this.roundRect(ctx, zone.x + padX, zone.y, zone.w - padX * 2, zone.h, radius, false, true);
      ctx.strokeStyle = hexToRgba(state.colorCorners || "#d4af37", 0.25);
      ctx.lineWidth = 0.8;
      this.roundRect(ctx, zone.x + padX + 6, zone.y + 6, zone.w - padX * 2 - 12, zone.h - 12, Math.max(radius - 4, 4), false, true);
      ctx.restore();
    }
    drawGradientFadeBackground(ctx, W, H, zone, state) {
      const intensity = state.gradientIntensity || 0.88;
      ctx.save();
      if (state.layout === "bottom") {
        const startY = Math.max(0, zone.y - 80);
        const grad = ctx.createLinearGradient(0, startY, 0, H);
        grad.addColorStop(0, "rgba(0, 0, 0, 0)");
        grad.addColorStop(0.25, hexToRgba(state.gradientPrimary || "#00381c", 0.55 * intensity));
        grad.addColorStop(0.65, hexToRgba(state.gradientSecondary || "#008542", 0.85 * intensity));
        grad.addColorStop(1, hexToRgba(state.gradientDarkness || "#050c07", Math.min(intensity + 0.08, 1)));
        ctx.fillStyle = grad;
        ctx.fillRect(0, startY, W, H - startY);
      } else if (state.layout === "top") {
        const endY = Math.min(H, zone.y + zone.h + 80);
        const grad = ctx.createLinearGradient(0, endY, 0, 0);
        grad.addColorStop(0, "rgba(0, 0, 0, 0)");
        grad.addColorStop(0.25, hexToRgba(state.gradientPrimary || "#00381c", 0.55 * intensity));
        grad.addColorStop(0.65, hexToRgba(state.gradientSecondary || "#008542", 0.85 * intensity));
        grad.addColorStop(1, hexToRgba(state.gradientDarkness || "#050c07", Math.min(intensity + 0.08, 1)));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, endY);
      } else if (state.layout === "center") {
        const cx = W / 2;
        const cy = H / 2;
        const radius = Math.max(zone.w, zone.h) * 0.75;
        const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        radGrad.addColorStop(0, hexToRgba(state.gradientDarkness || "#050c07", 0.9 * intensity));
        radGrad.addColorStop(0.5, hexToRgba(state.gradientPrimary || "#00381c", 0.6 * intensity));
        radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();
    }
    drawGlassCardBackground(ctx, zone, state) {
      const opacity = (state.boxOpacity !== void 0 ? state.boxOpacity : 0.95) * 0.45;
      const radius = state.cardRadius !== void 0 ? state.cardRadius : 18;
      const pad = state.layout === "center" ? state.paddingSide !== void 0 ? Math.min(state.paddingSide, 60) : 0 : state.paddingSide !== void 0 ? Math.min(state.paddingSide, 80) : 28;
      const rY = state.layout === "top" ? zone.y + 28 : zone.y + 10;
      const rH = state.layout === "center" ? zone.h : zone.h - 38;
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 35;
      const grad = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.h);
      grad.addColorStop(0, hexToRgba(state.gradientPrimary || "#00381c", opacity));
      grad.addColorStop(1, hexToRgba(state.gradientDarkness || "#050c07", Math.min(opacity + 0.2, 0.85)));
      ctx.fillStyle = grad;
      this.roundRect(ctx, zone.x + pad, rY, zone.w - pad * 2, rH, radius, true, false);
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = hexToRgba(state.colorCorners || "#d4af37", 0.45);
      ctx.lineWidth = 1.2;
      this.roundRect(ctx, zone.x + pad, rY, zone.w - pad * 2, rH, radius, false, true);
      ctx.restore();
    }
    drawFramedCardBackground(ctx, zone, state) {
      const radius = state.cardRadius !== void 0 ? state.cardRadius : 16;
      const pad = state.layout === "center" ? state.paddingSide !== void 0 ? Math.min(state.paddingSide, 60) : 0 : state.paddingSide !== void 0 ? Math.min(state.paddingSide, 80) : 28;
      const rY = state.layout === "top" ? zone.y + 28 : zone.y + 10;
      const rH = state.layout === "center" ? zone.h : zone.h - 38;
      ctx.save();
      ctx.fillStyle = "rgba(2, 9, 4, 0.28)";
      this.roundRect(ctx, zone.x + pad, rY, zone.w - pad * 2, rH, radius, true, false);
      ctx.strokeStyle = hexToRgba(state.colorCorners || "#d4af37", 0.7);
      ctx.lineWidth = 1.6;
      this.roundRect(ctx, zone.x + pad, rY, zone.w - pad * 2, rH, radius, false, true);
      ctx.strokeStyle = hexToRgba(state.colorCorners || "#d4af37", 0.25);
      ctx.lineWidth = 0.8;
      this.roundRect(ctx, zone.x + pad + 6, rY + 6, zone.w - pad * 2 - 12, rH - 12, Math.max(radius - 4, 4), false, true);
      ctx.restore();
    }
    renderCalibratedBlocks(ctx, blocks, state) {
      const isSeparated = state.textCardStyle === "separated";
      const isTransparent = state.textCardStyle === "transparent" || state.textCardStyle === "gradient";
      for (const b of blocks) {
        if (b.type === "badge") {
          this.drawBadgePill(ctx, b.x, b.y, b.text, true, state);
        } else if (b.type === "tag") {
          ctx.save();
          ctx.textAlign = b.align;
          ctx.fillStyle = b.color;
          ctx.font = b.font;
          ctx.letterSpacing = `${b.letterSpacing}px`;
          if (isTransparent) {
            ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
            ctx.shadowBlur = 8;
          }
          ctx.fillText(b.text, b.x, b.y);
          ctx.restore();
        } else if (b.type === "title") {
          ctx.save();
          ctx.font = b.font;
          ctx.letterSpacing = `${b.letterSpacing || 1}px`;
          if (isSeparated && b.lines && b.lines.length > 0) {
            const align = b.align || "center";
            let maxW = 0;
            for (const l of b.lines) {
              const w = ctx.measureText(l).width;
              if (w > maxW) maxW = w;
            }
            const boxW = Math.min(maxW + 48, (state.width || 1080) - 60);
            const boxH = b.lines.length * b.lineHeight + 16;
            const boxX = align === "left" ? b.x - 16 : align === "right" ? b.x - boxW + 16 : b.x - boxW / 2;
            const boxY = b.y - b.size * 0.85;
            ctx.shadowColor = "rgba(0,0,0,0.6)";
            ctx.shadowBlur = 18;
            ctx.fillStyle = hexToRgba(state.gradientDarkness || "#050c07", 0.82);
            this.roundRect(ctx, boxX, boxY, boxW, boxH, 12, true, false);
            ctx.shadowColor = "transparent";
            ctx.strokeStyle = hexToRgba(state.colorCorners || "#d4af37", 0.45);
            ctx.lineWidth = 1;
            this.roundRect(ctx, boxX, boxY, boxW, boxH, 12, false, true);
          }
          ctx.textAlign = b.align;
          ctx.fillStyle = b.color;
          if (b.glow > 0) {
            ctx.shadowColor = b.glowColor;
            ctx.shadowBlur = b.glow;
          } else if (isTransparent) {
            ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
            ctx.shadowBlur = 10;
          }
          let tY = b.y;
          for (const line of b.lines) {
            ctx.fillText(line, b.x, tY);
            tY += b.lineHeight;
          }
          this.boundingBoxes.push({ id: "title", x: b.x - (b.align === "center" ? b.maxWidth / 2 : 0), y: b.y - 10, w: b.maxWidth, h: tY - b.y + 10 });
          ctx.restore();
        } else if (b.type === "subtitle") {
          ctx.save();
          ctx.font = b.font;
          ctx.letterSpacing = `${b.letterSpacing !== void 0 ? b.letterSpacing : 0}px`;
          if (isSeparated && b.lines && b.lines.length > 0) {
            const align = b.align || "center";
            let maxW = 0;
            for (const l of b.lines) {
              const w = ctx.measureText(l).width;
              if (w > maxW) maxW = w;
            }
            const boxW = Math.min(maxW + 32, (state.width || 1080) - 70);
            const boxH = b.lines.length * b.lineHeight + 12;
            const boxX = align === "left" ? b.x - 12 : align === "right" ? b.x - boxW + 12 : b.x - boxW / 2;
            const boxY = b.y - b.size * 0.85;
            ctx.fillStyle = hexToRgba(state.gradientPrimary || "#00381c", 0.72);
            this.roundRect(ctx, boxX, boxY, boxW, boxH, 8, true, false);
            ctx.strokeStyle = hexToRgba(state.colorCorners || "#d4af37", 0.3);
            ctx.lineWidth = 0.8;
            this.roundRect(ctx, boxX, boxY, boxW, boxH, 8, false, true);
          }
          ctx.textAlign = b.align;
          ctx.fillStyle = b.color;
          if (isTransparent) {
            ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
            ctx.shadowBlur = 8;
          }
          let sY = b.y;
          for (const line of b.lines) {
            ctx.fillText(line, b.x, sY);
            sY += b.lineHeight;
          }
          ctx.letterSpacing = "0px";
          ctx.restore();
        } else if (b.type === "divider") {
          this.drawCelestialDivider(ctx, b.x, b.y, b.width, b.color);
        } else if (b.type === "description") {
          ctx.save();
          ctx.font = b.font;
          if (isSeparated && b.lines && b.lines.length > 0) {
            const align = b.align || "center";
            let maxW = 0;
            for (const l of b.lines) {
              const w = ctx.measureText(l).width;
              if (w > maxW) maxW = w;
            }
            const boxW = Math.min(maxW + 36, (state.width || 1080) - 60);
            const boxH = b.lines.length * b.lineHeight + 16;
            const boxX = align === "left" ? b.x - 14 : align === "right" ? b.x - boxW + 14 : b.x - boxW / 2;
            const boxY = b.y - b.size * 0.85;
            ctx.fillStyle = hexToRgba(state.gradientDarkness || "#050c07", 0.78);
            this.roundRect(ctx, boxX, boxY, boxW, boxH, 10, true, false);
            ctx.strokeStyle = hexToRgba(state.colorCorners || "#d4af37", 0.35);
            ctx.lineWidth = 0.8;
            this.roundRect(ctx, boxX, boxY, boxW, boxH, 10, false, true);
          }
          ctx.textAlign = b.align;
          ctx.fillStyle = b.color;
          if (isTransparent) {
            ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
            ctx.shadowBlur = 6;
          }
          let dY = b.y;
          for (const line of b.lines) {
            ctx.fillText(line, b.x, dY);
            dY += b.lineHeight;
          }
          ctx.restore();
        } else if (b.type === "highlight") {
          this.drawHighlightBox(ctx, b.x, b.y, b.width, b.text, state);
        } else if (b.type === "cta") {
          ctx.save();
          ctx.textAlign = b.align;
          ctx.fillStyle = b.color;
          ctx.font = b.font;
          ctx.letterSpacing = `${b.letterSpacing}px`;
          if (isTransparent) {
            ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
            ctx.shadowBlur = 8;
          }
          ctx.fillText(b.text, b.x, b.y);
          ctx.restore();
        }
      }
    }
    getAlignX(startX, width, align) {
      if (align === "left") return startX;
      if (align === "right") return startX + width;
      return startX + width / 2;
    }
    drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
      if (!text) return y;
      const words = text.split(" ");
      let line = "";
      let curY = y;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line.trim(), x, curY);
          line = words[n] + " ";
          curY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), x, curY);
      return curY + lineHeight;
    }
    drawBadgePill(ctx, x, y, text, centered, state) {
      if (!text) return y;
      ctx.save();
      const bFont = state.fontBadge || "'Cinzel', serif";
      const bSize = state.sizeBadge || 12;
      const bWeight = state.weightBadge || 700;
      ctx.font = `${bWeight} ${bSize}px ${bFont}`;
      const textWidth = ctx.measureText(text.toUpperCase()).width;
      const padX = 16;
      const badgeW = textWidth + padX * 2;
      const badgeH = Math.round(bSize * 2.4);
      const startX = centered ? x - badgeW / 2 : x;
      ctx.fillStyle = hexToRgba(state.gradientPrimary || "#00381c", 0.85);
      this.roundRect(ctx, startX, y, badgeW, badgeH, 14, true, false);
      ctx.strokeStyle = state.colorBadge || "#f5d77f";
      ctx.lineWidth = 1.2;
      this.roundRect(ctx, startX, y, badgeW, badgeH, 14, false, true);
      ctx.fillStyle = state.colorBadge || "#f5d77f";
      ctx.letterSpacing = `${state.spacingBadge !== void 0 ? state.spacingBadge : 1}px`;
      ctx.textAlign = "center";
      ctx.fillText(text.toUpperCase(), startX + badgeW / 2, y + Math.round(bSize * 1.6));
      ctx.letterSpacing = "0px";
      ctx.restore();
      return y + badgeH + 16;
    }
    drawHighlightBox(ctx, x, y, width, text, state) {
      if (!text) return y;
      ctx.save();
      const hFont = state.fontHighlight || "'Montserrat', sans-serif";
      const hSize = state.sizeHighlight || 14;
      const hWeight = state.weightHighlight || 600;
      const hSpacing = state.spacingHighlight !== void 0 ? state.spacingHighlight : 0.6;
      ctx.font = `${hWeight} ${hSize}px ${hFont}`;
      ctx.letterSpacing = `${hSpacing}px`;
      const words = text.split(" ");
      let line = "";
      const lines = [];
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > width - 28 && n > 0) {
          lines.push(line.trim());
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());
      const padY = 10;
      const lineH = Math.round(hSize * 1.35);
      const boxH = lines.length * lineH + padY * 2;
      ctx.fillStyle = hexToRgba(state.gradientPrimary || "#00381c", 0.55);
      this.roundRect(ctx, x, y, width, boxH, 8, true, false);
      ctx.strokeStyle = state.colorHighlightBorder || state.colorCorners || "#d4af37";
      ctx.lineWidth = 1;
      this.roundRect(ctx, x, y, width, boxH, 8, false, true);
      ctx.fillStyle = state.colorHighlight || "#f5d77f";
      ctx.textAlign = "center";
      let textY = y + padY + hSize * 0.9;
      for (const l of lines) {
        ctx.fillText(l, x + width / 2, textY);
        textY += lineH;
      }
      ctx.restore();
      return y + boxH + 12;
    }
    drawCelestialDivider(ctx, cx, cy, width, color) {
      ctx.save();
      ctx.strokeStyle = hexToRgba(color || "#d4af37", 0.65);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx - width / 2, cy);
      ctx.lineTo(cx - 20, cy);
      ctx.moveTo(cx + 20, cy);
      ctx.lineTo(cx + width / 2, cy);
      ctx.stroke();
      ctx.fillStyle = color || "#d4af37";
      ctx.beginPath();
      const r = 5;
      for (let i = 0; i < 4; i++) {
        const a = i * 90 * (Math.PI / 180);
        const aIn = (i * 90 + 45) * (Math.PI / 180);
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        const xIn = cx + r * 0.3 * Math.cos(aIn);
        const yIn = cy + r * 0.3 * Math.sin(aIn);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        ctx.lineTo(xIn, yIn);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    }
  };

  // design-system/js/canvas/layers/corners-layer.js
  var CornersLayer = class extends BaseLayer {
    constructor() {
      super("corners", 50);
    }
    draw(ctx, width, height, state) {
      if (!state.showBaroqueCorners) return;
      const m = 28;
      const size = 60;
      ctx.save();
      ctx.strokeStyle = state.colorCorners || "#d4af37";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(m, m + size);
      ctx.lineTo(m, m);
      ctx.lineTo(m + size, m);
      ctx.moveTo(width - m - size, m);
      ctx.lineTo(width - m, m);
      ctx.lineTo(width - m, m + size);
      ctx.moveTo(m, height - m - size);
      ctx.lineTo(m, height - m);
      ctx.lineTo(m + size, height - m);
      ctx.moveTo(width - m - size, height - m);
      ctx.lineTo(width - m, height - m);
      ctx.lineTo(width - m, height - m - size);
      ctx.stroke();
      ctx.restore();
    }
  };

  // design-system/js/canvas/renderer.js
  var Renderer = class {
    constructor(canvasElement, store) {
      this.canvasElement = canvasElement;
      this.store = store;
      this.highDPICanvas = new HighDPICanvas(canvasElement, store.state.width || 1080, store.state.height || 1080);
      this.layers = [
        new GradientLayer(),
        new ImageLayer(),
        new PatternLayer(),
        new OverlayLayer(),
        new TextLayer(),
        new CornersLayer()
      ];
      this.layers.sort((a, b) => a.zIndex - b.zIndex);
      this.rafId = null;
      this.snappingGuide = null;
      this.store.subscribe((prop) => {
        if (prop === "width" || prop === "height" || prop === "format") {
          this.highDPICanvas.resize(this.store.state.width, this.store.state.height);
        }
        this.markAllDirty();
        this.requestRender();
      });
    }
    markAllDirty() {
      this.layers.forEach((l) => l.markDirty());
    }
    requestRender() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = requestAnimationFrame(() => this.render());
    }
    render() {
      const ctx = this.highDPICanvas.getContext();
      if (!ctx) return;
      const width = this.store.state.width || 1080;
      const height = this.store.state.height || 1080;
      const state = this.store.state;
      ctx.save();
      ctx.clearRect(0, 0, width, height);
      for (const layer of this.layers) {
        layer.render(ctx, width, height, state);
      }
      if (state.showSafeAreaGuide) {
        this.drawSafeAreaGuide(ctx, width, height, state);
      }
      if (this.snappingGuide) {
        this.drawSnappingGuide(ctx, width, height, this.snappingGuide);
      }
      ctx.restore();
    }
    drawSafeAreaGuide(ctx, W, H, state) {
      const safe = SAFE_AREAS[state.format] || SAFE_AREAS["1:1"];
      ctx.save();
      ctx.strokeStyle = "rgba(245, 215, 127, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(0, safe.top);
      ctx.lineTo(W, safe.top);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, H - safe.bottom);
      ctx.lineTo(W, H - safe.bottom);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(safe.left, 0);
      ctx.lineTo(safe.left, H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W - safe.right, 0);
      ctx.lineTo(W - safe.right, H);
      ctx.stroke();
      ctx.fillStyle = "rgba(245, 215, 127, 0.7)";
      ctx.font = '500 12px "Montserrat", sans-serif';
      ctx.textAlign = "left";
      ctx.fillText(`Safe Area (${state.format})`, safe.left + 10, safe.top > 40 ? safe.top - 8 : safe.top + 18);
      ctx.restore();
    }
    setSnappingGuide(guide) {
      this.snappingGuide = guide;
      this.requestRender();
    }
    drawSnappingGuide(ctx, W, H, guide) {
      ctx.save();
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      if (guide.type === "vertical") {
        ctx.beginPath();
        ctx.moveTo(guide.x, 0);
        ctx.lineTo(guide.x, H);
        ctx.stroke();
      } else if (guide.type === "horizontal") {
        ctx.beginPath();
        ctx.moveTo(0, guide.y);
        ctx.lineTo(W, guide.y);
        ctx.stroke();
      }
      ctx.restore();
    }
    getTextLayer() {
      return this.layers.find((l) => l.name === "text");
    }
    async renderHighRes(scale = 2) {
      if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
        try {
          await Promise.race([
            document.fonts.ready,
            new Promise((r) => setTimeout(r, 250))
          ]);
        } catch (e) {
          console.warn("Erro ao aguardar carregamento de fontes:", e);
        }
      }
      const baseW = this.store.state.width || 1080;
      const baseH = this.store.state.height || 1080;
      const exportScale = Math.max(scale, 1);
      const targetW = Math.round(baseW * exportScale);
      const targetH = Math.round(baseH * exportScale);
      const offscreen = document.createElement("canvas");
      offscreen.width = targetW;
      offscreen.height = targetH;
      const ctx = offscreen.getContext("2d", {
        alpha: false,
        desynchronized: false
      });
      if (!ctx) return null;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.save();
      ctx.scale(exportScale, exportScale);
      const state = this.store.state;
      for (const layer of this.layers) {
        try {
          layer.render(ctx, baseW, baseH, state);
        } catch (layerErr) {
          console.warn(`Erro ao renderizar camada ${layer.name}:`, layerErr);
        }
      }
      ctx.restore();
      return offscreen;
    }
    async exportHighResImage(filename = "pedaco-do-ceu-post-2k.png", scale = 2) {
      return new Promise(async (resolve) => {
        try {
          const offscreen = await this.renderHighRes(scale);
          if (!offscreen) {
            this.exportLegacyImage(filename);
            return resolve();
          }
          if (offscreen.toBlob) {
            try {
              offscreen.toBlob((blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.download = filename;
                  link.href = url;
                  document.body.appendChild(link);
                  link.click();
                  setTimeout(() => {
                    if (link.parentNode) link.parentNode.removeChild(link);
                    URL.revokeObjectURL(url);
                  }, 1e3);
                  resolve();
                } else {
                  this.exportViaDataURL(offscreen, filename);
                  resolve();
                }
              }, "image/png", 1);
            } catch (blobErr) {
              console.warn("toBlob falhou, tentando toDataURL:", blobErr);
              this.exportViaDataURL(offscreen, filename);
              resolve();
            }
          } else {
            this.exportViaDataURL(offscreen, filename);
            resolve();
          }
        } catch (err) {
          console.warn("Fallback para exporta\xE7\xE3o padr\xE3o:", err);
          this.exportLegacyImage(filename);
          resolve();
        }
      });
    }
    exportViaDataURL(canvas, filename) {
      try {
        const dataUrl = canvas.toDataURL("image/png", 1);
        this.downloadDataUrl(dataUrl, filename);
      } catch (e) {
        console.warn("toDataURL falhou, usando fallback legacy:", e);
        this.exportLegacyImage(filename);
      }
    }
    downloadDataUrl(dataUrl, filename) {
      try {
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (link.parentNode) link.parentNode.removeChild(link);
        }, 150);
      } catch (e) {
        console.error("Falha ao disparar download:", e);
      }
    }
    exportLegacyImage(filename = "pedaco-do-ceu-post.png") {
      const dataUrl = this.highDPICanvas.getExportDataURL("image/png", 1);
      if (!dataUrl) return;
      this.downloadDataUrl(dataUrl, filename);
    }
    exportImage(filename = "pedaco-do-ceu-post.png", scale = 2) {
      return this.exportHighResImage(filename, scale);
    }
  };

  // design-system/js/ui/snapping.js
  var SnappingManager = class {
    constructor(threshold = 12) {
      this.threshold = threshold;
    }
    getSnapPoints(width, height) {
      return {
        vertical: [
          { x: width / 2, label: "center-x" },
          { x: width * 0.333, label: "third-left" },
          { x: width * 0.667, label: "third-right" },
          { x: width * 0.618, label: "golden-ratio-x" }
        ],
        horizontal: [
          { y: height / 2, label: "center-y" },
          { y: height * 0.333, label: "third-top" },
          { y: height * 0.667, label: "third-bottom" }
        ]
      };
    }
    applySnapping(x, y, width, height) {
      const points = this.getSnapPoints(width, height);
      let snappedX = x;
      let snappedY = y;
      let activeGuide = null;
      for (const p of points.vertical) {
        if (Math.abs(x - p.x) <= this.threshold) {
          snappedX = p.x;
          activeGuide = { type: "vertical", x: p.x };
          break;
        }
      }
      for (const p of points.horizontal) {
        if (Math.abs(y - p.y) <= this.threshold) {
          snappedY = p.y;
          activeGuide = { type: "horizontal", y: p.y };
          break;
        }
      }
      return { x: snappedX, y: snappedY, guide: activeGuide };
    }
  };

  // design-system/js/ui/drag-drop.js
  var CanvasDragDrop = class {
    constructor(canvasElement, renderer, store) {
      this.canvas = canvasElement;
      this.renderer = renderer;
      this.store = store;
      this.snapper = new SnappingManager(15);
      this.isDragging = false;
      this.dragMode = null;
      this.dragTarget = null;
      this.startPointer = { x: 0, y: 0 };
      this.initialPaddingTop = 100;
      this.initialPaddingSide = 20;
      this.initialPanX = 0;
      this.initialPanY = 0;
      this.initEvents();
    }
    initEvents() {
      this.canvas.addEventListener("pointerdown", this.onPointerDown.bind(this));
      window.addEventListener("pointermove", this.onPointerMove.bind(this));
      window.addEventListener("pointerup", this.onPointerUp.bind(this));
      window.addEventListener("pointercancel", this.onPointerUp.bind(this));
      this.canvas.addEventListener("wheel", this.onWheel.bind(this), { passive: false });
    }
    getCanvasCoordinates(e) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = (this.store.state.width || 1080) / rect.width;
      const scaleY = (this.store.state.height || 1080) / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
    onPointerDown(e) {
      const coords = this.getCanvasCoordinates(e);
      const textLayer = this.renderer.getTextLayer();
      let hit = null;
      if (textLayer && textLayer.boundingBoxes) {
        hit = textLayer.boundingBoxes.find(
          (b) => coords.x >= b.x && coords.x <= b.x + b.w && coords.y >= b.y && coords.y <= b.y + b.h
        );
      }
      this.isDragging = true;
      this.startPointer = coords;
      if (hit) {
        this.dragMode = "text";
        this.dragTarget = hit;
        this.initialPaddingTop = this.store.state.paddingTop || 90;
        this.initialPaddingSide = this.store.state.paddingSide || 60;
        this.canvas.style.cursor = "grabbing";
      } else {
        this.dragMode = "image";
        this.dragTarget = null;
        this.initialPanX = this.store.state.imgPanX || 0;
        this.initialPanY = this.store.state.imgPanY || 0;
        this.canvas.style.cursor = "move";
      }
    }
    onPointerMove(e) {
      if (!this.isDragging) {
        const coords2 = this.getCanvasCoordinates(e);
        const textLayer = this.renderer.getTextLayer();
        if (textLayer && textLayer.boundingBoxes) {
          const hoverText = textLayer.boundingBoxes.some(
            (b) => coords2.x >= b.x && coords2.x <= b.x + b.w && coords2.y >= b.y && coords2.y <= b.y + b.h
          );
          this.canvas.style.cursor = hoverText ? "grab" : this.store.state.imgObj ? "move" : "default";
        }
        return;
      }
      const coords = this.getCanvasCoordinates(e);
      const deltaX = coords.x - this.startPointer.x;
      const deltaY = coords.y - this.startPointer.y;
      if (this.dragMode === "text") {
        const W = this.store.state.width || 1080;
        const H = this.store.state.height || 1080;
        let newTop = Math.max(20, Math.min(220, this.initialPaddingTop + deltaY));
        let newSide = Math.max(10, Math.min(120, this.initialPaddingSide - deltaX));
        const snapped = this.snapper.applySnapping(coords.x, newTop, W, H);
        this.renderer.setSnappingGuide(snapped.guide);
        this.store.state.paddingTop = Math.round(snapped.y);
        this.store.state.paddingSide = Math.round(newSide);
        const topSlider = document.getElementById("paddingTopRange");
        const topVal = document.getElementById("paddingTopVal");
        if (topSlider) topSlider.value = this.store.state.paddingTop;
        if (topVal) topVal.textContent = this.store.state.paddingTop + "px";
        const sideSlider = document.getElementById("paddingSideRange");
        const sideVal = document.getElementById("paddingSideVal");
        if (sideSlider) sideSlider.value = this.store.state.paddingSide;
        if (sideVal) sideVal.textContent = this.store.state.paddingSide + "px";
      } else if (this.dragMode === "image") {
        let newPanX = Math.round(Math.max(-400, Math.min(400, this.initialPanX + deltaX)));
        let newPanY = Math.round(Math.max(-400, Math.min(400, this.initialPanY + deltaY)));
        this.store.state.imgPanX = newPanX;
        this.store.state.imgPanY = newPanY;
        const panXSlider = document.getElementById("imgPanXRange");
        const panXVal = document.getElementById("imgPanXVal");
        if (panXSlider) panXSlider.value = newPanX;
        if (panXVal) panXVal.textContent = newPanX + "px";
        const panYSlider = document.getElementById("imgPanYRange");
        const panYVal = document.getElementById("imgPanYVal");
        if (panYSlider) panYSlider.value = newPanY;
        if (panYVal) panYVal.textContent = newPanY + "px";
      }
    }
    onWheel(e) {
      if (!this.store.state.imgObj) return;
      e.preventDefault();
      const zoomStep = e.deltaY < 0 ? 0.05 : -0.05;
      let currentZoom = this.store.state.imgZoom || 1;
      let newZoom = Math.max(0.8, Math.min(2.5, currentZoom + zoomStep));
      newZoom = Math.round(newZoom * 100) / 100;
      this.store.state.imgZoom = newZoom;
      const zoomSlider = document.getElementById("imgZoomRange");
      const zoomVal = document.getElementById("imgZoomVal");
      if (zoomSlider) zoomSlider.value = Math.round(newZoom * 100);
      if (zoomVal) zoomVal.textContent = newZoom.toFixed(1) + "x";
    }
    onPointerUp() {
      if (this.isDragging) {
        this.isDragging = false;
        this.dragMode = null;
        this.dragTarget = null;
        this.renderer.setSnappingGuide(null);
        this.canvas.style.cursor = "default";
      }
    }
  };

  // design-system/js/ui/shortcuts.js
  var ShortcutManager = class {
    constructor(store, renderer, onResetCallback) {
      this.store = store;
      this.renderer = renderer;
      this.onReset = onResetCallback;
      this.initEvents();
    }
    initEvents() {
      window.addEventListener("keydown", (e) => {
        const target = e.target;
        const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";
        const isCtrl = e.ctrlKey || e.metaKey;
        if (isCtrl && !e.shiftKey && e.key.toLowerCase() === "z") {
          if (!isInput) {
            e.preventDefault();
            this.store.undo();
          }
        }
        if (isCtrl && e.shiftKey && e.key.toLowerCase() === "z" || isCtrl && e.key.toLowerCase() === "y") {
          if (!isInput) {
            e.preventDefault();
            this.store.redo();
          }
        }
        if (isCtrl && e.key.toLowerCase() === "e") {
          e.preventDefault();
          const cleanTitle = (this.store.state.title || "post").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-");
          this.renderer.exportImage(`pedaco-do-ceu-${this.store.state.format}-${cleanTitle}.png`);
        }
      });
    }
  };

  // design-system/js/ui/a11y.js
  var A11yManager = class _A11yManager {
    announce(message) {
      _A11yManager.announce(message);
    }
    static announce(message) {
      let region = document.getElementById("a11yStatus");
      if (!region) {
        region = document.createElement("div");
        region.id = "a11yStatus";
        region.className = "a11y-live-region";
        region.setAttribute("aria-live", "polite");
        region.setAttribute("aria-atomic", "true");
        document.body.appendChild(region);
      }
      region.textContent = message;
    }
    static initTabs() {
      const tabButtons = document.querySelectorAll(".tabs-nav .tab-btn");
      const tabPanels = document.querySelectorAll(".tabs-container .tab-content");
      tabButtons.forEach((btn, index) => {
        const targetId = btn.getAttribute("data-target");
        btn.setAttribute("role", "tab");
        btn.setAttribute("id", `tab-btn-${targetId}`);
        btn.setAttribute("aria-controls", targetId);
        btn.setAttribute("aria-selected", btn.classList.contains("active") ? "true" : "false");
        btn.setAttribute("tabindex", btn.classList.contains("active") ? "0" : "-1");
        btn.addEventListener("keydown", (e) => {
          let newIndex = index;
          if (e.key === "ArrowRight") {
            newIndex = (index + 1) % tabButtons.length;
          } else if (e.key === "ArrowLeft") {
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
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", `tab-btn-${panel.id}`);
        panel.setAttribute("tabindex", "0");
      });
    }
    static calculateLuminance(r, g, b) {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
    static checkContrast(hexColor1, hexColor2) {
      const parse = (hex) => {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 0, g: 0, b: 0 };
      };
      const c1 = parse(hexColor1);
      const c2 = parse(hexColor2);
      const l1 = this.calculateLuminance(c1.r, c1.g, c1.b) + 0.05;
      const l2 = this.calculateLuminance(c2.r, c2.g, c2.b) + 0.05;
      return l1 > l2 ? l1 / l2 : l2 / l1;
    }
  };

  // design-system/js/app.js
  var PHOTO_CATALOG = [
    // Categoria: Bem-Estar & Cristais
    {
      id: "be1",
      category: "bem-estar",
      categoryLabel: "\u{1F33F} Bem-Estar & Cristais",
      src: "../Fotos/Bem Estar/Tratadas/IMG_20260828_160836341.jpg",
      title: "CRISTAIS & BEM-ESTAR",
      subtitle: "A For\xE7a Primordial das Rochas Sagradas",
      description: "Purifique a energia do seu espa\xE7o com a for\xE7a vibracional dos quartzos e ametistas. Pe\xE7as brutas selecionadas para ancorar paz, clareza mental e cura interior.",
      categoryTag: "CURA & HARMONIA",
      highlightText: "\u2726 Transmuta\xE7\xE3o Energ\xE9tica & Paz",
      badgeText: "Energia Pura",
      sacredPattern: "flowerOfLife",
      gradientPrimary: "#00381c",
      gradientSecondary: "#008542",
      gradientDarkness: "#050c07",
      colorTitle: "#f8f9fa",
      colorSubtitle: "#eadcb9",
      colorDesc: "#f8f9fa",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#d4af37",
      colorTag: "#d4af37",
      colorBadge: "#f5d77f",
      colorCta: "#d4af37",
      colorPattern: "#d4af37",
      colorCorners: "#d4af37",
      colorDividers: "#d4af37",
      fontTitle: "'Cinzel Decorative', serif",
      weightTitle: "700",
      sizeTitle: 54,
      spacingTitle: 1,
      glowTitle: 14,
      colorTitleGlow: "#d4af37",
      fontSubtitle: "'Cormorant Garamond', serif",
      styleSubtitle: "italic 500",
      sizeSubtitle: 26,
      sizeDesc: 18,
      lineHeightDesc: 1.6
    },
    {
      id: "be2",
      category: "bem-estar",
      categoryLabel: "\u{1F33F} Bem-Estar & Cristais",
      src: "../Fotos/Bem Estar/Tratadas/IMG_20260828_163415579.jpg",
      title: "SABONETES FITOENERG\xC9TICOS",
      subtitle: "Alquimia Sagrada das Ervas Medicinais",
      description: "Banhos rituais que limpam a aura e renovam a vitalidade do corpo f\xEDsico e sutil. Feito com extratos naturais puros e \xF3leos essenciais de alta vibra\xE7\xE3o.",
      categoryTag: "RITUAL DI\xC1RIO",
      highlightText: "\u2726 Limpeza \xC1urica & Vitalidade Natural",
      badgeText: "Ervas Sagradas",
      sacredPattern: "flowerOfLife",
      gradientPrimary: "#002f18",
      gradientSecondary: "#007038",
      gradientDarkness: "#030d06",
      colorTitle: "#f8f9fa",
      colorSubtitle: "#eadcb9",
      colorDesc: "#f8f9fa",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#d4af37",
      colorTag: "#d4af37",
      colorBadge: "#f5d77f",
      colorCta: "#d4af37",
      colorPattern: "#d4af37",
      colorCorners: "#d4af37",
      colorDividers: "#d4af37",
      fontTitle: "'Cinzel Decorative', serif",
      weightTitle: "700",
      sizeTitle: 54,
      spacingTitle: 1,
      glowTitle: 12,
      colorTitleGlow: "#d4af37",
      fontSubtitle: "'Cormorant Garamond', serif",
      styleSubtitle: "italic 500",
      sizeSubtitle: 26,
      sizeDesc: 18,
      lineHeightDesc: 1.6
    },
    {
      id: "be3",
      category: "bem-estar",
      categoryLabel: "\u{1F33F} Bem-Estar & Cristais",
      src: "../Fotos/Bem Estar/Tratadas/IMG_20260828_160836341.jpg",
      title: "AROMATERAPIA SAGRADA",
      subtitle: "Gotas de Luz e Conex\xE3o Espiritual",
      description: "Velas arom\xE1ticas e \xF3leos essenciais que elevam o padr\xE3o vibrat\xF3rio do seu ambiente. Crie um santu\xE1rio de serenidade para seus momentos de ora\xE7\xE3o e recolhimento.",
      categoryTag: "SANTO SANTU\xC1RIO",
      highlightText: "\u2726 Frequ\xEAncia Vibracional Elevada",
      badgeText: "Aromas da Alma",
      sacredPattern: "sriYantra",
      gradientPrimary: "#1a1005",
      gradientSecondary: "#3d2508",
      gradientDarkness: "#0a0502",
      colorTitle: "#f5d77f",
      colorSubtitle: "#ffe0b2",
      colorDesc: "#fff3e0",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#d4af37",
      colorTag: "#d4af37",
      colorBadge: "#f5d77f",
      colorCta: "#d4af37",
      colorPattern: "#f5d77f",
      colorCorners: "#f5d77f",
      colorDividers: "#f5d77f",
      fontTitle: "'Cinzel Decorative', serif",
      weightTitle: "700",
      sizeTitle: 54,
      spacingTitle: 2,
      glowTitle: 16,
      colorTitleGlow: "#f5d77f",
      fontSubtitle: "'Cormorant Garamond', serif",
      styleSubtitle: "italic 500",
      sizeSubtitle: 26,
      sizeDesc: 18,
      lineHeightDesc: 1.6
    },
    // Categoria: Arcanjo Miguel
    {
      id: "am1",
      category: "arcanjo",
      categoryLabel: "\u2694\uFE0F Arcanjo Miguel",
      src: "../Fotos/Arcanjo Miguel/Tratadas/IMG_20260828_145751956_HDR.jpg",
      title: "S\xC3O MIGUEL ARCANJO",
      subtitle: "Pr\xEDncipe da Luz e Guardi\xE3o das Almas",
      description: "Que a Espada Flamejante de S\xE3o Miguel Arcanjo corte todos os la\xE7os energ\xE9ticos negativos e sele o seu lar em uma ab\xF3bada de prote\xE7\xE3o divina e justi\xE7a celeste.",
      categoryTag: "PROTE\xC7\xC3O DIVINA",
      highlightText: "\u2726 Espada de Luz \u2022 Corte de La\xE7os Negativos",
      badgeText: "Manto Azul",
      sacredPattern: "metatronCube",
      gradientPrimary: "#001a33",
      gradientSecondary: "#003366",
      gradientDarkness: "#000814",
      colorTitle: "#64b5f6",
      colorSubtitle: "#e3f2fd",
      colorDesc: "#f8f9fa",
      colorHighlight: "#90caf9",
      colorHighlightBorder: "#64b5f6",
      colorTag: "#64b5f6",
      colorBadge: "#90caf9",
      colorCta: "#d4af37",
      colorPattern: "#64b5f6",
      colorCorners: "#f5d77f",
      colorDividers: "#90caf9",
      fontTitle: "'Cinzel Decorative', serif",
      weightTitle: "700",
      sizeTitle: 54,
      spacingTitle: 2,
      glowTitle: 18,
      colorTitleGlow: "#64b5f6",
      fontSubtitle: "'Cinzel', serif",
      styleSubtitle: "normal 600",
      sizeSubtitle: 26,
      sizeDesc: 18,
      lineHeightDesc: 1.6
    },
    {
      id: "am2",
      category: "arcanjo",
      categoryLabel: "\u2694\uFE0F Arcanjo Miguel",
      src: "../Fotos/Arcanjo Miguel/Tratadas/IMG_20260828_145751956_HDR.jpg",
      title: "DEFENSOR CELESTIAL",
      subtitle: "Coragem, F\xE9 e Vit\xF3ria Espiritual",
      description: "Invoque a presen\xE7a do Pr\xEDncipe da Mil\xEDcia Celeste. Imagem esculpida com riqueza de detalhes para ancorar a energia da coragem e determina\xE7\xE3o no seu altar sagrado.",
      categoryTag: "CHAMA AZUL",
      highlightText: "\u2726 Escudo de F\xE9 Inabal\xE1vel & Prote\xE7\xE3o",
      badgeText: "Presen\xE7a Divina",
      sacredPattern: "metatronCube",
      gradientPrimary: "#002b16",
      gradientSecondary: "#006633",
      gradientDarkness: "#020d06",
      colorTitle: "#f8f9fa",
      colorSubtitle: "#90caf9",
      colorDesc: "#f8f9fa",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#d4af37",
      colorTag: "#d4af37",
      colorBadge: "#f5d77f",
      colorCta: "#d4af37",
      colorPattern: "#d4af37",
      colorCorners: "#d4af37",
      colorDividers: "#d4af37",
      fontTitle: "'Cinzel Decorative', serif",
      weightTitle: "700",
      sizeTitle: 54,
      spacingTitle: 1,
      glowTitle: 14,
      colorTitleGlow: "#d4af37",
      fontSubtitle: "'Cormorant Garamond', serif",
      styleSubtitle: "italic 600",
      sizeSubtitle: 26,
      sizeDesc: 18,
      lineHeightDesc: 1.6
    },
    {
      id: "am3",
      category: "arcanjo",
      categoryLabel: "\u2694\uFE0F Arcanjo Miguel",
      src: "../Fotos/Arcanjo Miguel/Tratadas/IMG_20260828_152249527_HDR.jpg",
      title: "QUEBRA DE DEMANDAS",
      subtitle: "Sob as Asas do Guardi\xE3o Maior",
      description: "Nenhuma for\xE7a contr\xE1ria prevalece diante do comando de S\xE3o Miguel Arcanjo. Sinta a presen\xE7a pacificadora e protetora que envolve seu esp\xEDrito e sua fam\xEDlia.",
      categoryTag: "PROTE\xC7\xC3O M\xC1XIMA",
      highlightText: "\u2726 Corte de Amarras & Liberta\xE7\xE3o Espiritual",
      badgeText: "Escudo Sagrado",
      sacredPattern: "metatronCube",
      gradientPrimary: "#081a2e",
      gradientSecondary: "#0e2e52",
      gradientDarkness: "#02060a",
      colorTitle: "#64b5f6",
      colorSubtitle: "#f8f9fa",
      colorDesc: "#e0e0e0",
      colorHighlight: "#90caf9",
      colorHighlightBorder: "#64b5f6",
      colorTag: "#d4af37",
      colorBadge: "#64b5f6",
      colorCta: "#d4af37",
      colorPattern: "#64b5f6",
      colorCorners: "#f5d77f",
      colorDividers: "#64b5f6",
      fontTitle: "'Cinzel Decorative', serif",
      weightTitle: "700",
      sizeTitle: 54,
      spacingTitle: 1,
      glowTitle: 16,
      colorTitleGlow: "#64b5f6",
      fontSubtitle: "'Cormorant Garamond', serif",
      styleSubtitle: "italic 500",
      sizeSubtitle: 26,
      sizeDesc: 18,
      lineHeightDesc: 1.6
    },
    // Categoria: Zodíaco
    {
      id: "zod1",
      category: "zodiaco",
      categoryLabel: "\u2648 Linha Zod\xEDaco",
      src: "../Fotos/zodiaco/Tratadas/IMG_20260828_175142446_HDR.jpg",
      title: "SABEDORIA DOS ASTROS",
      subtitle: "A Vibra\xE7\xE3o C\xF3smica do Seu Signo",
      description: "Cada signo do zod\xEDaco ressoa com elementos e pedras espec\xEDficas. Alinhe a sua ess\xEAncia com a geometria celeste e fortale\xE7a os seus dons naturais.",
      categoryTag: "ASTROLOGIA VIVA",
      highlightText: "\u2726 Resson\xE2ncia Planet\xE1ria & Ess\xEAncia Astral",
      badgeText: "Luz Celestial",
      sacredPattern: "lunarMandala",
      gradientPrimary: "#1f0d2b",
      gradientSecondary: "#421d5c",
      gradientDarkness: "#08030b",
      colorTitle: "#ce93d8",
      colorSubtitle: "#f3e5f5",
      colorDesc: "#f8f9fa",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#ba68c8",
      colorTag: "#ce93d8",
      colorBadge: "#f5d77f",
      colorCta: "#d4af37",
      colorPattern: "#ce93d8",
      colorCorners: "#f5d77f",
      colorDividers: "#ce93d8",
      fontTitle: "'Cinzel Decorative', serif",
      weightTitle: "700",
      sizeTitle: 54,
      spacingTitle: 2,
      glowTitle: 16,
      colorTitleGlow: "#ce93d8",
      fontSubtitle: "'Cormorant Garamond', serif",
      styleSubtitle: "italic 500",
      sizeSubtitle: 26,
      sizeDesc: 18,
      lineHeightDesc: 1.6
    },
    {
      id: "zod2",
      category: "zodiaco",
      categoryLabel: "\u2648 Linha Zod\xEDaco",
      src: "../Fotos/zodiaco/Tratadas/IMG_20260828_175100702.jpg",
      title: "MAPA ASTRAL & CRISTAIS",
      subtitle: "Harmoniza\xE7\xE3o dos 4 Elementos Sagrados",
      description: "Fogo, Terra, Ar e \xC1gua integrados no seu campo \xE1urico. Cristais consagrados para equilibrar a sua carta natal e abrir caminhos de realiza\xE7\xE3o.",
      categoryTag: "4 ELEMENTOS",
      highlightText: "\u2726 Equil\xEDbrio dos Chakras & For\xE7a Planet\xE1ria",
      badgeText: "For\xE7a C\xF3smica",
      sacredPattern: "lunarMandala",
      gradientPrimary: "#14142b",
      gradientSecondary: "#292954",
      gradientDarkness: "#05050d",
      colorTitle: "#9fa8da",
      colorSubtitle: "#e8eaf6",
      colorDesc: "#f8f9fa",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#7986cb",
      colorTag: "#9fa8da",
      colorBadge: "#f5d77f",
      colorCta: "#d4af37",
      colorPattern: "#9fa8da",
      colorCorners: "#f5d77f",
      colorDividers: "#9fa8da",
      fontTitle: "'Cinzel Decorative', serif",
      weightTitle: "700",
      sizeTitle: 54,
      spacingTitle: 1,
      glowTitle: 14,
      colorTitleGlow: "#9fa8da",
      fontSubtitle: "'Cormorant Garamond', serif",
      styleSubtitle: "italic 500",
      sizeSubtitle: 26,
      sizeDesc: 18,
      lineHeightDesc: 1.6
    },
    // Categoria: Kailash Aromas
    {
      id: "kai1",
      category: "kailash",
      categoryLabel: "\u{1F3D4}\uFE0F Kailash Aromas",
      src: "../Fotos/Kailash/Tratadas/IMG_20260828_173627904.jpg",
      title: "AROMAS DE KAILASH",
      subtitle: "A Pureza M\xEDstica das Altas Montanhas",
      description: "Incensos artesanais de queima suave e longa dura\xE7\xE3o. Cada aroma conduz a mente para estados meditativos elevados, dissipando cansa\xE7o mental e tens\xF5es.",
      categoryTag: "DEFUMA\xC7\xC3O PURA",
      highlightText: "\u2726 Limpeza de Ambientes & Purifica\xE7\xE3o",
      badgeText: "Ervas Nobres",
      sacredPattern: "flowerOfLife",
      gradientPrimary: "#1a1f0a",
      gradientSecondary: "#3b4717",
      gradientDarkness: "#060802",
      colorTitle: "#f8f9fa",
      colorSubtitle: "#dcedc8",
      colorDesc: "#f8f9fa",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#aed581",
      colorTag: "#d4af37",
      colorBadge: "#f5d77f",
      colorCta: "#d4af37",
      colorPattern: "#d4af37",
      colorCorners: "#d4af37",
      colorDividers: "#d4af37",
      fontTitle: "'Cinzel Decorative', serif",
      weightTitle: "700",
      sizeTitle: 54,
      spacingTitle: 1,
      glowTitle: 12,
      colorTitleGlow: "#d4af37",
      fontSubtitle: "'Cormorant Garamond', serif",
      styleSubtitle: "italic 500",
      sizeSubtitle: 26,
      sizeDesc: 18,
      lineHeightDesc: 1.6
    },
    {
      id: "kai2",
      category: "kailash",
      categoryLabel: "\u{1F3D4}\uFE0F Kailash Aromas",
      src: "../Fotos/Kailash/Tratadas/IMG_20260828_174047079_HDR.jpg",
      title: "ESS\xCANCIA DOS HIMALAIS",
      subtitle: "Onde a Fuma\xE7a Sobe, o Esp\xEDrito se Eleva",
      description: "Notas olfativas nobres extra\xEDdas da bot\xE2nica sagrada para acalmar a mente agitada, facilitar a concentra\xE7\xE3o na medita\xE7\xE3o e atrair boas energias.",
      categoryTag: "BEM-ESTAR OLFATIVO",
      highlightText: "\u2726 Resinas Sagradas & Defuma\xE7\xE3o Serena",
      badgeText: "Alta Frequ\xEAncia",
      sacredPattern: "flowerOfLife",
      gradientPrimary: "#002614",
      gradientSecondary: "#00592e",
      gradientDarkness: "#030805",
      colorTitle: "#f8f9fa",
      colorSubtitle: "#eadcb9",
      colorDesc: "#f8f9fa",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#d4af37",
      colorTag: "#d4af37",
      colorBadge: "#f5d77f",
      colorCta: "#d4af37",
      colorPattern: "#d4af37",
      colorCorners: "#d4af37",
      colorDividers: "#d4af37",
      fontTitle: "'Cinzel Decorative', serif",
      weightTitle: "700",
      sizeTitle: 54,
      spacingTitle: 1,
      glowTitle: 10,
      colorTitleGlow: "#d4af37",
      fontSubtitle: "'Cormorant Garamond', serif",
      styleSubtitle: "italic 500",
      sizeSubtitle: 26,
      sizeDesc: 18,
      lineHeightDesc: 1.6
    },
    // Categoria: NOA Orixás
    {
      id: "noa1",
      category: "noa",
      categoryLabel: "\u2728 Linha NOA Orix\xE1s",
      src: "../Fotos/NOA/Tratadas/IMG_20260828_180047923.jpg",
      title: "NOA ORIX\xC1S",
      subtitle: "For\xE7a Vital, Ax\xE9 e Ancestralidade",
      description: "A natureza \xE9 a morada do sagrado. Conecte-se com as for\xE7as dos elementos e a sabedoria ancestral dos Orix\xE1s. Pe\xE7as de respeito e devo\xE7\xE3o que acolhem a alma.",
      categoryTag: "ANCESTRALIDADE",
      highlightText: "\u2726 For\xE7a dos Elementos \u2022 Ax\xE9 & Prote\xE7\xE3o",
      badgeText: "Ax\xE9 & Luz",
      sacredPattern: "none",
      gradientPrimary: "#002914",
      gradientSecondary: "#006b35",
      gradientDarkness: "#030b05",
      colorTitle: "#f8f9fa",
      colorSubtitle: "#eadcb9",
      colorDesc: "#f8f9fa",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#d4af37",
      colorTag: "#d4af37",
      colorBadge: "#f5d77f",
      colorCta: "#d4af37",
      colorPattern: "#d4af37",
      colorCorners: "#d4af37",
      colorDividers: "#d4af37",
      fontTitle: "'Cinzel Decorative', serif",
      weightTitle: "700",
      sizeTitle: 54,
      spacingTitle: 2,
      glowTitle: 14,
      colorTitleGlow: "#d4af37",
      fontSubtitle: "'Cormorant Garamond', serif",
      styleSubtitle: "italic 500",
      sizeSubtitle: 26,
      sizeDesc: 18,
      lineHeightDesc: 1.6
    },
    // Categoria: Tibete & Homenagem Sagrada
    {
      id: "tib_homenagem1",
      category: "tibete",
      categoryLabel: "\u{1F54A}\uFE0F Prece do Tibete (L\xE2mpada de Sal)",
      src: "../Fotos/tibete/Tratadas/IMG_20260828_171759729.jpg",
      title: "ORA\xC7\xC3O PELO TIBETE & NEPAL",
      subtitle: "Em profunda rever\xEAncia e uni\xE3o espiritual",
      description: "Nossos cora\xE7\xF5es e ora\xE7\xF5es se voltam para os povos do Tibete e do Nepal, tocados pela recente trag\xE9dia nas montanhas sagradas. Que o poder de Karuna e a luz de Chenrezig abracem cada fam\xEDlia, trazendo serenidade e for\xE7a na reconstru\xE7\xE3o de seus lares.",
      categoryTag: "\u{1F54A}\uFE0F HOMENAGEM & SOLIDARIEDADE",
      highlightText: "\u2726 O\u1E42 MA\u1E46I PADME H\u016A\u1E42 \u2726 Al\xEDvio, Amparo e Cura",
      badgeText: "Prece Sagrada",
      ctaText: "PEDA\xC7O DO C\xC9U \u2022 SOLIDARIEDADE & F\xC9",
      sacredPattern: "sriYantra",
      gradientPrimary: "#140a03",
      gradientSecondary: "#241407",
      gradientDarkness: "#080401",
      colorTitle: "#ffffff",
      colorSubtitle: "#f5d77f",
      colorDesc: "#ffffff",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#d4af37",
      colorTag: "#f5d77f",
      colorBadge: "#f5d77f",
      colorCta: "#d4af37",
      colorPattern: "#d4af37",
      colorCorners: "#f5d77f",
      colorDividers: "#d4af37",
      fontTitle: "'Cinzel', serif",
      weightTitle: "900",
      sizeTitle: 44,
      spacingTitle: 2,
      glowTitle: 22,
      colorTitleGlow: "#f5d77f",
      fontSubtitle: "'Playfair Display', serif",
      styleSubtitle: "italic 700",
      sizeSubtitle: 24,
      fontDesc: "'Montserrat', sans-serif",
      sizeDesc: 20,
      lineHeightDesc: 1.6
    },
    {
      id: "tib_homenagem2",
      category: "tibete",
      categoryLabel: "\u{1F54A}\uFE0F Prece do Tibete (Buda Solar)",
      src: "../Fotos/tibete/Tratadas/IMG_20260828_172652877_HDR.jpg",
      title: "LUZ DE CHENREZIG",
      subtitle: "Compaix\xE3o Infinita e Amparo Divino",
      description: "Que o sopro sagrado das bandeiras de ora\xE7\xE3o espalhe paz pelos vales e eleve as almas que partiram em dire\xE7\xE3o \xE0 luz divina. Em uni\xE3o espiritual por todas as fam\xEDlias dos Himalaias.",
      categoryTag: "\u{1F54A}\uFE0F PRECE PELOS HIMALAIAS",
      highlightText: "\u2726 KARUNA \u2726 O Poder Infinito da Compaix\xE3o",
      badgeText: "Solidariedade & Paz",
      ctaText: "PEDA\xC7O DO C\xC9U \u2022 UNI\xC3O ESPIRITUAL",
      sacredPattern: "sriYantra",
      gradientPrimary: "#1c0e04",
      gradientSecondary: "#381d09",
      gradientDarkness: "#080401",
      colorTitle: "#ffffff",
      colorSubtitle: "#f5d77f",
      colorDesc: "#ffffff",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#d4af37",
      colorTag: "#f5d77f",
      colorBadge: "#f5d77f",
      colorCta: "#d4af37",
      colorPattern: "#d4af37",
      colorCorners: "#f5d77f",
      colorDividers: "#d4af37",
      fontTitle: "'Cinzel', serif",
      weightTitle: "900",
      sizeTitle: 44,
      spacingTitle: 2,
      glowTitle: 22,
      colorTitleGlow: "#f5d77f",
      fontSubtitle: "'Playfair Display', serif",
      styleSubtitle: "italic 700",
      sizeSubtitle: 24,
      fontDesc: "'Montserrat', sans-serif",
      sizeDesc: 20,
      lineHeightDesc: 1.6
    },
    {
      id: "tib_homenagem3",
      category: "tibete",
      categoryLabel: "\u{1F54A}\uFE0F Prece do Tibete (Pir\xE2mide de Sal)",
      src: "../Fotos/tibete/Tratadas/IMG_20260828_165849966.jpg",
      title: "RECONSTRU\xC7\xC3O & F\xC9",
      subtitle: "A For\xE7a Imut\xE1vel das Montanhas Sagradas",
      description: "Que o poder de Chenrezig abrace cada cora\xE7\xE3o ferido. Que a serenidade dos mosteiros e a for\xE7a das rochas sagradas sustentem a reconstru\xE7\xE3o de lares e vidas com coragem e esperan\xE7a.",
      categoryTag: "\u{1F54A}\uFE0F HOMENAGEM AO TIBETE",
      highlightText: "\u2726 O\u1E42 MA\u1E46I PADME H\u016A\u1E42 \u2726 Al\xEDvio, Amparo e Cura",
      badgeText: "Esperan\xE7a & Cura",
      ctaText: "PEDA\xC7O DO C\xC9U \u2022 SOLIDARIEDADE & F\xC9",
      sacredPattern: "sriYantra",
      gradientPrimary: "#140a03",
      gradientSecondary: "#2a1607",
      gradientDarkness: "#080401",
      colorTitle: "#ffffff",
      colorSubtitle: "#f5d77f",
      colorDesc: "#ffffff",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#d4af37",
      colorTag: "#f5d77f",
      colorBadge: "#f5d77f",
      colorCta: "#d4af37",
      colorPattern: "#d4af37",
      colorCorners: "#f5d77f",
      colorDividers: "#d4af37",
      fontTitle: "'Cinzel', serif",
      weightTitle: "900",
      sizeTitle: 44,
      spacingTitle: 2,
      glowTitle: 22,
      colorTitleGlow: "#f5d77f",
      fontSubtitle: "'Playfair Display', serif",
      styleSubtitle: "italic 700",
      sizeSubtitle: 24,
      fontDesc: "'Montserrat', sans-serif",
      sizeDesc: 20,
      lineHeightDesc: 1.6
    },
    {
      id: "tib4_tacas",
      category: "tibete",
      categoryLabel: "\u{1F9D8} Tibete & Ta\xE7as Sagradas",
      src: "../Fotos/tibete/Tratadas/IMG_20260828_172439605_HDR.jpg",
      title: "TA\xC7AS TIBETANAS",
      subtitle: "A Cura Vibracional dos 7 Metais Sagrados",
      description: "Forjadas \xE0 m\xE3o sob rituais ancestrais. As ondas sonoras em harmonia produzem frequ\xEAncias Alfa e Teta, alinhando os 7 chakras e dissipando bloqueios et\xE9ricos profundos.",
      categoryTag: "CURA SONORA",
      highlightText: "\u2726 Frequ\xEAncia Harm\xF4nica 432Hz \u2022 7 Metais",
      badgeText: "Cura Vibracional",
      ctaText: "PEDA\xC7O DO C\xC9U \u2022 HARMONIA & PAZ",
      sacredPattern: "sriYantra",
      gradientPrimary: "#261a0e",
      gradientSecondary: "#52371d",
      gradientDarkness: "#0d0804",
      colorTitle: "#f5d77f",
      colorSubtitle: "#ffe0b2",
      colorDesc: "#fff3e0",
      colorHighlight: "#f5d77f",
      colorHighlightBorder: "#d4af37",
      colorTag: "#d4af37",
      colorBadge: "#f5d77f",
      colorCta: "#f5d77f",
      colorPattern: "#f5d77f",
      colorCorners: "#f5d77f",
      colorDividers: "#f5d77f",
      fontTitle: "'Cinzel Decorative', serif",
      weightTitle: "700",
      sizeTitle: 54,
      spacingTitle: 2,
      glowTitle: 18,
      colorTitleGlow: "#f5d77f",
      fontSubtitle: "'Cormorant Garamond', serif",
      styleSubtitle: "italic 500",
      sizeSubtitle: 26,
      fontDesc: "'Montserrat', sans-serif",
      sizeDesc: 18,
      lineHeightDesc: 1.6
    }
  ];
  var INITIAL_STATE = {
    format: "1:1",
    width: 1080,
    height: 1080,
    layout: "right",
    align: "center",
    fitMode: "portal",
    imgSrc: PHOTO_CATALOG[0].src,
    imgObj: null,
    imgZoom: 1,
    imgPanX: 0,
    imgPanY: 0,
    imgFlipH: false,
    imgFlipV: false,
    bgImageSrc: null,
    bgImageObj: null,
    bgImageOpacity: 0.6,
    gradientPrimary: PHOTO_CATALOG[0].gradientPrimary,
    gradientSecondary: PHOTO_CATALOG[0].gradientSecondary,
    gradientDarkness: PHOTO_CATALOG[0].gradientDarkness,
    gradientIntensity: 0.88,
    categoryTag: PHOTO_CATALOG[0].categoryTag,
    title: PHOTO_CATALOG[0].title,
    subtitle: PHOTO_CATALOG[0].subtitle,
    description: PHOTO_CATALOG[0].description,
    highlightText: PHOTO_CATALOG[0].highlightText,
    showHighlightBox: true,
    ctaText: "Visite nossa loja \u2022 Peda\xE7o do C\xE9u",
    badgeText: PHOTO_CATALOG[0].badgeText,
    fontTitle: PHOTO_CATALOG[0].fontTitle,
    weightTitle: PHOTO_CATALOG[0].weightTitle,
    sizeTitle: 54,
    spacingTitle: PHOTO_CATALOG[0].spacingTitle,
    glowTitle: PHOTO_CATALOG[0].glowTitle,
    colorTitleGlow: PHOTO_CATALOG[0].colorTitleGlow,
    fontSubtitle: PHOTO_CATALOG[0].fontSubtitle,
    styleSubtitle: PHOTO_CATALOG[0].styleSubtitle,
    sizeSubtitle: 26,
    spacingSubtitle: 0,
    fontDesc: "'Montserrat', sans-serif",
    weightDesc: "300",
    sizeDesc: 18,
    lineHeightDesc: PHOTO_CATALOG[0].lineHeightDesc,
    fontHighlight: "'Montserrat', sans-serif",
    weightHighlight: "600",
    sizeHighlight: 14,
    spacingHighlight: 1,
    fontCta: "'Cinzel', serif",
    weightCta: "600",
    sizeCta: 14,
    spacingCta: 1,
    // Header / Cabeçalho da Loja
    headerText: "Peda\xE7o do C\xE9u \u2022 S\xE3o Lu\xEDs (MA)",
    fontHeader: "'Cinzel', serif",
    weightHeader: "600",
    sizeHeader: 12,
    spacingHeader: 2,
    colorHeader: "#d4af37",
    showHeader: true,
    // Badge / Selo
    fontBadge: "'Cinzel', serif",
    weightBadge: "700",
    sizeBadge: 12,
    spacingBadge: 1,
    // Tag / Categoria
    fontTag: "'Cinzel', serif",
    weightTag: "700",
    sizeTag: 14,
    spacingTag: 2,
    colorTitle: PHOTO_CATALOG[0].colorTitle,
    colorSubtitle: PHOTO_CATALOG[0].colorSubtitle,
    colorDesc: PHOTO_CATALOG[0].colorDesc,
    colorHighlight: PHOTO_CATALOG[0].colorHighlight,
    colorHighlightBorder: PHOTO_CATALOG[0].colorHighlightBorder,
    colorTag: PHOTO_CATALOG[0].colorTag,
    colorBadge: PHOTO_CATALOG[0].colorBadge,
    colorCta: PHOTO_CATALOG[0].colorCta,
    colorPattern: PHOTO_CATALOG[0].colorPattern,
    colorCorners: PHOTO_CATALOG[0].colorCorners,
    colorDividers: PHOTO_CATALOG[0].colorDividers,
    sacredPattern: PHOTO_CATALOG[0].sacredPattern,
    patternOpacity: 0.35,
    showBaroqueCorners: true,
    showBadge: true,
    showSafeAreaGuide: false,
    textCardStyle: "card",
    // 'card', 'gradient', 'separated', 'glass', 'transparent', 'framed'
    splitRatio: 0.6,
    textZoneHeight: 0.44,
    cardRadius: 18,
    paddingTop: 90,
    blockGap: 20,
    paddingSide: 60,
    globalLineGap: 12,
    sideBySideMode: false
  };
  var PedacoDoCeuStudio = class {
    constructor() {
      const saved = Persistence.load();
      const activeState = saved ? { ...INITIAL_STATE, ...saved } : INITIAL_STATE;
      this.store = new Store(activeState);
      this.canvasEl = document.getElementById("renderCanvas");
      this.renderer = new Renderer(this.canvasEl, this.store);
      this.dragDrop = new CanvasDragDrop(this.canvasEl, this.renderer, this.store);
      this.shortcuts = new ShortcutManager(this.store, this.renderer, () => this.syncUI());
      this.a11y = new A11yManager();
      this.init();
    }
    init() {
      this.initPhotoGallery();
      this.initSavedTemplates();
      this.bindEvents();
      this.syncUI();
      this.loadImage(this.store.state.imgSrc, () => {
        this.renderer.requestRender();
      });
      this.store.subscribe(() => {
        this.updateUndoRedoButtons();
      });
    }
    initSavedTemplates() {
      this.renderSavedTemplatesList();
    }
    renderSavedTemplatesList() {
      const listEl = document.getElementById("savedTemplatesList");
      if (!listEl) return;
      const templates = Persistence.getTemplates();
      listEl.innerHTML = "";
      if (templates.length === 0) {
        listEl.innerHTML = `
        <div style="font-size: 11px; color: var(--color-sacred-gold-light); opacity: 0.75; text-align: center; padding: 12px 6px; border: 1px dashed rgba(212, 175, 55, 0.25); border-radius: 4px;">
          \u2726 Nenhum template salvo ainda.<br>Digite um nome acima e clique em <b>Salvar</b>!
        </div>
      `;
        return;
      }
      templates.forEach((tpl) => {
        const card = document.createElement("div");
        card.className = "saved-template-card";
        const dateStr = tpl.createdAt ? new Date(tpl.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "";
        card.innerHTML = `
        <div class="template-info">
          <span class="template-title" title="${tpl.name}">${tpl.name}</span>
          <div class="template-meta">
            <span class="template-badge-fmt">${tpl.format || "1:1"}</span>
            <span>${dateStr}</span>
          </div>
        </div>
        <div class="template-actions">
          <button type="button" class="btn-tpl-load" title="Carregar este template" data-id="${tpl.id}">Carregar</button>
          <button type="button" class="btn-tpl-delete" title="Excluir template" data-id="${tpl.id}">\u2715</button>
        </div>
      `;
        const btnLoad = card.querySelector(".btn-tpl-load");
        if (btnLoad) {
          btnLoad.addEventListener("click", () => this.loadSavedTemplate(tpl.id));
        }
        const btnDel = card.querySelector(".btn-tpl-delete");
        if (btnDel) {
          btnDel.addEventListener("click", () => {
            if (typeof confirm !== "undefined" ? confirm(`Deseja realmente excluir o template "${tpl.name}"?`) : true) {
              this.deleteSavedTemplate(tpl.id);
            }
          });
        }
        listEl.appendChild(card);
      });
    }
    saveCurrentTemplate(customName) {
      const input = document.getElementById("templateNameInput");
      const name = customName && customName.trim() ? customName.trim() : (input ? input.value.trim() : "") || `Template ${this.store.state.title || "M\xEDstico"}`;
      const saved = Persistence.saveTemplate(name, this.store.state);
      if (saved) {
        if (input) input.value = "";
        this.renderSavedTemplatesList();
        A11yManager.announce(`Template "${saved.name}" salvo com sucesso!`);
      }
    }
    loadSavedTemplate(id) {
      const templates = Persistence.getTemplates();
      const found = templates.find((t) => t.id === id);
      if (!found || !found.state) return;
      Object.keys(found.state).forEach((key) => {
        this.store.state[key] = found.state[key];
      });
      this.syncUI();
      if (found.state.imgSrc) {
        this.loadImage(found.state.imgSrc, () => this.renderer.requestRender());
      } else {
        this.renderer.requestRender();
      }
      A11yManager.announce(`Template "${found.name}" carregado com sucesso!`);
    }
    deleteSavedTemplate(id) {
      Persistence.deleteTemplate(id);
      this.renderSavedTemplatesList();
      A11yManager.announce("Template exclu\xEDdo com sucesso.");
    }
    exportTemplatesJSON() {
      const jsonStr = Persistence.exportTemplatesJSON();
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `pedaco-do-ceu-templates-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1e3);
      A11yManager.announce("Arquivo JSON de templates exportado!");
    }
    importTemplatesJSON(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = Persistence.importTemplatesJSON(e.target.result);
          if (result) {
            this.renderSavedTemplatesList();
            A11yManager.announce(`${result.length} templates carregados com sucesso!`);
          } else {
            alert("Erro ao importar arquivo JSON de templates. Formato inv\xE1lido.");
          }
        } catch (err) {
          alert("Erro ao ler arquivo: " + err.message);
        }
      };
      reader.readAsText(file);
    }
    resetToDefaults() {
      const shouldReset = typeof confirm !== "undefined" ? confirm("Deseja redefinir o est\xFAdio para a configura\xE7\xE3o inicial padr\xE3o? Suas altera\xE7\xF5es n\xE3o salvas como template ser\xE3o perdidas.") : true;
      if (shouldReset) {
        Persistence.clear();
        Object.keys(INITIAL_STATE).forEach((k) => {
          this.store.state[k] = INITIAL_STATE[k];
        });
        this.syncUI();
        this.loadImage(INITIAL_STATE.imgSrc, () => this.renderer.requestRender());
        A11yManager.announce("Est\xFAdio redefinido para configura\xE7\xE3o padr\xE3o.");
      }
    }
    updateUndoRedoButtons() {
      const btnUndo = document.getElementById("btnUndo");
      const btnRedo = document.getElementById("btnRedo");
      if (btnUndo) btnUndo.disabled = !this.store.canUndo();
      if (btnRedo) btnRedo.disabled = !this.store.canRedo();
    }
    loadImage(src, callback) {
      const img = new Image();
      if (typeof window !== "undefined" && window.location && window.location.protocol.startsWith("http")) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => {
        this.store.state.imgObj = img;
        const orig = document.getElementById("originalPhotoImg");
        if (orig) orig.src = src;
        if (callback) callback();
      };
      img.onerror = () => {
        console.warn("Erro ao carregar imagem local, aplicando gerador sagrado:", src);
        this.store.state.imgObj = this.createFallbackImage();
        const orig = document.getElementById("originalPhotoImg");
        if (orig) orig.src = this.store.state.imgObj.toDataURL();
        if (callback) callback();
      };
      img.src = encodeURI(src);
    }
    createFallbackImage() {
      const c = document.createElement("canvas");
      c.width = 1e3;
      c.height = 1e3;
      const ctx = c.getContext("2d");
      const g = ctx.createLinearGradient(0, 0, 1e3, 1e3);
      g.addColorStop(0, "#001f0f");
      g.addColorStop(0.5, "#004d25");
      g.addColorStop(1, "#00140a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1e3, 1e3);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.5)";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 940, 940);
      ctx.strokeStyle = "#f5d77f";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(500, 500, 260, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#f5d77f";
      ctx.font = '700 36px "Cinzel", serif';
      ctx.textAlign = "center";
      ctx.fillText("\u2726 PEDA\xC7O DO C\xC9U \u2726", 500, 480);
      ctx.font = 'italic 500 24px "Cormorant Garamond", serif';
      ctx.fillText("Espa\xE7o Artes \u2022 Sagrado & M\xEDstico", 500, 530);
      return c;
    }
    initPhotoGallery() {
      const galleryEl = document.getElementById("photoGallery");
      if (!galleryEl) return;
      galleryEl.innerHTML = "";
      PHOTO_CATALOG.forEach((item, idx) => {
        const card = document.createElement("div");
        card.className = `gallery-thumb-item ${this.store.state.imgSrc === item.src ? "active" : ""}`;
        card.setAttribute("data-id", item.id);
        card.innerHTML = `
        <img src="${item.src}" alt="${item.title}" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'80\\' fill=\\'%2300381c\\'><rect width=\\'100%\\' height=\\'100%\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23d4af37\\' font-family=\\'serif\\' font-size=\\'12\\' text-anchor=\\'middle\\' dy=\\'.3em\\'>\u2726 Pe\xE7a ${idx + 1}</text></svg>'">
        <div class="thumb-info">
          <span class="thumb-title">${item.title}</span>
          <span class="thumb-category">${item.categoryLabel}</span>
        </div>
      `;
        card.addEventListener("click", () => {
          document.querySelectorAll(".gallery-thumb-item").forEach((c) => c.classList.remove("active"));
          card.classList.add("active");
          this.applyCatalogItem(item);
        });
        galleryEl.appendChild(card);
      });
    }
    applyCatalogItem(item) {
      Object.keys(item).forEach((key) => {
        if (key !== "id" && key !== "categoryLabel") {
          this.store.state[key] = item[key];
        }
      });
      this.store.state.imgSrc = item.src;
      this.syncUI();
      this.loadImage(item.src, () => {
        this.renderer.requestRender();
      });
    }
    applyPreset(presetKey) {
      const p = DESIGN_PRESETS[presetKey];
      if (!p) return;
      Object.keys(p).forEach((k) => {
        if (k !== "name") {
          this.store.state[k] = p[k];
        }
      });
      this.syncUI();
      this.renderer.requestRender();
      A11yManager.announce(`Preset ${p.name} aplicado com sucesso!`);
    }
    updateGradientLivePreview() {
      const previewEl = document.getElementById("gradientLivePreview");
      if (!previewEl) return;
      const s = this.store.state;
      previewEl.style.background = `linear-gradient(135deg, ${s.gradientPrimary || "#00381c"}, ${s.gradientSecondary || "#008542"}, ${s.gradientDarkness || "#050c07"})`;
    }
    bindEvents() {
      document.querySelectorAll(".tabs-nav .tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".tabs-nav .tab-btn").forEach((b) => {
            b.classList.remove("active");
            b.setAttribute("aria-selected", "false");
            b.setAttribute("tabindex", "-1");
          });
          document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
          btn.classList.add("active");
          btn.setAttribute("aria-selected", "true");
          btn.setAttribute("tabindex", "0");
          const targetId = btn.getAttribute("data-target");
          const targetPane = document.getElementById(targetId);
          if (targetPane) targetPane.classList.add("active");
        });
      });
      document.querySelectorAll("#presetsGrid .preset-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#presetsGrid .preset-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const presetKey = btn.getAttribute("data-preset");
          this.applyPreset(presetKey);
        });
      });
      const bindInput = (id, prop, isNum = false) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener("input", (e) => {
            this.store.state[prop] = isNum ? parseFloat(e.target.value) : e.target.value;
            const valEl = document.getElementById(id.replace("Range", "Val"));
            if (valEl) valEl.textContent = e.target.value + (id.includes("lineHeight") ? "x" : "px");
            if (prop.startsWith("gradient")) this.updateGradientLivePreview();
          });
        }
      };
      ["title", "subtitle", "description", "categoryTag", "highlightText", "ctaText", "badgeText", "headerText"].forEach((key) => {
        let id = key + "Input";
        if (key === "categoryTag") id = "categoryTagInput";
        if (key === "highlightText") id = "highlightInput";
        if (key === "ctaText") id = "ctaInput";
        if (key === "badgeText") id = "badgeInput";
        bindInput(id, key);
      });
      const colors = [
        "colorTitle",
        "colorTitleGlow",
        "colorSubtitle",
        "colorDesc",
        "colorHighlight",
        "colorHighlightBorder",
        "colorTag",
        "colorBadge",
        "colorCta",
        "colorPattern",
        "colorCorners",
        "colorDividers",
        "gradientPrimary",
        "gradientSecondary",
        "gradientDarkness"
      ];
      colors.forEach((key) => bindInput(key + "Input", key));
      bindInput("colorHeaderInput", "colorHeader");
      bindInput("sizeTitleRange", "sizeTitle", true);
      bindInput("spacingTitleRange", "spacingTitle", true);
      bindInput("glowTitleRange", "glowTitle", true);
      bindInput("sizeSubtitleRange", "sizeSubtitle", true);
      bindInput("spacingSubtitleRange", "spacingSubtitle", true);
      bindInput("sizeDescRange", "sizeDesc", true);
      bindInput("sizeHighlightRange", "sizeHighlight", true);
      bindInput("spacingHighlightRange", "spacingHighlight", true);
      bindInput("sizeCtaRange", "sizeCta", true);
      bindInput("spacingCtaRange", "spacingCta", true);
      bindInput("sizeHeaderRange", "sizeHeader", true);
      bindInput("spacingHeaderRange", "spacingHeader", true);
      bindInput("sizeBadgeRange", "sizeBadge", true);
      bindInput("spacingBadgeRange", "spacingBadge", true);
      bindInput("sizeTagRange", "sizeTag", true);
      bindInput("spacingTagRange", "spacingTag", true);
      bindInput("paddingTopRange", "paddingTop", true);
      bindInput("blockGapRange", "blockGap", true);
      bindInput("paddingSideRange", "paddingSide", true);
      bindInput("globalLineGapRange", "globalLineGap", true);
      const lhRange = document.getElementById("lineHeightDescRange");
      if (lhRange) {
        lhRange.addEventListener("input", (e) => {
          this.store.state.lineHeightDesc = parseFloat(e.target.value) / 10;
          const lhVal = document.getElementById("lineHeightDescVal");
          if (lhVal) lhVal.textContent = this.store.state.lineHeightDesc.toFixed(1) + "x";
        });
      }
      const showHeaderCheck = document.getElementById("showHeaderCheck");
      if (showHeaderCheck) {
        showHeaderCheck.addEventListener("change", (e) => {
          this.store.state.showHeader = e.target.checked;
          this.renderer.requestRender();
        });
      }
      [
        "fontTitleSelect",
        "weightTitleSelect",
        "fontSubtitleSelect",
        "styleSubtitleSelect",
        "fontDescSelect",
        "weightDescSelect",
        "fontHighlightSelect",
        "weightHighlightSelect",
        "fontCtaSelect",
        "weightCtaSelect",
        "fontHeaderSelect",
        "weightHeaderSelect",
        "fontBadgeSelect",
        "weightBadgeSelect",
        "fontTagSelect",
        "weightTagSelect",
        "sacredPatternSelect"
      ].forEach((id) => {
        const el = document.getElementById(id);
        const prop = id.replace("Select", "");
        if (el) el.addEventListener("change", (e) => {
          this.store.state[prop] = e.target.value;
          this.renderer.requestRender();
          if (prop.startsWith("font") && e.target.value) {
            const primaryFont = e.target.value.split(",")[0].replace(/['"]/g, "").trim();
            if (primaryFont && document.fonts && document.fonts.load) {
              try {
                document.fonts.load(`16px "${primaryFont}"`).then(() => this.renderer.requestRender()).catch(() => {
                });
              } catch (_) {
              }
            }
          }
        });
      });
      document.querySelectorAll("[data-fit]").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("[data-fit]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          this.store.state.fitMode = btn.getAttribute("data-fit");
        });
      });
      document.querySelectorAll("[data-align]").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("[data-align]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          this.store.state.align = btn.getAttribute("data-align");
        });
      });
      document.querySelectorAll("[data-format]").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("[data-format]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          this.setFormat(btn.getAttribute("data-format"));
        });
      });
      document.querySelectorAll("[data-layout]").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("[data-layout]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          this.store.state.layout = btn.getAttribute("data-layout");
        });
      });
      document.querySelectorAll("[data-text-card-style]").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("[data-text-card-style]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          this.store.state.textCardStyle = btn.getAttribute("data-text-card-style");
        });
      });
      document.querySelectorAll("[data-view-mode]").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("[data-view-mode]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const mode = btn.getAttribute("data-view-mode");
          const photoCard = document.getElementById("originalPhotoCard");
          if (photoCard) {
            if (mode === "split") {
              photoCard.classList.add("show");
              this.store.state.sideBySideMode = true;
            } else {
              photoCard.classList.remove("show");
              this.store.state.sideBySideMode = false;
            }
          }
        });
      });
      const bindRangeHelper = (id, prop, transformFn, valId, unit = "") => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener("input", (e) => {
            const rawVal = parseFloat(e.target.value);
            this.store.state[prop] = transformFn(rawVal);
            const disp = document.getElementById(valId);
            if (disp) {
              if (unit === "%") {
                disp.textContent = Math.round(rawVal) + "%";
              } else if (unit === "x") {
                disp.textContent = (rawVal / 100).toFixed(1) + "x";
              } else {
                disp.textContent = rawVal + unit;
              }
            }
            if (prop.startsWith("gradient")) this.updateGradientLivePreview();
          });
        }
      };
      bindRangeHelper("imgZoomRange", "imgZoom", (v) => v / 100, "imgZoomVal", "x");
      bindRangeHelper("imgPanXRange", "imgPanX", (v) => v, "imgPanXVal", "px");
      bindRangeHelper("imgPanYRange", "imgPanY", (v) => v, "imgPanYVal", "px");
      bindRangeHelper("splitRatioRange", "splitRatio", (v) => v / 100, "splitRatioVal", "%");
      bindRangeHelper("textZoneHeightRange", "textZoneHeight", (v) => v / 100, "textZoneHeightVal", "%");
      bindRangeHelper("cardRadiusRange", "cardRadius", (v) => v, "cardRadiusVal", "px");
      bindRangeHelper("patternOpacityRange", "patternOpacity", (v) => v / 100, "patternOpacityVal", "%");
      bindRangeHelper("boxOpacityRange", "boxOpacity", (v) => v / 100, "boxOpacityVal", "%");
      bindRangeHelper("gradientIntensityRange", "gradientIntensity", (v) => v / 100, "gradientIntensityVal", "%");
      const bindCheck = (id, prop) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("change", (e) => {
          this.store.state[prop] = e.target.checked;
          this.renderer.requestRender();
        });
      };
      bindCheck("showBadgeCheck", "showBadge");
      bindCheck("showCornersCheck", "showBaroqueCorners");
      bindCheck("showHighlightBoxCheck", "showHighlightBox");
      bindCheck("showSafeAreaGuideCheck", "showSafeAreaGuide");
      bindCheck("imgFlipHCheck", "imgFlipH");
      bindCheck("imgFlipVCheck", "imgFlipV");
      const imgUpload = document.getElementById("imageUploadInput");
      if (imgUpload) {
        imgUpload.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              this.loadImage(evt.target.result, () => this.renderer.requestRender());
            };
            reader.readAsDataURL(file);
          }
        });
      }
      const bgUpload = document.getElementById("bgImageUploadInput");
      if (bgUpload) {
        bgUpload.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              const img = new Image();
              img.onload = () => {
                this.store.state.bgImageObj = img;
                this.store.state.bgImageSrc = evt.target.result;
                this.renderer.requestRender();
              };
              img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      }
      const bgOpRange = document.getElementById("bgImageOpacityRange");
      if (bgOpRange) {
        bgOpRange.addEventListener("input", (e) => {
          this.store.state.bgImageOpacity = parseInt(e.target.value) / 100;
          const disp = document.getElementById("bgImageOpacityVal");
          if (disp) disp.textContent = e.target.value + "%";
        });
      }
      const btnRemoveBg = document.getElementById("btnRemoveBgImage");
      if (btnRemoveBg) {
        btnRemoveBg.addEventListener("click", () => {
          this.store.state.bgImageObj = null;
          this.store.state.bgImageSrc = null;
          if (bgUpload) bgUpload.value = "";
          this.renderer.requestRender();
        });
      }
      const btnUndo = document.getElementById("btnUndo");
      if (btnUndo) btnUndo.addEventListener("click", () => {
        this.store.undo();
        this.syncUI();
      });
      const btnRedo = document.getElementById("btnRedo");
      if (btnRedo) btnRedo.addEventListener("click", () => {
        this.store.redo();
        this.syncUI();
      });
      const btnSaveCustom = document.getElementById("btnSaveCustomTemplate");
      if (btnSaveCustom) {
        btnSaveCustom.addEventListener("click", () => this.saveCurrentTemplate());
      }
      const btnSaveQuick = document.getElementById("btnSaveTemplateQuick");
      if (btnSaveQuick) {
        btnSaveQuick.addEventListener("click", () => {
          const title = this.store.state.title ? this.store.state.title.slice(0, 24) : "Arte";
          const name = typeof prompt !== "undefined" ? prompt("Digite o nome para salvar este template:", `Template ${title}`) : `Template ${title}`;
          if (name) this.saveCurrentTemplate(name);
        });
      }
      const inputTplName = document.getElementById("templateNameInput");
      if (inputTplName) {
        inputTplName.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            this.saveCurrentTemplate();
          }
        });
      }
      const btnExportTplJson = document.getElementById("btnExportTemplatesJson");
      if (btnExportTplJson) {
        btnExportTplJson.addEventListener("click", () => this.exportTemplatesJSON());
      }
      const btnImportTplJson = document.getElementById("btnImportTemplatesJson");
      const importFileInput = document.getElementById("importTemplatesFileInput");
      if (btnImportTplJson && importFileInput) {
        btnImportTplJson.addEventListener("click", () => importFileInput.click());
        importFileInput.addEventListener("change", (e) => {
          if (e.target.files && e.target.files[0]) {
            this.importTemplatesJSON(e.target.files[0]);
            importFileInput.value = "";
          }
        });
      }
      const btnReset = document.getElementById("btnResetStudio");
      if (btnReset) {
        btnReset.addEventListener("click", () => this.resetToDefaults());
      }
      const btnExport = document.getElementById("btnExport");
      if (btnExport) {
        btnExport.addEventListener("click", async () => {
          const cleanTitle = (this.store.state.title || "post").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-");
          const exportResSelect = document.getElementById("exportResolutionSelect");
          const scale = exportResSelect ? parseInt(exportResSelect.value, 10) : 2;
          const resLabel = scale === 4 ? "4k" : scale === 1 ? "1k" : "2k";
          btnExport.disabled = true;
          const origContent = btnExport.innerHTML;
          btnExport.innerHTML = `<span>\u23F3</span> Gerando ${resLabel.toUpperCase()}...`;
          try {
            await this.renderer.exportHighResImage(`pedaco-do-ceu-${this.store.state.format}-${cleanTitle}-${resLabel}.png`, scale);
            A11yManager.announce(`Exporta\xE7\xE3o PNG (${resLabel.toUpperCase()} Ultra-HD) conclu\xEDda com sucesso!`);
          } finally {
            btnExport.disabled = false;
            btnExport.innerHTML = origContent;
          }
        });
      }
      const btnExportHtml = document.getElementById("btnExportHtml");
      if (btnExportHtml) {
        btnExportHtml.addEventListener("click", async () => {
          btnExportHtml.disabled = true;
          const origContent = btnExportHtml.innerHTML;
          btnExportHtml.innerHTML = "<span>\u23F3</span> Exportando...";
          try {
            await this.exportHTML();
            A11yManager.announce("Exporta\xE7\xE3o HTML conclu\xEDda com sucesso!");
          } finally {
            btnExportHtml.disabled = false;
            btnExportHtml.innerHTML = origContent;
          }
        });
      }
    }
    setFormat(fmt) {
      this.store.state.format = fmt;
      const dim = TOKENS.dimensions[fmt] || TOKENS.dimensions["1:1"];
      this.store.state.width = dim.width;
      this.store.state.height = dim.height;
      const dimDisplay = document.getElementById("formatDimDisplay");
      if (dimDisplay) dimDisplay.textContent = dim.label;
    }
    syncUI() {
      const s = this.store.state;
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== void 0) el.value = val;
      };
      const setCheck = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.checked = !!val;
      };
      setVal("titleInput", s.title);
      setVal("subtitleInput", s.subtitle);
      setVal("descriptionInput", s.description);
      setVal("categoryTagInput", s.categoryTag);
      setVal("highlightInput", s.highlightText);
      setVal("ctaInput", s.ctaText);
      setVal("badgeInput", s.badgeText);
      setVal("headerTextInput", s.headerText);
      setVal("colorTitleInput", s.colorTitle);
      setVal("colorTitleGlowInput", s.colorTitleGlow);
      setVal("colorSubtitleInput", s.colorSubtitle);
      setVal("colorDescInput", s.colorDesc);
      setVal("colorHighlightInput", s.colorHighlight);
      setVal("colorHighlightBorderInput", s.colorHighlightBorder);
      setVal("colorTagInput", s.colorTag);
      setVal("colorBadgeInput", s.colorBadge);
      setVal("colorCtaInput", s.colorCta);
      setVal("colorHeaderInput", s.colorHeader);
      setVal("colorPatternInput", s.colorPattern);
      setVal("colorCornersInput", s.colorCorners);
      setVal("colorDividersInput", s.colorDividers);
      setVal("gradientPrimaryInput", s.gradientPrimary);
      setVal("gradientSecondaryInput", s.gradientSecondary);
      setVal("gradientDarknessInput", s.gradientDarkness);
      setVal("fontTitleSelect", s.fontTitle || "'Cinzel Decorative', serif");
      setVal("weightTitleSelect", s.weightTitle || "700");
      setVal("fontSubtitleSelect", s.fontSubtitle || "'Cormorant Garamond', serif");
      setVal("styleSubtitleSelect", s.styleSubtitle || "italic 500");
      setVal("fontDescSelect", s.fontDesc || "'Montserrat', sans-serif");
      setVal("weightDescSelect", s.weightDesc || "300");
      setVal("fontHighlightSelect", s.fontHighlight || "'Montserrat', sans-serif");
      setVal("weightHighlightSelect", s.weightHighlight || "600");
      setVal("fontCtaSelect", s.fontCta || "'Cinzel', serif");
      setVal("weightCtaSelect", s.weightCta || "600");
      setVal("fontHeaderSelect", s.fontHeader || "'Cinzel', serif");
      setVal("weightHeaderSelect", s.weightHeader || "600");
      setVal("fontBadgeSelect", s.fontBadge || "'Cinzel', serif");
      setVal("weightBadgeSelect", s.weightBadge || "700");
      setVal("fontTagSelect", s.fontTag || "'Cinzel', serif");
      setVal("weightTagSelect", s.weightTag || "700");
      setVal("sacredPatternSelect", s.sacredPattern || "flowerOfLife");
      setVal("sizeTitleRange", s.sizeTitle || 54);
      const sizeTitleVal = document.getElementById("sizeTitleVal");
      if (sizeTitleVal) sizeTitleVal.textContent = (s.sizeTitle || 54) + "px";
      setVal("spacingTitleRange", s.spacingTitle !== void 0 ? s.spacingTitle : 1);
      const spacingTitleVal = document.getElementById("spacingTitleVal");
      if (spacingTitleVal) spacingTitleVal.textContent = (s.spacingTitle !== void 0 ? s.spacingTitle : 1) + "px";
      setVal("glowTitleRange", s.glowTitle !== void 0 ? s.glowTitle : 0);
      const glowTitleVal = document.getElementById("glowTitleVal");
      if (glowTitleVal) glowTitleVal.textContent = (s.glowTitle !== void 0 ? s.glowTitle : 0) + "px";
      setVal("sizeSubtitleRange", s.sizeSubtitle || 26);
      const sizeSubVal = document.getElementById("sizeSubtitleVal");
      if (sizeSubVal) sizeSubVal.textContent = (s.sizeSubtitle || 26) + "px";
      setVal("spacingSubtitleRange", s.spacingSubtitle !== void 0 ? s.spacingSubtitle : 0);
      const spacingSubVal = document.getElementById("spacingSubtitleVal");
      if (spacingSubVal) spacingSubVal.textContent = (s.spacingSubtitle !== void 0 ? s.spacingSubtitle : 0) + "px";
      setVal("sizeDescRange", s.sizeDesc || 18);
      const sizeDescVal = document.getElementById("sizeDescVal");
      if (sizeDescVal) sizeDescVal.textContent = (s.sizeDesc || 18) + "px";
      setVal("lineHeightDescRange", (s.lineHeightDesc || 1.4) * 10);
      const lhVal = document.getElementById("lineHeightDescVal");
      if (lhVal) lhVal.textContent = (s.lineHeightDesc || 1.4).toFixed(1) + "x";
      setVal("sizeHighlightRange", s.sizeHighlight || 14);
      const sizeHighVal = document.getElementById("sizeHighlightVal");
      if (sizeHighVal) sizeHighVal.textContent = (s.sizeHighlight || 14) + "px";
      setVal("spacingHighlightRange", s.spacingHighlight !== void 0 ? s.spacingHighlight : 1);
      const spacingHighVal = document.getElementById("spacingHighlightVal");
      if (spacingHighVal) spacingHighVal.textContent = (s.spacingHighlight !== void 0 ? s.spacingHighlight : 1) + "px";
      setVal("sizeCtaRange", s.sizeCta || 14);
      const sizeCtaVal = document.getElementById("sizeCtaVal");
      if (sizeCtaVal) sizeCtaVal.textContent = (s.sizeCta || 14) + "px";
      setVal("spacingCtaRange", s.spacingCta !== void 0 ? s.spacingCta : 1);
      const spacingCtaVal = document.getElementById("spacingCtaVal");
      if (spacingCtaVal) spacingCtaVal.textContent = (s.spacingCta !== void 0 ? s.spacingCta : 1) + "px";
      setVal("sizeHeaderRange", s.sizeHeader || 12);
      const sizeHeaderVal = document.getElementById("sizeHeaderVal");
      if (sizeHeaderVal) sizeHeaderVal.textContent = (s.sizeHeader || 12) + "px";
      setVal("spacingHeaderRange", s.spacingHeader !== void 0 ? s.spacingHeader : 2);
      const spacingHeaderVal = document.getElementById("spacingHeaderVal");
      if (spacingHeaderVal) spacingHeaderVal.textContent = (s.spacingHeader !== void 0 ? s.spacingHeader : 2) + "px";
      setVal("sizeBadgeRange", s.sizeBadge || 12);
      const sizeBadgeVal = document.getElementById("sizeBadgeVal");
      if (sizeBadgeVal) sizeBadgeVal.textContent = (s.sizeBadge || 12) + "px";
      setVal("spacingBadgeRange", s.spacingBadge !== void 0 ? s.spacingBadge : 1);
      const spacingBadgeVal = document.getElementById("spacingBadgeVal");
      if (spacingBadgeVal) spacingBadgeVal.textContent = (s.spacingBadge !== void 0 ? s.spacingBadge : 1) + "px";
      setVal("sizeTagRange", s.sizeTag || 14);
      const sizeTagVal = document.getElementById("sizeTagVal");
      if (sizeTagVal) sizeTagVal.textContent = (s.sizeTag || 14) + "px";
      setVal("spacingTagRange", s.spacingTag !== void 0 ? s.spacingTag : 2);
      const spacingTagVal = document.getElementById("spacingTagVal");
      if (spacingTagVal) spacingTagVal.textContent = (s.spacingTag !== void 0 ? s.spacingTag : 2) + "px";
      setVal("paddingTopRange", s.paddingTop !== void 0 ? s.paddingTop : 90);
      const pTopVal = document.getElementById("paddingTopVal");
      if (pTopVal) pTopVal.textContent = (s.paddingTop !== void 0 ? s.paddingTop : 90) + "px";
      setVal("blockGapRange", s.blockGap !== void 0 ? s.blockGap : 20);
      const bgVal = document.getElementById("blockGapVal");
      if (bgVal) bgVal.textContent = (s.blockGap !== void 0 ? s.blockGap : 20) + "px";
      setVal("paddingSideRange", s.paddingSide !== void 0 ? s.paddingSide : 60);
      const pSideVal = document.getElementById("paddingSideVal");
      if (pSideVal) pSideVal.textContent = (s.paddingSide !== void 0 ? s.paddingSide : 60) + "px";
      setVal("globalLineGapRange", s.globalLineGap !== void 0 ? s.globalLineGap : 12);
      const glgVal = document.getElementById("globalLineGapVal");
      if (glgVal) glgVal.textContent = (s.globalLineGap !== void 0 ? s.globalLineGap : 12) + "px";
      setVal("splitRatioRange", Math.round((s.splitRatio !== void 0 ? s.splitRatio : 0.6) * 100));
      const srVal = document.getElementById("splitRatioVal");
      if (srVal) srVal.textContent = Math.round((s.splitRatio !== void 0 ? s.splitRatio : 0.6) * 100) + "%";
      setVal("textZoneHeightRange", Math.round((s.textZoneHeight !== void 0 ? s.textZoneHeight : 0.44) * 100));
      const tzhVal = document.getElementById("textZoneHeightVal");
      if (tzhVal) tzhVal.textContent = Math.round((s.textZoneHeight !== void 0 ? s.textZoneHeight : 0.44) * 100) + "%";
      setVal("cardRadiusRange", s.cardRadius !== void 0 ? s.cardRadius : 18);
      const crVal = document.getElementById("cardRadiusVal");
      if (crVal) crVal.textContent = (s.cardRadius !== void 0 ? s.cardRadius : 18) + "px";
      setVal("gradientIntensityRange", (s.gradientIntensity || 0.88) * 100);
      const giVal = document.getElementById("gradientIntensityVal");
      if (giVal) giVal.textContent = Math.round((s.gradientIntensity || 0.88) * 100) + "%";
      setVal("boxOpacityRange", (s.boxOpacity || 0.95) * 100);
      const boVal = document.getElementById("boxOpacityVal");
      if (boVal) boVal.textContent = Math.round((s.boxOpacity || 0.95) * 100) + "%";
      setVal("patternOpacityRange", (s.patternOpacity !== void 0 ? s.patternOpacity : 0.35) * 100);
      const poVal = document.getElementById("patternOpacityVal");
      if (poVal) poVal.textContent = Math.round((s.patternOpacity !== void 0 ? s.patternOpacity : 0.35) * 100) + "%";
      setVal("bgImageOpacityRange", (s.bgImageOpacity || 0.6) * 100);
      const bgOpVal = document.getElementById("bgImageOpacityVal");
      if (bgOpVal) bgOpVal.textContent = Math.round((s.bgImageOpacity || 0.6) * 100) + "%";
      setVal("imgZoomRange", (s.imgZoom || 1) * 100);
      const zoomVal = document.getElementById("imgZoomVal");
      if (zoomVal) zoomVal.textContent = (s.imgZoom || 1).toFixed(1) + "x";
      setVal("imgPanXRange", s.imgPanX || 0);
      const panXVal = document.getElementById("imgPanXVal");
      if (panXVal) panXVal.textContent = (s.imgPanX || 0) + "px";
      setVal("imgPanYRange", s.imgPanY || 0);
      const panYVal = document.getElementById("imgPanYVal");
      if (panYVal) panYVal.textContent = (s.imgPanY || 0) + "px";
      setCheck("showHeaderCheck", s.showHeader);
      setCheck("showBadgeCheck", s.showBadge);
      setCheck("showCornersCheck", s.showBaroqueCorners);
      setCheck("showHighlightBoxCheck", s.showHighlightBox);
      setCheck("showSafeAreaGuideCheck", s.showSafeAreaGuide);
      setCheck("imgFlipHCheck", s.imgFlipH);
      setCheck("imgFlipVCheck", s.imgFlipV);
      document.querySelectorAll("[data-format]").forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-format") === s.format);
      });
      document.querySelectorAll("[data-layout]").forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-layout") === s.layout);
      });
      document.querySelectorAll("[data-align]").forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-align") === s.align);
      });
      document.querySelectorAll("[data-fit]").forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-fit") === s.fitMode);
      });
      document.querySelectorAll("[data-text-card-style]").forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-text-card-style") === (s.textCardStyle || "card"));
      });
      this.updateGradientLivePreview();
    }
    async exportHTML(filename) {
      const s = this.store.state;
      const cleanTitle = (s.title || "post").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-");
      const actualFilename = filename || `pedaco-do-ceu-${s.format}-${cleanTitle}.html`;
      let imgDataUrl = "";
      try {
        const offscreen = await this.renderer.renderHighRes(2);
        imgDataUrl = offscreen ? offscreen.toDataURL("image/png", 1) : this.renderer.highDPICanvas.getExportDataURL("image/png", 1);
      } catch (e) {
        imgDataUrl = this.renderer.highDPICanvas.getExportDataURL("image/png", 1);
      }
      const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${s.title || "Peda\xE7o do C\xE9u"} | ${s.subtitle || "Artes M\xEDsticas & Sagradas"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Cinzel+Decorative:wght@700&family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-darkness: ${s.gradientDarkness || "#0d0216"};
      --primary: ${s.gradientPrimary || "#2b0042"};
      --secondary: ${s.gradientSecondary || "#581c87"};
      --gold: #f5d77f;
      --gold-dark: #d4af37;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at center, var(--secondary) 0%, var(--primary) 50%, var(--bg-darkness) 100%);
      color: #f8f9fa;
      font-family: 'Montserrat', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px 15px;
    }
    .post-container {
      max-width: 680px;
      width: 100%;
      background: rgba(10, 5, 20, 0.85);
      backdrop-filter: blur(16px);
      border: 1.5px solid var(--gold-dark);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(212, 175, 55, 0.2);
    }
    .post-header {
      padding: 18px 24px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.25);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .post-brand {
      font-family: 'Cinzel', serif;
      font-weight: 700;
      color: var(--gold);
      letter-spacing: 1.5px;
      font-size: 15px;
    }
    .post-badge {
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--gold);
      border: 1px solid var(--gold);
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 600;
    }
    .post-image-wrapper {
      width: 100%;
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid rgba(212, 175, 55, 0.25);
    }
    .post-image-wrapper img {
      width: 100%;
      height: auto;
      display: block;
    }
    .post-content {
      padding: 28px 24px;
    }
    .post-tag {
      font-family: 'Cinzel', serif;
      font-size: 12px;
      letter-spacing: 3px;
      color: var(--gold-dark);
      margin-bottom: 8px;
    }
    .post-title {
      font-family: 'Cinzel Decorative', 'Cinzel', serif;
      font-size: 26px;
      color: #fff;
      text-shadow: 0 0 16px rgba(245, 215, 127, 0.4);
      margin-bottom: 8px;
    }
    .post-subtitle {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 19px;
      color: #eadcb9;
      margin-bottom: 18px;
    }
    .post-desc {
      font-size: 15px;
      line-height: 1.7;
      color: #e2e8f0;
      margin-bottom: 22px;
      white-space: pre-line;
    }
    .post-highlight {
      background: rgba(212, 175, 55, 0.1);
      border-left: 3px solid var(--gold);
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      font-size: 14px;
      color: var(--gold);
      margin-bottom: 24px;
      font-weight: 500;
    }
    .post-cta {
      border-top: 1px dashed rgba(212, 175, 55, 0.3);
      padding-top: 18px;
      font-size: 14px;
      color: var(--gold);
      font-style: italic;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .post-footer {
      padding: 16px 24px;
      background: rgba(5, 2, 10, 0.9);
      border-top: 1px solid rgba(212, 175, 55, 0.2);
      font-size: 12px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn-copy {
      background: var(--gold-dark);
      color: #1a0826;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      letter-spacing: 0.5px;
      transition: opacity 0.2s;
    }
    .btn-copy:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <article class="post-container">
    <header class="post-header">
      <span class="post-brand">\u2726 PEDA\xC7O DO C\xC9U</span>
      ${s.badgeText ? `<span class="post-badge">${s.badgeText}</span>` : ""}
    </header>
    
    <div class="post-image-wrapper">
      <img src="${imgDataUrl}" alt="${s.title || "Criativo Sagrado Peda\xE7o do C\xE9u"}">
    </div>

    <div class="post-content">
      ${s.categoryTag ? `<div class="post-tag">${s.categoryTag}</div>` : ""}
      <h1 class="post-title">${s.title || ""}</h1>
      ${s.subtitle ? `<h2 class="post-subtitle">${s.subtitle}</h2>` : ""}
      <p class="post-desc">${s.description || ""}</p>
      ${s.highlightText ? `<div class="post-highlight">\u2726 ${s.highlightText}</div>` : ""}
      <div class="post-cta">
        <span>\u{1F4CD}</span>
        <span>${s.ctaText || "Visite nosso espa\xE7o sagrado em S\xE3o Lu\xEDs \u2022 Peda\xE7o do C\xE9u"}</span>
      </div>
    </div>

    <footer class="post-footer">
      <span>F\xE1brica de Conte\xFAdo \u2022 S\xE3o Lu\xEDs (MA)</span>
      <button class="btn-copy" onclick="navigator.clipboard.writeText(document.querySelector('.post-desc').innerText).then(() => alert('Texto copiado com sucesso!'))">Copiar Texto</button>
    </footer>
  </article>
</body>
</html>`;
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const link = document.createElement("a");
      link.download = actualFilename;
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
        if (link.parentNode) link.parentNode.removeChild(link);
      }, 1e3);
    }
  };
  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
      window.pedacoStudio = window.studioApp = new PedacoDoCeuStudio();
    });
  }
})();
