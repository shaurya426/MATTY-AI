import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, LayoutGrid } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-border-light bg-surface-light/90 backdrop-blur dark:border-border-dark dark:bg-surface-dark/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-display font-bold text-white">
            M
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Matty</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-light hover:bg-canvas-light hover:text-ink-light dark:text-muted-dark dark:hover:bg-canvas-dark dark:hover:text-ink-dark sm:flex"
          >
            <LayoutGrid size={16} />
            My Designs
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="rounded-lg p-2 text-muted-light hover:bg-canvas-light hover:text-ink-light dark:text-muted-dark dark:hover:bg-canvas-dark dark:hover:text-ink-dark"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user && (
            <div className="flex items-center gap-2 pl-2">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-tight">{user.username}</p>
                <p className="text-xs leading-tight text-muted-light dark:text-muted-dark">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                aria-label="Log out"
                className="rounded-lg p-2 text-muted-light hover:bg-canvas-light hover:text-accent dark:text-muted-dark dark:hover:bg-canvas-dark"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
