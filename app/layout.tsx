import type { Metadata } from "next";
import { Inter, Special_Elite, Permanent_Marker } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { CustomCursor } from "@/components/CustomCursor";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const specialElite = Special_Elite({
  weight: "400",
  variable: "--font-special-elite",
  subsets: ["latin"],
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  variable: "--font-permanent-marker",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Case #404: The Developer",
  description: "An unsolved mystery portfolio.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${specialElite.variable} ${permanentMarker.variable} antialiased bg-[#0e0e0e] text-[#EDEDED] font-sans`}
      >
        <CustomCursor />

        {/* Background Background Decor */}
        <div className="fixed inset-0 pointer-events-none z-0 user-select-none overflow-hidden">
          {/* Subtle Grain */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "url('/subtle-grain.png')" }}></div>

          {/* Detailed Blood Splatters */}
          <svg className="absolute w-full h-full opacity-30 mix-blend-multiply filter blur-[1px]">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
              </filter>
            </defs>

            {/* Top Left Splatter */}
            <g transform="translate(150, 100) rotate(15)" fill="#4a0000" filter="url(#goo)">
              <circle cx="0" cy="0" r="25" />
              <circle cx="15" cy="10" r="10" />
              <circle cx="-10" cy="20" r="8" />
              <circle cx="30" cy="-5" r="5" />
              <rect x="5" y="15" width="2" height="40" rx="1" />
              <circle cx="8" cy="55" r="3" />
            </g>

            {/* Bottom Right Pool */}
            <g transform="translate(1600, 800) scale(1.5)" fill="#3a0404">
              <ellipse cx="0" cy="0" rx="60" ry="40" />
              <circle cx="50" cy="20" r="15" />
              <circle cx="-40" cy="-30" r="10" />
            </g>

            {/* Scattered droplets */}
            <g fill="#5e0000">
              <circle cx="400" cy="300" r="3" />
              <circle cx="420" cy="310" r="1.5" />
              <circle cx="390" cy="350" r="2" />

              <circle cx="1200" cy="200" r="4" />
              <circle cx="1215" cy="220" r="2" />

              <circle cx="800" cy="700" r="3" />
              <circle cx="850" cy="650" r="1" />
            </g>

            {/* Runny streak middle right */}
            <g transform="translate(1700, 400)" fill="#4a0000">
              <circle cx="0" cy="0" r="15" />
              <rect x="-1" y="0" width="2.5" height="120" rx="1" />
              <circle cx="0" cy="120" r="4" />
            </g>

            {/* Bottom Left Splatter */}
            <g transform="translate(300, 800) rotate(-20)" fill="#4a0000" filter="url(#goo)">
              <circle cx="0" cy="0" r="35" />
              <circle cx="-20" cy="15" r="15" />
              <rect x="0" y="20" width="3" height="60" rx="1.5" />
              <circle cx="2" cy="80" r="5" />
            </g>

            {/* Top Right Splatter */}
            <g transform="translate(1400, 150) rotate(45)" fill="#5e0000" filter="url(#goo)">
              <circle cx="0" cy="0" r="20" />
              <circle cx="10" cy="20" r="12" />
              <rect x="5" y="10" width="2" height="50" rx="1" />
            </g>

            {/* More scattered droplets */}
            <g fill="#4a0000">
              <circle cx="200" cy="400" r="2" />
              <circle cx="600" cy="100" r="1" />
              <circle cx="900" cy="800" r="4" />
              <circle cx="1500" cy="300" r="2" />
              <circle cx="100" cy="900" r="3" />
              <circle cx="1800" cy="100" r="2" />
              <circle cx="1000" cy="50" r="1.5" />
              <circle cx="1100" cy="950" r="5" fill="#2b0202" />
            </g>

            {/* Large central-ish wash (even darker) */}
            <path
              d="M700,450 Q750,400 850,450 T950,550 T750,650 Z"
              fill="#1a0101"
              className="opacity-30"
            />

            {/* Runny streak near suspect */}
            <g transform="translate(450, 150) rotate(10)" fill="#4a0000">
              <circle cx="0" cy="0" r="12" />
              <rect x="-0.5" y="0" width="1.5" height="150" rx="0.5" />
              <circle cx="0" cy="150" r="3" />
            </g>

            {/* Extra thick pool bottom left */}
            <g transform="translate(100, 850)" fill="#3e0101" filter="url(#goo)">
              <ellipse cx="0" cy="0" rx="80" ry="30" />
              <circle cx="40" cy="10" r="20" />
              <circle cx="-30" cy="15" r="25" />
            </g>

            {/* Fine splatter spray */}
            <g fill="#5e0000">
              {[...Array(20)].map((_, i) => (
                <circle
                  key={i}
                  cx={Math.random() * 2000}
                  cy={Math.random() * 1000}
                  r={Math.random() * 2}
                  className="opacity-60"
                />
              ))}
            </g>

            {/* Runny streak middle left */}
            <g transform="translate(100, 300)" fill="#4a0000">
              <circle cx="0" cy="0" r="10" />
              <rect x="-0.5" y="0" width="1.5" height="200" rx="0.5" />
              <circle cx="0" cy="200" r="3" />
            </g>

            <path
              d="M200,100 Q300,50 400,150 T600,100"
              fill="none"
              stroke="#5e0000"
              strokeWidth="2"
              className="opacity-10"
            />
          </svg>
        </div>

        <Navigation />
        <main className="min-h-screen pt-16 md:pt-20 relative z-10">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
