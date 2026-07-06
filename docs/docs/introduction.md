---
id: introduction
title: Introduction
slug: /
sidebar_position: 1
---

# expo-facebook-analytics

High-performance Facebook (Meta) Analytics for React Native, built on
[Nitro Modules](https://github.com/mrousavy/nitro).

It talks to the native Facebook SDK directly through a statically compiled JSI
binding — there is no React Native bridge in the hot path, so logging events is
effectively free on the JS thread.

## Features

- ⚡ **Direct native integration** via Nitro Modules — a zero-overhead, statically
  typed JSI binding to the Facebook SDK.
- 📊 **Full App Events coverage** — custom & predefined events, purchases, push
  notification opens.
- 👤 **User identity & advanced matching** — user IDs and hashed user data.
- 🆔 **Device identifiers** — anonymous ID and advertiser ID (IDFA / AAID),
  resolved off the JS thread.
- 🔧 **Runtime SDK control** — manual `initialize()` plus runtime toggles for
  auto-logging, advertiser-ID collection, app ID, and client token.
- 🧩 **Expo config plugin** — automatic native setup for iOS and Android.
- 🟦 **TypeScript-first** with predefined event and parameter constants.

## Requirements

| Tool                         | Version          |
| ---------------------------- | ---------------- |
| Expo SDK                     | 56+              |
| React Native                 | 0.85+            |
| `react-native-nitro-modules` | 0.35.9+          |
| iOS deployment target        | 16.4+            |
| Android `minSdkVersion`      | 24+              |

Native SDKs: Facebook iOS/Android SDK 18.

:::tip New Architecture
This module requires the React Native **New Architecture**, which is the default
in Expo SDK 56.
:::
