package com.nitrofbanalytics

import android.os.Bundle
import com.facebook.FacebookSdk
import com.facebook.LoggingBehavior
import com.facebook.appevents.AppEventsConstants
import com.facebook.appevents.AppEventsLogger
import com.facebook.internal.AttributionIdentifiers
import com.margelo.nitro.core.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import java.math.BigDecimal
import java.util.Currency

class HybridFacebookAnalytics : HybridFacebookAnalyticsSpec() {

    private val logger: AppEventsLogger by lazy {
        AppEventsLogger.newLogger(FacebookSdk.getApplicationContext())
    }

    // Background scope for blocking SDK calls (Play Services I/O) so they never
    // run on the JS thread.
    private val ioScope = CoroutineScope(Dispatchers.IO)

    // region Initialization & Runtime Configuration

    override fun initialize() {
        FacebookSdk.setAutoInitEnabled(true)
        FacebookSdk.fullyInitialize()
    }

    override fun setAutoLogAppEventsEnabled(enabled: Boolean) {
        FacebookSdk.setAutoLogAppEventsEnabled(enabled)
    }

    override fun setAdvertiserIDCollectionEnabled(enabled: Boolean) {
        FacebookSdk.setAdvertiserIDCollectionEnabled(enabled)
    }

    override fun setAppID(appID: String) {
        FacebookSdk.setApplicationId(appID)
    }

    override fun setClientToken(clientToken: String) {
        FacebookSdk.setClientToken(clientToken)
    }

    override fun setLoggingEnabled(enabled: Boolean) {
        val behaviors = listOf(
            LoggingBehavior.APP_EVENTS,
            LoggingBehavior.NETWORK_REQUESTS,
            LoggingBehavior.DEVELOPER_ERRORS,
            LoggingBehavior.INCLUDE_ACCESS_TOKENS
        )
        FacebookSdk.setIsDebugEnabled(enabled)
        for (behavior in behaviors) {
            if (enabled) {
                FacebookSdk.addLoggingBehavior(behavior)
            } else {
                FacebookSdk.removeLoggingBehavior(behavior)
            }
        }
    }

    // endregion

    // region Event Logging

    override fun logEvent(eventName: String, valueToSum: Double, params: Map<String, String>) {
        val bundle = mapToBundle(params)
        logger.logEvent(eventName, valueToSum, bundle)
    }

    override fun logEventWithoutParams(eventName: String, valueToSum: Double) {
        if (valueToSum != 0.0) {
            logger.logEvent(eventName, valueToSum)
        } else {
            logger.logEvent(eventName)
        }
    }

    override fun logPurchase(amount: Double, currency: String, params: Map<String, String>) {
        val bundle = mapToBundle(params)
        logger.logPurchase(
            BigDecimal.valueOf(amount),
            Currency.getInstance(currency),
            bundle
        )
    }

    override fun logPushNotificationOpen(payload: Map<String, String>) {
        val bundle = mapToBundle(payload)
        logger.logPushNotificationOpen(bundle)
    }

    // endregion

    // region User Identity

    override fun setUserID(userID: String) {
        AppEventsLogger.setUserID(userID)
    }

    override fun clearUserID() {
        AppEventsLogger.clearUserID()
    }

    override fun getUserID(): String? {
        return AppEventsLogger.getUserID()
    }

    override fun setUserData(
        email: String?,
        firstName: String?,
        lastName: String?,
        phone: String?,
        dateOfBirth: String?,
        gender: String?,
        city: String?,
        state: String?,
        zip: String?,
        country: String?
    ) {
        AppEventsLogger.setUserData(
            email, firstName, lastName, phone,
            dateOfBirth, gender, city, state, zip, country
        )
    }

    // endregion

    // region Device Identifiers

    override fun getAnonymousID(): Promise<String?> {
        return Promise.resolved(logger.anonymousAppDeviceGUID)
    }

    override fun getAdvertiserID(): Promise<String?> {
        // AttributionIdentifiers performs blocking Play Services I/O, so run it
        // off the JS thread on the IO dispatcher.
        return Promise.async(ioScope) {
            try {
                val context = FacebookSdk.getApplicationContext()
                val identifiers = AttributionIdentifiers.getAttributionIdentifiers(context)
                identifiers?.androidAdvertiserId
            } catch (e: Exception) {
                null
            }
        }
    }

    // endregion

    // region Configuration

    override fun setFlushBehavior(flushBehavior: String) {
        when (flushBehavior) {
            "explicit_only" -> AppEventsLogger.setFlushBehavior(AppEventsLogger.FlushBehavior.EXPLICIT_ONLY)
            else -> AppEventsLogger.setFlushBehavior(AppEventsLogger.FlushBehavior.AUTO)
        }
    }

    override fun flush() {
        logger.flush()
    }

    // endregion

    // region Push Notifications

    override fun setPushNotificationsDeviceToken(token: String) {
        // No-op on Android — use setPushNotificationsRegistrationId instead
    }

    override fun setPushNotificationsRegistrationId(registrationId: String) {
        AppEventsLogger.setPushNotificationsRegistrationId(registrationId)
    }

    // endregion

    // region Helpers

    private fun mapToBundle(map: Map<String, String>): Bundle {
        val bundle = Bundle()
        for ((key, value) in map) {
            bundle.putString(key, value)
        }
        return bundle
    }

    // endregion
}
