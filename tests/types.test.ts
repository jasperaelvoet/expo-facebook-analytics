import { describe, expect, test } from "bun:test";
import { AppEventParams, AppEvents } from "../src/types";

describe("AppEvents", () => {
  test("contains all predefined event names", () => {
    expect(AppEvents.AchievedLevel).toBe("fb_mobile_level_achieved");
    expect(AppEvents.AdClick).toBe("AdClick");
    expect(AppEvents.AdImpression).toBe("AdImpression");
    expect(AppEvents.AddedPaymentInfo).toBe("fb_mobile_add_payment_info");
    expect(AppEvents.AddedToCart).toBe("fb_mobile_add_to_cart");
    expect(AppEvents.AddedToWishlist).toBe("fb_mobile_add_to_wishlist");
    expect(AppEvents.CompletedRegistration).toBe(
      "fb_mobile_complete_registration",
    );
    expect(AppEvents.CompletedTutorial).toBe("fb_mobile_tutorial_completion");
    expect(AppEvents.Contact).toBe("Contact");
    expect(AppEvents.CustomizeProduct).toBe("CustomizeProduct");
    expect(AppEvents.Donate).toBe("Donate");
    expect(AppEvents.FindLocation).toBe("FindLocation");
    expect(AppEvents.InitiatedCheckout).toBe("fb_mobile_initiated_checkout");
    expect(AppEvents.Purchased).toBe("fb_mobile_purchase");
    expect(AppEvents.Rated).toBe("fb_mobile_rate");
    expect(AppEvents.Searched).toBe("fb_mobile_search");
    expect(AppEvents.SpentCredits).toBe("fb_mobile_spent_credits");
    expect(AppEvents.Schedule).toBe("Schedule");
    expect(AppEvents.StartTrial).toBe("StartTrial");
    expect(AppEvents.SubmitApplication).toBe("SubmitApplication");
    expect(AppEvents.Subscribe).toBe("Subscribe");
    expect(AppEvents.UnlockedAchievement).toBe(
      "fb_mobile_achievement_unlocked",
    );
    expect(AppEvents.ViewedContent).toBe("fb_mobile_content_view");
  });

  test("has exactly 23 event constants", () => {
    expect(Object.keys(AppEvents)).toHaveLength(23);
  });
});

describe("AppEventParams", () => {
  test("contains all predefined parameter names", () => {
    expect(AppEventParams.AddType).toBe("fb_mobile_add_type");
    expect(AppEventParams.Content).toBe("fb_content");
    expect(AppEventParams.ContentID).toBe("fb_content_id");
    expect(AppEventParams.ContentType).toBe("fb_content_type");
    expect(AppEventParams.Currency).toBe("fb_currency");
    expect(AppEventParams.Description).toBe("fb_description");
    expect(AppEventParams.Level).toBe("fb_level");
    expect(AppEventParams.NumItems).toBe("fb_num_items");
    expect(AppEventParams.MaxRatingValue).toBe("fb_max_rating_value");
    expect(AppEventParams.OrderId).toBe("fb_order_id");
    expect(AppEventParams.PaymentInfoAvailable).toBe(
      "fb_payment_info_available",
    );
    expect(AppEventParams.RegistrationMethod).toBe("fb_registration_method");
    expect(AppEventParams.SearchString).toBe("fb_search_string");
    expect(AppEventParams.Success).toBe("fb_success");
    expect(AppEventParams.ValueNo).toBe("0");
    expect(AppEventParams.ValueYes).toBe("1");
  });

  test("has exactly 16 parameter constants", () => {
    expect(Object.keys(AppEventParams)).toHaveLength(16);
  });
});
