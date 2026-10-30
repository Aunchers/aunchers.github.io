import { execSync } from 'node:child_process';

/** last commit that touched a file. null if git isn't available. */
export function gitLastUpdated(relPath: string): { hash: string; date: string } | null {
  try {
    // '/' so cmd.exe doesn't read it as a pipe
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
