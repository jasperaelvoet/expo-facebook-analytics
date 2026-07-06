---
id: installation
title: Installation
sidebar_position: 2
---

# Installation

Install the package and its Nitro Modules peer dependency:

```bash
npx expo install expo-facebook-analytics react-native-nitro-modules
```

Or with your package manager of choice:

```bash
bun add expo-facebook-analytics react-native-nitro-modules
# or
npm install expo-facebook-analytics react-native-nitro-modules
```

## Peer dependencies

| Package                      | Version   |
| ---------------------------- | --------- |
| `expo`                       | `>=56.0.0` |
| `react-native`               | `>=0.85`  |
| `react-native-nitro-modules` | `>=0.35.9` |

`expo` is only required if you use the config plugin (recommended).

## Build the native code

Because the module ships custom native code, it can't run in **Expo Go** — you
need a [development build](https://docs.expo.dev/develop/development-builds/introduction/).

```bash
# iOS (requires Xcode 26.4+)
npx expo run:ios

# Android (requires Android Studio / SDK)
npx expo run:android
```

These commands run `expo prebuild` automatically, generating the native projects
and compiling the Swift / Kotlin module.

## Next steps

Continue to [Expo Setup](./expo-setup.md) to configure the config plugin.
