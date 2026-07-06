# expo-facebook-analytics example

A minimal Expo (SDK 56) app that consumes the **local** `expo-facebook-analytics`
module via `link:..` and compiles its native code, so you can verify the module
works on a real device/simulator.

Because the module ships custom native code (Nitro), this app **cannot** run in
Expo Go — it builds a dev client.

## Run it

From the repo root, build the library once so the linked module is up to date:

```bash
bun install
bun run prepare
bun run nitrogen
```

Then, in this folder:

```bash
cd example
bun install

# iOS (requires Xcode 26.4+)
bun run ios

# Android (requires Android Studio / SDK)
bun run android
```

`expo run:ios` / `expo run:android` automatically run `expo prebuild` to generate
the native projects, compile the Swift/Kotlin native module, and launch the app.

## Using it

The app's `isAutoInitEnabled` is set to `false` in `app.json`, so the screen
starts un-initialized on purpose. Tap **initialize()** first, then tap any other
button to call the corresponding native method. Each call's result (or error) is
appended to the on-screen log.

On launch the app automatically runs the deferred-init flow (`setLoggingEnabled`
+ `initialize` + a `logEvent`) so the SDK is live immediately.

To verify real event delivery in Meta Events Manager, replace the placeholder
`appID` / `clientToken` in `app.json` with values from your Facebook app and
rebuild.

## See the native SDK logs

`setLoggingEnabled(true)` turns on the Facebook SDK's own verbose logging
(app events, network requests). Stream it from the running app:

```bash
bun run logs:ios       # iOS simulator
bun run logs:android   # Android emulator/device
```

With a real App ID you'll see event payloads and the `graph.facebook.com`
requests the SDK makes.

## End-to-end test

The app has a **Run all tests** button that calls every native method in sequence
and shows an `E2E PASSED n/n` banner. The [Maestro](https://maestro.mobile.dev)
flow in [`.maestro/e2e.yaml`](./.maestro/e2e.yaml) automates this — it's what CI
runs on the iOS simulator and Android emulator:

```bash
maestro test .maestro/e2e.yaml
```
