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

    for (const scheme of queriesSchemes) {
      if (!mod.modResults.LSApplicationQueriesSchemes.includes(scheme)) {
        mod.modResults.LSApplicationQueriesSchemes.push(scheme);
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

export const withFacebookAppDelegate: ConfigPlugin<ResolvedProps> = (
  config,
  _props,
) => {
  return withAppDelegate(config, (mod) => {
    const contents = mod.modResults.contents;

    // Add import
    if (!contents.includes("#import <FBSDKCoreKit/FBSDKCoreKit.h>")) {
      mod.modResults.contents = mod.modResults.contents.replace(
        '#import "AppDelegate.h"',
        '#import "AppDelegate.h"\n#import <FBSDKCoreKit/FBSDKCoreKit.h>',
      );
    }

    // Add didFinishLaunchingWithOptions hook
    if (!contents.includes("FBSDKApplicationDelegate")) {
      mod.modResults.contents = mod.modResults.contents.replace(
        "self.initialProps = @{};",
        "self.initialProps = @{};\n  [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];",
      );
    }

    // Add openURL handler
    if (!contents.includes("openURL:url options:options")) {
      const openURLMethod = `

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options];
}`;
      mod.modResults.contents = mod.modResults.contents.replace(
        /@end\s*$/,
        `${openURLMethod}\n\n@end\n`,
      );
    }

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
