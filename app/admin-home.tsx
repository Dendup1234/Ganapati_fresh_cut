import {
    ServiceCategory,
    listCategories,
    toggleCategoryActive,
} from "@/app/api/services";
import AdminBottomNav from "@/components/ui/AdminBottomNav";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

const metrics = [
  { label: "Queue Length", value: "5", icon: "people-outline" as const },
  {
    label: "Today’s Revenue",
    value: "Nu 2,400",
    icon: "bar-chart-outline" as const,
  },
  {
    label: "Completed Today",
    value: "12",
    icon: "checkmark-circle-outline" as const,
  },
  {
    label: "Avg Waiting Time",
    value: "30 mins",
    icon: "time-outline" as const,
  },
];

export default function AdminHomeScreen() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [togglingCategoryId, setTogglingCategoryId] = useState<number | null>(
    null,
  );
  const [isClosingShop, setIsClosingShop] = useState(false);

  useEffect(() => {
    let mounted = true;

    listCategories()
      .then((nextCategories) => {
        if (mounted) {
          setCategories(nextCategories);
        }
      })
      .catch(() => {
        Alert.alert("Unable to load categories", "Please try again.");
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleCategory = async (
    category: ServiceCategory,
    active: boolean,
  ) => {
    setTogglingCategoryId(category.id);
    const previousCategories = categories;

    setCategories((currentCategories) =>
      currentCategories.map((currentCategory) =>
        currentCategory.id === category.id
          ? { ...currentCategory, active }
          : currentCategory,
      ),
    );

    try {
      const updatedCategory = await toggleCategoryActive(category.id, active);

      setCategories((currentCategories) =>
        currentCategories.map((currentCategory) =>
          currentCategory.id === updatedCategory.id
            ? updatedCategory
            : currentCategory,
        ),
      );
    } catch {
      setCategories(previousCategories);
      Alert.alert("Unable to update category", "Please try again.");
    } finally {
      setTogglingCategoryId(null);
    }
  };

  const handleCloseShop = async () => {
    const activeCategories = categories.filter(
      (category) => category.active ?? true,
    );

    if (!activeCategories.length || isClosingShop) {
      return;
    }

    const previousCategories = categories;
    setIsClosingShop(true);
    setCategories((currentCategories) =>
      currentCategories.map((category) => ({ ...category, active: false })),
    );

    try {
      const updatedCategories = await Promise.all(
        activeCategories.map((category) =>
          toggleCategoryActive(category.id, false),
        ),
      );

      setCategories((currentCategories) =>
        currentCategories.map((category) => {
          const updatedCategory = updatedCategories.find(
            (nextCategory) => nextCategory.id === category.id,
          );

          return updatedCategory ?? category;
        }),
      );
    } catch {
      setCategories(previousCategories);
      Alert.alert("Unable to close shop", "Please try again.");
    } finally {
      setIsClosingShop(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Hello, Admin</Text>

          <View style={styles.metricsGrid}>
            {metrics.map((metric) => (
              <View key={metric.label} style={styles.metricCard}>
                <View style={styles.metricTitleRow}>
                  <Ionicons name={metric.icon} size={16} color="#3b73d9" />
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                </View>
                <Text style={styles.metricValue}>{metric.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.serviceControls}>
            {categories.map((category) => {
              const isActive = category.active ?? true;

              return (
                <View key={category.id} style={styles.serviceRow}>
                  <Text style={styles.serviceLabel}>
                    {category.name} services
                  </Text>
                  <Text style={styles.inactiveLabel}>
                    {isActive ? "Set Inactive" : "Set Active"}
                  </Text>
                  <Switch
                    value={isActive}
                    onValueChange={(active) =>
                      handleToggleCategory(category, active)
                    }
                    disabled={togglingCategoryId === category.id}
                    trackColor={{ false: "#d8d8d8", true: "#20b7bb" }}
                    thumbColor="#ffffff"
                  />
                  <Pressable style={styles.notifyButton}>
                    <Ionicons
                      name="notifications-outline"
                      size={18}
                      color="#ffffff"
                    />
                    <Text style={styles.notifyText}>Notify Users</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          <Pressable
            style={[
              styles.closeButton,
              isClosingShop ? styles.closeButtonDisabled : undefined,
            ]}
            onPress={handleCloseShop}
            disabled={isClosingShop}
          >
            <Ionicons name="storefront-outline" size={21} color="#ffffff" />
            <Text style={styles.closeButtonText}>
              {isClosingShop ? "Closing..." : "Close Shop"}
            </Text>
          </Pressable>
        </ScrollView>

        <AdminBottomNav active="home" />
      </View>
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
    paddingHorizontal: 28,
    paddingTop: 58,
    paddingBottom: 112,
  },
  title: {
    color: "#111111",
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 18,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 34,
    marginBottom: 40,
  },
  metricCard: {
    width: "43.5%",
    minHeight: 96,
    borderWidth: 1,
    borderColor: "#9e9e9e",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  metricTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  metricLabel: {
    color: "#111111",
    fontSize: 12,
  },
  metricValue: {
    color: "#111111",
    fontSize: 13,
  },
  serviceControls: {
    gap: 28,
    marginBottom: 22,
  },
  serviceRow: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
  },
  serviceLabel: {
    flex: 1,
    color: "#111111",
    fontSize: 16,
  },
  inactiveLabel: {
    color: "#111111",
    fontSize: 9,
    marginRight: 4,
    alignSelf: "flex-start",
  },
  notifyButton: {
    width: 112,
    height: 34,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#f49a48",
    marginLeft: 14,
  },
  notifyText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  closeButton: {
    alignSelf: "center",
    width: 168,
    height: 38,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: "#ff626a",
    marginBottom: 16,
  },
  closeButtonDisabled: {
    opacity: 0.65,
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  segment: {
    alignSelf: "center",
    width: 222,
    height: 54,
    borderRadius: 27,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dedede",
    padding: 7,
    marginBottom: 24,
  },
  segmentItem: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  segmentActive: {
    backgroundColor: "#ffffff",
  },
  segmentText: {
    color: "#6c7075",
    fontSize: 11,
  },
  segmentTextActive: {
    color: "#3b73d9",
    fontWeight: "700",
  },
  queueCard: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#9e9e9e",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  blacklistCard: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: "#9e9e9e",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  queueBadge: {
    width: 34,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dce9ff",
    marginRight: 10,
    alignSelf: "flex-start",
    marginTop: 14,
  },
  queueBadgeText: {
    color: "#3b73d9",
    fontSize: 12,
    fontWeight: "800",
  },
  queueInfo: {
    flex: 1,
  },
  queueName: {
    color: "#111111",
    fontSize: 16,
    marginBottom: 7,
  },
  queueService: {
    color: "#6d7075",
    fontSize: 12,
    marginBottom: 4,
  },
  blacklistReason: {
    color: "#6d7075",
    fontSize: 12,
    marginBottom: 4,
  },
  queueTime: {
    color: "#8a8f96",
    fontSize: 10,
  },
  checkButton: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b73d9",
  },
  blacklistScoreRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 5,
    borderColor: "#d0d0d0",
    alignItems: "center",
    justifyContent: "center",
  },
  blacklistScoreText: {
    color: "#ff626a",
    fontSize: 13,
    fontWeight: "700",
  },
  walkInButton: {
    height: 50,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    backgroundColor: "#1db5b9",
  },
  walkInText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});
