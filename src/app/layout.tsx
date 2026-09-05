import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedLens — AI Clinical Information Intelligence",
  description:
    "Transform fragmented medical reports into structured, traceable, and understandable clinical records with deterministic reference ranges and safety guardrails.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
