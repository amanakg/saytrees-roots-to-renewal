import { createServerFn } from "@tanstack/react-start";

const MODEL = "google/gemini-omni-1.1-flash";

export const DEFAULT_MOTION_PROMPT =
  "Animate this exact illustration as a gentle, realistic, seamlessly looping scene. Keep the painted style, composition and every character unchanged; the camera stays completely still. The couple keeps planting saplings with small natural hand movements, the trainer gestures while the farmers nod, the SayTrees field worker taps and glances at his tablet, the cow grazes slowly, the egret turns its head, leaves and grass sway softly in a light breeze, and the pond water ripples gently. End on the same pose as the first frame so the clip loops smoothly.";

function friendly(err: unknown): string {
  const e = err as { name?: string; code?: string; message?: string };
  console.error("scene video error", e?.name, e?.code, e?.message);
  if (e?.name === "PaymentRequiredError") return "Not enough AI credits. Add credits and try again.";
  if (e?.name === "RateLimitError") return "Too many requests right now. Please wait a minute and try again.";
  if (e?.name === "RequestRejectedError") return "The picture or description was not accepted. Try a different picture.";
  return "The animation could not be started. Please try again shortly.";
}

export const startSceneVideo = createServerFn({ method: "POST" })
  .inputValidator((input: { imageBase64: string; mimeType: string; prompt: string }) => {
    if (!input.imageBase64 || input.imageBase64.length > 14_000_000) throw new Error("Image missing or too large (max ~10 MB).");
    if (!/^image\/(png|jpeg|webp)$/.test(input.mimeType)) throw new Error("Use a PNG, JPG or WebP image.");
    return { ...input, prompt: (input.prompt || "").slice(0, 3000) };
  })
  .handler(async ({ data }) => {
    const { generateVideo } = await import("@lovable.dev/ai-gateway");
    try {
      const job = await generateVideo({
        model: MODEL,
        input: [
          { type: "image", data: data.imageBase64, mime_type: data.mimeType },
          { type: "text", text: data.prompt || DEFAULT_MOTION_PROMPT },
        ],
        response_format: { type: "video", duration: "8s", resolution: "720p", aspect_ratio: "16:9" },
      });
      return { id: job.id, error: null as string | null };
    } catch (err) {
      return { id: null, error: friendly(err) };
    }
  });

export const checkSceneVideo = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const { getVideo } = await import("@lovable.dev/ai-gateway");
    try {
      const job = (await getVideo(data.id)) as { status?: string; progress?: number; error?: { message?: string } };
      return { status: job.status ?? "in_progress", progress: job.progress ?? 0, error: job.error?.message ?? null };
    } catch (err) {
      return { status: "unknown", progress: 0, error: friendly(err) };
    }
  });

export const downloadSceneVideo = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const { downloadVideo } = await import("@lovable.dev/ai-gateway");
    try {
      const bin = await downloadVideo(data.id);
      const buf = new Uint8Array(await (await bin.blob()).arrayBuffer());
      let s = "";
      for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      return { base64: btoa(s), contentType: bin.contentType || "video/mp4", error: null as string | null };
    } catch (err) {
      return { base64: null, contentType: null, error: friendly(err) };
    }
  });
