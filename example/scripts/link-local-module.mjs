// Links the parent library into this example's node_modules as a single, clean
// symlink so Metro resolves `expo-facebook-analytics` to the parent source.
//
// We deliberately do NOT depend on the module via `file:..`: Bun copies the
// whole parent directory (which contains this example) into node_modules,
// recursing until the path length overflows. React Native autolinking is told
// about the module via react-native.config.js instead.
import { lstatSync, mkdirSync, symlinkSync, unlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url)); // example/scripts
const nodeModules = resolve(here, "..", "node_modules");
const link = resolve(nodeModules, "expo-facebook-analytics");
const target = resolve(here, "..", ".."); // repo root (example/scripts -> ..)

mkdirSync(nodeModules, { recursive: true });

// Remove any existing entry. Only ever unlink — never recurse — so a stray
// real directory can't trigger a runaway delete.
try {
  const stat = lstatSync(link);
  if (stat.isSymbolicLink() || stat.isFile()) {
    unlinkSync(link);
  } else {
    // A real directory here means a previous bad `file:` install; refuse to
    // recurse and tell the user how to recover.
    console.error(
      `Refusing to remove unexpected directory at ${link}. Delete it manually.`,
    );
    process.exit(0);
  }
} catch {
  // Nothing to remove.
}

symlinkSync(target, link, "dir");
console.log(`Linked expo-facebook-analytics -> ${target}`);
