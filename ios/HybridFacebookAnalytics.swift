import Foundation
import NitroModules
import FBSDKCoreKit
import AdSupport

class HybridFacebookAnalytics: HybridFacebookAnalyticsSpec {

    // MARK: - Initialization & Runtime Configuration

    func initialize() throws {
        // On iOS, auto-init is controlled by Info.plist (FacebookAutoInitEnabled).
        // When disabled, this performs the deferred initialization.
        ApplicationDelegate.shared.initializeSDK()
    }

    func setAutoLogAppEventsEnabled(enabled: Bool) throws {
        Settings.shared.isAutoLogAppEventsEnabled = enabled
    }

    func setAdvertiserIDCollectionEnabled(enabled: Bool) throws {
        Settings.shared.isAdvertiserIDCollectionEnabled = enabled
    }

    func setAppID(appID: String) throws {
        Settings.shared.appID = appID
    }

    func setClientToken(clientToken: String) throws {
        Settings.shared.clientToken = clientToken
    }

    func setLoggingEnabled(enabled: Bool) throws {
        let behaviors: [LoggingBehavior] = [
            .appEvents, .networkRequests, .developerErrors, .informational,
        ]
        for behavior in behaviors {
            if enabled {
                Settings.shared.enableLoggingBehavior(behavior)
            } else {
                Settings.shared.disableLoggingBehavior(behavior)
            }
        }
    }

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
        return Promise.resolved(withResult: AppEvents.shared.anonymousID)
    }

    func getAdvertiserID() throws -> Promise<String?> {
        let idfa = ASIdentifierManager.shared().advertisingIdentifier.uuidString
        if idfa == "00000000-0000-0000-0000-000000000000" {
            return Promise.resolved(withResult: nil)
        }
        return Promise.resolved(withResult: idfa)
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
        // Token comes as a hex string — convert back to raw Data.
        // Iterate over UTF-8 bytes and pack each pair of hex digits into one byte.
        var data = Data(capacity: token.utf8.count / 2)
        var highNibble: UInt8? = nil
        for ascii in token.utf8 {
            let nibble: UInt8
            switch ascii {
            case 0x30...0x39: nibble = ascii - 0x30        // '0'-'9'
            case 0x41...0x46: nibble = ascii - 0x41 + 10   // 'A'-'F'
            case 0x61...0x66: nibble = ascii - 0x61 + 10   // 'a'-'f'
            default: continue                              // skip spaces / non-hex
            }
            if let high = highNibble {
                data.append((high << 4) | nibble)
                highNibble = nil
            } else {
                highNibble = nibble
            }
        }
        AppEvents.shared.setPushNotificationsDeviceToken(data)
    }

    func setPushNotificationsRegistrationId(registrationId: String) throws {
        // No-op on iOS — this is an Android-only method
    }
}
