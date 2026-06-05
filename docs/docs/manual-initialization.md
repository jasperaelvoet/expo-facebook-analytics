---
id: manual-initialization
title: Manual Initialization
sidebar_position: 4
---

# Manual Initialization & Runtime Configuration

By default the Facebook SDK initializes automatically at app launch. If you need
to **gate initialization** behind user consent (GDPR, App Tracking Transparency),
set `isAutoInitEnabled: false` in the [config plugin](./expo-setup.md) and drive
the SDK from JavaScript instead.

## Deferred initialization

```typescript
import {
  initialize,
  setAutoLogAppEventsEnabled,
  setAdvertiserIDCollectionEnabled,
} from "expo-facebook-analytics";

async function onUserGrantedConsent() {
  // Optionally configure collection before initializing.
  setAutoLogAppEventsEnabled(true);
  setAdvertiserIDCollectionEnabled(true);

  // Initialize the SDK — events logged before this are not sent.
  initialize();
}
```

`initialize()` turns auto-init on and fully initializes the native SDK. It is safe
to call once; call it before you log any events.

## Fully manual configuration (no plugin)

You can provide the app ID and client token at runtime instead of through the
config plugin — useful for white-label apps or runtime-fetched credentials:

```typescript
import {
  setAppID,
  setClientToken,
  initialize,
} from "expo-facebook-analytics";

setAppID("YOUR_FACEBOOK_APP_ID");
setClientToken("YOUR_FACEBOOK_CLIENT_TOKEN");
initialize();
```

:::caution Order matters
Call `setAppID` / `setClientToken` **before** `initialize()`. The Facebook SDK
reads these values during initialization.
:::

## Runtime toggles

| Function                                   | Effect                                          |
| ------------------------------------------ | ----------------------------------------------- |
| `setAutoLogAppEventsEnabled(enabled)`      | Enable/disable automatic event logging          |
| `setAdvertiserIDCollectionEnabled(enabled)`| Enable/disable advertiser-ID (IDFA/AAID) collection |
| `setAppID(appID)`                          | Set the Facebook App ID at runtime              |
| `setClientToken(token)`                    | Set the Facebook Client Token at runtime        |

These map directly to the native SDK's settings on both platforms, so a flag you
flip here behaves identically to setting it through the config plugin.
