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
If you set `isAutoInitEnabled: false`, the SDK will **not** initialize on launch.
You must call [`initialize()`](./manual-initialization.md) yourself before logging
events. This is useful for consent-gated initialization (GDPR / ATT).
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
