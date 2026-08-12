"use client";
export function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button className="magical-btn" type="button" onClick={() => window.print()}>
      {label}
    </button>
  );
}