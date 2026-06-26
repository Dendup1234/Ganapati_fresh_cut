import {
  Staff,
  createStaff,
  deleteStaff,
  listStaffs,
  updateStaff,
} from "@/app/api/staffs";
import AdminBottomNav from "@/components/ui/AdminBottomNav";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { isAxiosError } from "axios";
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
  TextInput,
  View,
} from "react-native";

type StaffForm = {
  username: string;
  password: string;
};

const initialStaffForm: StaffForm = {
  username: "",
  password: "",
};

const getErrorMessage = (error: unknown) => {
  if (!isAxiosError(error)) {
    return "Something went wrong. Please try again.";
  }

  const data = error.response?.data as
    | { errors?: unknown; error?: unknown; message?: unknown }
    | undefined;
  const errors = data?.errors;

  if (Array.isArray(errors)) {
    return errors.join("\n");
  }

  if (errors && typeof errors === "object") {
    return Object.entries(errors)
      .map(([field, messages]) => {
        const detail = Array.isArray(messages)
          ? messages.join(", ")
          : String(messages);
        return `${field} ${detail}`;
      })
      .join("\n");
  }

  if (typeof data?.error === "string") {
    return data.error;
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  return "Something went wrong. Please try again.";
};

const formatCreatedAt = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AdminStaffScreen() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<StaffForm>(initialStaffForm);
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);
  const [resetStaff, setResetStaff] = useState<Staff | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetting, setResetting] = useState(false);

  const loadStaffs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const nextStaffs = await listStaffs();
      setStaffs(nextStaffs);
    } catch {
      setError("Unable to load staff right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStaffs();
    }, [loadStaffs]),
  );

  const sortedStaffs = useMemo(
    () =>
      [...staffs].sort(
        (firstStaff, secondStaff) =>
          new Date(secondStaff.created_at).getTime() -
          new Date(firstStaff.created_at).getTime(),
      ),
    [staffs],
  );

  const updateCreateForm = (field: keyof StaffForm, value: string) => {
    setCreateForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleOpenCreateModal = () => {
    setCreateForm(initialStaffForm);
    setCreateError("");
    setShowCreateModal(true);
  };

  const handleCreateStaff = async () => {
    setCreating(true);
    setCreateError("");

    try {
      const username = createForm.username.trim();

      await createStaff({
        username,
        email: `${username}@staff.com`,
        password: createForm.password,
      });
      setShowCreateModal(false);
      setCreateForm(initialStaffForm);
      await loadStaffs();
    } catch (nextError) {
      setCreateError(getErrorMessage(nextError));
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteStaff = (staff: Staff) => {
    Alert.alert(
      "Delete staff?",
      `Are you sure you want to delete ${staff.username}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteStaff(staff.id);
              setStaffs((currentStaffs) =>
                currentStaffs.filter(
                  (currentStaff) => currentStaff.id !== staff.id,
                ),
              );
            } catch {
              Alert.alert("Unable to delete staff", "Please try again.");
            }
          },
        },
      ],
    );
  };

  const handleOpenResetModal = (staff: Staff) => {
    setResetStaff(staff);
    setNewPassword("");
    setResetError("");
  };

  const handleResetPassword = async () => {
    if (!resetStaff) {
      return;
    }

    setResetting(true);
    setResetError("");

    try {
      await updateStaff(resetStaff.id, { password: newPassword });
      setResetStaff(null);
      setNewPassword("");
      Alert.alert("Password reset", "The staff password was updated.");
    } catch (nextError) {
      setResetError(getErrorMessage(nextError));
    } finally {
      setResetting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Text style={styles.title}>Staff</Text>
            <Pressable style={styles.newButton} onPress={handleOpenCreateModal}>
              <Ionicons name="add-outline" size={18} color="#ffffff" />
              <Text style={styles.newButtonText}>New Staff</Text>
            </Pressable>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.staffCell]}>Username</Text>
            <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
            <Text style={[styles.headerCell, styles.dateCell]}>Created</Text>
          </View>

          {loading ? (
            <ActivityIndicator color="#3b73d9" />
          ) : error ? (
            <Text style={styles.emptyText}>{error}</Text>
          ) : (
            <View style={styles.table}>
              {sortedStaffs.map((staff) => (
                <View key={staff.id} style={styles.staffRow}>
                  <View style={styles.rowTop}>
                    <View style={styles.staffCell}>
                      <Text style={styles.username}>{staff.username}</Text>
                      <Text style={styles.email}>{staff.email}</Text>
                    </View>

                    <View style={styles.statusCell}>
                      <View
                        style={[
                          styles.statusBadge,
                          staff.status === "inactive" &&
                            styles.statusBadgeInactive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            staff.status === "inactive" &&
                              styles.statusTextInactive,
                          ]}
                        >
                          {staff.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.createdAt, styles.dateCell]}>
                      {formatCreatedAt(staff.created_at)}
                    </Text>
                  </View>

                  <View style={styles.actions}>
                    <Pressable
                      style={[styles.actionButton, styles.resetButton]}
                      onPress={() => handleOpenResetModal(staff)}
                    >
                      <Ionicons
                        name="key-outline"
                        size={15}
                        color="#3b73d9"
                      />
                      <Text style={styles.resetButtonText}>Reset Password</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteStaff(staff)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={15}
                        color="#ff626a"
                      />
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              ))}

              {!sortedStaffs.length ? (
                <Text style={styles.emptyText}>No staff found</Text>
              ) : null}
            </View>
          )}
        </ScrollView>

        <AdminBottomNav active="staff" />
      </View>

      <Modal transparent visible={showCreateModal} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>New Staff</Text>

            <TextInput
              value={createForm.username}
              onChangeText={(value) => updateCreateForm("username", value)}
              placeholder="Username"
              placeholderTextColor="#9aa3b2"
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              value={createForm.password}
              onChangeText={(value) => updateCreateForm("password", value)}
              placeholder="Password"
              placeholderTextColor="#9aa3b2"
              style={styles.input}
              secureTextEntry
            />

            {createError ? (
              <Text style={styles.validationText}>{createError}</Text>
            ) : null}

            <View style={styles.dialogActions}>
              <Pressable
                style={styles.secondaryDialogButton}
                onPress={() => setShowCreateModal(false)}
                disabled={creating}
              >
                <Text style={styles.secondaryDialogButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.primaryDialogButton}
                onPress={handleCreateStaff}
                disabled={creating}
              >
                <Text style={styles.primaryDialogButtonText}>
                  {creating ? "Creating..." : "Create"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={Boolean(resetStaff)} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>
              Reset Password{resetStaff ? `: ${resetStaff.username}` : ""}
            </Text>

            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              placeholderTextColor="#9aa3b2"
              style={styles.input}
              secureTextEntry
            />

            {resetError ? (
              <Text style={styles.validationText}>{resetError}</Text>
            ) : null}

            <View style={styles.dialogActions}>
              <Pressable
                style={styles.secondaryDialogButton}
                onPress={() => setResetStaff(null)}
                disabled={resetting}
              >
                <Text style={styles.secondaryDialogButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.primaryDialogButton}
                onPress={handleResetPassword}
                disabled={resetting}
              >
                <Text style={styles.primaryDialogButtonText}>
                  {resetting ? "Saving..." : "Save"}
                </Text>
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
    paddingHorizontal: 24,
    paddingTop: 68,
    paddingBottom: 116,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  title: {
    color: "#111111",
    fontSize: 23,
    fontWeight: "800",
  },
  newButton: {
    height: 38,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#1db5b9",
    paddingHorizontal: 12,
  },
  newButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },
  tableHeader: {
    minHeight: 34,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e8ee",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerCell: {
    color: "#8d95a1",
    fontSize: 11,
    fontWeight: "800",
  },
  table: {
    gap: 12,
    paddingTop: 12,
  },
  staffRow: {
    borderWidth: 1,
    borderColor: "#dfe4ec",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  staffCell: {
    flex: 1.35,
  },
  statusCell: {
    flex: 0.9,
    alignItems: "flex-start",
  },
  dateCell: {
    flex: 0.9,
  },
  username: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },
  email: {
    color: "#7a818b",
    fontSize: 11,
  },
  statusBadge: {
    minWidth: 64,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e7f8ec",
    paddingHorizontal: 9,
  },
  statusBadgeInactive: {
    backgroundColor: "#ffe9e9",
  },
  statusText: {
    color: "#187d35",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  statusTextInactive: {
    color: "#ff4b4b",
  },
  createdAt: {
    color: "#5f656c",
    fontSize: 11,
    textAlign: "right",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    minHeight: 32,
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 10,
  },
  resetButton: {
    borderColor: "#dce9ff",
    backgroundColor: "#f7fbff",
  },
  resetButtonText: {
    color: "#3b73d9",
    fontSize: 11,
    fontWeight: "800",
  },
  deleteButton: {
    borderColor: "#ffd5d5",
    backgroundColor: "#fff8f8",
  },
  deleteButtonText: {
    color: "#ff626a",
    fontSize: 11,
    fontWeight: "800",
  },
  emptyText: {
    color: "#6f7378",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 24,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 26,
    backgroundColor: "rgba(0, 0, 0, 0.42)",
  },
  dialog: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
  },
  dialogTitle: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 16,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#dfe4ec",
    borderRadius: 8,
    color: "#111111",
    fontSize: 13,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  validationText: {
    color: "#ff4b4b",
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  dialogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  primaryDialogButton: {
    minWidth: 92,
    height: 38,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b73d9",
    paddingHorizontal: 14,
  },
  primaryDialogButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },
  secondaryDialogButton: {
    minWidth: 82,
    height: 38,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef2f7",
    paddingHorizontal: 14,
  },
  secondaryDialogButtonText: {
    color: "#30343a",
    fontSize: 12,
    fontWeight: "800",
  },
});
