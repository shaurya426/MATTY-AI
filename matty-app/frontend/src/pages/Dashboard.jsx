import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, Pencil } from "lucide-react";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";

export default function Dashboard() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadDesigns = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/designs");
      setDesigns(data.designs);
    } catch (err) {
      setError("Couldn't load your designs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDesigns();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this design? This can't be undone.")) return;
    try {
      await api.delete(`/designs/${id}`);
      setDesigns((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert("Couldn't delete this design. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">My Designs</h1>
            <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
              Posters, banners, and social media graphics you've made with Matty.
            </p>
          </div>
          <button
            onClick={() => navigate("/editor/new")}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <Plus size={16} />
            New design
          </button>
        </div>

        {loading && <p className="text-sm text-muted-light dark:text-muted-dark">Loading your designs…</p>}
        {error && <p className="text-sm text-accent">{error}</p>}

        {!loading && designs.length === 0 && (
          <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-light py-16 text-center dark:border-border-dark">
            <p className="font-display text-lg font-semibold">No designs yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-light dark:text-muted-dark">
              Create your first poster, banner, or social post to see it here.
            </p>
            <button
              onClick={() => navigate("/editor/new")}
              className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              <Plus size={16} />
              Start designing
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {designs.map((design) => (
            <div
              key={design._id}
              className="group overflow-hidden rounded-xl border border-border-light bg-surface-light shadow-card transition hover:-translate-y-0.5 dark:border-border-dark dark:bg-surface-dark"
            >
              <Link to={`/editor/${design._id}`}>
                <div className="checkerboard flex aspect-[4/3] items-center justify-center overflow-hidden bg-canvas-light dark:bg-canvas-dark">
                  {design.thumbnailUrl ? (
                    <img
                      src={design.thumbnailUrl}
                      alt={design.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-muted-light dark:text-muted-dark">No preview</span>
                  )}
                </div>
              </Link>
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{design.title}</p>
                  <p className="text-xs text-muted-light dark:text-muted-dark">
                    {new Date(design.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Link
                    to={`/editor/${design._id}`}
                    className="rounded-md p-1.5 text-muted-light hover:bg-canvas-light hover:text-primary dark:text-muted-dark dark:hover:bg-canvas-dark"
                    aria-label="Edit design"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(design._id)}
                    className="rounded-md p-1.5 text-muted-light hover:bg-canvas-light hover:text-accent dark:text-muted-dark dark:hover:bg-canvas-dark"
                    aria-label="Delete design"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
