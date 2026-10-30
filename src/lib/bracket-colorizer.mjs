// Build-time Shiki transformer: color nested bracket pairs by depth.
// Runs during `astro build`, never in the browser, so it costs nothing at
// request time. Palette is anchored to the site's pink accent and stays
// muted enough to sit alongside the github-dark token colors.

const OPEN = new Set(["(", "[", "{"]);
const CLOSE = new Set([")", "]", "}"]);

const isBracket = (ch) => OPEN.has(ch) || CLOSE.has(ch);

// Split a token so each bracket character becomes its own token, keeping
// offsets correct (mirrors shiki's `splitToken` but filters empty pieces).
function splitTokenAt(token, breakpoints) {
  const offsets = [...new Set(breakpoints)]
    .filter((o) => o > 0 && o < token.content.length)
    .sort((a, b) => a - b);
  if (offsets.length === 0) return [token];
  const parts = [];
  let last = 0;
  for (const o of offsets) {
    parts.push({
      ...token,
      content: token.content.slice(last, o),
      offset: token.offset + last,
    });
    last = o;
  }
  parts.push({
    ...token,
    content: token.content.slice(last),
    offset: token.offset + last,
  });
  return parts.filter((p) => p.content.length > 0);
}

const DEFAULT_COLORS = [
  "#ff79c6", // pink
  "#bd93f9", // purple
  "#8be9fd", // cyan
  "#50fa7b", // green
  "#f1fa8c", // yellow
  "#ffb86c", // orange
];

export function bracketColorizer(colors = DEFAULT_COLORS) {
  return {
    name: "bracket-colorizer",
    tokens(lines) {
      let depth = 0;
      return lines.map((line) => {
        const out = [];
        for (const token of line) {
          const { content } = token;
          // Leave comments (1), strings (2), and regex (3) alone; only real
          // bracket structure gets recolored.
          if (
            !content ||
            token.type === 1 ||
            token.type === 2 ||
            token.type === 3 ||
            !/[()[\]{}]/.test(content)
          ) {
            out.push(token);
            continue;
          }
          const breakpoints = [];
          for (let i = 0; i < content.length; i++) {
            if (isBracket(content[i])) breakpoints.push(i, i + 1);
          }
          for (const part of splitTokenAt(token, breakpoints)) {
            const ch = part.content;
            if (ch.length === 1 && isBracket(ch)) {
              if (OPEN.has(ch)) {
                depth += 1;
              } else if (depth === 0) {
                // Unbalanced closing bracket: leave its original color.
                out.push(part);
                continue;
              }
              const color = colors[(depth - 1) % colors.length];
              if (CLOSE.has(ch)) depth -= 1;
              out.push({
                ...part,
                color,
                htmlStyle: undefined,
                htmlAttrs: undefined,
              });
            } else {
              out.push(part);
            }
          }
        }
        return out;
      });
    },
  };
}
