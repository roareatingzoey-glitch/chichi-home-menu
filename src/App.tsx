import { useMemo, useState, useEffect } from 'react';
import { menuData, type Meal, type Ingredient } from './menu-data';
import { useShoppingCart } from './hooks/use-shopping-cart';
import { ShoppingPanel } from './components/shopping-panel';

// ─── validation ───────────────────────────────────────────────────────────────
function validateMealsData(items: Meal[]) {
  if (!Array.isArray(items) || items.length === 0)
    throw new Error('Meals data must be a non-empty array.');
  items.forEach((meal) => {
    if (!meal.nameCn || !meal.nameFr || !meal.categoryCn || !meal.categoryFr || !Array.isArray(meal.ingredients))
      throw new Error('Each meal must include names, categories, and ingredients.');
    if (meal.ingredients.length === 0)
      throw new Error(`Meal ${meal.nameCn} must include at least one ingredient.`);
    meal.ingredients.forEach((i) => {
      if (!i.cn || !i.fr) throw new Error(`Meal ${meal.nameCn} has an invalid ingredient entry.`);
    });
  });
}
function getCategories(items: Meal[]) {
  return Array.from(new Set(items.map((m) => m.categoryCn)));
}
function getMealsByCategory(items: Meal[], categories: string[]) {
  return categories.map((categoryCn) => {
    const filtered = items.filter((m) => m.categoryCn === categoryCn);
    return { categoryCn, categoryFr: filtered[0]?.categoryFr || '', items: filtered };
  });
}
function runSanityChecks() {
  validateMealsData(menuData);
  const categories = getCategories(menuData);
  if (categories.length === 0) throw new Error('Categories cannot be empty.');
  if (categories[0] !== '汤') throw new Error('The soup section must remain first.');
}
runSanityChecks();

// ─── season utils ─────────────────────────────────────────────────────────────
function getCurrentSeason(): '春' | '夏' | '秋' | '冬' {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return '春';
  if (m >= 6 && m <= 8) return '夏';
  if (m >= 9 && m <= 11) return '秋';
  return '冬';
}
const SEASON_FR: Record<string, string> = { 春: 'Printemps', 夏: 'Été', 秋: 'Automne', 冬: 'Hiver' };

// ─── daily suggestion ─────────────────────────────────────────────────────────
function getDailySuggestion(): { soup: Meal | null; main: Meal | null; veg: Meal | null } {
  const seed = new Date().toDateString();
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h * 31 + seed.charCodeAt(i), 2654435761) >>> 0;
  const pick = (arr: Meal[], salt: number): Meal | null => {
    if (arr.length === 0) return null;
    const idx = Math.abs((h + salt * 1234567) % arr.length);
    return arr[idx] ?? null;
  };
  const season = getCurrentSeason();
  const inSeason = (m: Meal) => !m.seasons || m.seasons.length === 0 || m.seasons.includes(season);
  const soupsAll = menuData.filter((m) => m.categoryCn === '汤');
  const vegsAll  = menuData.filter((m) => m.categoryCn === '蔬菜');
  const mainsAll = menuData.filter((m) => !['汤', '蔬菜', '甜品', '饮品', '氛围料理'].includes(m.categoryCn));
  const soups = soupsAll.filter(inSeason).length >= 1 ? soupsAll.filter(inSeason) : soupsAll;
  const mains = mainsAll.filter(inSeason).length >= 1 ? mainsAll.filter(inSeason) : mainsAll;
  const vegs  = vegsAll.filter(inSeason).length  >= 1 ? vegsAll.filter(inSeason)  : vegsAll;
  return { soup: pick(soups, 0), main: pick(mains, 1), veg: pick(vegs, 2) };
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
const STORAGE_KEY = 'home-menu-identity';
interface Identity {
  tableName: string;
  slogan: string;
  sloganFr: string;
  subtitle: string;
}
const DEFAULT_IDENTITY: Identity = {
  tableName: 'Notre Table',
  slogan: '吃好活好',
  sloganFr: 'Bien manger, bien vivre',
  subtitle: 'for two, at home',
};
function loadIdentity(): Identity | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Identity;
  } catch {
    return null;
  }
}
function saveIdentity(id: Identity) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(id));
}

