# chairs

my personal site. lives at [aunchers.org](https://aunchers.org).

static html and css, built with [astro](https://astro.build). no framework runtime, no hydration, no bundle. posts and projects are mdx content collections, everything else is just pages.

## stack

- astro, static output
- mdx for posts and projects
- plain css (no tailwind)
- fira code, self-hosted
- built and deployed with bun via github actions to github pages

## structure

```
/
├── public/
├── src/
│   ├── components/
│   ├── content/
│   │   ├── posts/
│   │   └── projects/
│   ├── layouts/
│   └── pages/
└── astro.config.mjs
```

posts go in `src/content/posts/`, projects in `src/content/projects/`. frontmatter is validated with zod at build time, so typos fail the build instead of silently breaking something.

## commands

run from the root:

| Command         | Action                                      |
| :-------------- | :------------------------------------------ |
| `bun install`   | install dependencies                        |
| `bun run dev`   | local dev server at `localhost:4321`        |
| `bun run build` | build production site to `./dist/`          |
| `bun run preview` | preview the build locally                 |

## deployment

push to `main` and github actions builds and deploys it. that's it.

## license

code is [MIT](https://github.com/aunchers/aunchers.github.io/blob/main/LICENSE).
posts, images, and design are all rights reserved.

---

*made with love by aunchers*
