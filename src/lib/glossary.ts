// terms for <Def>. keys are lowercase, matching is case-insensitive.

export interface GlossaryEntry {
  definition: string;
  href?: string;
}

export const glossary: Record<string, GlossaryEntry> = {
  proposition: {
    definition:
      "a declarative statement that is either true or false, but not both.",
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
