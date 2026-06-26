import {
  AuthUser,
  clearAuthToken,
  currentUser,
  getRawAuthToken,
  loadAuthToken,
  saveAuthToken,
} from "@/app/api/auth";
import apiClient from "@/app/api/axios";
import * as AuthSession from "expo-auth-session";
import {
  AuthRequestConfig,
  AuthSessionResult,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session";
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getGoogleOAuthEndpoint = () => {
  const baseURL = apiClient.defaults.baseURL?.replace(/\/$/, "") ?? "";
  return `${baseURL}/api/v1/auth/google_oauth2`;
};

export const getTokenFromOAuthResult = (result: AuthSessionResult | null) => {
  if (result?.type !== "success") {
    return undefined;
  }

  const tokenFromParams = result.params?.token;

  if (tokenFromParams) {
    return tokenFromParams;
  }

  if ("url" in result && result.url) {
    return new URL(result.url).searchParams.get("token") ?? undefined;
  }

  return undefined;
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const rehydrateAuth = async () => {
      try {
        const storedToken = await loadAuthToken();

        if (!mounted) {
          return;
        }

        setToken(storedToken ?? null);

        if (storedToken) {
          const me = await currentUser();

          if (mounted) {
            setUser(me);
          }
        }
      } catch {
        await clearAuthToken();

        if (mounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    rehydrateAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (nextToken: string) => {
    const rawToken = getRawAuthToken(nextToken);

    if (!rawToken) {
      return null;
    }

    await saveAuthToken(rawToken);
    setToken(rawToken);

    const me = await currentUser();
    setUser(me);
    return me;
  }, []);

  const signOut = useCallback(async () => {
    await clearAuthToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      signIn,
      signOut,
      setUser,
    }),
    [isLoading, signIn, signOut, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export const useGoogleAuthRequest = () => {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "ganapatifreshcut",
  });
  const discovery = useMemo(
    () => ({
      authorizationEndpoint: getGoogleOAuthEndpoint(),
    }),
    [],
  );
  const config = useMemo<AuthRequestConfig>(
    () => ({
      clientId: "google-oauth2",
      redirectUri,
      responseType: ResponseType.Token,
      usePKCE: false,
    }),
    [redirectUri],
  );
  const [request, response, promptAsync] = useAuthRequest(config, discovery);

  return {
    request,
    response,
    promptAsync,
    redirectUri,
  };
};
