import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: "1.5rem" }}>{children}</body>
    </html>
  );
}
