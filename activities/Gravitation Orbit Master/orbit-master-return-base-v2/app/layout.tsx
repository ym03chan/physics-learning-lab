import type { CSSProperties } from "react";
import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Orbit Master: Return to Base",
  description:
    "Command gravity-assisted rescue flights across humanity's frontier systems in 2300 AD.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        style={
          {
            "--og-image": `url("${basePath}/og.png")`,
          } as CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
