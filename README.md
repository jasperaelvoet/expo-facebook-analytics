# expo-facebook-analytics

High-performance Facebook Analytics for React Native using [Nitro Modules](https://github.com/mrousavy/nitro).

## Features

- Direct native Facebook SDK integration via Nitro Modules (zero-copy bridge)
- Full event logging, user identity management, and device identifier access
- Expo config plugin for automatic native setup
- TypeScript-first with predefined event and parameter constants
- iOS 13+ and Android SDK 21+

## Installation

```sh
bun add expo-facebook-analytics react-native-nitro-modules
```

or

```sh
npm install expo-facebook-analytics react-native-nitro-modules
```

### Peer Dependencies

- `react-native` >= 0.71
- `react-native-nitro-modules` >= 0.33.2
- `expo` >= 55.0.4 _(optional, for config plugin)_

### iOS

```sh
cd ios && pod install
```

### Android

No additional steps required — Gradle handles the Facebook SDK dependency automatically.

## Expo Setup

Add the plugin to your `app.json` / `app.config.js`:

```json
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

### Plugin Options

| Option                          | Type                  | Default       | Description                                |
| ------------------------------- | --------------------- | ------------- | ------------------------------------------ |
| `appID`                         | `string`              | **required**  | Facebook App ID                            |
| `clientToken`                   | `string`              | **required**  | Facebook Client Token                      |
| `displayName`                   | `string`              | App name      | Display name for Facebook                  |
| `scheme`                        | `string`              | `fb{appID}`   | URL scheme for deep linking                |
| `isAutoInitEnabled`             | `boolean`             | `true`        | Auto-initialize Facebook SDK               |
| `autoLogAppEventsEnabled`       | `boolean`             | `true`        | Automatically log app events               |
| `advertiserIDCollectionEnabled` | `boolean`             | `true`        | Enable advertiser ID collection            |
| `iosUserTrackingPermission`     | `string` \| `false`   | ATT prompt    | Custom tracking permission text or disable |

### Manual Native Setup

If you're not using Expo, refer to the [Facebook SDK documentation](https://developers.facebook.com/docs/app-events/getting-started-app-events-android/) for manual iOS and Android configuration.

## Usage

### Log Events

```typescript
import { logEvent, logPurchase, AppEvents, AppEventParams } from 'expo-facebook-analytics';

// Simple event
logEvent(AppEvents.ViewedContent);

// Event with a numeric value
logEvent(AppEvents.Searched, 1);

// Event with parameters
logEvent(AppEvents.AddedToCart, {
  [AppEventParams.ContentID]: 'product-123',
  [AppEventParams.ContentType]: 'product',
  [AppEventParams.Currency]: 'USD',
});

// Event with value and parameters
logEvent(AppEvents.Purchased, 29.99, {
  [AppEventParams.Currency]: 'USD',
  [AppEventParams.NumItems]: 2,
});

// Log a purchase
logPurchase(29.99, 'USD', {
  [AppEventParams.ContentID]: 'product-123',
});

// Log push notification open
logPushNotificationOpen({ campaign: 'summer-sale' });
```

### User Identity

```typescript
import { setUserID, getUserID, clearUserID, setUserData } from 'expo-facebook-analytics';

// Set user ID for analytics
setUserID('user-123');

// Get current user ID
const userId = getUserID();

// Clear user ID
clearUserID();

// Set user data for advanced matching
setUserData({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  gender: 'm',
  city: 'San Francisco',
  state: 'CA',
  country: 'US',
});
```

### Device Identifiers

```typescript
import { getAnonymousID, getAdvertiserID } from 'expo-facebook-analytics';

const anonId = await getAnonymousID();
const advertiserId = await getAdvertiserID(); // IDFA on iOS, AAID on Android
```

### Configuration

```typescript
import { setFlushBehavior, flush, setPushNotificationsDeviceToken, setPushNotificationsRegistrationId } from 'expo-facebook-analytics';

// Control event batching: 'auto' (default) or 'explicit_only'
setFlushBehavior('explicit_only');

// Manually flush queued events
flush();

// Push notification tokens
setPushNotificationsDeviceToken(apnsToken);       // iOS
setPushNotificationsRegistrationId(fcmToken);     // Android
```

## API Reference

### Event Logging

| Function                    | Description                          |
| --------------------------- | ------------------------------------ |
| `logEvent(name, ...args)`   | Log a custom or predefined event     |
| `logPurchase(amount, currency, params?)` | Log a purchase event      |
| `logPushNotificationOpen(payload?)` | Log a push notification open  |

### User Identity

| Function                | Description                        |
| ----------------------- | ---------------------------------- |
| `setUserID(id)`         | Set the user ID for analytics      |
| `clearUserID()`         | Clear the current user ID          |
| `getUserID()`           | Get the current user ID            |
| `setUserData(data)`     | Set user data for advanced matching|

### Device Identifiers

| Function              | Description                                 |
| --------------------- | ------------------------------------------- |
| `getAnonymousID()`    | Get the anonymous device ID                 |
| `getAdvertiserID()`   | Get IDFA (iOS) or AAID (Android)            |

### Configuration

| Function                              | Description                        |
| ------------------------------------- | ---------------------------------- |
| `setFlushBehavior(behavior)`          | Set event flush behavior           |
| `flush()`                             | Flush queued events immediately    |
| `setPushNotificationsDeviceToken(t)`  | Set APNs push token (iOS)         |
| `setPushNotificationsRegistrationId(id)` | Set FCM registration ID (Android) |

## Predefined Constants

### AppEvents

`AchievedLevel`, `AdClick`, `AdImpression`, `AddedPaymentInfo`, `AddedToCart`, `AddedToWishlist`, `CompletedRegistration`, `CompletedTutorial`, `Contact`, `CustomizeProduct`, `Donate`, `FindLocation`, `InitiatedCheckout`, `Purchased`, `Rated`, `Schedule`, `Searched`, `SpentCredits`, `StartTrial`, `SubmitApplication`, `Subscribe`, `UnlockedAchievement`, `ViewedContent`

### AppEventParams

`AddType`, `Content`, `ContentID`, `ContentType`, `Currency`, `Description`, `Level`, `MaxRatingValue`, `NumItems`, `OrderId`, `PaymentInfoAvailable`, `RegistrationMethod`, `SearchString`, `Success`, `ValueNo`, `ValueYes`

## Types

```typescript
type Params = { [key: string]: string | number };

type UserData = Readonly<{
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'm' | 'f';
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}>;

type AppEventsFlushBehavior = 'auto' | 'explicit_only';
```

## Requirements

| Platform | Minimum Version |
| -------- | --------------- |
| iOS      | 13.0            |
| Android  | SDK 21          |

Native SDKs: Facebook SDK ~17.0

## License

MIT
