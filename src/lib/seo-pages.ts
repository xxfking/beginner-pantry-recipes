export type SeoPage = {
  path: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  intent: string;
  seedIngredients: string[];
  equipment: string[];
  timeLimit: "10" | "20" | "30" | "45";
  promise: string;
  intro: string;
  beginnerTips: string[];
  recipeIdeas: string[];
  safetyFocus: string[];
  faqs: { question: string; answer: string }[];
};

type SeoSeed = Omit<
  SeoPage,
  "title" | "description" | "intro" | "beginnerTips" | "faqs"
> & {
  descFocus: string;
  coreMethod: string;
};

const seeds: SeoSeed[] = [
  {
    path: "/what-can-i-make-with/chicken-rice-eggs",
    keyword: "what can I make with chicken rice eggs",
    h1: "What Can I Make With Chicken, Rice, and Eggs?",
    intent: "A fast meal from three common ingredients that still feels complete.",
    seedIngredients: ["chicken", "rice", "eggs"],
    equipment: ["skillet", "rice cooker", "saucepan"],
    timeLimit: "30",
    promise: "Use cooked rice for speed, scramble the eggs separately, and cook chicken until the center is safe.",
    coreMethod: "Cook chicken first, fold in rice after the pan is hot, then add eggs at the end so they stay tender.",
    descFocus: "safe fried rice, rice bowls, and beginner chicken dinners",
    recipeIdeas: ["Chicken egg fried rice", "Soft chicken rice bowl with egg", "One-pan chicken rice scramble"],
    safetyFocus: ["Cook chicken to 165 degrees F.", "Cool leftover rice quickly and reheat until steaming hot."],
  },
  {
    path: "/easy-recipes-with/chicken-and-potatoes",
    keyword: "easy recipes with chicken and potatoes",
    h1: "Easy Recipes With Chicken and Potatoes",
    intent: "A familiar dinner using two staple ingredients and one pan.",
    seedIngredients: ["chicken", "potatoes"],
    equipment: ["sheet pan", "skillet", "air fryer"],
    timeLimit: "45",
    promise: "Cut potatoes small, season simply, and cook chicken to a safe center temperature.",
    coreMethod: "Start potatoes first, brown the chicken, then finish both with a lid or oven-style covered pan timing.",
    descFocus: "skillet dinners, sheet-pan style meals, and air fryer ideas",
    recipeIdeas: ["Chicken and potato hash", "Sheet-pan style chicken bites", "Air fryer chicken with potato wedges"],
    safetyFocus: ["Cook chicken to 165 degrees F.", "Keep raw chicken juices away from cooked potatoes."],
  },
  {
    path: "/beginner-recipes-with/ground-beef",
    keyword: "beginner recipes with ground beef",
    h1: "Beginner Recipes With Ground Beef",
    intent: "A low-stress way to turn ground beef into dinner without advanced techniques.",
    seedIngredients: ["ground beef", "onion", "rice"],
    equipment: ["skillet", "saucepan"],
    timeLimit: "30",
    promise: "Brown the beef fully, drain excess fat if needed, and build flavor with pantry seasonings.",
    coreMethod: "Break beef into small crumbles, cook until no pink remains, then add sauce, rice, pasta, or tortillas.",
    descFocus: "rice bowls, pasta sauce, tacos, and skillet dinners",
    recipeIdeas: ["Ground beef rice bowl", "Beginner taco skillet", "Simple beef pasta sauce"],
    safetyFocus: ["Cook ground beef to 160 degrees F.", "Use a clean spoon for tasting after raw meat has cooked."],
  },
  {
    path: "/one-pan-dinner-with/rice",
    keyword: "one pan dinner with rice",
    h1: "One-Pan Dinner With Rice",
    intent: "A filling dinner with fewer dishes and simple timing.",
    seedIngredients: ["rice", "onion", "frozen vegetables", "chicken broth"],
    equipment: ["wide skillet", "lid"],
    timeLimit: "45",
    promise: "Toast the rice, add measured liquid, cover the pan, and keep proteins safe.",
    coreMethod: "Treat rice as the timer: add long-cooking ingredients early and quick vegetables near the end.",
    descFocus: "covered skillet rice, tomato rice, and protein rice bowls",
    recipeIdeas: ["Tomato rice skillet", "Chicken broth rice with peas", "Egg and vegetable rice pan"],
    safetyFocus: ["Cook raw meat before adding rice or cut it small.", "Refrigerate cooked rice within 2 hours."],
  },
  {
    path: "/recipes-without/oven",
    keyword: "recipes without oven",
    h1: "Recipes Without an Oven",
    intent: "A cooking path for dorms, small kitchens, hot days, and broken ovens.",
    seedIngredients: ["eggs", "rice", "canned beans", "frozen vegetables"],
    equipment: ["skillet", "microwave", "rice cooker"],
    timeLimit: "30",
    promise: "Choose stovetop, microwave, rice cooker, or air fryer methods that fit your kitchen.",
    coreMethod: "Use one heat source at a time and match the recipe to the equipment you actually have.",
    descFocus: "stovetop meals, microwave bowls, rice cooker dinners, and air fryer shortcuts",
    recipeIdeas: ["Skillet rice bowl", "Microwave potato dinner", "Saucepan pasta with vegetables"],
    safetyFocus: ["Use microwave-safe containers only.", "Stir microwave meals halfway through to reduce cold spots."],
  },
  {
    path: "/use-up/leftover-rice",
    keyword: "use up leftover rice",
    h1: "Use Up Leftover Rice Safely",
    intent: "A safe and practical way to turn cold rice into a meal.",
    seedIngredients: ["leftover rice", "eggs", "frozen peas", "soy sauce"],
    equipment: ["skillet", "microwave"],
    timeLimit: "20",
    promise: "Reheat rice until steaming hot and add quick proteins or vegetables for a complete dish.",
    coreMethod: "Break up cold rice clumps, heat them thoroughly, then add sauce after the grains are hot.",
    descFocus: "fried rice, tuna rice bowls, and tomato rice skillets",
    recipeIdeas: ["Egg fried rice", "Tuna rice bowl", "Tomato rice skillet with beans"],
    safetyFocus: ["Reheat leftover rice until steaming hot.", "Keep cooked rice refrigerated and discard uncertain portions."],
  },
  {
    path: "/what-can-i-cook-with/eggs-and-bread",
    keyword: "what can I cook with eggs and bread",
    h1: "What Can I Cook With Eggs and Bread?",
    intent: "A fast meal from two ingredients nearly every kitchen has.",
    seedIngredients: ["eggs", "bread", "cheese"],
    equipment: ["skillet", "toaster"],
    timeLimit: "10",
    promise: "Toast the bread, cook eggs to your preferred texture, and add one simple topping.",
    coreMethod: "Cook the bread and eggs separately when you want control, then combine them while both are warm.",
    descFocus: "egg toast, skillet sandwiches, and breakfast-for-dinner meals",
    recipeIdeas: ["Egg-in-a-hole toast", "Savory French toast", "Open-faced scrambled egg sandwich"],
    safetyFocus: ["Cook eggs until the white and yolk are firm for the safest beginner default."],
  },
  {
    path: "/easy-pantry-meals-for-beginners",
    keyword: "easy pantry meals for beginners",
    h1: "Easy Pantry Meals for Beginners",
    intent: "A reliable first cooking plan when the fridge is nearly empty.",
    seedIngredients: ["pasta", "canned beans", "rice", "eggs", "frozen vegetables"],
    equipment: ["skillet", "saucepan", "microwave"],
    timeLimit: "30",
    promise: "Start with one starch, one protein, one vegetable, and one sauce.",
    coreMethod: "Pick a base first, add a shelf-stable protein, then finish with sauce and texture.",
    descFocus: "canned beans, pasta, rice, eggs, frozen vegetables, and simple sauces",
    recipeIdeas: ["Bean tomato pasta", "Egg rice bowl", "Microwave potato with tuna"],
    safetyFocus: ["Heat canned foods until hot when serving warm.", "Refrigerate opened cans in clean containers."],
  },
  {
    path: "/recipes-with/canned-tuna-and-rice",
    keyword: "recipes with canned tuna and rice",
    h1: "Recipes With Canned Tuna and Rice",
    intent: "A fast shelf-stable meal with real protein.",
    seedIngredients: ["canned tuna", "rice", "cucumber", "mayonnaise"],
    equipment: ["microwave", "rice cooker", "mixing bowl"],
    timeLimit: "20",
    promise: "Use warm rice or cold rice, then add tuna, crunch, and sauce.",
    coreMethod: "Drain tuna well, pair it with rice, and add cucumber, corn, pickles, or peas for texture.",
    descFocus: "spicy tuna bowls, tuna fried rice, and cold rice salads",
    recipeIdeas: ["Spicy tuna rice bowl", "Tuna fried rice", "Cold tuna rice salad"],
    safetyFocus: ["Refrigerate leftover tuna rice promptly.", "Keep opened tuna in a covered container in the fridge."],
  },
  {
    path: "/what-to-make-with/pasta-and-tomato-sauce",
    keyword: "what to make with pasta and tomato sauce",
    h1: "What to Make With Pasta and Tomato Sauce",
    intent: "A basic pasta dinner that can become more filling with one or two add-ins.",
    seedIngredients: ["pasta", "tomato sauce", "onion", "cheese"],
    equipment: ["pot", "skillet"],
    timeLimit: "20",
    promise: "Cook pasta until just tender, warm the sauce separately, and add one protein or vegetable.",
    coreMethod: "Salt the pasta water, save starchy water, and finish pasta in sauce for one minute.",
    descFocus: "tomato pasta, bean pasta, beef pasta, and tuna pasta",
    recipeIdeas: ["Tomato pasta with white beans", "Ground beef tomato pasta", "Tuna tomato pasta"],
    safetyFocus: ["Cook raw meat add-ins fully before mixing them with sauce.", "Refrigerate leftover pasta within 2 hours."],
  },
  {
    path: "/what-can-i-make-with/eggs-potatoes-onions",
    keyword: "what can I make with eggs potatoes onions",
    h1: "What Can I Make With Eggs, Potatoes, and Onions?",
    intent: "A cheap, filling meal from three simple ingredients.",
    seedIngredients: ["eggs", "potatoes", "onions"],
    equipment: ["skillet", "lid"],
    timeLimit: "30",
    promise: "Cook potatoes first, soften onions second, and add eggs at the end.",
    coreMethod: "Cut potatoes small, soften onions until glossy, then make space for eggs in the pan.",
    descFocus: "hashes, skillet eggs, and breakfast-for-dinner bowls",
    recipeIdeas: ["Potato onion hash with eggs", "Soft egg and potato skillet", "Breakfast-for-dinner bowl"],
    safetyFocus: ["Cook eggs until the white and yolk are firm for a safe beginner default."],
  },
  {
    path: "/easy-recipes-with/canned-beans",
    keyword: "easy recipes with canned beans",
    h1: "Easy Recipes With Canned Beans",
    intent: "A fast protein option that avoids raw meat handling.",
    seedIngredients: ["canned beans", "rice", "tomato sauce", "corn"],
    equipment: ["saucepan", "skillet", "microwave"],
    timeLimit: "20",
    promise: "Drain or rinse the beans, warm them with seasoning, and pair them with a base.",
    coreMethod: "Simmer beans with sauce for a few minutes so they absorb flavor instead of tasting plain.",
    descFocus: "bean rice bowls, bean pasta, and chickpea toast",
    recipeIdeas: ["Black bean rice bowl", "White bean tomato pasta", "Chickpea toast"],
    safetyFocus: ["Refrigerate opened canned beans in a clean covered container."],
  },
  {
    path: "/recipes-with/frozen-vegetables-and-rice",
    keyword: "recipes with frozen vegetables and rice",
    h1: "Recipes With Frozen Vegetables and Rice",
    intent: "A quick meal formula using freezer staples.",
    seedIngredients: ["frozen vegetables", "rice", "eggs", "soy sauce"],
    equipment: ["skillet", "microwave"],
    timeLimit: "20",
    promise: "Heat vegetables fully, add rice, then finish with protein and sauce.",
    coreMethod: "Cook frozen vegetables until the pan looks mostly dry, then add rice and sauce.",
    descFocus: "vegetable fried rice, rice bowls, and freezer-friendly skillet meals",
    recipeIdeas: ["Vegetable egg fried rice", "Broccoli tuna rice bowl", "Bean vegetable rice skillet"],
    safetyFocus: ["Heat frozen vegetables until hot throughout.", "Refrigerate rice bowls within 2 hours."],
  },
  {
    path: "/what-to-cook-with/chicken-breast-and-pasta",
    keyword: "what to cook with chicken breast and pasta",
    h1: "What to Cook With Chicken Breast and Pasta",
    intent: "A safe, simple pasta dinner with lean protein.",
    seedIngredients: ["chicken breast", "pasta", "tomato sauce", "spinach"],
    equipment: ["pot", "skillet"],
    timeLimit: "30",
    promise: "Cut chicken evenly, cook it first, and finish pasta in sauce.",
    coreMethod: "Cook chicken pieces until safe, remove them briefly, then bring everything together in sauce.",
    descFocus: "chicken tomato pasta, garlic chicken pasta, and creamy beginner pasta",
    recipeIdeas: ["Chicken tomato pasta", "Garlic chicken pasta with peas", "Yogurt lemon chicken pasta"],
    safetyFocus: ["Cook chicken breast to 165 degrees F.", "Use separate tools for raw chicken and cooked pasta."],
  },
  {
    path: "/beginner-meals-with/rotisserie-chicken",
    keyword: "beginner meals with rotisserie chicken",
    h1: "Beginner Meals With Rotisserie Chicken",
    intent: "A shortcut protein for fast meals.",
    seedIngredients: ["rotisserie chicken", "rice", "tortillas", "lettuce"],
    equipment: ["microwave", "skillet", "saucepan"],
    timeLimit: "20",
    promise: "Use cooked chicken as a shortcut, then build bowls, wraps, soups, or pasta.",
    coreMethod: "Shred the chicken, reheat it gently with moisture, then pair it with a base and sauce.",
    descFocus: "rice bowls, wraps, soups, and pasta using cooked chicken",
    recipeIdeas: ["Rotisserie chicken rice bowl", "Chicken noodle soup", "Chicken yogurt wrap"],
    safetyFocus: ["Reheat leftover chicken to 165 degrees F.", "Refrigerate portions promptly after removing meat from the bird."],
  },
  {
    path: "/missing-one-ingredient/chicken-curry",
    keyword: "missing one ingredient chicken curry",
    h1: "Missing One Ingredient for Chicken Curry?",
    intent: "A substitution guide for a meal that is already started.",
    seedIngredients: ["chicken", "curry powder", "rice", "yogurt"],
    equipment: ["skillet", "saucepan"],
    timeLimit: "30",
    promise: "Use pantry swaps for cream, coconut milk, tomato, onions, or vegetables.",
    coreMethod: "Toast curry powder in oil, add a liquid swap gently, and keep the chicken safety target unchanged.",
    descFocus: "curry substitutions, coconut-free curry, and pantry curry sauce",
    recipeIdeas: ["Yogurt chicken curry", "Tomato chicken curry", "Coconut-free curry skillet"],
    safetyFocus: ["Cook chicken to 165 degrees F.", "Keep dairy-based sauces below a hard boil."],
  },
  {
    path: "/recipes-with/eggs-and-spinach",
    keyword: "recipes with eggs and spinach",
    h1: "Recipes With Eggs and Spinach",
    intent: "A fast green meal with minimal prep.",
    seedIngredients: ["eggs", "spinach", "bread", "cheese"],
    equipment: ["skillet", "toaster"],
    timeLimit: "10",
    promise: "Wilt spinach first, add eggs second, and stop when the eggs are just set.",
    coreMethod: "Cook off spinach moisture before eggs go in so the finished dish stays tender.",
    descFocus: "spinach eggs, toast, rice bowls, and beginner omelets",
    recipeIdeas: ["Spinach scrambled eggs on toast", "Egg spinach rice bowl", "Cheesy spinach omelet"],
    safetyFocus: ["Cook eggs until the white and yolk are firm for the safest beginner default."],
  },
  {
    path: "/recipes-with/canned-tomatoes-and-rice",
    keyword: "recipes with canned tomatoes and rice",
    h1: "Recipes With Canned Tomatoes and Rice",
    intent: "A pantry-based meal with sauce and starch built in.",
    seedIngredients: ["canned tomatoes", "rice", "beans", "onion"],
    equipment: ["skillet", "saucepan"],
    timeLimit: "30",
    promise: "Simmer tomatoes with rice, add protein, and keep the liquid ratio steady.",
    coreMethod: "Add extra water or broth because tomatoes alone may not hydrate rice evenly.",
    descFocus: "tomato rice, rice soup, bean skillets, and pantry bowls",
    recipeIdeas: ["Tomato rice with black beans", "Canned tomato rice soup", "Skillet tomato rice with egg"],
    safetyFocus: ["Refrigerate cooked rice within 2 hours.", "Heat canned tomato dishes until bubbling hot."],
  },
  {
    path: "/no-grocery-dinner-ideas",
    keyword: "no grocery dinner ideas",
    h1: "No-Grocery Dinner Ideas",
    intent: "Dinner from what is already available at home.",
    seedIngredients: ["rice", "eggs", "canned beans", "frozen vegetables", "pasta"],
    equipment: ["skillet", "saucepan", "microwave"],
    timeLimit: "30",
    promise: "Pick a base, add protein, use a vegetable, and finish with a sauce.",
    coreMethod: "Take inventory first, then choose a bowl, skillet, pasta, soup, or wrap format.",
    descFocus: "pantry dinners, fridge clean-out meals, freezer staples, and leftover ideas",
    recipeIdeas: ["Pasta with beans and tomato sauce", "Rice bowl with egg", "Potato skillet with tuna"],
    safetyFocus: ["Discard food that smells off, looks spoiled, or sat out too long.", "Reheat leftovers to 165 degrees F."],
  },
  {
    path: "/what-can-i-make-with/pantry-staples",
    keyword: "what can I make with pantry staples",
    h1: "What Can I Make With Pantry Staples?",
    intent: "A flexible recipe generator page for shelf-stable ingredients.",
    seedIngredients: ["rice", "pasta", "beans", "canned tomatoes", "tuna", "oats"],
    equipment: ["skillet", "saucepan", "microwave"],
    timeLimit: "30",
    promise: "Turn shelf-stable ingredients into bowls, pasta, soups, wraps, or breakfast-for-dinner.",
    coreMethod: "Build from a base, a protein, a sauce, and one texture contrast.",
    descFocus: "rice, pasta, beans, canned tomatoes, tuna, oats, and sauces",
    recipeIdeas: ["Canned tomato bean pasta", "Tuna rice bowl", "Oatmeal with banana"],
    safetyFocus: ["Check cans for damage before opening.", "Store opened canned foods in clean covered containers."],
  },
];

