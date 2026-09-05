---
id: expo-setup
title: Expo Setup
sidebar_position: 3
---

# Expo Setup

Add the config plugin to your `app.json` / `app.config.js`. It configures the
Facebook SDK natively (Info.plist, `AppDelegate`, Android manifest, strings, and
permissions) so you don't have to touch the native projects.

```json title="app.json"
{
  "expo": {
    "plugins": [
      [
        "expo-facebook-analytics",
        {
          "appID": "YOUR_FACEBOOK_APP_ID",
          "clientToken": "YOUR_FACEBOOK_CLIENT_TOKEN",
          "displayName": "Your App Name"
        }
      ]
    ]
  }
}
```

After changing plugin options, rebuild the native projects:

```bash
npx expo prebuild --clean
```

## Plugin options

| Option                          | Type                | Default      | Description                                |
| ------------------------------- | ------------------- | ------------ | ------------------------------------------ |
| `appID`                         | `string`            | **required** | Facebook App ID                            |
| `clientToken`                   | `string`            | **required** | Facebook Client Token                      |
| `displayName`                   | `string`            | App name     | Display name for Facebook                  |
| `scheme`                        | `string`            | `fb{appID}`  | URL scheme for deep linking                |
| `isAutoInitEnabled`             | `boolean`           | `true`       | Auto-initialize the Facebook SDK at launch |
| `autoLogAppEventsEnabled`       | `boolean`           | `true`       | Automatically log app events               |
| `advertiserIDCollectionEnabled` | `boolean`           | `true`       | Enable advertiser ID collection            |
| `iosUserTrackingPermission`     | `string` \| `false` | ATT prompt   | Custom ATT prompt text, or `false` to omit |

:::info Disabling auto-init
With `isAutoInitEnabled: true` (the default) the plugin wires the SDK into your
app delegate — `AppDelegate.swift` on Expo SDK 53 and newer, the Objective-C
delegate on older templates — so it starts at launch. With
`isAutoInitEnabled: false` the delegate is left untouched and the SDK does
**not** initialize on launch: call [`initialize()`](./manual-initialization.md)
yourself before logging events. This is useful for consent-gated initialization
(GDPR / ATT). If you also set `autoLogAppEventsEnabled: false`, call
`activateApp()` after `initialize()` so installs can still be attributed.
:::

## SKAdNetwork & App Tracking Transparency (iOS)

The plugin automatically adds Meta's SKAdNetwork identifiers and, unless you pass
`iosUserTrackingPermission: false`, an `NSUserTrackingUsageDescription` entry so
you can request the ATT prompt.

## Without Expo

If you're in a bare React Native project, follow the
[Facebook SDK setup guides](https://developers.facebook.com/docs/app-events/getting-started-app-events-android/)
for manual iOS and Android configuration, or configure everything at runtime with
[`setAppID` / `setClientToken` / `initialize`](./manual-initialization.md).
