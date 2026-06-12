import { create } from "zustand";

export type Criteria = {
  occasion?: string;
  recipient?: string;
  location?: string;
  budget?: number;
  deliveryDate?: string;
  preference?: string;
  avoid?: string;
};

type CriteriaStore = {
  criteria: Criteria;
  setCriteria: (update: Partial<Criteria>) => void;
  removeCriteria: (key: keyof Criteria) => void;
  clearCriteria: () => void;
};

export const useCriteriaStore = create<CriteriaStore>((set) => ({
  criteria: {},
  setCriteria: (update) =>
    set((state) => ({ criteria: { ...state.criteria, ...update } })),
  removeCriteria: (key) =>
    set((state) => {
      const next = { ...state.criteria };
      delete next[key];
      return { criteria: next };
    }),
  clearCriteria: () => set({ criteria: {} }),
}));