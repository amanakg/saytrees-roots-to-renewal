import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import groundScene from "@/assets/ground-scene-v2.jpg";
import {
  DEFAULT_MOTION_PROMPT,
  checkSceneVideo,
  downloadSceneVideo,
  startSceneVideo,
} from "@/lib/scene-video.functions";
import { clearSceneVideo, saveSceneVideo } from "@/lib/scene-store";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Scene Animation Studio — SayTrees" },
      { name: "description", content: "Turn a SayTrees village illustration into a realistic looping animation." },
      { property: "og:title", content: "Scene Animation Studio — SayTrees" },
      { property: "og:description", content: "Animate the SayTrees village scene with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Studio,
});

type Phase = "idle" | "starting" | "rendering" | "done" | "error";

async function fileToBase64(blob: Blob) {
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s = "";
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}

function Studio() {
  const start = useServerFn(startSceneVideo);
  const check = useServerFn(checkSceneVideo);
  const download = useServerFn(downloadSceneVideo);
  const [image, setImage] = useState<{ url: string; blob: Blob | null }>({ url: groundScene, blob: null });
  const [prompt, setPrompt] = useState(DEFAULT_MOTION_PROMPT);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [video, setVideo] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const cancelled = useRef(false);

  useEffect(() => () => { cancelled.current = true; }, []);
  useEffect(() => {
    if (!video) return setVideoUrl(null);
    const u = URL.createObjectURL(video);
    setVideoUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [video]);

  const busy = phase === "starting" || phase === "rendering";

  async function generate() {
    setPhase("starting"); setMessage(""); setProgress(0); setVideo(null);
    try {
      const blob = image.blob ?? (await (await fetch(image.url)).blob());
      const mimeType = blob.type || "image/jpeg";
      const res = await start({ data: { imageBase64: await fileToBase64(blob), mimeType, prompt } });
      if (!res.id) throw new Error(res.error ?? "Could not start.");
      setPhase("rendering");
      while (!cancelled.current) {
        await new Promise((r) => setTimeout(r, 6000));
        const s = await check({ data: { id: res.id } });
        setProgress(s.progress);
        if (s.status === "failed") throw new Error(s.error ?? "The animation failed.");
        if (s.status === "completed") break;
      }
      const d = await download({ data: { id: res.id } });
      if (!d.base64) throw new Error(d.error ?? "Download failed.");
      const bytes = Uint8Array.from(atob(d.base64), (c) => c.charCodeAt(0));
      setVideo(new Blob([bytes], { type: d.contentType ?? "video/mp4" }));
      setPhase("done");
    } catch (e) {
      setPhase("error");
      setMessage(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  return (
    <main className="bg-sky min-h-dvh px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Scene Animation Studio</h1>
            <p className="text-muted-foreground">Upload a village illustration and bring its people, animals, water and leaves to life.</p>
          </div>
          <Link to="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">← Back to site</Link>
        </header>

        <section className="grid gap-6 rounded-2xl bg-card p-5 shadow-sm md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="font-display text-lg font-medium">1. Illustration</h2>
            <img src={image.url} alt="Selected village illustration" className="aspect-video w-full rounded-lg object-cover" />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={busy}
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-primary-foreground"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (f.size > 10_000_000) return toast.error("Please pick an image under 10 MB.");
                setImage({ url: URL.createObjectURL(f), blob: f });
              }}
            />
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-lg font-medium">2. Describe the movement</h2>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={9} disabled={busy} />
            <Button onClick={generate} disabled={busy} className="w-full">
              {busy ? "Animating… (takes a few minutes)" : "Create looping animation"}
            </Button>
            {busy && <Progress value={phase === "starting" ? 2 : Math.max(5, progress)} />}
            {phase === "error" && <p className="text-sm text-destructive">{message}</p>}
          </div>
        </section>

        {videoUrl && (
          <section className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
            <h2 className="font-display text-lg font-medium">3. Preview</h2>
            <video src={videoUrl} autoPlay loop muted playsInline controls className="w-full rounded-lg" />
            <div className="flex flex-wrap gap-3">
              <Button onClick={async () => { await saveSceneVideo(video!); toast.success("Animation applied to the home page."); }}>
                Apply to home page
              </Button>
              <Button variant="outline" asChild>
                <a href={videoUrl} download="saytrees-village.mp4">Download video</a>
              </Button>
            </div>
          </section>
        )}

        <div>
          <Button variant="ghost" size="sm" onClick={async () => { await clearSceneVideo(); toast.success("Home page reset to the still picture."); }}>
            Reset home page to still picture
          </Button>
        </div>
      </div>
    </main>
  );
}
