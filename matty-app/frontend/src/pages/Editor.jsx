import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../api/axios.js";
import CanvasEditor from "../components/CanvasEditor.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { Moon, Sun } from "lucide-react";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isNew = id === "new";

  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/designs/${id}`)
      .then(({ data }) => setDesign(data.design))
      .catch(() => setNotice("Couldn't load this design."))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSave = async (payload) => {
    setSaving(true);
    setNotice("");
    try {
      if (isNew || !design) {
        const { data } = await api.post("/designs", payload);
        setDesign(data.design);
        setNotice("Design saved.");
        navigate(`/editor/${data.design._id}`, { replace: true });
      } else {
        const { data } = await api.put(`/designs/${design._id}`, payload);
        setDesign(data.design);
        setNotice("Design saved.");
      }
    } catch (err) {
      setNotice(err.response?.data?.message || "Couldn't save your design. Please try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setNotice(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas-light dark:bg-canvas-dark">
        <p className="text-sm text-muted-light dark:text-muted-dark">Loading design…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-canvas-light dark:bg-canvas-dark">
      <div className="flex items-center justify-between border-b border-border-light bg-surface-light px-4 py-2 dark:border-border-dark dark:bg-surface-dark">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-light hover:bg-canvas-light hover:text-ink-light dark:text-muted-dark dark:hover:bg-canvas-dark dark:hover:text-ink-dark"
        >
          <ArrowLeft size={16} />
          My Designs
        </button>

        <div className="flex items-center gap-3">
          {notice && <span className="text-xs text-muted-light dark:text-muted-dark">{notice}</span>}
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="rounded-lg p-2 text-muted-light hover:bg-canvas-light dark:text-muted-dark dark:hover:bg-canvas-dark"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <CanvasEditor
          initialData={design?.jsonData}
          initialTitle={design?.title || "Untitled design"}
          onSave={handleSave}
          saving={saving}
        />
      </div>
    </div>
  );
}
