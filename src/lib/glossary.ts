// Shared glossary for the `<Def>` component.
//
// Add a term here once, then reference it from any post (this one or a
// later one) with `<Def term="proposition" />`. Hovering the rendered word
// shows the definition plus, if you set `href`, a "more details" link.
//
// Keys are matched case-insensitively. Keep them lowercase here.

export interface GlossaryEntry {
  definition: string;
  href?: string;
}

export const glossary: Record<string, GlossaryEntry> = {
  proposition: {
    definition:
      "a declarative statement that is either true or false, but not both.",
    // href: "https://en.wikipedia.org/wiki/Proposition",
  },
  "compound proposition": {
    definition:
      "combines one or more simple propositions using a logical connective.",
  },
  implication: {
    definition:
      "written p → q and read \"if p, then q\"; false only when p is true and q is false.",
  },
  "truth table": {
    definition:
      "lists the result of a compound proposition for every possible combination of truth values.",
  },
};

export function lookupTerm(term: string): GlossaryEntry | undefined {
  return glossary[term.trim().toLowerCase()];
}
