import Link from "next/link";
import { CheckCircle2, Gift } from "lucide-react";

export default async function CheckoutConfirmation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-center shadow-sm">
        <div className="ribbon mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl text-white shadow-md">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
          Order confirmed 🎉
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Thanks for shopping with GiftMate. This is a demo checkout — no real
          payment was taken.
        </p>
        <p className="mt-4 rounded-xl bg-[var(--color-bg)] px-4 py-2 font-mono text-sm text-[var(--color-ink)]">
          Order&nbsp;#{id}
        </p>
        <Link
          href="/"
          className="ribbon mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95"
        >
          <Gift className="size-4" /> Send another gift
        </Link>
      </div>
    </div>
  );
}
