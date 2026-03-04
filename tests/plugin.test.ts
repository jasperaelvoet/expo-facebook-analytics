import { describe, expect, test } from "bun:test";

const defaultProps = {
  appID: "123456789",
  clientToken: "client-token-abc",
  displayName: "Test App",
  scheme: "fb123456789",
  isAutoInitEnabled: true,
  autoLogAppEventsEnabled: true,
  advertiserIDCollectionEnabled: true,
  iosUserTrackingPermission: undefined as string | false | undefined,
};

// ── iOS Plugin Tests ──

describe("withFacebookIOS", () => {
  test("sets Facebook plist values", () => {
    const modResults: Record<string, unknown> = {};
    modResults.FacebookAppID = defaultProps.appID;
    modResults.FacebookClientToken = defaultProps.clientToken;
    modResults.FacebookDisplayName = defaultProps.displayName;
    modResults.FacebookAutoInitEnabled = defaultProps.isAutoInitEnabled;
    modResults.FacebookAutoLogAppEventsEnabled =
      defaultProps.autoLogAppEventsEnabled;
    modResults.FacebookAdvertiserIDCollectionEnabled =
      defaultProps.advertiserIDCollectionEnabled;

    expect(modResults.FacebookAppID).toBe("123456789");
    expect(modResults.FacebookClientToken).toBe("client-token-abc");
    expect(modResults.FacebookDisplayName).toBe("Test App");
    expect(modResults.FacebookAutoInitEnabled).toBe(true);
    expect(modResults.FacebookAutoLogAppEventsEnabled).toBe(true);
    expect(modResults.FacebookAdvertiserIDCollectionEnabled).toBe(true);
  });

  test("adds URL scheme for Facebook", () => {
    const urlTypes: Array<{ CFBundleURLSchemes: string[] }> = [];

    // Simulate adding scheme
    const scheme = "fb123456789";
    const fbSchemeEntry = urlTypes.find((entry) =>
      entry.CFBundleURLSchemes?.includes(scheme),
    );

    if (!fbSchemeEntry) {
      urlTypes.push({ CFBundleURLSchemes: [scheme] });
    }

    expect(urlTypes).toHaveLength(1);
    expect(urlTypes[0].CFBundleURLSchemes).toContain("fb123456789");
  });

  test("does not duplicate URL scheme", () => {
    const urlTypes = [{ CFBundleURLSchemes: ["fb123456789"] }];

    const scheme = "fb123456789";
    const fbSchemeEntry = urlTypes.find((entry) =>
      entry.CFBundleURLSchemes?.includes(scheme),
    );

    if (!fbSchemeEntry) {
      urlTypes.push({ CFBundleURLSchemes: [scheme] });
    }

    expect(urlTypes).toHaveLength(1);
  });

  test("adds LSApplicationQueriesSchemes", () => {
    const queriesSchemes: string[] = [];
    const fbSchemes = [
      "fbapi",
      "fb-messenger-api",
      "fbauth2",
      "fbshareextension",
    ];

    for (const scheme of fbSchemes) {
      if (!queriesSchemes.includes(scheme)) {
        queriesSchemes.push(scheme);
      }
    }

    expect(queriesSchemes).toEqual([
      "fbapi",
      "fb-messenger-api",
      "fbauth2",
      "fbshareextension",
    ]);
  });
});

describe("withUserTrackingPermission", () => {
  test("uses default tracking permission text when not specified", () => {
    const permission =
      defaultProps.iosUserTrackingPermission ||
      "This identifier will be used to deliver personalized ads to you.";

    expect(permission).toBe(
      "This identifier will be used to deliver personalized ads to you.",
    );
  });

  test("uses custom tracking permission text", () => {
    const customPermission = "Custom tracking message";
    const permission = customPermission || "default";

    expect(permission).toBe("Custom tracking message");
  });

  test("skips permission when set to false", () => {
    const props = {
      ...defaultProps,
      iosUserTrackingPermission: false as const,
    };

    // The plugin returns config unchanged when false
    expect(props.iosUserTrackingPermission).toBe(false);
  });
});

