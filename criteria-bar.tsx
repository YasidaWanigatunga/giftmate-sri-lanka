"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Ban,
  Brain,
  CalendarDays,
  Check,
  Gift,
  Heart,
  MapPin,
  Pencil,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useCriteriaStore, type Criteria } from "@/hooks/use-criteria";

// The agent's visible memory. Each pill is editable (pencil) and forgettable (×).
// Edits update the store directly AND are announced to the agent via onEdit so
// its next tool calls use the corrected value.
const FIELDS: {
  key: keyof Criteria;
  icon: typeof Gift;
  label: (v: string | number) => string;
}[] = [
  { key: "occasion", icon: Gift, label: (v) => String(v) },
  { key: "recipient", icon: User, label: (v) => String(v) },
  { key: "location", icon: MapPin, label: (v) => String(v) },
  {
    key: "budget",
    icon: Wallet,
    label: (v) => `Up to Rs. ${Number(v).toLocaleString("en-LK")}`,
  },
  { key: "deliveryDate", icon: CalendarDays, label: (v) => String(v) },
  { key: "preference", icon: Heart, label: (v) => String(v) },
  { key: "avoid", icon: Ban, label: (v) => `No ${v}` },
];

export function CriteriaBar({
  onEdit,
}: {
  /** Tells the agent about a manual memory change so it stays in sync. */
  onEdit?: (key: keyof Criteria, value: string) => void;
}) {
  const criteria = useCriteriaStore((s) => s.criteria);
  const setCriteria = useCriteriaStore((s) => s.setCriteria);
  const removeCriteria = useCriteriaStore((s) => s.removeCriteria);

  const [editing, setEditing] = useState<keyof Criteria | null>(null);
  const [draft, setDraft] = useState("");

  const active = FIELDS.filter(
    (f) => criteria[f.key] !== undefined && criteria[f.key] !== ""
  );

  function startEdit(key: keyof Criteria) {
    setEditing(key);
    setDraft(String(criteria[key] ?? ""));
  }

  function commitEdit() {
    if (!editing) return;
    const value = draft.trim();
    if (value) {
      if (editing === "budget") {
        const num = Number(value.replace(/[^\d.]/g, ""));
        if (!Number.isNaN(num) && num > 0) {
          setCriteria({ budget: num });
          onEdit?.("budget", String(num));
        }
      } else {
        setCriteria({ [editing]: value });
        onEdit?.(editing, value);
      }
    }
    setEditing(null);
  }

  return (
    <div className="border-b border-[var(--color-line)] bg-[var(--color-surface)]/70 px-4 py-2.5 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted)]">
          <Brain className="size-3.5 text-saffron" />
          Agent memory
        </span>

        {active.length === 0 && (
          <span className="text-xs text-[var(--color-muted)]">
            What GiftMate remembers appears here — click a pill to edit it, ×
            to make it forget.
          </span>
        )}

        <AnimatePresence mode="popLayout">
          {active.map(({ key, icon: Icon, label }) => (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, scale: 0.8, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-line)] bg-[var(--color-bg)] py-1 pl-2.5 pr-1.5 text-xs font-medium text-[var(--color-ink)]"
            >
              <Icon className="size-3.5 shrink-0 text-plum" />

              {editing === key ? (
                <span className="flex items-center gap-1">
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit();
                      if (e.key === "Escape") setEditing(null);
                    }}
                    className="w-28 rounded border border-plum/40 bg-white px-1.5 py-0.5 text-xs outline-none"
                  />
                  <button
                    onClick={commitEdit}
                    title="Save"
                    className="flex size-5 items-center justify-center rounded-full text-mint hover:bg-mint/10"
                  >
                    <Check className="size-3.5" />
                  </button>
                </span>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(key)}
                    title="Edit this memory"
                    className="flex items-center gap-1 hover:text-plum"
                  >
                    {label(criteria[key] as string | number)}
                    <Pencil className="size-3 text-[var(--color-muted)]" />
                  </button>
                  <button
                    onClick={() => removeCriteria(key)}
                    title="Forget this"
                    className="flex size-5 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-rose/10 hover:text-rose"
                  >
                    <X className="size-3" />
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
