import { AuthUser, currentUser, login } from "@/app/api/auth";
import {
    getTokenFromOAuthResult,
    useAuth,
    useGoogleAuthRequest,
} from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const DUMMY_EMAIL = "test@example.com";
const DUMMY_PASSWORD = "password123";
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";
const REGISTER_PROMPT = "Don't have an account? ";
const googleIcon = require("../assets/images/icons8-google-48.png");

const getDashboardRoute = (user?: AuthUser) => {
  const role = user?.role?.toLowerCase();
  return user?.is_admin || role === "admin" || role === "stylist" || role === "staff"
    ? "/admin-home"
    : "/home";
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securePassword, setSecurePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { setUser, signIn } = useAuth();
  const { request: googleRequest, promptAsync: promptGoogleSignIn } =
    useGoogleAuthRequest();

  const handleDummyLogin = () => {
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      router.replace("/admin-home");
      return true;
    }

    if (
      email.trim().toLowerCase() === DUMMY_EMAIL &&
      password === DUMMY_PASSWORD
    ) {
      router.replace("/home");
      return true;
    }

    return false;
  };

  const handleLogin = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const loginResult = await login({
        email: email.trim(),
        password,
      });
      const user = await currentUser();

      setUser(user);
      router.replace(getDashboardRoute(user ?? loginResult.data));
    } catch {
      if (handleDummyLogin()) {
        return;
      }

      Alert.alert(
        "Invalid login",
        "Use your API account, or test@example.com/password123 and admin@example.com/admin123 while the backend is offline.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading || !googleRequest) {
      return;
    }

    setIsGoogleLoading(true);

    try {
      const result = await promptGoogleSignIn();
      const token = getTokenFromOAuthResult(result);

      if (!token) {
        if (result.type !== "cancel" && result.type !== "dismiss") {
          Alert.alert(
            "Google login failed",
            "No login token was returned. Please try again.",
          );
        }
        return;
      }

      const user = await signIn(token);
      router.replace(getDashboardRoute(user ?? undefined));
    } catch {
      Alert.alert("Google login failed", "Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            Welcome back! Glad to see you, Again!
          </Text>

          <View style={styles.form}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#9aa3b2"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <View style={styles.passwordWrap}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9aa3b2"
                secureTextEntry={securePassword}
                style={[styles.input, styles.passwordInput]}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setSecurePassword((value) => !value)}
              >
                <Ionicons
                  name={securePassword ? "eye-off" : "eye"}
                  size={17}
                  color="#7b8494"
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={styles.forgotButton}
            onPress={() => router.push("/forgot-password")}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>

          <Pressable
            style={[
              styles.primaryButton,
              isLoading ? styles.primaryButtonDisabled : undefined,
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.primaryText}>
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or Login with</Text>
            <View style={styles.divider} />
          </View>

          <Pressable
            style={[
              styles.googleButton,
              (!googleRequest || isGoogleLoading) &&
                styles.googleButtonDisabled,
            ]}
            onPress={handleGoogleLogin}
            disabled={!googleRequest || isGoogleLoading}
          >
            <Image source={googleIcon} style={styles.googleIcon} />
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>{REGISTER_PROMPT}</Text>
            <Pressable onPress={() => router.push("/register")}>
              <Text style={styles.footerLink}>Register Now</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 104,
    paddingBottom: 32,
  },
  title: {
    color: "#10131a",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    marginBottom: 30,
  },
  form: {
    gap: 20,
  },
  input: {
    height: 52,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#edf0f4",
    backgroundColor: "#f7f8fa",
    paddingHorizontal: 18,
    color: "#111827",
    fontSize: 13,
  },
  passwordWrap: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 48,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotButton: {
    alignSelf: "center",
    marginTop: 18,
    marginBottom: 22,
  },
  forgotText: {
    color: "#6b7280",
    fontSize: 11,
    fontWeight: "500",
  },
  primaryButton: {
    height: 52,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b73d9",
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#edf0f4",
  },
  dividerText: {
    color: "#6b7280",
    fontSize: 11,
    marginHorizontal: 10,
  },
  googleButton: {
    width: 88,
    height: 52,
    borderWidth: 1,
    borderColor: "#e7eaf0",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#ffffff",
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  footerText: {
    color: "#111827",
    fontSize: 12,
  },
  footerLink: {
    color: "#2867c9",
    fontSize: 12,
    fontWeight: "700",
  },
});
