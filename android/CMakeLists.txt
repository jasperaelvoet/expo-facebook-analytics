project(NitroFBAnalytics)
cmake_minimum_required(VERSION 3.9.0)

set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 20)

# The shared library loaded by NitroFBAnalyticsOnLoad.initializeNative()
# (System.loadLibrary("NitroFBAnalytics")). Its real sources are added by the
# generated autolinking cmake below.
add_library(NitroFBAnalytics SHARED
  src/main/cpp/cpp-adapter.cpp
)

# Adds the Nitrogen-generated C++ sources, headers, and links (fbjni,
# ReactAndroid, react-native-nitro-modules) to the NitroFBAnalytics target.
include(${CMAKE_SOURCE_DIR}/../nitrogen/generated/android/NitroFBAnalytics+autolinking.cmake)
