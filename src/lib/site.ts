export const siteConfig = {
  name: "Beginner Pantry Recipes",
  shortName: "Pantry Recipes",
  tagline: "Recipe Generator From Ingredients You Have",
  description:
    "Upload pantry ingredients, confirm what you have, and generate beginner-safe recipes with step-by-step cooking guidance.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://beginnerpantryrecipes.com",
  author: "Beginner Pantry Recipes",
  nav: [
    { href: "/", label: "Generator" },
    { href: "/easy-pantry-meals-for-beginners", label: "Beginner meals" },
    { href: "/recipes-without/oven", label: "No oven" },
    { href: "/use-up/leftover-rice", label: "Use leftovers" },
  ],
};

export function absoluteUrl(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url.replace(/\/$/, "")}${cleanPath}`;
}
