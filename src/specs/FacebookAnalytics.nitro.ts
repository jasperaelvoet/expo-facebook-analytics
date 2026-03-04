import type { HybridObject } from 'react-native-nitro-modules';

export interface FacebookAnalytics
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  // Event logging
  logEvent(eventName: string, valueToSum: number, params: Record<string, string>): void;
  logEventWithoutParams(eventName: string, valueToSum: number): void;
  logPurchase(
    amount: number,
    currency: string,
    params: Record<string, string>
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
    country: string | undefined
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
