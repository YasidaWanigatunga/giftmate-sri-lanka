"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Ban,
  CalendarDays,
  Gift,
  Heart,
  MapPin,
  Sparkles,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useCriteriaStore, type Criteria } from "@/hooks/use-criteria";

// Each criterion renders as a little "gift tag" pill with its own icon + label.
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

export function CriteriaBar() {
  const criteria = useCriteriaStore((s) => s.criteria);
  const removeCriteria = useCriteriaStore((s) => s.removeCriteria);

  const active = FIELDS.filter(
    (f) => criteria[f.key] !== undefined && criteria[f.key] !== ""
  );

  return (
    <div className="border-b border-[var(--color-line)] bg-[var(--color-surface)]/70 px-4 py-2.5 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-muted)]">
          <Sparkles className="size-3.5 text-saffron" />
          Gift tags
        </span>

        {active.length === 0 && (
          <span className="text-xs text-[var(--color-muted)]">
            Tell GiftMate the occasion, who it&apos;s for, your city &amp;
            budget — tags appear here.
          </span>
        )}

        <AnimatePresence mode="popLayout">
          {active.map(({ key, icon: Icon, label }) => (
            <motion.button
              key={key}
              layout
              initial={{ opacity: 0, scale: 0.8, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => removeCriteria(key)}
              title="Remove tag"
              className="group flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-line)] bg-[var(--color-bg)] py-1 pl-2.5 pr-2 text-xs font-medium text-[var(--color-ink)] transition-colors hover:border-rose/50 hover:bg-rose/5"
            >
              <Icon className="size-3.5 text-plum" />
              {label(criteria[key] as string | number)}
              <X className="size-3 text-[var(--color-muted)] transition-colors group-hover:text-rose" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
