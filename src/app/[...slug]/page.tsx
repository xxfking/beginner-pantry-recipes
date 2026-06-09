import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { RecipeTool } from "@/components/RecipeTool";
import {
  getSeoPageByPath,
  getSeoPageStaticParams,
  seoPages,
  slugToPath,
} from "@/lib/seo-pages";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { buildSeoPageJsonLd } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return getSeoPageStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPageByPath(slugToPath(slug));

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: absoluteUrl(page.path),
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: absoluteUrl(page.path),
      type: "article",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary",
      title: page.title,
      description: page.description,
    },
  };
}

export default async function SeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoPageByPath(slugToPath(slug));

  if (!page) {
    notFound();
  }

  return (
    <main className="site-shell">
      <JsonLd data={buildSeoPageJsonLd(page)} />
      <header className="site-header">
        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Beginner Pantry Recipes home">
            <span className="brand-mark">B</span>
            <span>
              <span className="block font-display text-lg font-semibold leading-5">{siteConfig.name}</span>
              <span className="block text-[11px] font-medium text-[color:var(--muted)]">{siteConfig.tagline}</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-black md:flex" aria-label="Main navigation">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} className="border-b border-transparent py-2 transition hover:border-black">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden justify-end text-[13px] font-semibold text-black md:flex">EN</div>
        </div>
      </header>

      <article>
        <section className="mx-auto w-full max-w-[1500px] px-4 pt-10 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="display-heading text-[clamp(3rem,5vw,6rem)] text-black">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] leading-7 text-[color:var(--muted)]">{page.intro}</p>
          </div>
        </section>

        <RecipeTool seedIngredients={page.seedIngredients} pageIntent={page.intent} />

        <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="section-rule grid gap-8 pt-10 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <h2 className="font-display text-3xl font-medium text-black">
                Beginner method for {page.keyword}
              </h2>
              <p className="mt-4 text-base leading-8 text-[color:var(--muted)]">{page.promise}</p>
              <div className="mt-6 space-y-4">
                {page.beginnerTips.map((tip, index) => (
                  <div key={tip} className="border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-4">
                    <p className="text-sm font-semibold text-[color:var(--swedish-blue)]">Step {index + 1}</p>
                    <p className="mt-1 text-base leading-7 text-[color:var(--muted)]">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-medium text-black">Recipe ideas</h2>
                <ul className="mt-4 space-y-3 text-base leading-7 text-[color:var(--muted)]">
                  {page.recipeIdeas.map((idea) => (
                    <li key={idea} className="border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-3">
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl font-medium text-black">Safety notes</h2>
                <ul className="mt-4 space-y-3 text-base leading-7 text-[color:var(--muted)]">
                  {page.safetyFocus.map((note) => (
                    <li key={note} className="border border-[color:var(--safety-green)] bg-[#edf6ef] p-3 text-[#174b30]">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <section className="section-rule mt-10 pt-10">
            <h2 className="font-display text-3xl font-medium text-black">FAQ</h2>
            <div className="mt-5 grid gap-4">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-4">
                  <h3 className="text-base font-semibold text-black">{faq.question}</h3>
                  <p className="mt-2 text-base leading-7 text-[color:var(--muted)]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section-rule mt-10 pt-10">
            <h2 className="font-display text-3xl font-medium text-black">More pantry searches</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {seoPages
                .filter((related) => related.path !== page.path)
                .slice(0, 6)
                .map((related) => (
                  <Link
                    key={related.path}
                    href={related.path}
                    className="border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-4 text-sm font-semibold leading-6 text-black transition hover:border-[color:var(--swedish-blue)] hover:text-[color:var(--swedish-blue)]"
                  >
                    {related.h1}
                  </Link>
                ))}
            </div>
          </section>
        </section>
      </article>
    </main>
  );
}
