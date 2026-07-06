package com.nitrofbanalytics

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.margelo.nitro.com.nitrofbanalytics.NitroFBAnalyticsOnLoad

/**
 * React Native autolinking entry point for the Nitro module.
 *
 * Unlike iOS (where Nitro auto-registers via the podspec's autolinking files),
 * Android has no auto-load mechanism for the C++ library. This package exists
 * solely so React Native autolinking instantiates it and triggers
 * [NitroFBAnalyticsOnLoad.initializeNative], which loads the native library and
 * registers the "FacebookAnalytics" HybridObject in the Nitro registry.
 */
class FacebookAnalyticsPackage : ReactPackage {
  init {
    NitroFBAnalyticsOnLoad.initializeNative()
  }

  override fun createNativeModules(
    reactContext: ReactApplicationContext,
  ): List<NativeModule> = emptyList()

  override fun createViewManagers(
    reactContext: ReactApplicationContext,
  ): List<ViewManager<*, *>> = emptyList()
}
