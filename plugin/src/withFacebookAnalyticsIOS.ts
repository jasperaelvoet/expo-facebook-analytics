import {
  type ConfigPlugin,
  withInfoPlist,
} from '@expo/config-plugins';

type ResolvedProps = {
  appID: string;
  clientToken: string;
  displayName: string;
  scheme: string;
  autoInitEnabled: boolean;
  autoLogAppEventsEnabled: boolean;
  advertiserIDCollectionEnabled: boolean;
  iosUserTrackingPermission?: string | false;
};

export const withFacebookIOS: ConfigPlugin<ResolvedProps> = (
  config,
  props
) => {
  return withInfoPlist(config, (mod) => {
    mod.modResults.FacebookAppID = props.appID;
    mod.modResults.FacebookClientToken = props.clientToken;
    mod.modResults.FacebookDisplayName = props.displayName;
    mod.modResults.FacebookAutoInitEnabled = props.autoInitEnabled;
    mod.modResults.FacebookAutoLogAppEventsEnabled =
      props.autoLogAppEventsEnabled;
    mod.modResults.FacebookAdvertiserIDCollectionEnabled =
      props.advertiserIDCollectionEnabled;

    // URL schemes
    if (!mod.modResults.CFBundleURLTypes) {
      mod.modResults.CFBundleURLTypes = [];
    }

    const fbSchemeEntry = mod.modResults.CFBundleURLTypes.find(
      (entry: any) =>
        entry.CFBundleURLSchemes &&
        entry.CFBundleURLSchemes.includes(props.scheme)
    );

    if (!fbSchemeEntry) {
      mod.modResults.CFBundleURLTypes.push({
        CFBundleURLSchemes: [props.scheme],
      });
    }

    // LSApplicationQueriesSchemes
    const queriesSchemes = [
      'fbapi',
      'fb-messenger-api',
      'fbauth2',
      'fbshareextension',
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
  props
) => {
  if (props.iosUserTrackingPermission === false) {
    return config;
  }

  return withInfoPlist(config, (mod) => {
    mod.modResults.NSUserTrackingUsageDescription =
      props.iosUserTrackingPermission ||
      'This identifier will be used to deliver personalized ads to you.';
    return mod;
  });
};

export const withSKAdNetworkIdentifiers: ConfigPlugin<string[]> = (
  config,
  identifiers
) => {
  return withInfoPlist(config, (mod) => {
    if (!mod.modResults.SKAdNetworkItems) {
      mod.modResults.SKAdNetworkItems = [];
    }

    const existing = new Set(
      mod.modResults.SKAdNetworkItems.map(
        (item: any) => item.SKAdNetworkIdentifier
      )
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
