// components/shopping-panel.tsx
import { useState } from 'react';
import { type Meal } from '../menu-data';

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
      <path d="M2 6l3 3 5-5" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

interface ShoppingPanelProps {
  selectedMeals: Meal[];
  onClear: () => void;
}

export function ShoppingPanel({ selectedMeals, onClear }: ShoppingPanelProps) {
  const [open, setOpen] = useState(false);
  const [bought, setBought] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const ingredients = (() => {
    const map = new Map<string, string>();
    selectedMeals.forEach((m) => m.ingredients.forEach((i) => map.set(i.cn, i.fr)));
    return Array.from(map.entries()).map(([cn, fr]) => ({ cn, fr }));
  })();

  const remaining = ingredients.filter((i) => !bought.has(i.cn)).length;

  function toggleBought(cn: string) {
    setBought((prev) => {
      const next = new Set(prev);
      next.has(cn) ? next.delete(cn) : next.add(cn);
      return next;
    });
  }

  function handleCopy() {
    const lines = [
      '本周购物清单',
      '',
      ...ingredients.map((i) => `· ${i.cn}  ${i.fr}`),
      '',
      `共 ${ingredients.length} 种食材 · ${selectedMeals.length} 道菜`,
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleClear() {
    setOpen(false);
    setBought(new Set());
    onClear();
  }

  if (selectedMeals.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 px-4">
      {/* expanded panel */}
      <div
        className={`overflow-hidden rounded-[24px] border border-[#e6d8c4] bg-[#faf4ea]/97 shadow-[0_8px_32px_rgba(123,99,77,0.14)] backdrop-blur-sm transition-all duration-500 ease-out ${
          open ? 'mb-2 max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 pt-4">
          {/* panel header */}
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p
                className="text-[1rem] font-semibold text-stone-800"
                style={{ fontFamily: 'Baskerville, Georgia, serif' }}
              >
                食材清单
              </p>
              <p className="mt-0.5 text-[0.78rem] italic text-[#8fa08a]"
                style={{ fontFamily: 'Baskerville, Georgia, serif' }}>
                {remaining > 0 ? `还剩 ${remaining} 种未买` : '全部买齐了 ✓'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-full border border-[#d8c9b5] px-3 py-1.5 text-[0.78rem] text-stone-500 transition-colors hover:border-[#8b6e4e] hover:text-[#8b6e4e]"
              >
                <CopyIcon />
                {copied ? '已复制' : '复制'}
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 rounded-full border border-[#d8c9b5] px-3 py-1.5 text-[0.78rem] text-stone-400 transition-colors hover:border-red-300 hover:text-red-400"
              >
                <CloseIcon />
                清空
              </button>
            </div>
          </div>

          {/* selected meals */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {selectedMeals.map((m) => (
              <span
                key={m.nameCn}
                className="rounded-full bg-[#f0e8db] px-2.5 py-0.5 text-[0.75rem] text-stone-600"
              >
                {m.nameCn}
              </span>
            ))}
          </div>

          <div className="h-px bg-[#eadfce]" />

          {/* ingredient list */}
          <div className="mt-3 max-h-[220px] overflow-y-auto pr-1">
            {ingredients.map((ing) => {
              const done = bought.has(ing.cn);
              return (
                <button
                  key={ing.cn}
                  onClick={() => toggleBought(ing.cn)}
                  className="flex w-full items-center gap-3 border-b border-[#eadfce]/80 py-2 text-left last:border-b-0 hover:opacity-80"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                      done
                        ? 'border-[#8b6e4e] bg-[#8b6e4e] text-white'
                        : 'border-[#d8c9b5] text-transparent'
                    }`}
                  >
                    <CheckIcon />
                  </span>
                  <span
                    className={`flex-1 text-[0.9rem] transition-colors ${
                      done ? 'text-[#c0b09a] line-through' : 'text-stone-700'
                    }`}
                  >
                    {ing.cn}
                  </span>
                  <span
                    className="text-[0.8rem] italic text-[#a89880]"
                    style={{ fontFamily: 'Baskerville, Georgia, serif' }}
                  >
                    {ing.fr}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* floating bar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-[20px] border border-[#d8c4a8] bg-[#8b6e4e] px-5 py-3.5 shadow-[0_4px_20px_rgba(123,99,77,0.22)] transition-all duration-200 hover:bg-[#7a5f42] active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[0.8rem] font-semibold text-white">
            {selectedMeals.length}
          </span>
          <div className="text-left">
            <p className="text-[0.9rem] font-semibold leading-tight text-white"
               style={{ fontFamily: 'Baskerville, Georgia, serif' }}>
              查看食材清单
            </p>
            <p className="text-[0.72rem] text-white/70">
              {ingredients.length} 种食材
              {remaining < ingredients.length ? ` · 已买 ${ingredients.length - remaining}` : ''}
            </p>
          </div>
        </div>
        <span className="text-white/80">
          <ChevronIcon open={open} />
        </span>
      </button>
    </div>
  );
}