# aunchers

source for [aunchers.org](https://aunchers.org).

blog posts and projects live in `src/content` as mdx. the three themes (bat,
midnight, paper) and the rest of the styling are in `src/styles/global.css`.

Use `InlineImage` for an inline image and label, with an optional link:

```astro
import InlineImage from "@/components/InlineImage.astro";

<InlineImage src="/pfp/equine.webp" label="Equine Browser" href="https://github.com/aunchers/equine" />
```

`src` accepts any image URL, so the same component works for people, projects,
and other icons. Omit `href` for an unlinked label.

## running it

```bash
bun install
bun run dev
```

`bun run build` writes the static site to `dist/`.
