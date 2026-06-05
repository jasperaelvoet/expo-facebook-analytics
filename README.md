# expo-facebook-analytics

High-performance Facebook Analytics for React Native using [Nitro Modules](https://github.com/mrousavy/nitro).

📖 **[Documentation](https://jasperaelvoet.github.io/expo-facebook-analytics/)** · 🧪 **[Example app](./example)**

> **Minimal by design.** This library wraps only the Facebook **App Events /
> Analytics** APIs — event logging, user identity, and device identifiers. It is
> **not** a full Facebook SDK (no Login, Sharing, Graph API, or Gaming). If you
> only need analytics and conversion tracking, that's the point: a tiny, fast
> surface area built on a zero-overhead Nitro/JSI bridge to the native SDK.

## Installation

```sh
npx expo install expo-facebook-analytics react-native-nitro-modules
```

Add the config plugin to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-facebook-analytics",
        {
          "appID": "YOUR_FACEBOOK_APP_ID",
          "clientToken": "YOUR_FACEBOOK_CLIENT_TOKEN"
        }
      ]
    ]
  }
}
```

The module ships native code, so it requires a [development build](https://docs.expo.dev/develop/development-builds/introduction/) — it can't run in Expo Go.

## Quick start

```typescript
import { logEvent, logPurchase, AppEvents } from 'expo-facebook-analytics';

logEvent(AppEvents.ViewedContent);
logEvent(AppEvents.AddedToCart, { product: 'sku-123' });
logPurchase(29.99, 'USD');
```

For deferred (consent-gated) initialization, set `isAutoInitEnabled: false` in the
plugin and call `initialize()` yourself. Enable the Facebook SDK's native logging
with `setLoggingEnabled(true)`. See the [documentation](https://jasperaelvoet.github.io/expo-facebook-analytics/) for the full API.

See the **[documentation](https://jasperaelvoet.github.io/expo-facebook-analytics/)** for the full API,
config-plugin options, manual initialization, and predefined constants.

## Requirements

| Tool                         | Version |
| ---------------------------- | ------- |
| Expo SDK                     | 56+     |
| React Native                 | 0.85+   |
| `react-native-nitro-modules` | 0.35.9+ |
| iOS deployment target        | 16.4+   |
| Android `minSdkVersion`      | 24+     |

Native SDKs: Facebook iOS/Android SDK 18. Requires the React Native New Architecture (default in SDK 56).

## Contributing

```sh
bun install        # install dependencies
bun run nitrogen   # regenerate native bindings
bun run prepare    # build the library
bun test           # run tests
bun run check      # lint & format
```

To run the example app, see [`example/`](./example).

## License

MIT
