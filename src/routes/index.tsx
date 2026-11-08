import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { loadSceneVideo } from "@/lib/scene-store";
import {
  ArrowRight,
  Droplet,
  Eye,
  EyeOff,
  Flame,
  Leaf,
  Lock,
  Settings,
  Sprout,
  Sun,
  TreeDeciduous,
  TreePine,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import groundScene from "@/assets/ground-scene-v2.jpg";
import warmingRing from "@/assets/warming-ring.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — SayTrees Impact Dashboard" },
      {
        name: "description",
        content:
          "Sign in to the SayTrees impact dashboard. Agroforestry, forestry, water conservation, biogas, solar and mangroves.",
      },
      { property: "og:title", content: "Sign in — SayTrees Impact Dashboard" },
      {
        property: "og:description",
        content: "Building climate resilient communities through land, water, community and clean energy work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const focusAreas: { label: string; icon: LucideIcon }[] = [
  { label: "Agroforestry", icon: Leaf },
  { label: "Forestry", icon: TreePine },
  { label: "Water\nConservation", icon: Droplet },
  { label: "Bio Gas", icon: Flame },
  { label: "Solar", icon: Sun },
  { label: "Mangroves", icon: TreeDeciduous },
];

const groundWork: { title: string; text: string; icon: LucideIcon }[] = [
  { title: "Restore Land Ecosystems", text: "Urban and rural afforestation, community forests", icon: Sprout },
  { title: "Restore Water Ecosystems", text: "Lake rejuvenation, wells and watersheds", icon: Droplet },
  { title: "Strengthen Communities", text: "Farmer training and volunteering", icon: Users },
  { title: "Enable Clean Energy", text: "Household and community biogas", icon: Flame },
  { title: "Technology for Impact", text: "M&E, biodiversity data, tree certificates", icon: Settings },
];

function Logo() {
  return (
    <div className="flex items-center gap-4">
      <span className="font-display text-3xl font-semibold tracking-tight text-foreground">
        say<span className="relative text-primary">
          trees
          <Leaf
            aria-hidden
            className="absolute -top-2 left-0.5 size-3.5 -rotate-12 fill-primary text-primary"
          />
        </span>
      </span>
      <span className="hidden h-9 w-px bg-foreground/70 sm:block lg:hidden xl:block" />
      <span className="hidden whitespace-nowrap font-display text-[0.7rem] font-semibold leading-tight tracking-[0.2em] text-foreground sm:block lg:hidden xl:block">
        BUILDING CLIMATE
        <br />
        RESILIENT COMMUNITIES
      </span>
    </div>
  );
}

