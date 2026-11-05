"use server";

import {
    igdbGameSchema,
    libraryEntrySchema,
    libraryStatusSchema,
    type IGDBGame,
    type LibraryEntry,
    type LibraryStatus,
} from "@backlog-defeater/api-client";
import { getRequestInfo, serverAction } from "rwsdk/worker";

type ActionResult<T> =
    | { ok: true; data: T }
    | { ok: false; status: number; message: string };

type ApiResult =
    | { ok: true; data: unknown }
    | { ok: false; status: number; message: string };

async function callLibraryApi(
    path: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: unknown,
): Promise<ApiResult> {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!apiBaseUrl) {
        console.error("VITE_API_BASE_URL is not configured");
        return {
            ok: false,
            status: 500,
            message: "The library API is not configured.",
        };
    }

    const { request } = getRequestInfo();
    const cookie = request.headers.get("Cookie");
    if (!cookie) {
        return { ok: false, status: 401, message: "Please log in first." };
    }

    const headers = new Headers({ Cookie: cookie });
    const origin = request.headers.get("Origin");
    if (origin) {
        headers.set("Origin", origin);
    }
    if (body !== undefined) {
        headers.set("Content-Type", "application/json");
    }

    const sessionResponse = await fetch(
        new URL("/api/auth/get-session", apiBaseUrl),
        { headers },
    );
    if (!sessionResponse.ok) {
        console.error("Library action session check failed:", sessionResponse.status);
        return {
            ok: false,
            status: 502,
            message: "Could not verify your session.",
        };
    }

    const session: unknown = await sessionResponse.json();
    if (!isAuthenticatedSession(session)) {
        return { ok: false, status: 401, message: "Please log in first." };
    }

    const response = await fetch(new URL(path, apiBaseUrl), {
        method,
        headers,
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });

    if (response.status === 204) {
        return { ok: true, data: undefined };
    }

    const data: unknown = await response.json().catch(() => null);
    if (!response.ok) {
        return {
            ok: false,
            status: response.status,
            message: getErrorMessage(data, "The library request failed."),
        };
    }
    return { ok: true, data };
}

function isAuthenticatedSession(
    value: unknown,
): value is { session: object; user: object } {
    return (
        typeof value === "object" &&
        value !== null &&
        "session" in value &&
        typeof value.session === "object" &&
        value.session !== null &&
        "user" in value &&
        typeof value.user === "object" &&
        value.user !== null
    );
}

function getErrorMessage(value: unknown, fallback: string): string {
    if (
        typeof value === "object" &&
        value !== null &&
        "message" in value &&
        typeof value.message === "string"
    ) {
        return value.message;
    }
    return fallback;
}

function validateResponse<T>(
    result: ApiResult,
    parse: (value: unknown) => T,
): ActionResult<T> {
    if (!result.ok) {
        return result;
    }

    try {
        return { ok: true, data: parse(result.data) };
    } catch (cause: unknown) {
        console.error("Library API returned an invalid response:", cause);
        return {
            ok: false,
            status: 502,
            message: "The library API returned an invalid response.",
        };
    }
}

export const addGameToLibrary = serverAction(
    async (
        game: IGDBGame,
        status: LibraryStatus,
    ): Promise<ActionResult<LibraryEntry>> => {
        const validGame = igdbGameSchema.safeParse(game);
        const validStatus = libraryStatusSchema.safeParse(status);
        if (!validGame.success || !validStatus.success) {
            return { ok: false, status: 400, message: "Invalid game or status." };
        }

        const result = await callLibraryApi("/api/library", "POST", {
            igdbGameId: validGame.data.id,
            name: validGame.data.name,
            coverImageId: validGame.data.coverImageId,
            status: validStatus.data,
        });
        return validateResponse(result, (value) => libraryEntrySchema.parse(value));
    },
);

export const updateGameLibraryStatus = serverAction(
    async (
        igdbGameId: number,
        status: LibraryStatus,
    ): Promise<ActionResult<LibraryEntry>> => {
        if (!Number.isSafeInteger(igdbGameId) || igdbGameId <= 0) {
            return { ok: false, status: 400, message: "Invalid game ID." };
        }
        const validStatus = libraryStatusSchema.safeParse(status);
        if (!validStatus.success) {
            return { ok: false, status: 400, message: "Invalid game status." };
        }

        const result = await callLibraryApi(
            `/api/library/${igdbGameId}`,
            "PATCH",
            { status: validStatus.data },
        );
        return validateResponse(result, (value) => libraryEntrySchema.parse(value));
    },
);

export const removeGameFromLibrary = serverAction(
    async (igdbGameId: number): Promise<ActionResult<void>> => {
        if (!Number.isSafeInteger(igdbGameId) || igdbGameId <= 0) {
            return { ok: false, status: 400, message: "Invalid game ID." };
        }

        const result = await callLibraryApi(
            `/api/library/${igdbGameId}`,
            "DELETE",
        );
        if (!result.ok) {
            return result;
        }
        return { ok: true, data: undefined };
    },
);
