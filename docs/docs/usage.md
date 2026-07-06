---
id: usage
title: Usage
sidebar_position: 5
---

# Usage

## Log events

```typescript
import {
  logEvent,
  logPurchase,
  logPushNotificationOpen,
  AppEvents,
  AppEventParams,
} from "expo-facebook-analytics";

// Simple event
logEvent(AppEvents.ViewedContent);

// Event with a numeric value to sum
logEvent(AppEvents.Searched, 1);

// Event with parameters
logEvent(AppEvents.AddedToCart, {
  [AppEventParams.ContentID]: "product-123",
  [AppEventParams.ContentType]: "product",
  [AppEventParams.Currency]: "USD",
});

// Event with both a value and parameters
logEvent(AppEvents.Purchased, 29.99, {
  [AppEventParams.Currency]: "USD",
  [AppEventParams.NumItems]: 2,
});

// Dedicated purchase event
logPurchase(29.99, "USD", {
  [AppEventParams.ContentID]: "product-123",
});

// Push notification open
logPushNotificationOpen({ campaign: "summer-sale" });
```

## User identity

```typescript
import {
  setUserID,
  getUserID,
  clearUserID,
  setUserData,
} from "expo-facebook-analytics";

setUserID("user-123");

const userId = getUserID();

clearUserID();

// Advanced matching — values are hashed by the native SDK
setUserData({
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  gender: "m",
  city: "San Francisco",
  state: "CA",
  country: "US",
});
```

## Device identifiers

These return Promises and run off the JS thread:

```typescript
import { getAnonymousID, getAdvertiserID } from "expo-facebook-analytics";

const anonId = await getAnonymousID();
const advertiserId = await getAdvertiserID(); // IDFA on iOS, AAID on Android
```

## Flushing & push tokens

```typescript
import {
  setFlushBehavior,
  flush,
  setPushNotificationsDeviceToken,
  setPushNotificationsRegistrationId,
} from "expo-facebook-analytics";

// Control event batching: 'auto' (default) or 'explicit_only'
setFlushBehavior("explicit_only");

// Manually flush queued events
flush();

// Push notification tokens
setPushNotificationsDeviceToken(apnsToken); // iOS (hex string)
setPushNotificationsRegistrationId(fcmToken); // Android
```
