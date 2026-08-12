"use client";
import { useMemo, useState } from "react";
import { VIDEO_SCENES } from "@/lib/content";
type VideoRow = {
  id: string;
  title: string;
  description: string;
  scene: string;
};
export function VideoTheater({
  videos,
  childName,
  elfName,
}: {
  videos: VideoRow[];
  childName: string;
  elfName: string;
}) {
  const [active, setActive] = useState(videos[0]?.id ?? "");
  const current = videos.find((video) => video.id === active) ?? videos[0];
  const art = useMemo(
    () => VIDEO_SCENES.find((scene) => scene.scene === current?.scene)?.image || "/images/workshop.jpg",
    [current],
  );
  if (!current) {
    return <p>Write a letter to unlock your first workshop film.</p>;
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="overflow-hidden rounded-[28px] border border-[#f4d03f]/30 bg-black/40">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={art} alt="" className="h-[360px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute bottom-0 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[#f4d03f]">North Pole Film Reel</p>
            <h2 className="font-display text-3xl">{current.title}</h2>
            <p className="font-hand mt-2 text-2xl">
              “{childName}, it is {elfName}! {current.description}”
            </p>
          </div>
        </div>
        <div className="space-y-2 p-5 text-sm text-[#fff6e5]/80">
          <p>Personalized video magic is ready in the workshop. This reel uses your name today.</p>
          <p>Soon, full AI-generated films will call {childName} by name in every scene.</p>
        </div>
      </div>
      <div className="grid gap-3">
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setActive(video.id)}
            className={`rounded-2xl p-4 text-left ${active === video.id ? "bg-[#9b1b30]" : "card-glass"}`}
          >
            <p className="font-display text-lg">{video.title}</p>
            <p className="text-sm text-[#fff6e5]/75">{video.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