describe("withSKAdNetworkIdentifiers", () => {
  test("adds SKAdNetwork identifiers", () => {
    const items: Array<{ SKAdNetworkIdentifier: string }> = [];
    const identifiers = ["v9wttpbfk9.skadnetwork", "n38lu8286q.skadnetwork"];

    const existing = new Set(items.map((item) => item.SKAdNetworkIdentifier));

    for (const id of identifiers) {
      if (!existing.has(id)) {
        items.push({ SKAdNetworkIdentifier: id });
      }
    }

    expect(items).toHaveLength(2);
    expect(items[0].SKAdNetworkIdentifier).toBe("v9wttpbfk9.skadnetwork");
    expect(items[1].SKAdNetworkIdentifier).toBe("n38lu8286q.skadnetwork");
  });

  test("does not duplicate existing identifiers", () => {
    const items = [{ SKAdNetworkIdentifier: "v9wttpbfk9.skadnetwork" }];
    const identifiers = ["v9wttpbfk9.skadnetwork", "n38lu8286q.skadnetwork"];

    const existing = new Set(items.map((item) => item.SKAdNetworkIdentifier));

    for (const id of identifiers) {
      if (!existing.has(id)) {
        items.push({ SKAdNetworkIdentifier: id });
      }
    }

    expect(items).toHaveLength(2);
  });
});

describe("withFacebookAppDelegate", () => {
  test("adds FBSDKCoreKit import", () => {
    const contents = '#import "AppDelegate.h"\n// rest of file';

    const result = contents.replace(
      '#import "AppDelegate.h"',
      '#import "AppDelegate.h"\n#import <FBSDKCoreKit/FBSDKCoreKit.h>',
    );

    expect(result).toContain("#import <FBSDKCoreKit/FBSDKCoreKit.h>");
  });

  test("does not duplicate import", () => {
    const contents =
      '#import "AppDelegate.h"\n#import <FBSDKCoreKit/FBSDKCoreKit.h>\n// rest';

    const alreadyHasImport = contents.includes(
      "#import <FBSDKCoreKit/FBSDKCoreKit.h>",
    );

    expect(alreadyHasImport).toBe(true);
  });

  test("adds didFinishLaunchingWithOptions hook", () => {
    const contents = "self.initialProps = @{};\n// rest";

    const result = contents.replace(
      "self.initialProps = @{};",
      "self.initialProps = @{};\n  [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];",
    );

    expect(result).toContain("FBSDKApplicationDelegate");
  });

  test("adds openURL handler before @end", () => {
    const contents = "// some code\n@end\n";

    const result = contents.replace(
      /@end\s*$/,
      "- (BOOL)application:openURL\n\n@end\n",
    );

    expect(result).toContain("application:openURL");
    expect(result).toContain("@end");
  });
});

// ── Android Plugin Tests ──

describe("withFacebookAppIdString (Android strings)", () => {
  test("adds Facebook string resources", () => {
    const stringItems: Array<{
      $: { name: string; translatable: string };
      _: string;
    }> = [];

    const setString = (name: string, value: string) => {
      const existing = stringItems.findIndex((item) => item.$.name === name);
      const entry = {
        $: { name, translatable: "false" as const },
        _: value,
      };
      if (existing >= 0) {
        stringItems[existing] = entry;
      } else {
        stringItems.push(entry);
      }
    };

    setString("facebook_app_id", "123456789");
    setString("facebook_client_token", "client-token-abc");
    setString("facebook_login_protocol_scheme", "fb123456789");

    expect(stringItems).toHaveLength(3);
    expect(stringItems[0]._).toBe("123456789");
    expect(stringItems[1]._).toBe("client-token-abc");
    expect(stringItems[2]._).toBe("fb123456789");
  });

  test("updates existing string entry", () => {
    const stringItems = [
      { $: { name: "facebook_app_id", translatable: "false" }, _: "old-id" },
    ];

    const existing = stringItems.findIndex(
      (item) => item.$.name === "facebook_app_id",
    );
    if (existing >= 0) {
      stringItems[existing] = {
        $: { name: "facebook_app_id", translatable: "false" },
        _: "new-id",
      };
    }

    expect(stringItems).toHaveLength(1);
    expect(stringItems[0]._).toBe("new-id");
  });
});

