#include <jni.h>
#include <fbjni/fbjni.h>

#include "NitroFBAnalyticsOnLoad.hpp"

// Entry point of libNitroFBAnalytics.so. Loaded by
// NitroFBAnalyticsOnLoad.initializeNative() (System.loadLibrary), this
// registers the "FacebookAnalytics" HybridObject with the Nitro registry so
// JS `createHybridObject("FacebookAnalytics")` can resolve it.
JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return facebook::jni::initialize(vm, [] {
    margelo::nitro::fbanalytics::registerAllNatives();
  });
}
