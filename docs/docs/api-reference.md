---
id: api-reference
title: API Reference
sidebar_position: 6
---

# API Reference

All functions are named exports of `expo-facebook-analytics`.

## Initialization & runtime configuration

### `initialize(): void`

Manually initializes the Facebook SDK. Only required when `isAutoInitEnabled` is
`false`. Call once, early, before logging events.

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
