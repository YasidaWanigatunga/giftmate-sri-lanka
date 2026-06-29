"use client";

import { useRef, useState, useEffect } from "react";
import { Mic, Send, Square } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isListening, startListening, stopListening } = useSpeech();

  // Auto-grow the textarea up to a max height.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [value]);

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  function toggleMic() {
    if (isListening) {
      stopListening();
    } else {
      startListening((spoken) =>
        setValue((prev) => (prev ? `${prev} ${spoken}` : spoken))
      );
    }
  }

  return (
    <div className="border-t border-[var(--color-line)] bg-[var(--color-surface)]/80 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <div className="flex flex-1 items-end gap-2 rounded-3xl border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2 focus-within:border-plum/40">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            disabled={disabled}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Birthday gift for amma under Rs. 5000 in Colombo…"
            className="max-h-[140px] flex-1 resize-none bg-transparent py-1 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
          />
          <button
            type="button"
            onClick={toggleMic}
            title={isListening ? "Stop listening" : "Speak"}
            className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors ${
              isListening
                ? "bg-rose text-white"
                : "text-[var(--color-muted)] hover:bg-[var(--color-line)] hover:text-plum"
            }`}
          >
            {isListening ? (
              <Square className="size-4 fill-current" />
            ) : (
              <Mic className="size-4" />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="ribbon flex size-11 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-transform active:scale-95 disabled:opacity-40"
          title="Send"
        >
          <Send className="size-4" />
        </button>
      </div>
      {isListening && (
        <p className="mx-auto mt-1.5 max-w-3xl text-xs text-rose">
          Listening… speak now (English or Romanized Sinhala works best).
        </p>
      )}
    </div>
  );
}
