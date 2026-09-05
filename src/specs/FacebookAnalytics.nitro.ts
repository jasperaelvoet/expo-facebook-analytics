import type { HybridObject } from "react-native-nitro-modules";

export interface FacebookAnalytics
  extends HybridObject<{ ios: "swift"; android: "kotlin" }> {
  // SDK initialization & runtime configuration
  initialize(): void;
  /**
   * Turn the native SDK's auto-init flag on or off at runtime. Android
   * persists it, so an app that gates the SDK behind consent should switch it
   * off again when consent is withdrawn. No-op on iOS, which has no auto-init.
   */
  setAutoInitEnabled(enabled: boolean): void;
  setAutoLogAppEventsEnabled(enabled: boolean): void;
  setAdvertiserIDCollectionEnabled(enabled: boolean): void;
  setAppID(appID: string): void;
  setClientToken(clientToken: string): void;
  /**
   * Enable verbose Facebook SDK logging (app events, network requests,
   * developer errors). Logs are printed to the native console.
   */
  setLoggingEnabled(enabled: boolean): void;

  // Event logging
  /**
   * Log an app activation: publishes the install (with the Play install
   * referrer on Android) once per device, then the launch event. The only path
   * that does so when automatic event logging is off.
   */
  activateApp(): void;
  logEvent(
    eventName: string,
    valueToSum: number,
    params: Record<string, string>,
  ): void;
  logEventWithoutParams(eventName: string, valueToSum: number): void;
  logPurchase(
    amount: number,
    currency: string,
    params: Record<string, string>,
  ): void;
  logPushNotificationOpen(payload: Record<string, string>): void;

  // User identity
  setUserID(userID: string): void;
  clearUserID(): void;
  getUserID(): string | undefined;
  setUserData(
    email: string | undefined,
    firstName: string | undefined,
    lastName: string | undefined,
    phone: string | undefined,
    dateOfBirth: string | undefined,
    gender: string | undefined,
    city: string | undefined,
    state: string | undefined,
    zip: string | undefined,
    country: string | undefined,
  ): void;

  // Device identifiers
  getAnonymousID(): Promise<string | undefined>;
  getAdvertiserID(): Promise<string | undefined>;

  // Configuration
  setFlushBehavior(flushBehavior: string): void;
  flush(): void;

  // Push notification tokens
  setPushNotificationsDeviceToken(token: string): void;
  setPushNotificationsRegistrationId(registrationId: string): void;
}
