import type { SeoPage } from "@/lib/seo-pages";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function buildHomeJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: siteConfig.name,
      applicationCategory: "FoodApplication",
      operatingSystem: "Web",
      url: absoluteUrl("/"),
      description: siteConfig.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Can I generate a recipe from a pantry photo?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Upload a pantry or fridge photo, confirm the ingredients, then generate a beginner-friendly recipe from the confirmed list.",
          },
        },
        {
          "@type": "Question",
          name: "Does the tool store my photo?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The MVP sends the image for the current analysis request and writes neither photos nor ingredient text to a database.",
          },
        },
      ],
    },
  ];
}

export function buildSeoPageJsonLd(page: SeoPage) {
  const url = absoluteUrl(page.path);
  const image = absoluteUrl("/recipe-placeholder.svg");

  return [
    {
      "@context": "https://schema.org",
      "@type": "Recipe",
      name: page.h1,
      image: [image],
      description: page.description,
      keywords: page.keyword,
      recipeCategory: "Beginner dinner",
      recipeCuisine: "Home cooking",
      prepTime: "PT10M",
      cookTime: `PT${page.timeLimit}M`,
      totalTime: `PT${Number(page.timeLimit) + 10}M`,
      recipeYield: "2 servings",
      recipeIngredient: page.seedIngredients,
      recipeInstructions: page.recipeIdeas.map((idea, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        text: idea,
      })),
      author: {
        "@type": "Organization",
        name: siteConfig.name,
      },
      mainEntityOfPage: url,
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: page.h1,
      description: page.promise,
      totalTime: `PT${page.timeLimit}M`,
      step: page.beginnerTips.map((tip, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        text: tip,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${page.h1} recipe ideas`,
      itemListElement: page.recipeIdeas.map((idea, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: idea,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];
}
