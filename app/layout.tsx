import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { sitePath } from "@/lib/site-url";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Mortgage Lead Center";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: "Get mortgage payment estimates and request personalized rate options.",
  applicationName: siteName,
  manifest: sitePath("/manifest.webmanifest"),
  icons: {
    icon: sitePath("/icons/icon.svg"),
    apple: sitePath("/icons/icon.svg"),
  },
};

export const viewport: Viewport = {
  themeColor: "#164e63",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
