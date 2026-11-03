import { createApiClient } from "@backlog-defeater/api-client";
import { API_URL } from "@/config";

export const apiClient = createApiClient(API_URL);
