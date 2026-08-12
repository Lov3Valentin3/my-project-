import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NorthPole Pal",
    short_name: "Elf Pal",
    description: "A magical elf pen pal from the North Pole for kids and families.",
    start_url: "/",
    display: "standalone",
    background_color: "#07151c",
    theme_color: "#0f3d2e",
    icons: [
      {
        src: "/images/elves/holly.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}