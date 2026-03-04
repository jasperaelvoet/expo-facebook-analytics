import {
  type ConfigPlugin,
  AndroidConfig,
  withStringsXml,
  withAndroidManifest,
} from '@expo/config-plugins';

type ResolvedProps = {
  appID: string;
  clientToken: string;
  displayName: string;
  scheme: string;
  autoInitEnabled: boolean;
  autoLogAppEventsEnabled: boolean;
  advertiserIDCollectionEnabled: boolean;
};

export const withFacebookAppIdString: ConfigPlugin<ResolvedProps> = (
  config,
  props
) => {
  return withStringsXml(config, (mod) => {
    const stringItems = mod.modResults.resources.string ?? [];

    const setString = (name: string, value: string) => {
      const existing = stringItems.findIndex(
        (item: any) => item.$.name === name
      );
      const entry = {
        $: { name, translatable: 'false' as const },
        _: value,
      };
      if (existing >= 0) {
        stringItems[existing] = entry;
      } else {
        stringItems.push(entry);
      }
    };

    setString('facebook_app_id', props.appID);
    setString('facebook_client_token', props.clientToken);
    setString('facebook_login_protocol_scheme', props.scheme);

    mod.modResults.resources.string = stringItems;
    return mod;
  });
};

export const withFacebookManifest: ConfigPlugin<ResolvedProps> = (
  config,
  props
) => {
  return withAndroidManifest(config, (mod) => {
    const mainApplication =
      AndroidConfig.Manifest.getMainApplicationOrThrow(mod.modResults);

    // Add meta-data entries
    if (!mainApplication['meta-data']) {
      mainApplication['meta-data'] = [];
    }

    const metaData = mainApplication['meta-data'];

    const setMetaData = (name: string, value: string) => {
      const existing = metaData.findIndex(
        (item: any) => item.$['android:name'] === name
      );
      const entry = {
        $: {
          'android:name': name,
          'android:value': value,
        },
      };
      if (existing >= 0) {
        metaData[existing] = entry;
      } else {
        metaData.push(entry);
      }
    };

    setMetaData(
      'com.facebook.sdk.ApplicationId',
      '@string/facebook_app_id'
    );
    setMetaData(
      'com.facebook.sdk.ClientToken',
      '@string/facebook_client_token'
    );
    setMetaData('com.facebook.sdk.ApplicationName', props.displayName);
    setMetaData(
      'com.facebook.sdk.AutoInitEnabled',
      String(props.autoInitEnabled)
    );
    setMetaData(
      'com.facebook.sdk.AutoLogAppEventsEnabled',
      String(props.autoLogAppEventsEnabled)
    );
    setMetaData(
      'com.facebook.sdk.AdvertiserIDCollectionEnabled',
      String(props.advertiserIDCollectionEnabled)
    );

    return mod;
  });
};

export const withAndroidPermissions: ConfigPlugin<ResolvedProps> = (
  config,
  _props
) => {
  return AndroidConfig.Permissions.withPermissions(config, [
    'android.permission.INTERNET',
  ]);
};