// ─── OnboardingScreen ─────────────────────────────────────────────────────────
function OnboardingScreen({ onDone }: { onDone: (id: Identity) => void }) {
  const [tableName, setTableName] = useState('');
  const [slogan, setSlogan]       = useState('');
  const [sloganFr, setSloganFr]   = useState('');
  const [subtitle, setSubtitle]   = useState('');

  function handleSubmit() {
    const id: Identity = {
      tableName: tableName.trim() || DEFAULT_IDENTITY.tableName,
      slogan:    slogan.trim()    || DEFAULT_IDENTITY.slogan,
      sloganFr:  sloganFr.trim()  || DEFAULT_IDENTITY.sloganFr,
      subtitle:  subtitle.trim()  || DEFAULT_IDENTITY.subtitle,
    };
    saveIdentity(id);
    onDone(id);
  }

  const inputClass = 'w-full rounded-[12px] border border-[#e2d4be] bg-[#faf4ea]/70 px-4 py-2.5 text-[0.9rem] text-stone-700 placeholder-[#c8b8a4] outline-none transition-all focus:border-[#c8a882] focus:bg-[#faf4ea]';
  const labelClass = 'mb-1 block text-[0.72rem] uppercase tracking-[0.18em] text-stone-400';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3eadf] px-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-[#e6d8c4] bg-[#f4e9dc] px-8 py-10 shadow-[0_18px_60px_rgba(123,99,77,0.08)]">

        {/* decorative corners */}
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.25"
          className="pointer-events-none absolute -left-6 -top-6 h-32 w-32 text-[#d8c7b2] opacity-60">
          <path d="M29 171c18-8 35-26 48-52 8-15 14-34 20-56" />
          <path d="M94 64c-13 2-24 12-29 25 14 1 25-5 32-16" />
          <path d="M111 41c-9 8-14 18-15 30 13-2 22-10 27-23" />
        </svg>
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.25"
          className="pointer-events-none absolute -bottom-6 -right-4 h-32 w-32 rotate-180 text-[#d8c7b2] opacity-50">
          <path d="M29 171c18-8 35-26 48-52 8-15 14-34 20-56" />
          <path d="M94 64c-13 2-24 12-29 25 14 1 25-5 32-16" />
        </svg>

        <div className="relative">
          {/* header */}
          <p className="mb-2 text-[11px] uppercase tracking-[0.32em] text-stone-400">
            Bienvenue
          </p>
          <h1 className="text-2xl font-semibold text-stone-800"
            style={{ fontFamily: 'Baskerville, Georgia, Times New Roman, serif' }}>
            定制你们的菜单
          </h1>
          <p className="mt-1 text-[0.88rem] italic text-[#8fa08a]"
            style={{ fontFamily: 'Baskerville, Georgia, Times New Roman, serif' }}>
            Personnalisez votre menu
          </p>

          <div className="my-6 h-px bg-[#e2d4be]" />

          {/* fields */}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>你们的桌子叫什么</label>
              <input value={tableName} onChange={(e) => setTableName(e.target.value)}
                placeholder="给你们的餐桌起个名字"
                className={inputClass}
                style={{ fontFamily: 'Baskerville, Georgia, serif' }} />
            </div>
            <div>
              <label className={labelClass}>一句中文 slogan（可留空）</label>
              <input value={slogan} onChange={(e) => setSlogan(e.target.value)}
                placeholder="例：吃好活好"
                className={inputClass}
                style={{ fontFamily: 'Baskerville, Georgia, serif' }} />
            </div>
            <div>
              <label className={labelClass}>法语版 slogan（可留空）</label>
              <input value={sloganFr} onChange={(e) => setSloganFr(e.target.value)}
                placeholder="例：Bien manger, bien vivre"
                className={inputClass}
                style={{ fontFamily: 'Baskerville, Georgia, serif', fontStyle: 'italic' }} />
            </div>
            <div>
              <label className={labelClass}>一行小描述（可留空）</label>
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
                placeholder="例：for two, at home"
                className={inputClass}
                style={{ fontFamily: 'Baskerville, Georgia, serif' }} />
            </div>
          </div>

          <div className="my-6 h-px bg-[#e2d4be]" />

          <button onClick={handleSubmit}
            className="w-full rounded-[14px] bg-[#8b6e4e] py-3 text-[0.92rem] font-medium tracking-wide text-white transition-colors hover:bg-[#7a5f42] active:scale-[0.98]"
            style={{ fontFamily: 'Baskerville, Georgia, serif' }}>
            进入菜单 →
          </button>

          <p className="mt-3 text-center text-[0.68rem] text-stone-400"
            style={{ fontFamily: 'Baskerville, Georgia, serif', fontStyle: 'italic' }}>
            信息仅存在你的浏览器里，不会上传到任何服务器
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── decorative SVG components (unchanged) ────────────────────────────────────
function GrainOverlay({ opacity = '0.08' }: { opacity?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0" style={{
      opacity,
      backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"160\\" height=\\"160\\" viewBox=\\"0 0 160 160\\"><filter id=\\"n\\"><feTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.85\\" numOctaves=\\"2\\" stitchTiles=\\"stitch\\"/></filter><rect width=\\"160\\" height=\\"160\\" filter=\\"url(%23n)\\" opacity=\\"0.65\\"/></svg>")',
    }} />
  );
}
function BotanicalCorner({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.25"
      className={`pointer-events-none absolute text-[#d8c7b2] ${className}`}>
      <path d="M29 171c18-8 35-26 48-52 8-15 14-34 20-56" />
      <path d="M94 64c-13 2-24 12-29 25 14 1 25-5 32-16" />
      <path d="M111 41c-9 8-14 18-15 30 13-2 22-10 27-23" />
      <path d="M79 101c-13 0-23 6-31 17 14 3 26-1 35-10" />
      <path d="M62 137c-11 1-21 7-28 16 13 2 23-1 31-8" />
      <path d="M118 88c11 2 21 9 28 20-12 2-24-2-33-12" />
      <path d="M132 122c10 2 20 8 28 18-11 2-22-1-31-10" />
      <path d="M134 154c8 1 17 5 24 12-10 2-18 0-25-6" />
      <circle cx="101" cy="60" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function FoodDoodle({ className = '', variant = 'mix' }: { className?: string; variant?: string }) {
  if (variant === 'dumpling') return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2"
      className={`pointer-events-none absolute text-[#dccbb7] ${className}`}>
      <path d="M40 120c30-40 90-40 120 0" /><path d="M60 120c10-15 70-15 80 0" /><path d="M70 110c5-8 55-8 60 0" />
    </svg>
  );
  if (variant === 'leaf') return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2"
      className={`pointer-events-none absolute text-[#d8c7b2] ${className}`}>
      <path d="M40 150c60-80 120-80 140-140" /><path d="M60 140c40-50 80-50 110-110" /><path d="M80 130c30-35 60-35 90-90" />
    </svg>
  );
  if (variant === 'coffee') return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2"
      className={`pointer-events-none absolute text-[#e2d3c2] ${className}`}>
      <ellipse cx="100" cy="120" rx="40" ry="20" /><path d="M60 120c0 30 80 30 80 0" />
      <path d="M140 110c10 0 20 5 20 15s-10 15-20 15" />
      <path d="M90 70c5-10 10-10 15 0" /><path d="M105 65c5-10 10-10 15 0" />
    </svg>
  );
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.1"
      className={`pointer-events-none absolute text-[#e7d9c7] ${className}`}>
      <path d="M40 140c20-30 40-60 70-90" /><ellipse cx="120" cy="70" rx="18" ry="10" />
      <path d="M60 120c10-10 20-15 35-20" /><path d="M100 120c12-8 25-10 40-8" />
      <circle cx="80" cy="90" r="4" /><circle cx="140" cy="100" r="3" />
    </svg>
  );
}
function BackgroundSprig({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 80" fill="none" stroke="currentColor" strokeWidth="1.1"
      className={`pointer-events-none absolute text-[#e4d7c7] ${className}`}>
      <path d="M14 58c26-3 52-16 78-40" />
      <path d="M52 39c-10 0-19 5-25 12 11 2 20 0 28-5" />
      <path d="M77 24c-9 1-17 6-23 13 11 1 20-1 28-7" />
      <path d="M104 16c-10 1-18 7-24 14 11 1 21-2 29-8" />
      <path d="M89 46c10 0 18 4 24 11-11 2-20 1-28-4" />
      <path d="M117 34c10 0 18 4 24 11-11 2-20 1-28-4" />
      <path d="M145 26c10 0 18 4 24 11-11 2-20 1-28-4" />
    </svg>
  );
}
function LineIcon({ type }: { type?: string }) {
  const c = 'h-5 w-5 text-[#7f8f7a]';
  if (type === 'pot') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={c}><path d="M7 10h10a2 2 0 0 1 2 2v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-3a2 2 0 0 1 2-2Z"/><path d="M9 10V8a3 3 0 0 1 6 0v2"/><path d="M3 13h2"/><path d="M19 13h2"/><path d="M9 4c0 1-.8 1.4-.8 2.4"/><path d="M12 4c0 1-.8 1.4-.8 2.4"/><path d="M15 4c0 1-.8 1.4-.8 2.4"/></svg>;
  if (type === 'plate') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={c}><ellipse cx="12" cy="13" rx="8" ry="5"/><ellipse cx="12" cy="13" rx="4.5" ry="2.4"/><path d="M5 17.2c1.7 1.2 4.3 1.8 7 1.8s5.3-.6 7-1.8"/></svg>;
  if (type === 'pan') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={c}><path d="M5 13a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1H5v-1Z"/><path d="M18 12h2.5a1.5 1.5 0 0 1 0 3H18"/><path d="M7 17h9"/></svg>;
  if (type === 'bowl') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={c}><path d="M4 11h16a8 8 0 0 1-16 0Z"/><path d="M8 16h8"/><path d="M9 8c0-1 .8-1.3.8-2.3"/><path d="M12 8c0-1 .8-1.3.8-2.3"/><path d="M15 8c0-1 .8-1.3.8-2.3"/></svg>;
  if (type === 'egg') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={c}><path d="M12 4c-2.8 0-5 4.2-5 8.2A5 5 0 0 0 12 17a5 5 0 0 0 5-4.8C17 8.2 14.8 4 12 4Z"/></svg>;
  if (type === 'broccoli') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={c}><circle cx="9" cy="9" r="3"/><circle cx="13" cy="9" r="3"/><circle cx="11" cy="6" r="3"/><path d="M11 12v5"/></svg>;
  if (type === 'veg-mix') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={c}><ellipse cx="12" cy="14" rx="7" ry="4"/><path d="M8 11c1-1 2-1 3 0"/><path d="M13 10c1-1 2-1 3 0"/></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={c}><path d="M12 19c4.5-2.8 6.5-6 6.5-9a3.5 3.5 0 0 0-6.2-2.1A3.5 3.5 0 0 0 6 10c0 3 2 6.2 6 9Z"/><path d="M12 8c-1.6 1.2-2.5 2.5-2.5 4"/></svg>;
}
function SectionDivider() {
  return (
    <div className="flex items-center gap-4 text-[#d8c9b5]">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ddd0be] to-[#e9decd]" />
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-4 w-4 text-[#ccb9a1]">
        <path d="M12 5.5c2 2.2 4.5 3.9 6.5 5.1-2 1.3-4.5 3-6.5 5.4-2-2.4-4.5-4.1-6.5-5.4 2-1.2 4.5-2.9 6.5-5.1Z" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#ddd0be] to-[#e9decd]" />
    </div>
  );
}
function IngredientNote({ ingredients, alignRight = false }: { ingredients: Ingredient[]; alignRight?: boolean }) {
  return (
    <div className={`relative mt-3 max-w-[420px] rounded-[18px] bg-[#f6efe3]/95 px-4 py-3 shadow-[0_10px_28px_rgba(123,99,77,0.05)] transition-all duration-500 ease-out ${
      alignRight ? 'ml-auto mr-3 rotate-[0.55deg]' : 'ml-16 md:ml-24 -rotate-[0.6deg]'
    }`}>
      <GrainOverlay opacity="0.09" />
      <BackgroundSprig className={`${alignRight ? 'left-0' : '-right-2'} top-0 h-12 w-28 opacity-50`} />
      <div className="relative space-y-1.5 text-[0.94rem] leading-6 text-stone-600">
        {ingredients.map((ing, index) => (
          <div key={`${ing.cn}-${index}`}
            className={`flex items-baseline justify-between gap-5 ${index % 2 === 0 ? 'translate-x-[1px]' : '-translate-x-[1px]'}`}>
            <span>{ing.cn}</span>
            <span className="text-right italic text-[#8fa08a]">{ing.fr}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function SeasonBadge({ seasons }: { seasons?: string[] }) {
  const current = getCurrentSeason();
  if (!seasons || seasons.length === 0) return null;
  const isCurrent = seasons.includes(current);
  return (
    <span className={`ml-2 inline-block rounded-full px-1.5 py-px text-[0.65rem] leading-none tracking-wide ${
      isCurrent ? 'bg-[#e8f0e4] text-[#5a7a52]' : 'bg-[#f0eae0] text-[#b8a990] opacity-60'
    }`} style={{ fontFamily: 'Baskerville, Georgia, serif', fontStyle: 'italic' }}>
      {seasons[0]}
    </span>
  );
}
function DailySuggestion({ onToggleMeal, selectedMeals }: { onToggleMeal: (n: string) => void; selectedMeals: Set<string> }) {
  const { soup, main, veg } = useMemo(() => getDailySuggestion(), []);
  const season = getCurrentSeason();
  const suggestions = [
    { role: '汤', meal: soup },
    { role: '主菜', meal: main },
    { role: '蔬菜', meal: veg },
  ].filter((s): s is { role: string; meal: Meal } => s.meal !== null);
  if (suggestions.length === 0) return null;
  return (
    <div className="relative mb-6 overflow-hidden rounded-[22px] border border-[#e2d4be] bg-[#f9f3e8]/80 px-5 py-4">
      <GrainOverlay opacity="0.05" />
      <BackgroundSprig className="right-2 top-0 h-14 w-40 opacity-20" />
      <div className="relative">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-stone-400"
            style={{ fontFamily: 'Baskerville, Georgia, serif' }}>今日推荐</p>
          <p className="text-[0.72rem] italic text-[#8fa08a]"
            style={{ fontFamily: 'Baskerville, Georgia, serif' }}>
            {season}季时令 · {SEASON_FR[season]}
          </p>
        </div>
        <div className="space-y-2">
          {suggestions.map(({ role, meal }) => {
            const checked = selectedMeals.has(meal.nameCn);
            return (
              <button key={meal.nameCn} onClick={() => onToggleMeal(meal.nameCn)}
                className="flex w-full items-center gap-3 text-left transition-opacity hover:opacity-80">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                  checked ? 'border-[#8b6e4e] bg-[#8b6e4e] text-white' : 'border-[#d8c9b5] text-[#b8a990]'
                }`}>
                  {checked
                    ? <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><path d="M2 6l3 3 5-5" /></svg>
                    : <span className="text-[0.65rem]" style={{ fontFamily: 'Baskerville, Georgia, serif', fontStyle: 'italic' }}>+</span>
                  }
                </span>
                <span className="w-8 shrink-0 text-[0.7rem] text-[#b8a990]"
                  style={{ fontFamily: 'Baskerville, Georgia, serif', fontStyle: 'italic' }}>{role}</span>
                <span className="flex-1 text-[0.88rem] text-stone-700"
                  style={{ fontFamily: 'Baskerville, Georgia, serif' }}>{meal.nameCn}</span>
                <span className="text-[0.75rem] italic text-[#8fa08a]"
                  style={{ fontFamily: 'Baskerville, Georgia, serif' }}>{meal.nameFr}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[0.68rem] text-stone-400"
          style={{ fontFamily: 'Baskerville, Georgia, serif', fontStyle: 'italic' }}>
          每天自动更新 · 点击 + 加入购物清单
        </p>
      </div>
    </div>
  );
}
function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative mb-5">
      <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-[#c0b09a]">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="搜索菜名或食材，例如：鸡蛋、豆腐…"
        className="w-full rounded-[14px] border border-[#e2d4be] bg-[#faf4ea]/70 py-2.5 pl-9 pr-9 text-[0.9rem] text-stone-700 placeholder-[#c8b8a4] outline-none transition-all focus:border-[#c8a882] focus:bg-[#faf4ea]"
        style={{ fontFamily: 'Baskerville, Georgia, serif' }} />
      {value && (
        <button onClick={() => onChange('')}
          className="absolute inset-y-0 right-3 flex items-center text-[#c0b09a] hover:text-stone-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
function SearchResults({
  query, selectedMeals, onToggleMeal, expandedMealName, onExpand, onCollapse,
}: {
  query: string; selectedMeals: Set<string>; onToggleMeal: (n: string) => void;
  expandedMealName: string | null; onExpand: (n: string) => void; onCollapse: (n: string) => void;
}) {
  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return [];
    return menuData.filter((m) =>
      m.nameCn.toLowerCase().includes(q) ||
      m.nameFr.toLowerCase().includes(q) ||
      m.categoryCn.includes(q) ||
      m.ingredients.some((i) => i.cn.toLowerCase().includes(q) || i.fr.toLowerCase().includes(q))
    );
  }, [q]);
  const byIngredient = useMemo(() => {
    if (!q) return new Set<string>();
    return new Set(results
      .filter((m) => !m.nameCn.toLowerCase().includes(q) && !m.nameFr.toLowerCase().includes(q) && !m.categoryCn.includes(q))
      .map((m) => m.nameCn)
    );
  }, [q, results]);
  if (!q) return null;
  return (
    <div className="mb-6 overflow-hidden rounded-[22px] border border-[#e2d4be] bg-[#faf4ea]/80">
      <GrainOverlay opacity="0.04" />
      <div className="relative px-5 py-4">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-stone-400"
            style={{ fontFamily: 'Baskerville, Georgia, serif' }}>
            {results.length > 0 ? `找到 ${results.length} 道菜` : '没有找到相关菜品'}
          </p>
          {byIngredient.size > 0 && results.length > 0 && (
            <p className="text-[0.68rem] italic text-[#b8a990]"
              style={{ fontFamily: 'Baskerville, Georgia, serif' }}>
              含食材「{query.trim()}」的菜
            </p>
          )}
        </div>
        {results.map((meal, index) => {
          const isIngMatch = byIngredient.has(meal.nameCn);
          const matchedIngs = meal.ingredients.filter(
            (i) => i.cn.toLowerCase().includes(q) || i.fr.toLowerCase().includes(q)
          );
          return (
            <div key={meal.nameCn}
              className="group border-b border-[#eadfce]/70 py-3 last:border-b-0"
              onMouseEnter={() => onExpand(meal.nameCn)}
              onMouseLeave={() => onCollapse(meal.nameCn)}>
              <div className="flex items-start gap-3">
                <button onClick={() => onToggleMeal(meal.nameCn)}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                    selectedMeals.has(meal.nameCn)
                      ? 'border-[#8b6e4e] bg-[#8b6e4e] text-white'
                      : 'border-[#d8c9b5] text-transparent hover:border-[#8b6e4e]'
                  }`}>
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-[0.92rem] text-stone-800"
                      style={{ fontFamily: 'Baskerville, Georgia, serif' }}>{meal.nameCn}</span>
                    <span className="text-[0.75rem] italic text-[#8fa08a]"
                      style={{ fontFamily: 'Baskerville, Georgia, serif' }}>{meal.nameFr}</span>
                    <span className="ml-auto text-[0.7rem] text-[#b8a990]"
                      style={{ fontFamily: 'Baskerville, Georgia, serif', fontStyle: 'italic' }}>{meal.categoryCn}</span>
                  </div>
                  {isIngMatch && matchedIngs.length > 0 && (
                    <p className="mt-0.5 text-[0.72rem] text-[#8fa08a]"
                      style={{ fontFamily: 'Baskerville, Georgia, serif', fontStyle: 'italic' }}>
                      含：{matchedIngs.map((i) => i.cn).join('、')}
                    </p>
                  )}
                </div>
              </div>
              <div className={`overflow-hidden transition-all duration-500 ease-out ${
                expandedMealName === meal.nameCn ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <IngredientNote ingredients={meal.ingredients} alignRight={index % 2 === 1} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function MealRow({
  meal, isExpanded, onExpand, onCollapse, rowIndex, isSelected, onToggle,
}: {
  meal: Meal; isExpanded: boolean; onExpand: () => void; onCollapse: () => void;
  rowIndex: number; isSelected: boolean; onToggle: () => void;
}) {
  const rowOffset = rowIndex % 2 === 0 ? 'translate-x-[1px]' : '-translate-x-[1px]';
  const alignRight = rowIndex % 3 === 1;
  return (
    <div className="group relative border-b border-[#eadfce]/90 py-4 last:border-b-0 transition-all duration-500 ease-out hover:-translate-y-[1px]"
      onMouseEnter={onExpand} onMouseLeave={onCollapse} onFocus={onExpand} onBlur={onCollapse} tabIndex={0}>
      <BackgroundSprig className={`${alignRight ? 'right-6' : 'left-8'} top-0 h-14 w-40 opacity-30`} />
      <div className="relative flex items-start justify-between gap-6">
        <div className={`flex items-start gap-3 ${rowOffset}`}>
          <button onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
              isSelected ? 'border-[#8b6e4e] bg-[#8b6e4e] text-white' : 'border-[#d8c9b5] text-transparent hover:border-[#8b6e4e]'
            }`}
            aria-label={isSelected ? '取消选择' : '选择此菜'}>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
              <path d="M2 6l3 3 5-5" />
            </svg>
          </button>
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#faf4ea]/80">
            <LineIcon type={meal.icon} />
          </span>
          <div className="min-w-0">
            <h3 className="flex items-center text-[1.03rem] font-medium leading-[1.08] tracking-[0.02em] text-stone-800">
              {meal.nameCn}
              <SeasonBadge seasons={meal.seasons} />
            </h3>
            <p className="mt-0.5 text-[0.88rem] italic leading-[1.08] tracking-[0.015em] text-[#7f8f7a]">
              {meal.nameFr}
            </p>
          </div>
        </div>
        <div className="pr-2 pt-1 text-[#ccb9a1] opacity-0 transition-all duration-500 ease-out group-hover:opacity-100">
          <span className="text-lg">·</span>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ease-out ${isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <IngredientNote ingredients={meal.ingredients} alignRight={alignRight} />
      </div>
    </div>
  );
}
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];
function CategorySection({
  titleCn, titleFr, items, expandedMealName, onExpand, onCollapse,
  selectedMeals, onToggleMeal, sectionIndex,
}: {
  titleCn: string; titleFr: string; items: Meal[];
  expandedMealName: string | null;
  onExpand: (n: string) => void; onCollapse: (n: string) => void;
  selectedMeals: Set<string>; onToggleMeal: (n: string) => void;
  sectionIndex: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-[30px] bg-[#faf4ea]/60 px-5 py-5 md:px-6 md:py-6">
      <GrainOverlay opacity="0.04" />
      <BackgroundSprig className="right-2 top-1 h-16 w-44 opacity-20" />
      <div className="mx-auto max-w-[860px]">
        <div className="relative mb-5">
          <p className="mb-1 text-[0.72rem] italic text-[#c8b8a4]"
            style={{ fontFamily: 'Baskerville, Georgia, serif' }}>
            {ROMAN[sectionIndex] ?? sectionIndex + 1}.
          </p>
          <h2 className="text-[1.5rem] font-semibold leading-tight tracking-[0.012em] text-stone-800"
            style={{ fontFamily: 'Baskerville, Georgia, Times New Roman, serif' }}>
            {titleCn}
          </h2>
          <p className="mt-0.5 text-[0.92rem] italic tracking-[0.04em] text-[#8fa08a]"
            style={{ fontFamily: 'Baskerville, Georgia, Times New Roman, serif' }}>
            {titleFr}
          </p>
          <div className="mt-4"><SectionDivider /></div>
        </div>
        <div>
          {items.map((meal, index) => (
            <MealRow key={meal.nameCn} meal={meal} rowIndex={index}
              isExpanded={expandedMealName === meal.nameCn}
              onExpand={() => onExpand(meal.nameCn)}
              onCollapse={() => onCollapse(meal.nameCn)}
              isSelected={selectedMeals.has(meal.nameCn)}
              onToggle={() => onToggleMeal(meal.nameCn)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FamilyMenuPage ───────────────────────────────────────────────────────────
export default function FamilyMenuPage() {
  const categories = useMemo(() => getCategories(menuData), []);
  const [expandedMealName, setExpandedMealName] = useState<string | null>(null);
  const mealsByCategory = useMemo(() => getMealsByCategory(menuData, categories), [categories]);
  const { selected, toggle, clear } = useShoppingCart();
  const [query, setQuery] = useState('');

  // ✦ identity: null = still loading, undefined-ish handled by onboarding
  const [identity, setIdentity] = useState<Identity | null | 'loading'>('loading');

  useEffect(() => {
    setIdentity(loadIdentity());
  }, []);

  // still reading localStorage
  if (identity === 'loading') return null;

  // first visit — show onboarding
  if (identity === null) {
    return <OnboardingScreen onDone={(id) => setIdentity(id)} />;
  }

  return (
    <div className="min-h-screen bg-[#f3eadf] text-stone-700">
      <div className="mx-auto max-w-5xl px-6 pb-28 pt-10 md:px-10 md:pt-14">
        <div className="relative overflow-hidden rounded-[34px] border border-[#e6d8c4] bg-[#f4e9dc] px-7 py-8 shadow-[0_18px_60px_rgba(123,99,77,0.08)] md:px-10 md:py-10">
          <GrainOverlay opacity="0.12" />
          <BotanicalCorner className="-left-8 -top-8 h-40 w-40 opacity-60" />
          <BotanicalCorner className="-bottom-10 -right-6 h-44 w-44 rotate-180 opacity-55" />
          <FoodDoodle variant="leaf" className="left-1/3 top-1/2 h-36 w-36 opacity-40 -rotate-[8deg]" />
          <FoodDoodle variant="dumpling" className="left-10 top-24 h-44 w-44 opacity-55" />
          <FoodDoodle variant="coffee" className="right-14 bottom-24 h-40 w-40 opacity-50 rotate-[10deg]" />
          <BackgroundSprig className="left-24 top-12 h-16 w-48 opacity-30" />
          <BackgroundSprig className="bottom-14 right-24 h-14 w-44 rotate-[8deg] opacity-25" />

          <header className="relative mb-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.32em] text-stone-400">Our table</p>
                {/* ✦ identity fields replace hardcoded strings */}
                <h1 className="text-3xl font-semibold tracking-[0.02em] text-stone-800 md:text-5xl"
                  style={{ fontFamily: 'Baskerville, Georgia, Times New Roman, serif' }}>
                  {identity.tableName}
                </h1>
                <p className="mt-1.5 text-[0.97rem] italic tracking-[0.06em] text-[#8fa08a]"
                  style={{ fontFamily: 'Baskerville, Georgia, Times New Roman, serif' }}>
                  Menu de la maison
                </p>
                <div className="mt-4 max-w-2xl">
                  <p className="text-base font-medium tracking-[0.02em] text-stone-700 md:text-lg">
                    {identity.slogan}
                  </p>
                  <p className="mt-1 text-[0.92rem] italic tracking-[0.06em] text-[#8fa08a] md:text-[0.98rem]"
                    style={{ fontFamily: 'Baskerville, Georgia, Times New Roman, serif' }}>
                    {identity.sloganFr}
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-stone-500">
                <div className="tracking-[0.03em] italic">a quiet table</div>
                <div className="mt-1 text-lg font-medium italic tracking-[0.04em] text-stone-800">
                  {identity.subtitle}
                </div>
              </div>
            </div>
            <div className="mt-6"><SectionDivider /></div>
          </header>

          <DailySuggestion onToggleMeal={toggle} selectedMeals={selected} />
          <SearchBar value={query} onChange={setQuery} />

          {query.trim() ? (
            <SearchResults
              query={query} selectedMeals={selected} onToggleMeal={toggle}
              expandedMealName={expandedMealName}
              onExpand={(n) => setExpandedMealName(n)}
              onCollapse={(n) => setExpandedMealName((c) => (c === n ? null : c))}
            />
          ) : (
            <div className="relative space-y-3">
              {mealsByCategory.map((group, index) => (
                <CategorySection
                  key={group.categoryCn}
                  titleCn={group.categoryCn} titleFr={group.categoryFr}
                  items={group.items}
                  expandedMealName={expandedMealName}
                  onExpand={(n) => setExpandedMealName(n)}
                  onCollapse={(n) => setExpandedMealName((c) => (c === n ? null : c))}
                  selectedMeals={selected} onToggleMeal={toggle}
                  sectionIndex={index}
                />
              ))}
            </div>
          )}

          {/* ✦ reset identity link — tucked away at bottom */}
          <div className="mt-8 text-center">
            <button
              onClick={() => { localStorage.removeItem(STORAGE_KEY); setIdentity(null); }}
              className="text-[0.68rem] text-stone-300 transition-colors hover:text-stone-400"
              style={{ fontFamily: 'Baskerville, Georgia, serif', fontStyle: 'italic' }}>
              重新设置个人信息
            </button>
          </div>
        </div>
      </div>

      <ShoppingPanel
        selectedMeals={menuData.filter((m) => selected.has(m.nameCn))}
        onClear={clear}
      />
    </div>
  );
}