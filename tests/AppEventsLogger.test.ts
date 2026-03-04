import { beforeEach, describe, expect, mock, test } from "bun:test";

// Mock the native module before importing
const mockNative = {
  logEvent: mock(() => {}),
  logEventWithoutParams: mock(() => {}),
  logPurchase: mock(() => {}),
  logPushNotificationOpen: mock(() => {}),
  setUserID: mock(() => {}),
  clearUserID: mock(() => {}),
  getUserID: mock(() => "user-123"),
  setUserData: mock(() => {}),
  getAnonymousID: mock(() => Promise.resolve("anon-id")),
  getAdvertiserID: mock(() => Promise.resolve("advert-id")),
  setFlushBehavior: mock(() => {}),
  flush: mock(() => {}),
  setPushNotificationsDeviceToken: mock(() => {}),
  setPushNotificationsRegistrationId: mock(() => {}),
};

mock.module("react-native-nitro-modules", () => ({
  NitroModules: {
    createHybridObject: () => mockNative,
  },
}));

const {
  logEvent,
  logPurchase,
  logPushNotificationOpen,
  setUserID,
  clearUserID,
  getUserID,
  setUserData,
  getAnonymousID,
  getAdvertiserID,
  setFlushBehavior,
  flush,
  setPushNotificationsDeviceToken,
  setPushNotificationsRegistrationId,
} = await import("../src/index");

function resetMocks() {
  for (const fn of Object.values(mockNative)) {
    (fn as ReturnType<typeof mock>).mockClear();
  }
}

describe("logEvent", () => {
  beforeEach(() => resetMocks());

  test("logs event with name only", () => {
    logEvent("test_event");

    expect(mockNative.logEventWithoutParams).toHaveBeenCalledWith(
      "test_event",
      0,
    );
    expect(mockNative.logEvent).not.toHaveBeenCalled();
  });

  test("logs event with valueToSum", () => {
    logEvent("test_event", 42);

    expect(mockNative.logEventWithoutParams).toHaveBeenCalledWith(
      "test_event",
      42,
    );
  });

  test("logs event with params", () => {
    logEvent("test_event", { key: "value" });

    expect(mockNative.logEvent).toHaveBeenCalledWith("test_event", 0, {
      key: "value",
    });
    expect(mockNative.logEventWithoutParams).not.toHaveBeenCalled();
  });

  test("logs event with valueToSum and params", () => {
    logEvent("test_event", 10, { key: "value" });

    expect(mockNative.logEvent).toHaveBeenCalledWith("test_event", 10, {
      key: "value",
    });
  });

  test("logs event with params and valueToSum in any order", () => {
    logEvent("test_event", { key: "val" }, 5);

    expect(mockNative.logEvent).toHaveBeenCalledWith("test_event", 5, {
      key: "val",
    });
  });

  test("converts numeric param values to strings", () => {
    logEvent("test_event", { count: 42 });

    expect(mockNative.logEvent).toHaveBeenCalledWith("test_event", 0, {
      count: "42",
    });
  });
});

describe("logPurchase", () => {
  beforeEach(() => resetMocks());

  test("logs purchase with amount and currency", () => {
    logPurchase(9.99, "USD");

    expect(mockNative.logPurchase).toHaveBeenCalledWith(9.99, "USD", {});
  });

  test("logs purchase with parameters", () => {
    logPurchase(9.99, "USD", { item: "widget" });

    expect(mockNative.logPurchase).toHaveBeenCalledWith(9.99, "USD", {
      item: "widget",
    });
  });

  test("converts numeric parameter values to strings", () => {
    logPurchase(9.99, "USD", { quantity: 3 });

    expect(mockNative.logPurchase).toHaveBeenCalledWith(9.99, "USD", {
      quantity: "3",
    });
  });
});

