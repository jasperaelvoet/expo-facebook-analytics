import { type ConfigPlugin, createRunOncePlugin } from "@expo/config-plugins";
import {
  withAndroidPermissions,
  withFacebookAppIdString,
  withFacebookManifest,
} from "./withFacebookAnalyticsAndroid";
import {
  withFacebookAppDelegate,
  withFacebookIOS,
  withSKAdNetworkIdentifiers,
  withUserTrackingPermission,
} from "./withFacebookAnalyticsIOS";

const pkg = require("../../package.json");

export type ConfigProps = {
  appID: string;
  clientToken: string;
  displayName?: string;
  scheme?: string;
  isAutoInitEnabled?: boolean;
  autoLogAppEventsEnabled?: boolean;
  advertiserIDCollectionEnabled?: boolean;
  iosUserTrackingPermission?: string | false;
};

const withFacebookAnalytics: ConfigPlugin<ConfigProps | undefined> = (
  config,
  props,
) => {
  if (!props) {
    throw new Error(
      "expo-facebook-analytics plugin requires props: { appID, clientToken }",
    );
  }

  const {
    appID,
    clientToken,
    displayName,
    scheme = `fb${props.appID}`,
    isAutoInitEnabled = true,
    autoLogAppEventsEnabled = true,
    advertiserIDCollectionEnabled = true,
    iosUserTrackingPermission,
  } = props;

  if (!appID) {
    throw new Error('Missing required "appID" in plugin config.');
  }
  if (!clientToken) {
    throw new Error('Missing required "clientToken" in plugin config.');
  }

  const resolvedProps = {
    appID,
    clientToken,
    displayName: displayName || config.name || "",
    scheme,
    isAutoInitEnabled,
    autoLogAppEventsEnabled,
    advertiserIDCollectionEnabled,
    iosUserTrackingPermission,
  };

  // Android
  config = withFacebookAppIdString(config, resolvedProps);
  config = withFacebookManifest(config, resolvedProps);
  config = withAndroidPermissions(config, resolvedProps);

  // iOS
  config = withFacebookIOS(config, resolvedProps);
  config = withFacebookAppDelegate(config, resolvedProps);
  config = withUserTrackingPermission(config, resolvedProps);
  config = withSKAdNetworkIdentifiers(config, [
    "v9wttpbfk9.skadnetwork",
    "n38lu8286q.skadnetwork",
  ]);

  return config;
};

export default createRunOncePlugin(
  withFacebookAnalytics,
  pkg.name,
  pkg.version,
);
