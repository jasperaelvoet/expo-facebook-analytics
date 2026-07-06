---
id: example-app
title: Example App
sidebar_position: 8
---

# Example App

The repository ships a runnable example under
[`example/`](https://github.com/jasperaelvoet/expo-facebook-analytics/tree/main/example).
It consumes the local module via `link:..`, compiles its native code, and renders
a screen with a button for every API so you can verify the module on a real device
or simulator.

Because the module ships custom native code, the example builds a **development
build** — it can't run in Expo Go.

## Run it

From the repo root:

```bash
bun install
bun run prepare
bun run nitrogen
```

Then build and launch the example:

```bash
cd example
bun install

# iOS (requires Xcode 26.4+)
bun run ios

# Android (requires Android Studio / SDK)
bun run android
```

Or use the root convenience scripts, which do all of the above in one step:

```bash
bun run example:ios
bun run example:android
```

## What it does

The example sets `isAutoInitEnabled: false`, so the screen starts un-initialized
on purpose. Tap **initialize()** first, then tap any other button to call the
corresponding native method. Each call's result (or error) is appended to an
on-screen log — a quick way to confirm the native bridge is wired up correctly.

To verify live event delivery in
[Meta Events Manager](https://www.facebook.com/events_manager2), replace the
placeholder `appID` / `clientToken` in `example/app.json` with values from your
Facebook app and rebuild.