function titleCaseKeyword(keyword: string) {
  return keyword.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function buildPage(seed: SeoSeed): SeoPage {
  const ingredients = seed.seedIngredients.join(", ");
  return {
    ...seed,
    title: `${seed.h1} | Beginner Pantry Recipes`,
    description: `Generate ${seed.descFocus} from ${ingredients}. Get beginner steps, substitutions, safety notes, and missing-ingredient ideas.`,
    intro: `${seed.intent} Start with ${ingredients}. ${seed.coreMethod} The generator on this page keeps the same ingredients editable, so you can remove anything you do not have, add pantry staples, and ask for a beginner recipe that fits your time, equipment, diet, allergies, and serving count.`,
    beginnerTips: [
      `Check your ingredients first: ${ingredients}. Remove anything spoiled, expired, or uncertain before cooking.`,
      seed.coreMethod,
      `Keep the first version simple. Use ${seed.equipment[0]} as the main tool and add only one sauce or seasoning direction.`,
      seed.promise,
      "Read every step before turning on heat so timing feels predictable.",
      "Taste at the end and adjust with salt, acid, heat, or a small amount of fat.",
    ],
    faqs: [
      {
        question: `Can beginners make ${seed.h1.toLowerCase()}?`,
        answer: `Yes. This page is built for beginner cooks and keeps the method focused on ${seed.equipment[0]}, clear timing, and visible doneness cues.`,
      },
      {
        question: `What if I am missing one ingredient for ${titleCaseKeyword(seed.keyword)}?`,
        answer:
          "Use the generator to list what you have. It will separate required ingredients from optional staples and suggest substitutions when the meal can still work.",
      },
      {
        question: "How does the safety guidance work?",
        answer:
          "The recipe generator adds fixed food-safety notes for poultry, ground meat, fish, eggs, leftovers, and refrigerated storage.",
      },
    ],
  };
}

export const seoPages: SeoPage[] = seeds.map(buildPage);

export function getSeoPageByPath(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return seoPages.find((page) => page.path === normalized);
}

export function slugToPath(slug: string[]) {
  return `/${slug.join("/")}`;
}

export function getSeoPageStaticParams() {
  return seoPages.map((page) => ({
    slug: page.path.split("/").filter(Boolean),
  }));
}
