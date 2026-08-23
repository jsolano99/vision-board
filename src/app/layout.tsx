import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const jakarta = localFont({
  src: "../fonts/jakarta-variable.woff2",
  variable: "--font-jakarta-raw",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vision Board",
  description: "Build your board. Get your next steps.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <body className="min-h-full">
        {/*
          THESIS: A calm, modern health/fitness-dashboard grammar applied to personal
          goals — soft white cards on a light canvas, a radial progress ring for the
          year, tonal category badges — refusing this build's own prior drenched-orange
          sports-broadcast world in favor of what the user explicitly re-pinned.
          OWN-WORLD: Light neutral canvas (#F1F2F5) with white rounded cards (24-28px
          radius) and soft diffuse shadows; one coral-red brand accent for primary
          actions and the year-progress ring; five tonal (pastel-background, saturated-
          text) category badges; Plus Jakarta Sans at varying weight for both display
          numerals and body/label text — no separate display face.
          STORY: Unchanged from the prior world — pin photos, tag each by life area,
          analyze to get a concrete, image-grounded next step per area.
          FIRST VIEWPORT: Light white nav card top; greeting + H1 + radial year-progress
          ring; segmented category filter; two-column dashboard (board canvas left,
          next-steps rail right) as white cards on the light canvas.
          FORM: User-pinned reference (two health/fitness app screenshots) — a redesign
          that replaces the prior pinned world outright, per new-work.md's redesign
          rule: the old look is evidence, not authority, once the user repins.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the
          finish review, the verdict, and DESIGN.md.
        */}
        {children}
      </body>
    </html>
  );
}
