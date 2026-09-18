import { Menu, Moon, Sun } from 'lucide-react';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ onOpenSidebar }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface/85 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="iconSm"
        className="lg:hidden"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="iconSm"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </Button>

        <div className="flex items-center gap-2.5 border-l border-line pl-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium leading-tight text-ink">Leila Rahimi</p>
            <p className="text-2xs leading-tight text-muted">Finance lead</p>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-iris-500 text-xs font-semibold text-white">
            LR
          </span>
        </div>
      </div>
    </header>
  );
}
