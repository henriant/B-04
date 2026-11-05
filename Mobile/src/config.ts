import { Platform } from "react-native";

const configuredApiUrl =
    Platform.OS === "android"
        ? process.env.EXPO_PUBLIC_API_URL_ANDROID
        : process.env.EXPO_PUBLIC_API_URL;

const localApiUrl =
    Platform.OS === "android"
        ? "http://10.0.2.2:8790"
        : "http://localhost:8790";

export const API_URL = configuredApiUrl || localApiUrl;
