import { currentUser } from "@/app/api/auth";
import { listCategories, listServices } from "@/app/api/services";
import { leaveToken, listTokens, QueueToken } from "@/app/api/tokens";
import BottomNav from "@/components/ui/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const avatarImage =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80";

const parseNumberParam = (value?: string) => {
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : null;
};

const parseEstimatedMinutes = (estimatedTime?: string | null) => {
  if (!estimatedTime) {
    return 0;
  }

  const normalized = estimatedTime.toLowerCase().replace(/\s+/g, " ").trim();
  const colonMatch = normalized.match(/^(\d+)\s*:\s*(\d+)$/);

  if (colonMatch) {
    const hours = Number(colonMatch[1]);
    const minutes = Number(colonMatch[2]);
    return hours * 60 + minutes;
  }

  const hourMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(hour|hr|hrs|h)/);
  const minuteMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(minute|min|mins|m)/);
  const plainNumber = Number(normalized);

  if (hourMatch || minuteMatch) {
    const hours = hourMatch ? Number(hourMatch[1]) : 0;
    const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
    return Math.round(hours * 60 + minutes);
  }

  if (Number.isFinite(plainNumber)) {
    return plainNumber;
  }

  return 0;
};

export default function QueueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    tokenId?: string;
    serviceId?: string;
    serviceName?: string;
    categoryName?: string;
  }>();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [tokens, setTokens] = useState<QueueToken[]>([]);
  const [customerName, setCustomerName] = useState("Customer");
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState("");
  const [serviceEstimatedMinutes, setServiceEstimatedMinutes] = useState<
    Record<number, number>
  >({});
  const selectedTokenId = parseNumberParam(params.tokenId);
  const selectedServiceId = parseNumberParam(params.serviceId);

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [user, nextTokens, categories] = await Promise.all([
        currentUser(),
        listTokens(),
        listCategories(),
      ]);
      const serviceGroups = await Promise.all(
        categories.map((category) => listServices(category.id)),
      );
      const nextServiceEstimatedMinutes = serviceGroups
        .flat()
        .reduce<Record<number, number>>((estimates, service) => {
          estimates[service.id] = parseEstimatedMinutes(service.estimated_time);
          return estimates;
        }, {});

      setCustomerName(user.username || "Customer");
      setCreditScore(user.credit_score ?? null);
      setCurrentUserId(user.id);
      setTokens(nextTokens);
      setServiceEstimatedMinutes(nextServiceEstimatedMinutes);
    } catch {
      setError("Unable to load your queue right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadQueue();
    }, [loadQueue]),
  );

  const queueTokens = useMemo(() => {
    return tokens
      .filter(
        (token) => token.status === "pending" || token.status === "in_progress",
      )
      .filter((token) =>
        selectedServiceId ? token.service?.id === selectedServiceId : true,
      )
      .sort(
        (firstToken, secondToken) =>
          (firstToken.queue_position ?? 9999) -
          (secondToken.queue_position ?? 9999),
      );
  }, [selectedServiceId, tokens]);

  const activeToken = useMemo(() => {
    return (
      queueTokens.find((token) => token.id === selectedTokenId) ??
      queueTokens.find((token) => token.user?.id === currentUserId) ??
      null
    );
  }, [currentUserId, queueTokens, selectedTokenId]);

  const customersAhead = Math.max((activeToken?.queue_position ?? 1) - 1, 0);
  const activeTokenIndex = activeToken
    ? queueTokens.findIndex((token) => token.id === activeToken.id)
    : -1;
  const tokensAhead =
    activeTokenIndex > 0 ? queueTokens.slice(0, activeTokenIndex) : [];
  const estimatedTime = tokensAhead.reduce((total, token) => {
    const serviceId = token.service?.id;
    const serviceMinutes = serviceId
      ? (serviceEstimatedMinutes[serviceId] ?? 0)
      : 0;

    return total + serviceMinutes;
  }, 0);
  const serviceName =
    activeToken?.service?.name ?? params.serviceName ?? "your service";

  const handleLeaveQueue = async () => {
    if (!activeToken) {
      setShowExitDialog(false);
      return;
    }

    setLeaving(true);

    try {
      await leaveToken(activeToken.id);
      setShowExitDialog(false);
      setTokens((currentTokens) =>
        currentTokens.filter((token) => token.id !== activeToken.id),
      );
      router.replace("/home");
    } catch {
      Alert.alert("Unable to leave queue", "Please try again.");
    } finally {
      setLeaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.title}>Hello, {customerName}</Text>
            <Text style={styles.subtitle}>
              {activeToken
                ? `You are #${activeToken.queue_position ?? "-"} in line for ${serviceName}`
                : "You are not in an active queue"}
            </Text>
          </View>

          <View style={styles.scoreWrap}>
            <View style={styles.scoreRing}>
              <Text style={styles.scoreText}>{creditScore ?? "-"}</Text>
            </View>
            <Image source={{ uri: avatarImage }} style={styles.avatar} />
          </View>
        </View>

        <View style={styles.serviceNotice}>
          <View style={styles.serviceNoticeIcon}>
            <Ionicons name="ticket-outline" size={22} color="#3b73d9" />
          </View>
          <View style={styles.serviceNoticeTextWrap}>
            <Text style={styles.serviceNoticeLabel}>Joined Service</Text>
            <Text style={styles.serviceNoticeName}>{serviceName}</Text>
          </View>
        </View>

        <View style={styles.listSection}>
          {loading ? (
            <ActivityIndicator color="#3b73d9" style={styles.loader} />
          ) : error ? (
            <Text style={styles.emptyText}>{error}</Text>
          ) : (
            <ScrollView
              style={styles.queueList}
              contentContainerStyle={styles.queueListContent}
              showsVerticalScrollIndicator={false}
            >
              {queueTokens.map((token, index) => {
                const position = token.queue_position ?? index + 1;
                const isCurrentUser = token.id === activeToken?.id;

                return (
                  <View
                    key={token.id}
                    style={[
                      styles.queueRow,
                      isCurrentUser ? styles.queueRowActive : undefined,
                    ]}
                  >
                    <Text
                      style={[
                        styles.positionText,
                        isCurrentUser ? styles.queueTextActive : undefined,
                      ]}
                    >
                      {position}.
                    </Text>
                    <Text
                      style={[
                        styles.memberText,
                        isCurrentUser ? styles.queueTextActive : undefined,
                      ]}
                    >
                      {token.token_code}
                    </Text>
                  </View>
                );
              })}

              {!queueTokens.length ? (
                <Text style={styles.emptyText}>No active queue found</Text>
              ) : null}
            </ScrollView>
          )}

          <Pressable style={styles.smallQueueIcon}>
            <Ionicons name="options-outline" size={20} color="#5d6065" />
          </Pressable>
        </View>

        <View style={styles.stats}>
          <View style={styles.statRow}>
            <View style={styles.statIconBox}>
              <Ionicons name="timer-outline" size={24} color="#3b73d9" />
            </View>
            <View style={styles.statTextWrap}>
              <Text style={styles.statValue}>
                {estimatedTime}
                <Text style={styles.statUnit}> min</Text>
              </Text>
              <Text style={styles.statLabel}>Estimated Time</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statIconBox}>
              <Ionicons name="people-outline" size={24} color="#3b73d9" />
            </View>
            <View style={styles.statTextWrap}>
              <Text style={styles.statValue}>{customersAhead}</Text>
              <Text style={styles.statLabel}>Customers ahead</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={[
            styles.exitButton,
            (!activeToken || leaving) && styles.exitButtonMuted,
          ]}
          onPress={() => setShowExitDialog(true)}
          disabled={!activeToken || leaving}
        >
          <Text style={styles.exitButtonText}>
            {leaving ? "Leaving..." : "Exit Queue"}
          </Text>
        </Pressable>

        <BottomNav active="queue" />
      </View>

      <Modal transparent visible={showExitDialog} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogText}>
              Are you sure you want to cancel? You may need to wait again.
            </Text>
            <View style={styles.dialogActions}>
              <Pressable style={styles.dialogButton} onPress={handleLeaveQueue}>
                <Text style={styles.dialogYes}>Yes</Text>
              </Pressable>
              <Pressable
                style={[styles.dialogButton, styles.dialogButtonMuted]}
                onPress={() => setShowExitDialog(false)}
              >
                <Text style={styles.dialogNo}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 28,
    paddingTop: 52,
    paddingBottom: 96,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  greeting: {
    flex: 1,
  },
  title: {
    color: "#111111",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: "#6d7075",
    fontSize: 12,
  },
  scoreWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  scoreRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 5,
    borderColor: "#28b8bd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  scoreText: {
    color: "#28b8bd",
    fontSize: 15,
    fontWeight: "600",
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#e8e8e8",
  },
  serviceNotice: {
    minHeight: 70,
    borderWidth: 1,
    borderColor: "#dce9ff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 22,
    backgroundColor: "#f7fbff",
  },
  serviceNoticeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8f0ff",
    marginRight: 12,
  },
  serviceNoticeTextWrap: {
    flex: 1,
  },
  serviceNoticeLabel: {
    color: "#6d7075",
    fontSize: 12,
    marginBottom: 4,
  },
  serviceNoticeName: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "800",
  },
  categoryBar: {
    alignSelf: "center",
    width: 206,
    height: 48,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dedede",
    padding: 5,
    marginBottom: 22,
  },
  categoryItem: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  categoryActive: {
    backgroundColor: "#ffffff",
  },
  categoryText: {
    color: "#6c7075",
    fontSize: 12,
  },
  categoryTextActive: {
    color: "#3b73d9",
    fontWeight: "700",
  },
  listSection: {
    height: 150,
    position: "relative",
    marginHorizontal: -28,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eeeeee",
    marginBottom: 48,
  },
  queueList: {
    flex: 1,
  },
  queueListContent: {
    paddingHorizontal: 54,
    paddingVertical: 10,
  },
  queueRow: {
    minHeight: 24,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  queueRowActive: {
    borderWidth: 1,
    borderColor: "#e3e7ee",
    backgroundColor: "#f8f9fb",
  },
  positionText: {
    width: 40,
    color: "#c4c5ca",
    fontSize: 17,
    textAlign: "right",
    marginRight: 16,
  },
  memberText: {
    flex: 1,
    color: "#c4c5ca",
    fontSize: 17,
  },
  queueTextActive: {
    color: "#3b73d9",
  },
  smallQueueIcon: {
    position: "absolute",
    top: 14,
    right: 10,
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: "#aeb4bd",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  stats: {
    alignSelf: "center",
    gap: 20,
    marginBottom: 56,
  },
  statRow: {
    width: 210,
    flexDirection: "row",
    alignItems: "center",
  },
  statIconBox: {
    width: 50,
    height: 50,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dce9ff",
    marginRight: 14,
  },
  statTextWrap: {
    flex: 1,
  },
  statValue: {
    color: "#111111",
    fontSize: 32,
    lineHeight: 34,
    fontWeight: "800",
  },
  statUnit: {
    fontSize: 16,
    fontWeight: "800",
  },
  statLabel: {
    color: "#111111",
    fontSize: 10,
  },
  exitButton: {
    height: 54,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff626a",
  },
  exitButtonMuted: {
    backgroundColor: "#b8b8b8",
  },
  exitButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  loader: {
    marginTop: 56,
  },
  emptyText: {
    color: "#6d7075",
    fontSize: 13,
    paddingTop: 56,
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 42,
    backgroundColor: "rgba(0, 0, 0, 0.38)",
  },
  dialog: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingTop: 26,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  dialogText: {
    color: "#111111",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 22,
  },
  dialogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  dialogButton: {
    minWidth: 64,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dialogButtonMuted: {
    backgroundColor: "#e8f0ff",
  },
  dialogYes: {
    color: "#111111",
    fontSize: 10,
  },
  dialogNo: {
    color: "#1d4fbf",
    fontSize: 10,
    fontWeight: "700",
  },
});
