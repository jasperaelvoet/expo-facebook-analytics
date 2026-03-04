import { NitroModules } from "react-native-nitro-modules";
import type { FacebookAnalytics as FacebookAnalyticsSpec } from "./specs/FacebookAnalytics.nitro";
import type { AppEventsFlushBehavior, Params, UserData } from "./types";

export type { AppEventsFlushBehavior, Params, UserData } from "./types";
export { AppEventParams, AppEvents } from "./types";

const NativeFBAnalytics =
  NitroModules.createHybridObject<FacebookAnalyticsSpec>("FacebookAnalytics");

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
  let params: Params = {};

  for (const arg of args) {
    if (typeof arg === "number") {
      valueToSum = arg;
    } else if (typeof arg === "object") {
      params = arg;
    }
  }

  const stringParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    stringParams[key] = String(value);
  }

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
  const stringParams: Record<string, string> = {};
  if (parameters) {
    for (const [key, value] of Object.entries(parameters)) {
      stringParams[key] = String(value);
    }
  }
  NativeFBAnalytics.logPurchase(purchaseAmount, currencyCode, stringParams);
}

/**
 * Log a push notification open event.
 */
export function logPushNotificationOpen(
  payload?: Record<string, string | number>,
): void {
  const stringPayload: Record<string, string> = {};
  if (payload) {
    for (const [key, value] of Object.entries(payload)) {
      stringPayload[key] = String(value);
    }
  }
  NativeFBAnalytics.logPushNotificationOpen(stringPayload);
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
