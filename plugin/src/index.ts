import {
  type ConfigPlugin,
  createRunOncePlugin,
} from '@expo/config-plugins';
import {
  withFacebookAppIdString,
  withFacebookManifest,
  withAndroidPermissions,
} from './withFacebookAnalyticsAndroid';
import {
  withFacebookIOS,
  withUserTrackingPermission,
  withSKAdNetworkIdentifiers,
} from './withFacebookAnalyticsIOS';

const pkg = require('../../package.json');

export type ConfigProps = {
  appID: string;
  clientToken: string;
  displayName?: string;
  scheme?: string;
  autoInitEnabled?: boolean;
  autoLogAppEventsEnabled?: boolean;
  advertiserIDCollectionEnabled?: boolean;
  iosUserTrackingPermission?: string | false;
};

const withFacebookAnalytics: ConfigPlugin<ConfigProps | void> = (
  config,
  props
) => {
  if (!props) {
    throw new Error(
      'react-native-nitro-fbanalytics plugin requires props: { appID, clientToken }'
    );
  }

  const {
    appID,
    clientToken,
    displayName,
    scheme = `fb${props.appID}`,
    autoInitEnabled = true,
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
    displayName: displayName || config.name || '',
    scheme,
    autoInitEnabled,
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
  config = withUserTrackingPermission(config, resolvedProps);
  config = withSKAdNetworkIdentifiers(config, [
    'v9wttpbfk9.skadnetwork',
    'n38lu8286q.skadnetwork',
  ]);

  return config;
};

export default createRunOncePlugin(
  withFacebookAnalytics,
  pkg.name,
  pkg.version
);
