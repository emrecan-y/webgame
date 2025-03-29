import { CensorType, Profanity } from "@2toad/profanity";
import { createContext, PropsWithChildren } from "react";

type ProfanityFilterContextProviderType = {
  profanity: Profanity | undefined;
  censor: (input: string) => string;
};

export const ProfanityFilterContext =
  createContext<ProfanityFilterContextProviderType>({
    profanity: undefined,
    censor: () => "",
  });

export function ProfanityFilterContextProvider({
  children,
}: PropsWithChildren) {
  const profanity = new Profanity({
    languages: ["en", "de"],
    wholeWord: false,
    grawlixChar: "*",
  });
  profanity.whitelist.addWords(generatedNames);
  function censor(input: string) {
    return profanity.censor(input, CensorType.AllVowels);
  }
  return (
    <ProfanityFilterContext.Provider
      value={{ profanity: profanity, censor: censor }}
    >
      {children}
    </ProfanityFilterContext.Provider>
  );
}

const generatedNames = [
  "Fluffy",
  "Sneaky",
  "Grumpy",
  "Soggy",
  "Wobbly",
  "Chubby",
  "Sticky",
  "Noodle",
  "Wacky",
  "Slippery",
  "Goofy",
  "Beefy",
  "Zany",
  "Lumpy",
  "Chunky",
  "Wiggly",
  "Spicy",
  "Jumping",
  "Bouncy",
  "Silly",
  "Funky",
  "Gravy",
  "Soggy",
  "Squishy",
  "Mighty",
  "Plump",
  "Gassy",
  "Hairy",
  "Lazy",
  "Odd",
  "Pickle",
  "Noodle",
  "Muffin",
  "Waffle",
  "Donut",
  "Taco",
  "Banana",
  "Bubble",
  "Pickles",
  "Fuzz",
  "Gravy",
  "Potato",
  "Nacho",
  "Wiggle",
  "Toaster",
  "Snickers",
  "Jellybean",
  "Lemon",
  "Bacon",
  "Cupcake",
  "Peanut",
  "Spaghetti",
  "Cucumber",
  "Cabbage",
  "Popcorn",
  "Broccoli",
  "Gizmo",
  "Cheese",
  "Burrito",
  "Pickles",
];
