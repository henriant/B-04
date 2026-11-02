import { Platform } from 'react-native'

const apiUrl =
    Platform.OS === "android"
        ? process.env.EXPO_PUBLIC_API_URL_ANDROID
        : process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error("Missing API URL for this platform");
}

export const API_URL = apiUrl;
