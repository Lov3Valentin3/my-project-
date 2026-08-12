import type { ReactNode } from "react";
export const metadata = {
  title: "Workshop Admin",
  robots: { index: false, follow: false },
};
export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
