// Links the parent library into this example's node_modules as a clean symlink.
//
// We can't depend on it via `file:..` because Bun copies the whole repo
// directory (including this example, docs, and node_modules), which breaks
// Metro resolution and React Native / Expo autolinking. A single directory
// symlink behaves like a normal installed package, so autolinking finds the
// podspec and Metro resolves `expo-facebook-analytics` to the parent source.
import { existsSync, lstatSync, rmSync, symlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const link = resolve(here, "..", "node_modules", "expo-facebook-analytics");
const target = resolve(here, "..", ".."); // repo root

if (existsSync(link) || isSymlink(link)) {
  rmSync(link, { recursive: true, force: true });
}
symlinkSync(target, link, "dir");
console.log(`Linked expo-facebook-analytics -> ${target}`);

function isSymlink(p) {
  try {
    return lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}