function SignInBar() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast("Sign-in isn't connected yet", {
      description: "Please contact your SayTrees coordinator for access.",
    });
  }

  const fieldClass =
    "h-11 w-full rounded-full border border-input bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";

  return (
    <header className="animate-rise mx-auto flex w-full max-w-7xl flex-col gap-5 rounded-3xl bg-card px-6 py-5 shadow-float lg:flex-row lg:items-center lg:justify-between lg:rounded-full lg:px-8 lg:py-3.5">
      <Logo />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:flex-nowrap"
      >
        <label className="relative sm:w-56 lg:w-52 xl:w-56">
          <span className="sr-only">Username</span>
          <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input name="username" autoComplete="username" placeholder="Username" required className={fieldClass} />
        </label>
        <label className="relative sm:w-56 lg:w-52 xl:w-56">
          <span className="sr-only">Password</span>
          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Password"
            required
            className={`${fieldClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition hover:text-primary"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </label>
        <Button type="submit" variant="cta" className="h-11 px-7">
          Sign in <ArrowRight />
        </Button>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toast("Contact your SayTrees coordinator to reset your password.");
          }}
          className="whitespace-nowrap text-center font-display text-sm font-semibold text-primary-deep hover:text-primary lg:ml-2"
        >
          Forgot password?
        </a>
      </form>
    </header>
  );
}

function FocusAreas() {
  return (
    <section aria-labelledby="focus-heading" className="animate-rise mx-auto mt-12 max-w-6xl [animation-delay:120ms] lg:mt-[4vh]">
      <div className="flex items-center justify-center gap-6">
        <span className="rule-fade hidden w-32 sm:block" />
        <h2 id="focus-heading" className="eyebrow">
          Our Focus Areas
        </h2>
        <span className="rule-fade hidden w-32 rotate-180 sm:block" />
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:mt-[2.5vh] lg:flex lg:items-center lg:justify-center">
        {focusAreas.map(({ label, icon: Icon }, i) => (
          <li
            key={label}
            className={`flex items-center gap-3 px-4 xl:px-6 ${i > 0 ? "lg:border-l lg:border-foreground/20" : ""}`}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-primary">
              <Icon className="size-6" strokeWidth={1.6} />
            </span>
            <span className="whitespace-pre-line font-display text-base font-medium leading-tight text-foreground">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function GroundWork() {
  return (
    <section
      aria-labelledby="ground-heading"
      className="animate-rise mx-auto mt-16 grid max-w-7xl items-center gap-8 [animation-delay:240ms] lg:mt-[4vh] lg:grid-cols-[1fr_auto] xl:gap-10"
    >
      <div>
        <div className="flex items-center gap-6">
          <h2 id="ground-heading" className="eyebrow shrink-0">
            What we do on the ground
          </h2>
          <span className="h-px flex-1 bg-primary/60" />
        </div>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:mt-[2.5vh] lg:grid-cols-5 lg:gap-0">
          {groundWork.map(({ title, text, icon: Icon }, i) => (
            <li
              key={title}
              className={`relative lg:px-3 xl:px-5 ${i > 0 ? "lg:border-l lg:border-primary/25" : "lg:pl-0"}`}
            >
              <div className="flex items-start gap-2 xl:gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-primary/40 bg-card font-display text-sm font-bold text-primary-deep shadow-sm">
                  {i + 1}
                </span>
                <span className="mt-2 grid size-14 shrink-0 place-items-center rounded-full bg-secondary text-primary xl:size-16">
                  <Icon className="size-7 xl:size-8" strokeWidth={1.5} />
                </span>
              </div>
              <h3 className="mt-4 text-xl font-bold leading-tight text-primary-deep lg:text-[1.05rem] xl:text-xl">
                {title}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-snug text-muted-foreground lg:text-sm xl:text-[0.95rem]">
                {text}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <div className="mx-auto w-64 sm:w-72 lg:w-[min(14rem,30vh)] xl:w-[min(20rem,32vh)] 2xl:w-[min(24rem,34vh)]">
        <img
          src={warmingRing.url}
          alt="Tree ring coloured with warming stripes, from blue at the centre to deep red at the edge"
          width={800}
          height={800}
          className="animate-slow-spin aspect-square w-full rounded-full object-cover shadow-float"
        />
      </div>
    </section>
  );
}

function Index() {
  return (
    <main className="bg-sky relative flex min-h-dvh flex-col overflow-hidden lg:h-dvh lg:min-h-0">
      <div className="relative z-10 px-4 pt-6 sm:px-8 lg:pt-[3vh]">
        <SignInBar />
        <FocusAreas />
        <GroundWork />
        <p className="mt-10 text-center text-sm text-muted-foreground lg:hidden">
          Need access? Contact your SayTrees coordinator.
        </p>
      </div>
      <div className="flex-1 lg:hidden" aria-hidden />
      <SceneMedia />
    </main>
  );
}

function SceneMedia() {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let u: string | null = null;
    loadSceneVideo()
      .then((b) => { if (b) { u = URL.createObjectURL(b); setUrl(u); } })
      .catch(() => {});
    return () => { if (u) URL.revokeObjectURL(u); };
  }, []);
  const cls =
    "scene-fade relative -mt-2 block w-full object-cover sm:-mt-8 lg:-mt-[5vh] lg:h-auto lg:min-h-[26vh] lg:flex-1 lg:object-bottom";
  if (url)
    return <video src={url} poster={groundScene} autoPlay loop muted playsInline className={cls} aria-label="Animated SayTrees village scene" />;
  return (
    <>
      <img
        src={groundScene}
        alt="Villagers planting saplings beside a restored pond, a biogas plant, a grazing cow, a farmer training session and a solar-powered sensor, and a SayTrees field worker checking a tablet"
        width={1920}
        height={800}
        className={cls}
      />
    </>
  );
}
