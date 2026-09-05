import {
  type ConfigPlugin,
  withAppDelegate,
  withInfoPlist,
} from "@expo/config-plugins";

type ResolvedProps = {
  appID: string;
  clientToken: string;
  displayName: string;
  scheme: string;
  isAutoInitEnabled: boolean;
  autoLogAppEventsEnabled: boolean;
  advertiserIDCollectionEnabled: boolean;
  iosUserTrackingPermission?: string | false;
};

export const withFacebookIOS: ConfigPlugin<ResolvedProps> = (config, props) => {
  return withInfoPlist(config, (mod) => {
    mod.modResults.FacebookAppID = props.appID;
    mod.modResults.FacebookClientToken = props.clientToken;
    mod.modResults.FacebookDisplayName = props.displayName;
    mod.modResults.FacebookAutoInitEnabled = props.isAutoInitEnabled;
    mod.modResults.FacebookAutoLogAppEventsEnabled =
      props.autoLogAppEventsEnabled;
    mod.modResults.FacebookAdvertiserIDCollectionEnabled =
      props.advertiserIDCollectionEnabled;

    // URL schemes
    if (!mod.modResults.CFBundleURLTypes) {
      mod.modResults.CFBundleURLTypes = [];
    }

    const fbSchemeEntry = mod.modResults.CFBundleURLTypes.find(
      (entry: { CFBundleURLSchemes?: string[] }) =>
        entry.CFBundleURLSchemes?.includes(props.scheme),
    );

    if (!fbSchemeEntry) {
      mod.modResults.CFBundleURLTypes.push({
        CFBundleURLSchemes: [props.scheme],
      });
    }

    // LSApplicationQueriesSchemes
    const queriesSchemes = [
      "fbapi",
      "fb-messenger-api",
      "fbauth2",
      "fbshareextension",
    ];

    if (!mod.modResults.LSApplicationQueriesSchemes) {
      mod.modResults.LSApplicationQueriesSchemes = [];
    }

    const existingQueries = new Set<string>(
      mod.modResults.LSApplicationQueriesSchemes,
    );
    for (const scheme of queriesSchemes) {
      if (!existingQueries.has(scheme)) {
        mod.modResults.LSApplicationQueriesSchemes.push(scheme);
        existingQueries.add(scheme);
      }
    }

    return mod;
  });
};

export const withUserTrackingPermission: ConfigPlugin<ResolvedProps> = (
  config,
  props,
) => {
  if (props.iosUserTrackingPermission === false) {
    return config;
  }

  return withInfoPlist(config, (mod) => {
    mod.modResults.NSUserTrackingUsageDescription =
      props.iosUserTrackingPermission ||
      "This identifier will be used to deliver personalized ads to you.";
    return mod;
  });
};

const OBJC_IMPORT = "#import <FBSDKCoreKit/FBSDKCoreKit.h>";
const OBJC_LAUNCH_HOOK =
  "[[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];";
const SWIFT_IMPORT = "import FBSDKCoreKit";
const SWIFT_LAUNCH_HOOK =
  "ApplicationDelegate.shared.application(application, didFinishLaunchingWithOptions: launchOptions)";
const SWIFT_LAUNCH_ANCHOR =
  /^([ \t]*)return super\.application\(application, didFinishLaunchingWithOptions: launchOptions\)/m;

/**
 * Wire the Facebook SDK into the app delegate so it initializes at launch.
 *
 * Expo SDK 53 and newer generate `AppDelegate.swift` (an `ExpoAppDelegate`
 * subclass); older templates are Objective-C. Both are handled, and the patch
 * is idempotent. Exported without the config-plugin wrapper so it can be
 * unit-tested against template snippets.
 */
export function applyFacebookAppDelegate(
  contents: string,
  language: string,
): string {
  let result = contents;

  if (language === "swift") {
    if (!result.includes(SWIFT_IMPORT)) {
      // Ahead of the first import, whatever access modifier the template uses
      // (`internal import Expo` on SDK 57, plain `import Expo` before).
      const withImport = result.replace(
        /^((?:\w+ )?import [^\n]+\n)/m,
        `${SWIFT_IMPORT}\n$1`,
      );
      result =
        withImport === result ? `${SWIFT_IMPORT}\n${result}` : withImport;
    }

    if (!result.includes(SWIFT_LAUNCH_HOOK)) {
      if (!SWIFT_LAUNCH_ANCHOR.test(result)) {
        throw new Error(
          "expo-facebook-analytics: could not find `return super.application(application, didFinishLaunchingWithOptions: launchOptions)` in AppDelegate.swift. " +
            "Restore Expo's template delegate, or set `isAutoInitEnabled: false` and call `initialize()` from JavaScript.",
        );
      }
      result = result.replace(
        SWIFT_LAUNCH_ANCHOR,
        `$1${SWIFT_LAUNCH_HOOK}\n$1return super.application(application, didFinishLaunchingWithOptions: launchOptions)`,
      );
    }

    return result;
  }

  if (!result.includes(OBJC_IMPORT)) {
    result = result.replace(
      '#import "AppDelegate.h"',
      `#import "AppDelegate.h"\n${OBJC_IMPORT}`,
    );
  }

  if (!result.includes("FBSDKApplicationDelegate")) {
    result = result.replace(
      "self.initialProps = @{};",
      `self.initialProps = @{};\n  ${OBJC_LAUNCH_HOOK}`,
    );
  }

  if (!result.includes("openURL:url options:options")) {
    const openURLMethod = `

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options];
}`;
    result = result.replace(/@end\s*$/, `${openURLMethod}\n\n@end\n`);
  }

  return result;
}

export const withFacebookAppDelegate: ConfigPlugin<ResolvedProps> = (
  config,
  props,
) => {
  // With auto-init off the app starts the SDK from JavaScript through
  // `initialize()`; wiring the delegate anyway would start it at launch and
  // defeat consent gating. (The iOS SDK has had no auto-init of its own since
  // v9, so this wiring is the only launch-time path.)
  if (!props.isAutoInitEnabled) {
    return config;
  }

  return withAppDelegate(config, (mod) => {
    mod.modResults.contents = applyFacebookAppDelegate(
      mod.modResults.contents,
      mod.modResults.language,
    );
    return mod;
  });
};

export const withSKAdNetworkIdentifiers: ConfigPlugin<string[]> = (
  config,
  identifiers,
) => {
  return withInfoPlist(config, (mod) => {
    if (!mod.modResults.SKAdNetworkItems) {
      mod.modResults.SKAdNetworkItems = [];
    }

    const existing = new Set(
      mod.modResults.SKAdNetworkItems.map(
        (item: { SKAdNetworkIdentifier: string }) => item.SKAdNetworkIdentifier,
      ),
    );

    for (const id of identifiers) {
      if (!existing.has(id)) {
        mod.modResults.SKAdNetworkItems.push({
          SKAdNetworkIdentifier: id,
        });
      }
    }

    return mod;
  });
};
