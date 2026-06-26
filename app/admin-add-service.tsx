import { Ionicons } from "@expo/vector-icons";
import {
  ServiceCategory,
  createService,
  listCategories,
} from "@/app/api/services";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const blankPoint = "";

export default function AdminAddServiceScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState<string[]>([blankPoint]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    listCategories()
      .then((nextCategories) => {
        if (!mounted) {
          return;
        }

        setCategories(nextCategories);
        setCategoryId(nextCategories[0]?.id ?? null);
      })
      .catch(() => {
        Alert.alert("Categories unavailable", "Please try again in a moment.");
      })
      .finally(() => {
        if (mounted) {
          setLoadingCategories(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const updatePoint = (index: number, value: string) => {
    setPoints((current) =>
      current.map((point, pointIndex) =>
        pointIndex === index ? value : point,
      ),
    );
  };

  const removePoint = (index: number) => {
    setPoints((current) => current.filter((_, pointIndex) => pointIndex !== index));
  };

  const handleAddService = async () => {
    const numericPrice = Number(price);
    const servicePoints = points
      .map((point) => point.trim())
      .filter((point) => point.length > 0);

    if (!categoryId) {
      Alert.alert("Select category", "Please select a service category.");
      return;
    }

    if (!name.trim() || !price.trim() || !Number.isFinite(numericPrice)) {
      Alert.alert("Missing details", "Name and a valid price are required.");
      return;
    }

    if (!servicePoints.length) {
      Alert.alert("Add points", "Please add at least one service point.");
      return;
    }

    setSaving(true);
    try {
      await createService(categoryId, {
        name: name.trim(),
        price: numericPrice,
        description: description.trim() || null,
        estimated_time: estimatedTime.trim() || null,
        img: imageUrl.trim() || null,
        service_type: servicePoints,
      });
      router.replace("/admin-services");
    } catch {
      Alert.alert("Unable to add service", "Please check the details and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>Add New Service</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Armpit Waxing"
          placeholderTextColor="#b0b6bf"
          style={styles.input}
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="30"
          placeholderTextColor="#b0b6bf"
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Category</Text>
        {loadingCategories ? (
          <ActivityIndicator color="#3b73d9" style={styles.categoryLoader} />
        ) : (
          <View style={styles.radioGroup}>
            {categories.map((category) => {
              const selected = category.id === categoryId;

              return (
                <Pressable
                  key={category.id}
                  style={styles.radioOption}
                  onPress={() => setCategoryId(category.id)}
                >
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                  <Text style={styles.radioText}>{category.name}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Text style={styles.label}>Service Points</Text>
        <View style={styles.pointsBox}>
          {points.map((point, index) => (
            <View key={index} style={styles.pointRow}>
              <Text style={styles.pointBullet}>•</Text>
              <TextInput
                value={point}
                onChangeText={(value) => updatePoint(index, value)}
                placeholder="Add a service point"
                placeholderTextColor="#b0b6bf"
                style={styles.pointInput}
              />
              {points.length > 1 ? (
                <Pressable
                  style={styles.pointRemove}
                  onPress={() => removePoint(index)}
                >
                  <Ionicons name="close" size={16} color="#ff626a" />
                </Pressable>
              ) : null}
            </View>
          ))}
          <Pressable
            style={styles.addPointButton}
            onPress={() => setPoints((current) => [...current, blankPoint])}
          >
            <Ionicons name="add-circle-outline" size={16} color="#3b73d9" />
            <Text style={styles.addPointText}>Add point</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Estimated Time</Text>
        <TextInput
          value={estimatedTime}
          onChangeText={setEstimatedTime}
          placeholder="00 : 30"
          placeholderTextColor="#b0b6bf"
          style={[styles.input, styles.timeInput]}
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="https://example.com/img.jpg"
          placeholderTextColor="#b0b6bf"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
          style={styles.descriptionInput}
        />

        <Pressable
          style={[styles.primaryButton, saving && styles.disabledButton]}
          onPress={handleAddService}
          disabled={saving}
        >
          <Ionicons name="add-circle-outline" size={16} color="#ffffff" />
          <Text style={styles.buttonText}>
            {saving ? "Adding..." : "Add Service"}
          </Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Ionicons name="close-circle-outline" size={16} color="#ffffff" />
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  content: {
    paddingHorizontal: 14,
    paddingTop: 48,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: { width: 36, height: 36, justifyContent: "center" },
  headerTitle: {
    flex: 1,
    color: "#111111",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  headerSpacer: { width: 36 },
  label: {
    color: "#111111",
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    height: 38,
    borderWidth: 1,
    borderColor: "#dfe4ec",
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#111111",
    fontSize: 12,
    marginBottom: 14,
  },
  timeInput: {
    width: 96,
  },
  categoryLoader: {
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  radioGroup: {
    minHeight: 58,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#c9ced8",
    borderRadius: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#b8bec8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#3b73d9",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b73d9",
  },
  radioText: { color: "#111111", fontSize: 12 },
  pointsBox: {
    borderWidth: 1,
    borderColor: "#dfe4ec",
    borderRadius: 5,
    padding: 10,
    marginBottom: 14,
  },
  pointRow: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pointBullet: {
    color: "#3b73d9",
    fontSize: 18,
    lineHeight: 22,
  },
  pointInput: {
    flex: 1,
    color: "#111111",
    fontSize: 12,
    paddingVertical: 8,
  },
  pointRemove: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  addPointButton: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  addPointText: {
    color: "#3b73d9",
    fontSize: 12,
    fontWeight: "700",
  },
  descriptionInput: {
    height: 88,
    borderWidth: 1,
    borderColor: "#dfe4ec",
    borderRadius: 5,
    color: "#111111",
    fontSize: 12,
    padding: 10,
    marginBottom: 12,
  },
  primaryButton: {
    height: 36,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#3b73d9",
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.65,
  },
  cancelButton: {
    height: 36,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ff626a",
  },
  buttonText: { color: "#ffffff", fontSize: 12, fontWeight: "800" },
});
