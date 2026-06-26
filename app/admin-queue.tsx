import {
  QueueToken,
  TokenStatus,
  advanceToken,
  listTokens,
} from "@/app/api/tokens";
import { listCategories, listServices } from "@/app/api/services";
import AdminBottomNav from "@/components/ui/AdminBottomNav";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type StatusFilter = "active" | TokenStatus;

const statusLabels: Record<TokenStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const getAdvanceLabel = (status: TokenStatus) => {
  if (status === "pending") {
    return "Start";
  }

  if (status === "in_progress") {
    return "Complete";
  }

  return "Completed";
};

const getAdvanceIcon = (status: TokenStatus) => {
  if (status === "pending") {
    return "play-circle-outline";
  }

  return "checkmark-circle-outline";
};

const formatElapsed = (createdAt: string) => {
  const createdTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) {
    return "";
  }

  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - createdTime) / 60000),
  );

  if (elapsedMinutes < 1) {
    return "just now";
  }

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} min ago`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  return `${elapsedHours} hr ago`;
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

export default function AdminQueueScreen() {
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [tokens, setTokens] = useState<QueueToken[]>([]);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [advancingId, setAdvancingId] = useState<number | null>(null);
  const [serviceEstimatedMinutes, setServiceEstimatedMinutes] = useState<
    Record<number, number>
  >({});

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [nextTokens, categories] = await Promise.all([
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

      setTokens(nextTokens);
      setServiceEstimatedMinutes(nextServiceEstimatedMinutes);
    } catch {
      setError("Unable to load the queue right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadQueue();
    }, [loadQueue]),
  );

  const activeTokens = useMemo(
    () =>
      tokens.filter(
        (token) => token.status === "pending" || token.status === "in_progress",
      ),
    [tokens],
  );

  const visibleTokens = useMemo(() => {
    const sourceTokens = activeFilter === "active" ? activeTokens : tokens;

    if (activeFilter === "active") {
      return sourceTokens;
    }

    return sourceTokens.filter((token) => token.status === activeFilter);
  }, [activeFilter, activeTokens, tokens]);

  const queueStats = useMemo(() => {
    const pendingCount = tokens.filter((token) => token.status === "pending").length;
    const inProgressCount = tokens.filter(
      (token) => token.status === "in_progress",
    ).length;
    const completedCount = tokens.filter(
      (token) => token.status === "completed",
    ).length;
    const cancelledCount = tokens.filter(
      (token) => token.status === "cancelled",
    ).length;

    if (!activeTokens.length) {
      return {
        estimatedWait: 0,
        cancelledCount,
        completedCount,
        inProgressCount,
        pendingCount,
        status: completedCount > 0 ? "Done" : "Idle",
        totalInQueue: 0,
      };
    }

    const estimatedWait = activeTokens.reduce((total, token) => {
      const serviceId = token.service?.id;
      const serviceMinutes = serviceId
        ? serviceEstimatedMinutes[serviceId] ?? 0
        : 0;

      return total + serviceMinutes;
    }, 0);

    return {
      estimatedWait,
      cancelledCount,
      completedCount,
      inProgressCount,
      pendingCount,
      status: inProgressCount > 0 ? "Serving" : "Active",
      totalInQueue: activeTokens.length,
    };
  }, [activeTokens, serviceEstimatedMinutes, tokens]);

  const handleAdvance = async (token: QueueToken) => {
    if (token.status === "completed" || token.status === "cancelled") {
      return;
    }

    setAdvancingId(token.id);

    try {
      const advancedToken = await advanceToken(token.id);

      setTokens((currentTokens) =>
        currentTokens.map((currentToken) =>
          currentToken.id === advancedToken.id ? advancedToken : currentToken,
        ),
      );
    } catch {
      Alert.alert("Unable to update status", "Please try again.");
    } finally {
      setAdvancingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Booking</Text>

          {/*
          <View style={styles.actions}>
            <Pressable
              style={[styles.actionButton, styles.walkInButton]}
              onPress={() => setShowWalkInModal(true)}
            >
              <Ionicons name="walk-outline" size={23} color="#ffffff" />
              <Text style={styles.actionText}>Add Walk-In</Text>
            </Pressable>

            <Pressable style={[styles.actionButton, styles.stopButton]}>
              <Ionicons name="close-circle-outline" size={23} color="#ffffff" />
              <Text style={styles.actionText}>Stop Queue</Text>
            </Pressable>
          </View>
          */}

          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total in Queue</Text>
              <Text style={styles.summaryValue}>{queueStats.totalInQueue}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Est Wait Time</Text>
              <Text style={styles.summaryValue}>{queueStats.estimatedWait} min</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Status</Text>
              <View
                style={[
                  styles.statusPill,
                  queueStats.status === "Idle" && styles.statusPillIdle,
                  queueStats.status === "Done" && styles.statusPillDone,
                  queueStats.status === "Serving" && styles.statusPillServing,
                ]}
              >
                <Text style={styles.statusText}>{queueStats.status}</Text>
              </View>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.segment}
          >
            {(["active", "pending", "in_progress", "completed"] as const).map(
              (filter) => {
                const active = activeFilter === filter;
                const label =
                  filter === "active" ? "Active" : statusLabels[filter];

                return (
                  <Pressable
                    key={filter}
                    style={[styles.segmentItem, active && styles.segmentActive]}
                    onPress={() => setActiveFilter(filter)}
                  >
                    <Ionicons
                      name={
                        filter === "completed"
                          ? "checkmark-done-outline"
                          : "people-outline"
                      }
                      size={21}
                      color={active ? "#3b73d9" : "#6c7075"}
                    />

                    <Text
                      style={[
                        styles.segmentText,
                        active && styles.segmentTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </ScrollView>

          {loading ? (
            <ActivityIndicator color="#3b73d9" />
          ) : error ? (
            <Text style={styles.emptyText}>{error}</Text>
          ) : (
            <View style={styles.cards}>
              {visibleTokens.map((token, index) => {
                const disabled =
                  token.status === "completed" ||
                  token.status === "cancelled" ||
                  advancingId === token.id;

                const buttonLabel =
                  advancingId === token.id
                    ? "Updating..."
                    : getAdvanceLabel(token.status);

                return (
                  <View key={token.id} style={styles.queueCard}>
                    <View style={styles.cardTop}>
                      <View style={styles.numberBadge}>
                        <Text style={styles.numberText}>
                          {token.queue_position ?? index + 1}
                        </Text>
                      </View>

                      <View style={styles.cardInfo}>
                        <Text style={styles.customerName}>
                          {token.user?.username ?? "Customer"}
                        </Text>

                        <Text style={styles.phone}>
                          ID {token.user?.id ?? "-"} · {token.token_code}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.scoreRing,
                          token.status === "completed" && styles.scoreRingDone,
                        ]}
                      >
                        <Text style={styles.scoreText}>
                          {token.user?.credit_score ??
                            token.queue_position ??
                            "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardMeta}>
                      <Text style={styles.time}>
                        {formatElapsed(token.created_at)}
                      </Text>

                      <Text style={styles.service}>
                        {token.service?.name ?? "Service"}
                      </Text>
                    </View>

                    <View style={styles.statusRow}>
                      <View
                        style={[
                          styles.tokenStatusPill,
                          token.status === "in_progress" &&
                            styles.tokenStatusPillProgress,
                          token.status === "completed" &&
                            styles.tokenStatusPillDone,
                          token.status === "cancelled" &&
                            styles.tokenStatusPillCancelled,
                        ]}
                      >
                        <Text style={styles.tokenStatusText}>
                          {statusLabels[token.status]}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      style={[
                        styles.advanceButton,
                        token.status === "in_progress" && styles.completeButton,
                        disabled && styles.disabledButton,
                      ]}
                      onPress={() => handleAdvance(token)}
                      disabled={disabled}
                    >
                      <Ionicons
                        name={getAdvanceIcon(token.status)}
                        size={16}
                        color="#ffffff"
                      />

                      <Text style={styles.advanceText}>{buttonLabel}</Text>
                    </Pressable>
                  </View>
                );
              })}

              {!visibleTokens.length ? (
                <Text style={styles.emptyText}>No customers found</Text>
              ) : null}
            </View>
          )}
        </ScrollView>

        <AdminBottomNav active="queue" />
      </View>

      <Modal transparent visible={showWalkInModal} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.walkInDialog}>
            <Text style={styles.dialogTitle}>Select Service Category</Text>

            <View style={styles.dialogRadioGroup}>
              <View style={styles.dialogRadioOption}>
                <View style={styles.dialogRadio} />
                <Text style={styles.dialogRadioText}>Barber</Text>
              </View>

              <View style={styles.dialogRadioOption}>
                <View style={[styles.dialogRadio, styles.dialogRadioSelected]}>
                  <View style={styles.dialogRadioDot} />
                </View>

                <Text style={styles.dialogRadioText}>Beauty</Text>
              </View>
            </View>

            <Text style={styles.dialogQuestion}>Add person to the queue?</Text>

            <View style={styles.dialogActions}>
              <Pressable
                style={styles.dialogAction}
                onPress={() => setShowWalkInModal(false)}
              >
                <Text style={styles.dialogYes}>Yes</Text>
              </Pressable>

              <Pressable
                style={[styles.dialogAction, styles.dialogActionMuted]}
                onPress={() => setShowWalkInModal(false)}
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
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 76,
    paddingBottom: 112,
  },
  title: {
    color: "#111111",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 34,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    width: "45.5%",
    height: 52,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  walkInButton: {
    backgroundColor: "#1db5b9",
  },
  stopButton: {
    backgroundColor: "#ff626a",
  },
  actionText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  summaryCard: {
    minHeight: 76,
    borderWidth: 1,
    borderColor: "#1db5b9",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 24,
    marginBottom: 30,
  },
  summaryItem: {
    alignItems: "center",
    minWidth: 66,
  },
  summaryLabel: {
    color: "#9aa0aa",
    fontSize: 12,
    marginBottom: 6,
  },
  summaryValue: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "800",
  },
  statusPill: {
    minWidth: 44,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1db5b9",
  },
  statusPillIdle: {
    backgroundColor: "#9aa0aa",
  },
  statusPillDone: {
    backgroundColor: "#3b73d9",
  },
  statusPillServing: {
    backgroundColor: "#f49a48",
  },
  statusText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
  },
  segment: {
    minHeight: 58,
    borderRadius: 29,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dedede",
    padding: 7,
    marginBottom: 32,
    gap: 4,
  },
  segmentItem: {
    minWidth: 116,
    height: 44,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  segmentActive: {
    backgroundColor: "#ffffff",
  },
  segmentText: {
    color: "#6c7075",
    fontSize: 12,
  },
  segmentTextActive: {
    color: "#3b73d9",
    fontWeight: "700",
  },
  cards: {
    gap: 18,
  },
  queueCard: {
    minHeight: 172,
    borderWidth: 1,
    borderColor: "#a5a5a5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  numberBadge: {
    minWidth: 34,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dce9ff",
    marginRight: 10,
    paddingHorizontal: 8,
  },
  numberText: {
    color: "#3b73d9",
    fontSize: 12,
    fontWeight: "800",
  },
  cardInfo: {
    flex: 1,
  },
  customerName: {
    color: "#111111",
    fontSize: 16,
    marginBottom: 12,
  },
  phone: {
    color: "#9aa0aa",
    fontSize: 12,
  },
  scoreRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 5,
    borderColor: "#b8b8b8",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreRingDone: {
    borderColor: "#1db5b9",
  },
  scoreText: {
    color: "#1db5b9",
    fontSize: 12,
    fontWeight: "700",
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  time: {
    color: "#9aa0aa",
    fontSize: 12,
  },
  service: {
    color: "#f49a48",
    fontSize: 12,
  },
  statusRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tokenStatusPill: {
    minWidth: 74,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f49a48",
    paddingHorizontal: 10,
  },
  tokenStatusPillProgress: {
    backgroundColor: "#3b73d9",
  },
  tokenStatusPillDone: {
    backgroundColor: "#1db5b9",
  },
  tokenStatusPillCancelled: {
    backgroundColor: "#ff626a",
  },
  tokenStatusText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
  },
  advanceButton: {
    height: 32,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1db5b9",
  },
  completeButton: {
    backgroundColor: "#3b73d9",
  },
  disabledButton: {
    backgroundColor: "#b8b8b8",
  },
  advanceText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },
  emptyText: {
    color: "#6f7378",
    fontSize: 13,
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 26,
    backgroundColor: "rgba(0, 0, 0, 0.42)",
  },
  walkInDialog: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
  },
  dialogTitle: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },
  dialogRadioGroup: {
    height: 58,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#dfe4ec",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  dialogRadioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  dialogRadio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#b8bec8",
    alignItems: "center",
    justifyContent: "center",
  },
  dialogRadioSelected: {
    borderColor: "#3b73d9",
  },
  dialogRadioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b73d9",
  },
  dialogRadioText: {
    color: "#111111",
    fontSize: 12,
  },
  dialogQuestion: {
    color: "#111111",
    fontSize: 11,
    marginBottom: 24,
  },
  dialogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  dialogAction: {
    width: 92,
    height: 26,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  dialogActionMuted: {
    backgroundColor: "#dce9ff",
  },
  dialogYes: {
    color: "#111111",
    fontSize: 9,
  },
  dialogNo: {
    color: "#111111",
    fontSize: 9,
  },
});
