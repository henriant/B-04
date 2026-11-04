
"use client";

import { useState } from "react";
import { deleteUser, useAuthSession } from "@/lib/auth-client";

export function Profile() {
    const { data: session, isPending } = useAuthSession();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleDeleteAccount() {
        const confirmed = window.confirm(
            "Are you absolutely sure you want to delete your account? This cannot be reversed!",
        );
        if (!confirmed) {
            return;
        }

        setError(null);
        setIsDeleting(true);

        try {
            const result = await deleteUser();
            if (result.error) {
                setError(
                    result.error.code === "SESSION_EXPIRED"
                        ? "For security, please log in again before deleting your account."
                        : result.error.message ?? "Could not delete your account.",
                );
                return;
            }

            window.location.assign("/");
        } catch (cause: unknown) {
            console.error("Account deletion failed:", cause);
            setError("Could not delete your account. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    }

    if (isPending) {
        return <p role="status">Checking your session...</p>;
    }

    if (!session) {
        return (
            <section className="profile-page">
                <h1>Profile</h1>
                <p role="status">
                    Log in to view your profile. <a href="/LogIn">Log in</a>
                </p>
            </section>
        );
    }

    return (
        <section className="profile-page">
            <header className="profile-heading">
                <img
                    className="profile-avatar"
                    src="/backlogDefeaterSecondaryLogo2_blue_white2.png"
                    alt="profile avatar"
                />
                <div className="profile-identity">
                    <h1>{session.user.name}</h1>
                    <p className="profile-email">{session.user.email}</p>
                </div>
            </header>

            <div className="profile-actions">
                <button className="profile-settings-button" type="button">
                    Settings
                </button>
                <button
                    className="profile-delete-button"
                    type="button"
                    onClick={() => void handleDeleteAccount()}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting account..." : "Delete account"}
                </button>
            </div>
            {error && <p className="profile-error" role="alert">{error}</p>}
        </section>
    );
}