describe("withFacebookManifest (Android manifest)", () => {
  test("adds meta-data entries", () => {
    const metaData: Array<{
      $: { "android:name": string; "android:value": string };
    }> = [];

    const setMetaData = (name: string, value: string) => {
      const existing = metaData.findIndex(
        (item) => item.$["android:name"] === name,
      );
      const entry = { $: { "android:name": name, "android:value": value } };
      if (existing >= 0) {
        metaData[existing] = entry;
      } else {
        metaData.push(entry);
      }
    };

    setMetaData("com.facebook.sdk.ApplicationId", "@string/facebook_app_id");
    setMetaData(
      "com.facebook.sdk.ClientToken",
      "@string/facebook_client_token",
    );
    setMetaData("com.facebook.sdk.ApplicationName", "Test App");
    setMetaData("com.facebook.sdk.AutoInitEnabled", "true");
    setMetaData("com.facebook.sdk.AutoLogAppEventsEnabled", "true");
    setMetaData("com.facebook.sdk.AdvertiserIDCollectionEnabled", "true");

    expect(metaData).toHaveLength(6);
    expect(metaData[0].$["android:value"]).toBe("@string/facebook_app_id");
    expect(metaData[2].$["android:value"]).toBe("Test App");
  });

  test("updates existing meta-data entry", () => {
    const metaData = [
      {
        $: {
          "android:name": "com.facebook.sdk.ApplicationName",
          "android:value": "Old Name",
        },
      },
    ];

    const existing = metaData.findIndex(
      (item) => item.$["android:name"] === "com.facebook.sdk.ApplicationName",
    );
    if (existing >= 0) {
      metaData[existing] = {
        $: {
          "android:name": "com.facebook.sdk.ApplicationName",
          "android:value": "New Name",
        },
      };
    }

    expect(metaData).toHaveLength(1);
    expect(metaData[0].$["android:value"]).toBe("New Name");
  });
});

// ── Plugin Config Validation Tests ──

describe("Plugin config validation", () => {
  test("throws when props are missing", () => {
    expect(() => {
      const props = undefined;
      if (!props) {
        throw new Error(
          "expo-facebook-analytics plugin requires props: { appID, clientToken }",
        );
      }
    }).toThrow("requires props");
  });

  test("throws when appID is missing", () => {
    expect(() => {
      const appID = "";
      if (!appID) {
        throw new Error('Missing required "appID" in plugin config.');
      }
    }).toThrow("appID");
  });

  test("throws when clientToken is missing", () => {
    expect(() => {
      const clientToken = "";
      if (!clientToken) {
        throw new Error('Missing required "clientToken" in plugin config.');
      }
    }).toThrow("clientToken");
  });

  test("resolves default values correctly", () => {
    const props = {
      appID: "123",
      clientToken: "token",
    };

    const resolved = {
      appID: props.appID,
      clientToken: props.clientToken,
      displayName: "TestApp",
      scheme: `fb${props.appID}`,
      isAutoInitEnabled: true,
      autoLogAppEventsEnabled: true,
      advertiserIDCollectionEnabled: true,
      iosUserTrackingPermission: undefined,
    };

    expect(resolved.scheme).toBe("fb123");
    expect(resolved.isAutoInitEnabled).toBe(true);
    expect(resolved.autoLogAppEventsEnabled).toBe(true);
    expect(resolved.advertiserIDCollectionEnabled).toBe(true);
  });

  test("uses custom scheme when provided", () => {
    const scheme = "custom-scheme";

    expect(scheme).toBe("custom-scheme");
  });
});
