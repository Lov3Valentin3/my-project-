import { ImageResponse } from "next/og";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "64px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg,#c6283a,#0f3d2e)",
          color: "#f4d03f",
          fontSize: 34,
          borderRadius: 20,
        }}
      >
        NP
      </div>
    ),
    size,
  );
}
