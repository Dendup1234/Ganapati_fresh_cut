import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AdminBottomNav from "@/components/ui/AdminBottomNav";
import {
  AdminService,
  ServiceCategory,
  listCategories,
  listServices,
} from "@/app/api/services";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type CategoryFilter = "all" | number;

type ServiceWithCategory = AdminService & {
  categoryName: string;
};

export default function AdminServicesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<ServiceWithCategory[]>([]);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServiceData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const nextCategories = await listCategories();
      const serviceGroups = await Promise.all(
        nextCategories.map(async (category) => {
          const categoryServices = await listServices(category.id);
          return categoryServices.map((service) => ({
            ...service,
            categoryName: category.name,
          }));
        }),
      );

      setCategories(nextCategories);
      setServices(serviceGroups.flat());
    } catch {
      setError("Unable to load services right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadServiceData();
    }, [loadServiceData]),
  );

  const visibleServices = useMemo(() => {
    if (activeFilter === "all") {
      return services;
    }

    return services.filter((service) => service.category_id === activeFilter);
  }, [activeFilter, services]);

  const categoryCounts = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      count: services.filter((service) => service.category_id === category.id)
        .length,
    }));
  }, [categories, services]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Services</Text>

          <View style={styles.summaryCard}>
            {categoryCounts.slice(0, 2).map((category) => (
              <View key={category.id} style={styles.summaryColumn}>
                <View style={styles.summaryTitle}>
                  <Ionicons
                    name={category.name.toLowerCase().includes("barber") ? "cut-outline" : "brush-outline"}
                    size={24}
                    color="#6f7378"
                  />
                  <Text style={styles.summaryLabel}>{category.name}</Text>
                </View>
                <View style={styles.countBox}>
                  <Text style={styles.countText}>{category.count}</Text>
                </View>
              </View>
            ))}
            {!categoryCounts.length ? (
              <Text style={styles.emptyText}>No categories found</Text>
            ) : null}
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.smallButton}
              onPress={() => router.push("/admin-add-service")}
            >
              <Text style={styles.smallButtonText}>+ Add Service</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.segment}
          >
            <Pressable
              style={[
                styles.segmentItem,
                activeFilter === "all" && styles.segmentActive,
              ]}
              onPress={() => setActiveFilter("all")}
            >
              <Ionicons
                name="layers-outline"
                size={20}
                color={activeFilter === "all" ? "#3b73d9" : "#6c7075"}
              />
              <Text
                style={[
                  styles.segmentText,
                  activeFilter === "all" && styles.segmentTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            {categories.map((category) => {
              const active = activeFilter === category.id;

              return (
                <Pressable
                  key={category.id}
                  style={[styles.segmentItem, active && styles.segmentActive]}
                  onPress={() => setActiveFilter(category.id)}
                >
                  <Ionicons
                    name={category.name.toLowerCase().includes("barber") ? "cut-outline" : "brush-outline"}
                    size={20}
                    color={active ? "#3b73d9" : "#6c7075"}
                  />
                  <Text
                    style={[
                      styles.segmentText,
                      active && styles.segmentTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {loading ? (
            <ActivityIndicator color="#3b73d9" />
          ) : error ? (
            <Text style={styles.emptyText}>{error}</Text>
          ) : (
            <View style={styles.list}>
              {visibleServices.map((service) => (
                <View key={service.id} style={styles.serviceRow}>
                  <View style={styles.serviceCopy}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.variantText}>
                      {service.service_type.length || 0} Points
                    </Text>
                  </View>
                  <Text style={styles.categoryText}>{service.categoryName}</Text>
                  <Pressable
                    style={styles.editButton}
                    onPress={() =>
                      router.push({
                        pathname: "/admin-edit-service",
                        params: {
                          service: JSON.stringify(service),
                        },
                      })
                    }
                  >
                    <Ionicons name="create-outline" size={14} color="#ffffff" />
                    <Text style={styles.editButtonText}>Edit Details</Text>
                  </Pressable>
                </View>
              ))}
              {!visibleServices.length ? (
                <Text style={styles.emptyText}>No services found</Text>
              ) : null}
            </View>
          )}
        </ScrollView>

        <AdminBottomNav active="services" />
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
    paddingHorizontal: 36,
    paddingTop: 70,
    paddingBottom: 112,
  },
  title: {
    color: "#111111",
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 24,
  },
  summaryCard: {
    minHeight: 112,
    borderWidth: 1,
    borderColor: "#b7b7b7",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginHorizontal: 18,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  summaryColumn: {
    alignItems: "center",
    flex: 1,
  },
  summaryTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 12,
  },
  summaryLabel: {
    color: "#6f7378",
    fontSize: 18,
  },
  countBox: {
    width: 38,
    height: 38,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dce9ff",
  },
  countText: {
    color: "#3b73d9",
    fontSize: 22,
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    marginBottom: 24,
  },
  smallButton: {
    height: 34,
    minWidth: 116,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b73d9",
    paddingHorizontal: 10,
  },
  smallButtonText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
  },
  segment: {
    minHeight: 58,
    borderRadius: 29,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dedede",
    padding: 7,
    marginBottom: 28,
    gap: 4,
  },
  segmentItem: {
    minWidth: 92,
    height: 44,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
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
  list: {
    gap: 22,
    paddingHorizontal: 2,
  },
  serviceRow: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  serviceCopy: {
    flex: 1,
  },
  serviceName: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
  variantText: {
    color: "#575b61",
    fontSize: 10,
    marginTop: 4,
  },
  categoryText: {
    width: 64,
    color: "#575b61",
    fontSize: 10,
  },
  editButton: {
    width: 106,
    height: 30,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#1db5b9",
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
  },
  emptyText: {
    color: "#6f7378",
    fontSize: 13,
    textAlign: "center",
  },
});
