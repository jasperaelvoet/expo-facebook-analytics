import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  AppEventParams,
  AppEvents,
  clearUserID,
  flush,
  getAdvertiserID,
  getAnonymousID,
  getUserID,
  initialize,
  logEvent,
  logPurchase,
  logPushNotificationOpen,
  setAdvertiserIDCollectionEnabled,
  setAppID,
  setAutoLogAppEventsEnabled,
  setClientToken,
  setFlushBehavior,
  setLoggingEnabled,
  setPushNotificationsDeviceToken,
  setPushNotificationsRegistrationId,
  setUserData,
  setUserID,
} from "expo-facebook-analytics";

type LogEntry = { id: number; ok: boolean; label: string; detail?: string };

type Action = { label: string; run: () => unknown };
type Section = { title: string; accent: string; actions: Action[] };

const SECTIONS: Section[] = [
  {
    title: "Setup",
    accent: "#4d9bff",
    actions: [
      { label: "initialize", run: () => initialize() },
      { label: "setAppID", run: () => setAppID("000000000000000") },
      {
        label: "setClientToken",
        run: () => setClientToken("00000000000000000000000000000000"),
      },
      { label: "setLoggingEnabled(true)", run: () => setLoggingEnabled(true) },
      {
        label: "setAutoLogAppEventsEnabled",
        run: () => setAutoLogAppEventsEnabled(true),
      },
      {
        label: "setAdvertiserIDCollectionEnabled",
        run: () => setAdvertiserIDCollectionEnabled(true),
      },
    ],
  },
  {
    title: "Events",
    accent: "#7ee787",
    actions: [
      {
        label: "logEvent (custom)",
        run: () => logEvent("example_button_tap", { source: "example_app" }),
      },
      {
        label: "logEvent (ViewedContent + value)",
        run: () =>
          logEvent(AppEvents.ViewedContent, 9.99, {
            [AppEventParams.ContentType]: "product",
            [AppEventParams.ContentID]: "sku-123",
          }),
      },
      {
        label: "logPurchase (9.99 USD)",
        run: () =>
          logPurchase(9.99, "USD", { [AppEventParams.ContentID]: "sku-123" }),
      },
      {
        label: "logPushNotificationOpen",
        run: () => logPushNotificationOpen({ campaign: "example" }),
      },
      { label: "flush", run: () => flush() },
      {
        label: 'setFlushBehavior("explicit_only")',
        run: () => setFlushBehavior("explicit_only"),
      },
    ],
  },
  {
    title: "Identity",
    accent: "#ffa657",
    actions: [
      { label: 'setUserID("user-123")', run: () => setUserID("user-123") },
      { label: "getUserID", run: () => getUserID() },
      { label: "clearUserID", run: () => clearUserID() },
      {
        label: "setUserData",
        run: () => setUserData({ email: "test@example.com", country: "us" }),
      },
    ],
  },
  {
    title: "Identifiers (async)",
    accent: "#bc8cff",
    actions: [
      { label: "getAnonymousID", run: () => getAnonymousID() },
      { label: "getAdvertiserID", run: () => getAdvertiserID() },
    ],
  },
  {
    title: "Push tokens",
    accent: "#ff7b9c",
    actions: [
      {
        label: "setPushNotificationsDeviceToken",
        run: () => setPushNotificationsDeviceToken("a1b2c3d4"),
      },
      {
        label: "setPushNotificationsRegistrationId",
        run: () => setPushNotificationsRegistrationId("fcm-token-xyz"),
      },
    ],
  },
];

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const nextId = useRef(0);

  const append = useCallback((entry: Omit<LogEntry, "id">) => {
    setLogs((prev) => [{ id: nextId.current++, ...entry }, ...prev].slice(0, 60));
  }, []);

  // On launch, demonstrate the deferred-init flow and turn on verbose SDK
  // logging so the native Facebook SDK output shows up in the device console.
  // (app.json sets isAutoInitEnabled: false, so nothing runs until we ask.)
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    try {
      setLoggingEnabled(true);
      initialize();
      logEvent("app_launched", { source: "example_app" });
      append({ ok: true, label: "auto: logging + initialize + logEvent" });
    } catch (err) {
      append({ ok: false, label: "auto-init", detail: String(err) });
    }
  }, [append]);

  const onPress = useCallback(
    (action: Action) => async () => {
      try {
        const result = await action.run();
        append({
          ok: true,
          label: action.label,
          detail: result === undefined ? undefined : JSON.stringify(result),
        });
      } catch (err) {
        append({ ok: false, label: action.label, detail: String(err) });
      }
    },
    [append],
  );

  // End-to-end self test: runs every method once and reports an overall
  // result. The banner text is asserted by the Maestro E2E flow in CI.
  const [result, setResult] = useState<string | null>(null);
  const runAll = useCallback(async () => {
    setResult(null);
    const actions = SECTIONS.flatMap((s) => s.actions);
    let passed = 0;
    const failures: string[] = [];
    for (const action of actions) {
      try {
        await action.run();
        passed++;
        append({ ok: true, label: action.label });
      } catch (err) {
        failures.push(action.label);
        append({ ok: false, label: action.label, detail: String(err) });
      }
    }
    const total = actions.length;
    setResult(
      failures.length === 0
        ? `E2E PASSED ${passed}/${total}`
        : `E2E FAILED ${failures.length}/${total}`,
    );
  }, [append]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View style={styles.brandText}>
            <Text style={styles.title}>Facebook Analytics</Text>
            <Text style={styles.subtitle}>Nitro · Expo SDK 56 · example</Text>
          </View>
          <Pressable
            testID="run-all"
            accessibilityLabel="Run all tests"
            style={({ pressed }) => [
              styles.runAll,
              pressed && styles.runAllPressed,
            ]}
            onPress={runAll}
          >
            <Text style={styles.runAllText}>Run all tests</Text>
          </Pressable>
          {result ? (
            <View
              testID="e2e-result"
              style={[
                styles.result,
                result.startsWith("E2E PASSED")
                  ? styles.resultPass
                  : styles.resultFail,
              ]}
            >
              <Text style={styles.resultText}>{result}</Text>
            </View>
          ) : null}
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View
                  style={[styles.dot, { backgroundColor: section.accent }]}
                />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <View style={styles.card}>
                {section.actions.map((action, i) => (
                  <Row
                    key={action.label}
                    label={action.label}
                    accent={section.accent}
                    first={i === 0}
                    onPress={onPress(action)}
                  />
                ))}
              </View>
            </View>
          ))}
          <View style={{ height: 12 }} />
        </ScrollView>

        <View style={styles.logPanel}>
          <View style={styles.logHeader}>
            <Text style={styles.logTitle}>Output</Text>
            <Pressable onPress={() => setLogs([])} hitSlop={8}>
              <Text style={styles.clear}>Clear</Text>
            </Pressable>
          </View>
          <ScrollView
            style={styles.logScroll}
            contentContainerStyle={styles.logContent}
          >
            {logs.length === 0 ? (
              <Text style={styles.empty}>
                Tap a method above to call the native module.
              </Text>
            ) : (
              logs.map((entry) => (
                <View key={entry.id} style={styles.logLine}>
                  <Text
                    style={[
                      styles.badge,
                      entry.ok ? styles.badgeOk : styles.badgeErr,
                    ]}
                  >
                    {entry.ok ? "✓" : "✕"}
                  </Text>
                  <Text style={styles.logLabel}>{entry.label}</Text>
                  {entry.detail ? (
                    <Text
                      style={[
                        styles.logDetail,
                        !entry.ok && styles.logDetailErr,
                      ]}
                      numberOfLines={1}
                    >
                      {entry.detail}
                    </Text>
                  ) : null}
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Row({
  label,
  accent,
  first,
  onPress,
}: {
  label: string;
  accent: string;
  first: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (to: number) =>
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animate(0.97)}
      onPressOut={() => animate(1)}
    >
      <Animated.View
        style={[
          styles.row,
          !first && styles.rowBorder,
          { transform: [{ scale }] },
        ]}
      >
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.chevron, { color: accent }]}>›</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0e1a" },
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14 },
  brandText: { gap: 2 },
  title: { color: "#f5f7ff", fontSize: 20, fontWeight: "700" },
  subtitle: { color: "#6b7493", fontSize: 12, fontWeight: "500" },

  runAll: {
    marginTop: 14,
    backgroundColor: "#1877F2",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  runAllPressed: { backgroundColor: "#1568d8" },
  runAllText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  result: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  resultPass: { backgroundColor: "#0f2a16", borderColor: "#1f5a2e" },
  resultFail: { backgroundColor: "#2a0f14", borderColor: "#5a1f28" },
  resultText: {
    color: "#f5f7ff",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Menlo",
  },

  body: { flex: 1 },
  bodyContent: { paddingHorizontal: 20, paddingTop: 4 },
  section: { marginBottom: 18 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    marginLeft: 2,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: {
    color: "#9aa3c0",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#141a2e",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1f2740",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: "#1f2740" },
  rowLabel: {
    color: "#e4e9ff",
    fontSize: 14.5,
    fontWeight: "600",
    fontFamily: "Menlo",
    flex: 1,
  },
  chevron: { fontSize: 22, fontWeight: "700", marginLeft: 8 },

  logPanel: {
    backgroundColor: "#070a14",
    borderTopWidth: 1,
    borderTopColor: "#1f2740",
    height: 200,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  logTitle: {
    color: "#9aa3c0",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  clear: { color: "#4d9bff", fontSize: 13, fontWeight: "600" },
  logScroll: { flex: 1 },
  logContent: { paddingBottom: 12 },
  empty: { color: "#4a5374", fontSize: 13, fontStyle: "italic" },
  logLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 3,
  },
  badge: { fontSize: 13, fontWeight: "800", width: 14 },
  badgeOk: { color: "#3fb950" },
  badgeErr: { color: "#f85149" },
  logLabel: {
    color: "#c9d2f0",
    fontSize: 12.5,
    fontFamily: "Menlo",
    fontWeight: "600",
  },
  logDetail: {
    color: "#6b7493",
    fontSize: 12,
    fontFamily: "Menlo",
    flex: 1,
  },
  logDetailErr: { color: "#f85149" },
});
