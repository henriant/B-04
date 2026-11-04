"use client";

import { useState } from "react";
import { signOut, useAuthSession } from "@/lib/auth-client";

export function AuthNavigation() {
    const { data: session, isPending } = useAuthSession();
    const [error, setError] = useState<string | null>(null);
    const [isSigningOut, setIsSigningOut] = useState(false);

    async function handleSignOut() {
        setError(null);
        setIsSigningOut(true);

        try {
            const result = await signOut();
            if (result.error) {
                setError(result.error.message ?? "Could not log out.");
                return;
            }

            window.location.assign("/");
        } catch (cause: unknown) {
            console.error("Logout failed:", cause);
            setError("Could not log out. Please try again.");
        } finally {
            setIsSigningOut(false);
        }
    }

    if (isPending) {
        return (
            <nav className="auth-navigation" aria-label="Account" aria-busy="true">
                <ul className="user-header-section">
                    <li className="meny-text">Checking session...</li>
                </ul>
            </nav>
        );
    }

    return (
        <nav className="auth-navigation" aria-label="Account">
            <ul className="user-header-section">
                {session ? (
                    <>
                        <li className="meny-text">
                            <span className="auth-user-name">
                                Hello, {session.user.name}!
                            </span>
                        </li>
                        <li className="meny-text">
                            <button
                                type="button"
                                className="auth-logout-button"
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                            >
                                {isSigningOut ? "Logging out..." : "Log out"}
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="meny-text">
                            <a href="/LogIn">Log in</a>
                        </li>
                        <li className="meny-text">
                            <a href="/SignUp">Sign up</a>
                        </li>
                    </>
                )}
            </ul>
            {error && <p role="alert" className="auth-navigation-error">{error}</p>}
        </nav>
    );
}
