module.exports = {
  dependency: {
    platforms: {
      ios: {},
      android: {
        // Ensures autolinking adds FacebookAnalyticsPackage to the app's
        // PackageList, which loads the Nitro C++ library and registers the
        // "FacebookAnalytics" HybridObject. Without this the JS
        // createHybridObject call throws "not registered" at startup.
        packageImportPath: "import com.nitrofbanalytics.FacebookAnalyticsPackage",
        packageInstance: "new com.nitrofbanalytics.FacebookAnalyticsPackage()",
      },
    },
  },
};
