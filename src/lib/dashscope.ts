type ChatContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string | ChatContentPart[];
};

type DashScopeChoice = {
  message?: {
    content?: string;
  };
};

type DashScopeResponse = {
  choices?: DashScopeChoice[];
  error?: {
    message?: string;
  };
};

export class DashScopeConfigError extends Error {
  constructor() {
    super("DASHSCOPE_API_KEY is required before AI generation can run.");
    this.name = "DashScopeConfigError";
  }
}

function getDashScopeConfig() {
  const apiKey = process.env.DASHSCOPE_API_KEY;

  if (!apiKey) {
    throw new DashScopeConfigError();
  }

  return {
    apiKey,
    baseUrl:
      process.env.DASHSCOPE_BASE_URL ||
      "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    model: process.env.DASHSCOPE_MODEL || "qwen3.5-flash",
  };
}

type DashScopeJsonOptions = {
  timeoutMs?: number;
  maxTokens?: number;
};

export async function callDashScopeJson(
  messages: ChatMessage[],
  { timeoutMs = 55_000, maxTokens = 1_400 }: DashScopeJsonOptions = {},
) {
  const config = getDashScopeConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.2,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => ({}))) as DashScopeResponse;

    if (!response.ok) {
      throw new Error(payload.error?.message || `DashScope request failed with ${response.status}`);
    }

    const content = payload.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("DashScope response did not include message content.");
    }

    return content;
  } finally {
    clearTimeout(timeout);
  }
}
