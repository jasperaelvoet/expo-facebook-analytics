export type AppEventsFlushBehavior = 'auto' | 'explicit_only';

export type Params = { [key: string]: string | number };

export type UserData = Readonly<{
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

/**
 * Predefined Facebook App Event names.
 */
export const AppEvents = {
  AchievedLevel: 'fb_mobile_level_achieved',
  AdClick: 'AdClick',
  AdImpression: 'AdImpression',
  AddedPaymentInfo: 'fb_mobile_add_payment_info',
  AddedToCart: 'fb_mobile_add_to_cart',
  AddedToWishlist: 'fb_mobile_add_to_wishlist',
  CompletedRegistration: 'fb_mobile_complete_registration',
  CompletedTutorial: 'fb_mobile_tutorial_completion',
  Contact: 'Contact',
  CustomizeProduct: 'CustomizeProduct',
  Donate: 'Donate',
  FindLocation: 'FindLocation',
  InitiatedCheckout: 'fb_mobile_initiated_checkout',
  Purchased: 'fb_mobile_purchase',
  Rated: 'fb_mobile_rate',
  Searched: 'fb_mobile_search',
  SpentCredits: 'fb_mobile_spent_credits',
  Schedule: 'Schedule',
  StartTrial: 'StartTrial',
  SubmitApplication: 'SubmitApplication',
  Subscribe: 'Subscribe',
  UnlockedAchievement: 'fb_mobile_achievement_unlocked',
  ViewedContent: 'fb_mobile_content_view',
} as const;

/**
 * Predefined Facebook App Event parameter names.
 */
export const AppEventParams = {
  AddType: 'fb_mobile_add_type',
  Content: 'fb_content',
  ContentID: 'fb_content_id',
  ContentType: 'fb_content_type',
  Currency: 'fb_currency',
  Description: 'fb_description',
  Level: 'fb_level',
  NumItems: 'fb_num_items',
  MaxRatingValue: 'fb_max_rating_value',
  OrderId: 'fb_order_id',
  PaymentInfoAvailable: 'fb_payment_info_available',
  RegistrationMethod: 'fb_registration_method',
  SearchString: 'fb_search_string',
  Success: 'fb_success',
  ValueNo: '0',
  ValueYes: '1',
} as const;
