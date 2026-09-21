import { execSync } from 'node:child_process';

/**
 * Last-modified info for a source file, read from git at build time.
 * Nothing runs in the browser or on any server at request time —
 * the date is baked into the static HTML, so it costs nothing on
 * the client and keeps working if GitHub is unreachable.
 *
 * Returns null (callers should fall back to frontmatter.date) when
 * git metadata isn't available.
 */
export function gitLastUpdated(relPath: string): { hash: string; date: string } | null {
  try {
    // '/' separator instead of '|' so cmd.exe doesn't treat it as a pipe
    const out = execSync(
      `git log -1 --format=%h/%as -- "${relPath}"`,
      { encoding: 'utf8', windowsHide: true }
    ).trim();
    const [hash, date] = out.split('/');
    if (!hash || !date) return null;
    return { hash, date };
  } catch {
    return null;
  }
}

export function postLastUpdated(slug: string) {
  return gitLastUpdated(`src/content/posts/${slug}.mdx`);
}