describe("logPushNotificationOpen", () => {
  beforeEach(() => resetMocks());

  test("logs without payload", () => {
    logPushNotificationOpen();

    expect(mockNative.logPushNotificationOpen).toHaveBeenCalledWith({});
  });

  test("logs with payload", () => {
    logPushNotificationOpen({ campaign: "summer" });

    expect(mockNative.logPushNotificationOpen).toHaveBeenCalledWith({
      campaign: "summer",
    });
  });

  test("converts numeric payload values to strings", () => {
    logPushNotificationOpen({ id: 123 });

    expect(mockNative.logPushNotificationOpen).toHaveBeenCalledWith({
      id: "123",
    });
  });
});

describe("setUserID", () => {
  beforeEach(() => resetMocks());

  test("sets user ID", () => {
    setUserID("user-456");

    expect(mockNative.setUserID).toHaveBeenCalledWith("user-456");
    expect(mockNative.clearUserID).not.toHaveBeenCalled();
  });

  test("clears user ID when null", () => {
    setUserID(null);

    expect(mockNative.clearUserID).toHaveBeenCalled();
    expect(mockNative.setUserID).not.toHaveBeenCalled();
  });
});

describe("clearUserID", () => {
  beforeEach(() => resetMocks());

  test("calls native clearUserID", () => {
    clearUserID();

    expect(mockNative.clearUserID).toHaveBeenCalled();
  });
});

describe("getUserID", () => {
  beforeEach(() => resetMocks());

  test("returns user ID from native", () => {
    const result = getUserID();

    expect(result).toBe("user-123");
    expect(mockNative.getUserID).toHaveBeenCalled();
  });
});

describe("setUserData", () => {
  beforeEach(() => resetMocks());

  test("passes all user data fields", () => {
    setUserData({
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
      dateOfBirth: "1990-01-01",
      gender: "m",
      city: "NYC",
      state: "NY",
      zip: "10001",
      country: "US",
    });

    expect(mockNative.setUserData).toHaveBeenCalledWith(
      "test@example.com",
      "John",
      "Doe",
      "1234567890",
      "1990-01-01",
      "m",
      "NYC",
      "NY",
      "10001",
      "US",
    );
  });

  test("passes undefined for missing fields", () => {
    setUserData({ email: "test@example.com" });

    expect(mockNative.setUserData).toHaveBeenCalledWith(
      "test@example.com",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  });

  test("handles empty user data", () => {
    setUserData({});

    expect(mockNative.setUserData).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  });
});

describe("getAnonymousID", () => {
  beforeEach(() => resetMocks());

  test("returns anonymous ID", async () => {
    const result = await getAnonymousID();

    expect(result).toBe("anon-id");
  });
});

describe("getAdvertiserID", () => {
  beforeEach(() => resetMocks());

  test("returns advertiser ID", async () => {
    const result = await getAdvertiserID();

    expect(result).toBe("advert-id");
  });
});

describe("setFlushBehavior", () => {
  beforeEach(() => resetMocks());

  test("sets auto flush behavior", () => {
    setFlushBehavior("auto");

    expect(mockNative.setFlushBehavior).toHaveBeenCalledWith("auto");
  });

  test("sets explicit_only flush behavior", () => {
    setFlushBehavior("explicit_only");

    expect(mockNative.setFlushBehavior).toHaveBeenCalledWith("explicit_only");
  });
});

describe("flush", () => {
  beforeEach(() => resetMocks());

  test("calls native flush", () => {
    flush();

    expect(mockNative.flush).toHaveBeenCalled();
  });
});

describe("setPushNotificationsDeviceToken", () => {
  beforeEach(() => resetMocks());

  test("sets device token", () => {
    setPushNotificationsDeviceToken("token-abc");

    expect(mockNative.setPushNotificationsDeviceToken).toHaveBeenCalledWith(
      "token-abc",
    );
  });
});

describe("setPushNotificationsRegistrationId", () => {
  beforeEach(() => resetMocks());

  test("sets registration ID", () => {
    setPushNotificationsRegistrationId("reg-xyz");

    expect(mockNative.setPushNotificationsRegistrationId).toHaveBeenCalledWith(
      "reg-xyz",
    );
  });
});
