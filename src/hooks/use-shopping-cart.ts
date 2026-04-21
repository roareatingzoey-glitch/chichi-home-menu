// hooks/use-shopping-cart.ts
import { useState, useCallback } from 'react';
import { type Meal } from '../menu-data';

export function useShoppingCart() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = useCallback((mealName: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(mealName) ? next.delete(mealName) : next.add(mealName);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  const getIngredients = useCallback(
    (meals: Meal[]) => {
      const map = new Map<string, string>();
      meals
        .filter((m) => selected.has(m.nameCn))
        .forEach((m) => m.ingredients.forEach((i) => map.set(i.cn, i.fr)));
      return Array.from(map.entries()).map(([cn, fr]) => ({ cn, fr }));
    },
    [selected],
  );

  return { selected, toggle, clear, getIngredients };
}