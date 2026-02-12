import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { task, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = type === "schedule"
      ? `You are an energy-adaptive scheduler for neurodiverse individuals. Given the user's context, suggest an optimized daily schedule. Return JSON with this structure:
        { "schedule": [{ "hour": "9:00 AM", "energy": "high"|"medium"|"low"|"rest", "task": "task description" }] }
        Align hard tasks with high-energy slots. Include rest breaks. Be encouraging.`
      : `You are a task breakdown assistant for neurodiverse individuals (ADHD, dyslexia). 
        Break any task into 3-6 small, manageable steps. Each step should take 5-15 minutes max.
        Use encouraging, simple language. Add relevant emojis.
        Return JSON: { "title": "task title", "emoji": "relevant emoji", "xpReward": number (25-100 based on difficulty), "subtasks": [{ "id": "unique_id", "text": "step description", "done": false }] }
        Make steps concrete and actionable. Start with the easiest step to build momentum.`;

    const body: Record<string, unknown> = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: task },
      ],
    };

    body.tools = [
      {
        type: "function",
        function: {
          name: type === "schedule" ? "return_schedule" : "return_task_breakdown",
          description: type === "schedule" ? "Return the optimized schedule" : "Return the broken down task",
          parameters: type === "schedule"
            ? {
                type: "object",
                properties: {
                  schedule: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        hour: { type: "string" },
                        energy: { type: "string", enum: ["high", "medium", "low", "rest"] },
                        task: { type: "string" },
                      },
                      required: ["hour", "energy"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["schedule"],
                additionalProperties: false,
              }
            : {
                type: "object",
                properties: {
                  title: { type: "string" },
                  emoji: { type: "string" },
                  xpReward: { type: "number" },
                  subtasks: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        text: { type: "string" },
                        done: { type: "boolean" },
                      },
                      required: ["id", "text", "done"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["title", "emoji", "xpReward", "subtasks"],
                additionalProperties: false,
              },
        },
      },
    ];
    body.tool_choice = {
      type: "function",
      function: { name: type === "schedule" ? "return_schedule" : "return_task_breakdown" },
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
