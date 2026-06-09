import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Beginner Pantry Recipes.",
  alternates: {
    canonical: absoluteUrl("/privacy"),
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] px-4 py-12 text-stone-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-emerald-700">
          {siteConfig.name}
        </Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">Privacy Policy</h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-stone-700">
          <p>
            Beginner Pantry Recipes processes uploaded images and ingredient text only to analyze ingredients
            and generate recipes during the current request.
          </p>
          <p>
            The MVP stores no accounts, uploaded photos, ingredient lists, generated recipes, or payment
            details in a database.
          </p>
          <p>
            The app may send request content to the configured AI provider for ingredient analysis and recipe
            generation. Production deployments should review the provider account settings and applicable data
            retention controls.
          </p>
          <p>
            Basic analytics can be added after launch to measure page views, search performance, and tool
            usage. Analytics should avoid collecting recipe text or uploaded images.
          </p>
        </div>
      </div>
    </main>
  );
}
