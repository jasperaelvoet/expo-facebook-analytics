import { NitroModules } from "react-native-nitro-modules";
import type { FacebookAnalytics as FacebookAnalyticsSpec } from "./specs/FacebookAnalytics.nitro";
import type { AppEventsFlushBehavior, Params, UserData } from "./types";

export type { AppEventsFlushBehavior, Params, UserData } from "./types";
export { AppEventParams, AppEvents } from "./types";

const NativeFBAnalytics =
  NitroModules.createHybridObject<FacebookAnalyticsSpec>("FacebookAnalytics");

const EMPTY_PARAMS: Record<string, string> = {};

/**
 * Coerce a params object to the `Record<string, string>` shape the native
 * layer expects. Returns a shared empty object when there is nothing to convert
 * so the common no-params path allocates nothing.
 */
function toStringParams(
  params: Record<string, string | number> | undefined,
): Record<string, string> {
  if (!params) {
    return EMPTY_PARAMS;
  }
  const keys = Object.keys(params);
  if (keys.length === 0) {
    return EMPTY_PARAMS;
  }
  const stringParams: Record<string, string> = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    stringParams[key] = String(params[key]);
  }
  return stringParams;
}

/**
 * Manually initialize the Facebook SDK.
 *
 * Only required when `isAutoInitEnabled` is set to `false` in the config plugin.
 * Call this once, early in your app's lifecycle (e.g. in your root layout),
 * after optionally configuring the app ID / client token at runtime.
 */
export function initialize(): void {
  NativeFBAnalytics.initialize();
}

/**
 * Enable or disable automatic logging of app events at runtime.
 */
export function setAutoLogAppEventsEnabled(enabled: boolean): void {
  NativeFBAnalytics.setAutoLogAppEventsEnabled(enabled);
}

/**
 * Enable or disable advertiser ID (IDFA / AAID) collection at runtime.
 */
export function setAdvertiserIDCollectionEnabled(enabled: boolean): void {
  NativeFBAnalytics.setAdvertiserIDCollectionEnabled(enabled);
}

/**
 * Set the Facebook App ID at runtime (alternative to the config plugin).
 * Call before {@link initialize} when configuring the SDK manually.
 */
export function setAppID(appID: string): void {
  NativeFBAnalytics.setAppID(appID);
}

/**
 * Set the Facebook Client Token at runtime (alternative to the config plugin).
 * Call before {@link initialize} when configuring the SDK manually.
 */
export function setClientToken(clientToken: string): void {
  NativeFBAnalytics.setClientToken(clientToken);
}

/**
 * Enable verbose Facebook SDK logging (app events, network requests, developer
 * errors). Output is printed to the native console — view it via the Xcode
 * console / `xcrun simctl spawn booted log stream` (iOS) or `adb logcat` (Android).
 * Intended for development only.
 */
export function setLoggingEnabled(enabled: boolean): void {
  NativeFBAnalytics.setLoggingEnabled(enabled);
}

/**
 * Log a custom or predefined app event.
 * @param eventName - Event name (use AppEvents constants for predefined events)
 * @param args - Optional valueToSum (number) and/or params object
 */
export function logEvent(
  eventName: string,
  ...args: Array<number | Params>
): void {
  let valueToSum = 0;
  let params: Params | undefined;

  for (const arg of args) {
    if (typeof arg === "number") {
      valueToSum = arg;
    } else if (typeof arg === "object") {
      params = arg;
    }
  }

  const stringParams = toStringParams(params);

  if (Object.keys(stringParams).length > 0) {
    NativeFBAnalytics.logEvent(eventName, valueToSum, stringParams);
  } else {
    NativeFBAnalytics.logEventWithoutParams(eventName, valueToSum);
  }
}

/**
 * Log a purchase event.
 */
export function logPurchase(
  purchaseAmount: number,
  currencyCode: string,
  parameters?: Params,
): void {
  NativeFBAnalytics.logPurchase(
    purchaseAmount,
    currencyCode,
    toStringParams(parameters),
  );
}

/**
 * Log a push notification open event.
 */
export function logPushNotificationOpen(
  payload?: Record<string, string | number>,
): void {
  NativeFBAnalytics.logPushNotificationOpen(toStringParams(payload));
}

/**
 * Set the user ID for analytics association.
 */
export function setUserID(userID: string | null): void {
  if (userID === null) {
    NativeFBAnalytics.clearUserID();
  } else {
    NativeFBAnalytics.setUserID(userID);
  }
}

/**
 * Clear the current user ID.
 */
export function clearUserID(): void {
  NativeFBAnalytics.clearUserID();
}

/**
 * Get the current user ID.
 */
export function getUserID(): string | undefined {
  return NativeFBAnalytics.getUserID();
}

/**
 * Set user data for advanced matching.
 */
export function setUserData(userData: UserData): void {
  NativeFBAnalytics.setUserData(
    userData.email,
    userData.firstName,
    userData.lastName,
    userData.phone,
    userData.dateOfBirth,
    userData.gender,
    userData.city,
    userData.state,
    userData.zip,
    userData.country,
  );
}

/**
 * Get the anonymous device ID.
 */
export function getAnonymousID(): Promise<string | undefined> {
  return NativeFBAnalytics.getAnonymousID();
}

/**
 * Get the advertiser ID (IDFA on iOS, AAID on Android).
 */
export function getAdvertiserID(): Promise<string | undefined> {
  return NativeFBAnalytics.getAdvertiserID();
}

/**
 * Set the flush behavior for event batching.
 * @param flushBehavior - 'auto' or 'explicit_only'
 */
export function setFlushBehavior(flushBehavior: AppEventsFlushBehavior): void {
  NativeFBAnalytics.setFlushBehavior(flushBehavior);
}

/**
 * Flush all queued events to Facebook immediately.
 */
export function flush(): void {
  NativeFBAnalytics.flush();
}

/**
 * Set the push notification device token (iOS).
 */
export function setPushNotificationsDeviceToken(deviceToken: string): void {
  NativeFBAnalytics.setPushNotificationsDeviceToken(deviceToken);
}

/**
 * Set the push notification registration ID (Android/FCM).
 */
export function setPushNotificationsRegistrationId(
  registrationId: string,
): void {
  NativeFBAnalytics.setPushNotificationsRegistrationId(registrationId);
}
