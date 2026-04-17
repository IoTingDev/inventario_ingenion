import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { InventoryItem, SEED_INVENTORY } from "@/data/inventory";

interface Ctx {
  items: InventoryItem[];
  upsert: (item: InventoryItem) => void;
  remove: (id: string) => void;
  getById: (id: string) => InventoryItem | undefined;
}

const InventoryCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "ioting:inventory:v1";

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return SEED_INVENTORY;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<Ctx>(() => ({
    items,
    upsert: (item) =>
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.id === item.id);
        const updated = { ...item, fechaActualizacion: new Date().toISOString().slice(0, 10) };
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updated;
          return next;
        }
        return [updated, ...prev];
      }),
    remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
    getById: (id) => items.find((p) => p.id === id),
  }), [items]);

  return <InventoryCtx.Provider value={value}>{children}</InventoryCtx.Provider>;
};

export const useInventory = () => {
  const ctx = useContext(InventoryCtx);
  if (!ctx) throw new Error("useInventory must be used inside InventoryProvider");
  return ctx;
};
