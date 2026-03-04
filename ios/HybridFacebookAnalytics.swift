import Foundation
import NitroModules
import FBSDKCoreKit

class HybridFacebookAnalytics: HybridFacebookAnalyticsSpec {

    // MARK: - Event Logging

    func logEvent(eventName: String, valueToSum: Double, params: [String: String]) throws {
        let fbParams: [AppEvents.ParameterName: Any] = params.reduce(into: [:]) { result, pair in
            result[AppEvents.ParameterName(pair.key)] = pair.value
        }
        AppEvents.shared.logEvent(
            AppEvents.Name(eventName),
            valueToSum: valueToSum,
            parameters: fbParams
        )
    }

    func logEventWithoutParams(eventName: String, valueToSum: Double) throws {
        if valueToSum != 0 {
            AppEvents.shared.logEvent(
                AppEvents.Name(eventName),
                valueToSum: valueToSum
            )
        } else {
            AppEvents.shared.logEvent(AppEvents.Name(eventName))
        }
    }

    func logPurchase(amount: Double, currency: String, params: [String: String]) throws {
        let fbParams: [AppEvents.ParameterName: Any] = params.reduce(into: [:]) { result, pair in
            result[AppEvents.ParameterName(pair.key)] = pair.value
        }
        AppEvents.shared.logPurchase(amount: amount, currency: currency, parameters: fbParams)
    }

    func logPushNotificationOpen(payload: [String: String]) throws {
        let nsPayload: [String: Any] = payload.reduce(into: [:]) { result, pair in
            result[pair.key] = pair.value
        }
        AppEvents.shared.logPushNotificationOpen(payload: nsPayload)
    }

    // MARK: - User Identity

    func setUserID(userID: String) throws {
        AppEvents.shared.userID = userID
    }

    func clearUserID() throws {
        AppEvents.shared.userID = nil
    }

    func getUserID() throws -> String? {
        return AppEvents.shared.userID
    }

    func setUserData(
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
    ) throws {
        AppEvents.shared.setUser(
            email: email,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            dateOfBirth: dateOfBirth,
            gender: gender,
            city: city,
            state: state,
            zip: zip,
            country: country
        )
    }

    // MARK: - Device Identifiers

    func getAnonymousID() throws -> Promise<String?> {
        return Promise.resolved(withValue: AppEvents.shared.anonymousID)
    }

    func getAdvertiserID() throws -> Promise<String?> {
        return Promise.resolved(withValue: nil)
    }

    // MARK: - Configuration

    func setFlushBehavior(flushBehavior: String) throws {
        switch flushBehavior {
        case "explicit_only":
            AppEvents.shared.flushBehavior = .explicitOnly
        default:
            AppEvents.shared.flushBehavior = .auto
        }
    }

    func flush() throws {
        AppEvents.shared.flush()
    }

    // MARK: - Push Notifications

    func setPushNotificationsDeviceToken(token: String) throws {
        if let data = token.data(using: .utf8) {
            AppEvents.shared.setPushNotificationsDeviceToken(data)
        }
    }

    func setPushNotificationsRegistrationId(registrationId: String) throws {
        // No-op on iOS — this is an Android-only method
    }
}
