import { useEffect, useRef, useState, useCallback } from "react";
import { fabric } from "fabric";
import {
  Square,
  Circle as CircleIcon,
  Type,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Download,
  Save,
  Trash2,
} from "lucide-react";

const MAX_HISTORY = 50;

export default function CanvasEditor({
  initialData,
  initialTitle = "Untitled design",
  onSave,
  saving,
}) {
  const canvasElRef = useRef(null);
  const fabricRef = useRef(null);
  const fileInputRef = useRef(null);

  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const isRestoringRef = useRef(false);

  const [title, setTitle] = useState(initialTitle);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  // --- Initialize fabric canvas ---
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;

    const pushHistory = () => {
      if (isRestoringRef.current) return;
      const json = JSON.stringify(canvas.toJSON());
      const history = historyRef.current;
      // Drop any "future" states if we've undone and then made a new change
      history.splice(historyIndexRef.current + 1);
      history.push(json);
      if (history.length > MAX_HISTORY) history.shift();
      historyIndexRef.current = history.length - 1;
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(false);
    };

    canvas.on("object:added", pushHistory);
    canvas.on("object:modified", pushHistory);
    canvas.on("object:removed", pushHistory);
    canvas.on("selection:created", () => setHasSelection(true));
    canvas.on("selection:updated", () => setHasSelection(true));
    canvas.on("selection:cleared", () => setHasSelection(false));

    // Load existing design if editing, otherwise seed initial history state
    if (initialData) {
      isRestoringRef.current = true;
      canvas.loadFromJSON(initialData, () => {
        canvas.renderAll();
        historyRef.current = [JSON.stringify(canvas.toJSON())];
        historyIndexRef.current = 0;
        isRestoringRef.current = false;
      });
    } else {
      historyRef.current = [JSON.stringify(canvas.toJSON())];
      historyIndexRef.current = 0;
    }

    return () => canvas.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restoreHistory = useCallback((index) => {
    const canvas = fabricRef.current;
    const state = historyRef.current[index];
    if (!state) return;
    isRestoringRef.current = true;
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
      isRestoringRef.current = false;
    });
  }, []);

  const handleUndo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    restoreHistory(historyIndexRef.current);
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
  };

  const handleRedo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    restoreHistory(historyIndexRef.current);
    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  // --- Toolbar actions ---
  const addRectangle = () => {
    const rect = new fabric.Rect({
      left: 150,
      top: 150,
      width: 160,
      height: 100,
      fill: "#5B47E0",
      rx: 8,
      ry: 8,
    });
    fabricRef.current.add(rect).setActiveObject(rect);
  };

  const addCircle = () => {
    const circle = new fabric.Circle({
      left: 200,
      top: 200,
      radius: 60,
      fill: "#FF6B4A",
    });
    fabricRef.current.add(circle).setActiveObject(circle);
  };

  const addText = () => {
    const text = new fabric.IText("Double-click to edit", {
      left: 180,
      top: 180,
      fontFamily: "Inter, sans-serif",
      fontSize: 28,
      fill: "#1A1D23",
    });
    fabricRef.current.add(text).setActiveObject(text);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        img.scaleToWidth(300);
        img.set({ left: 100, top: 100 });
        fabricRef.current.add(img).setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // allow re-uploading the same file
  };

  const deleteSelection = () => {
    const canvas = fabricRef.current;
    const active = canvas.getActiveObjects();
    active.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  const exportPNG = () => {
    const canvas = fabricRef.current;
    const dataUrl = canvas.toDataURL({ format: "png", quality: 1, multiplier: 2 });
    const link = document.createElement("a");
    link.download = `${title || "matty-design"}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleSave = () => {
    const canvas = fabricRef.current;
    const jsonData = canvas.toJSON();
    const thumbnailUrl = canvas.toDataURL({ format: "png", quality: 0.6, multiplier: 0.3 });
    onSave?.({ title, jsonData, thumbnailUrl, width: canvas.width, height: canvas.height });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border-light bg-surface-light px-4 py-3 dark:border-border-dark dark:bg-surface-dark">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled design"
          className="w-48 rounded-lg border border-border-light bg-canvas-light px-3 py-1.5 text-sm font-medium outline-none focus:border-primary dark:border-border-dark dark:bg-canvas-dark"
        />

        <div className="mx-2 h-6 w-px bg-border-light dark:bg-border-dark" />

        <ToolButton icon={Square} label="Rectangle" onClick={addRectangle} />
        <ToolButton icon={CircleIcon} label="Circle" onClick={addCircle} />
        <ToolButton icon={Type} label="Text" onClick={addText} />
        <ToolButton icon={ImageIcon} label="Image" onClick={() => fileInputRef.current.click()} />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <ToolButton
          icon={Trash2}
          label="Delete"
          onClick={deleteSelection}
          disabled={!hasSelection}
        />

        <div className="mx-2 h-6 w-px bg-border-light dark:bg-border-dark" />

        <ToolButton icon={Undo2} label="Undo" onClick={handleUndo} disabled={!canUndo} />
        <ToolButton icon={Redo2} label="Redo" onClick={handleRedo} disabled={!canRedo} />

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={exportPNG}
            className="flex items-center gap-1.5 rounded-lg border border-border-light px-3 py-1.5 text-sm font-medium hover:bg-canvas-light dark:border-border-dark dark:hover:bg-canvas-dark"
          >
            <Download size={16} />
            Export PNG
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving…" : "Save design"}
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="checkerboard flex flex-1 items-center justify-center overflow-auto bg-canvas-light p-8 dark:bg-canvas-dark">
        <div className="rounded-lg shadow-card">
          <canvas ref={canvasElRef} />
        </div>
      </div>
    </div>
  );
}

function ToolButton({ icon: Icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-light hover:bg-canvas-light disabled:cursor-not-allowed disabled:opacity-40 dark:text-ink-dark dark:hover:bg-canvas-dark"
    >
      <Icon size={17} />
    </button>
  );
}
