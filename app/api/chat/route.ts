import { groq } from "@ai-sdk/groq";
import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  type UIMessage,
} from "ai";
import { SYSTEM_PROMPT } from "@/lib/persona";
import { tools } from "@/lib/tools";

export const maxDuration = 30;

// gpt-oss is a reasoning model. Its "reasoning" parts can leak into the chat
// history and break convertToModelMessages on the next turn, so drop them.
function stripReasoning(messages: UIMessage[]): UIMessage[] {
  return messages.map((m) => ({
    ...m,
    parts: m.parts.filter((p) => p.type !== "reasoning"),
  }));
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq("openai/gpt-oss-120b"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(stripReasoning(messages)),
    tools,
    stopWhen: stepCountIs(5),
    providerOptions: {
      // Keep the model's chain-of-thought out of the response entirely.
      groq: { reasoningFormat: "hidden" },
    },
  });

  return result.toUIMessageStreamResponse();
}