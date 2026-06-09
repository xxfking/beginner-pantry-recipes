import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Beginner Pantry Recipes.",
  alternates: {
    canonical: absoluteUrl("/terms"),
  },
};

export default function TermsPage() {
  return (
    <main className="site-shell px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-[color:var(--swedish-blue)]">
          {siteConfig.name}
        </Link>
        <h1 className="display-heading mt-6 text-5xl">Terms of Service</h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-[color:var(--muted)]">
          <p>
            Beginner Pantry Recipes provides recipe suggestions for general home cooking. Generated recipes
            require user judgment and safe food handling.
          </p>
          <p>
            Users are responsible for checking ingredient freshness, allergies, dietary restrictions, cooking
            temperatures, and local food safety guidance.
          </p>
          <p>
            The service may refuse unsafe or non-food inputs. The service can also fail when provider keys,
            network access, or AI model responses are unavailable.
          </p>
          <p>
            Recipes and SEO pages are provided as informational content. The MVP includes no medical,
            nutritional, or professional dietary advice.
          </p>
        </div>
      </div>
    </main>
  );
}
