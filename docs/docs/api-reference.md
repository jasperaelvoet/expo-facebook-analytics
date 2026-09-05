---
id: api-reference
title: API Reference
sidebar_position: 6
---

# API Reference

All functions are named exports of `expo-facebook-analytics`.

## Initialization & runtime configuration

### `initialize(): void`

Initializes the Facebook SDK from JavaScript. Required when `isAutoInitEnabled`
is `false`: nothing else starts the SDK then. (On iOS there has been no
auto-init since SDK 9, so the plugin's `AppDelegate` wiring is the only other
path.) Safe to call once; call it before logging events.

### `setAutoInitEnabled(enabled: boolean): void`

Turns the native SDK's auto-init flag on or off at runtime. `initialize()`
switches it on and Android persists it, so a consent-gated app should call
`setAutoInitEnabled(false)` when consent is withdrawn — otherwise the next
launch initializes the SDK before JavaScript runs. No-op on iOS.

### `setAutoLogAppEventsEnabled(enabled: boolean): void`

Enables or disables automatic app-event logging at runtime.

### `setAdvertiserIDCollectionEnabled(enabled: boolean): void`

Enables or disables advertiser-ID (IDFA / AAID) collection at runtime.

### `setAppID(appID: string): void`

Sets the Facebook App ID at runtime. Call before `initialize()`.

### `setClientToken(clientToken: string): void`

Sets the Facebook Client Token at runtime. Call before `initialize()`.

### `setLoggingEnabled(enabled: boolean): void`

Enables verbose Facebook SDK logging (app events, network requests, developer
errors). Output is printed to the **native** console — view it with
`xcrun simctl spawn booted log stream` (iOS) or `adb logcat` (Android). The
example app exposes `bun run logs:ios` / `bun run logs:android` for this.
Development only.

## Event logging

### `activateApp(): void`

Logs an app activation: publishes the install event (with the Google Play
install referrer on Android) the first time it runs on a device, then the
launch event. The SDK only does this on its own when automatic event logging is
on, so call it once per launch after `initialize()` whenever
`autoLogAppEventsEnabled` is `false` — without it Meta cannot attribute installs
to your ads.

### `logEvent(eventName: string, ...args: Array<number | Params>): void`

Logs a custom or predefined event. The variadic `args` accept an optional numeric
`valueToSum` and/or a `Params` object, in any order.

```typescript
logEvent("level_complete");
logEvent("level_complete", 5);
logEvent("level_complete", 5, { level: "3" });
```

### `logPurchase(amount: number, currency: string, params?: Params): void`

Logs a purchase with an amount and ISO currency code.

### `logPushNotificationOpen(payload?: Record<string, string | number>): void`

Logs that the app was opened from a push notification.

## User identity

### `setUserID(userID: string | null): void`

Sets the user ID associated with events. Passing `null` clears it.

### `clearUserID(): void`

Clears the current user ID.

### `getUserID(): string | undefined`

Returns the current user ID, if set.

### `setUserData(data: UserData): void`

Sets hashed user data for advanced matching. See [`UserData`](#userdata).

## Device identifiers

### `getAnonymousID(): Promise<string | undefined>`

Resolves with the anonymous device GUID.

### `getAdvertiserID(): Promise<string | undefined>`

Resolves with the advertiser ID — IDFA on iOS, AAID on Android. Returns
`undefined` when unavailable (e.g. limit-ad-tracking enabled). Runs off the JS
thread.

## Configuration

### `setFlushBehavior(behavior: AppEventsFlushBehavior): void`

Sets event-flush behavior: `'auto'` (default) or `'explicit_only'`.

### `flush(): void`

Flushes all queued events to Facebook immediately.

### `setPushNotificationsDeviceToken(token: string): void`

Sets the APNs device token (iOS). Pass the token as a hex string.

### `setPushNotificationsRegistrationId(registrationId: string): void`

Sets the FCM registration ID (Android).

## Types

### `Params`

```typescript
type Params = { [key: string]: string | number };
```

### `UserData`

```typescript
type UserData = Readonly<{
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "m" | "f";
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}>;
```

### `AppEventsFlushBehavior`

```typescript
type AppEventsFlushBehavior = "auto" | "explicit_only";
```
