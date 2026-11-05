// Logg inn-felt med brukernavn og passord. Disse sammenlignes med informasjonen som er lagret i databasen (passord hashes) og lar brukeren logge inn dersom de matcher
"use client";

import { useState, type ComponentProps } from "react";
import { CiMail } from "react-icons/ci";
import { IoLockClosedOutline } from "react-icons/io5";
import { signIn } from "@/lib/auth-client";

export function LogIn() {
    // Vis feilmelding og deaktivert knapp mens innloggingen behandles.
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = async (event) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        // Les e-post og passord fra feltene i skjemaet.
        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");

        try {
            const result = await signIn.email({
                email,
                password,
                callbackURL: "/Library",
            });

            if (result.error) {
                // Auth-klienten kan returnere en feil uten å kaste et unntak.
                setError(result.error.message ?? "Could not log in. Check your email and password.");
                return;
            };

            // Gå til biblioteket etter vellykket innlogging.
            window.location.assign("/Library");
        } catch (cause: unknown) {
            console.error("Login failed:", cause);
            setError("Could not log in. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return(
        <>
            <section className="intro">
                <a href="/"><img className='logoHome' src='./backlogDefeaterSecondaryLogo2_blue_white2.png' alt='Backlog Defeater logo'/></a>
                <h2>The best place to defeat your video game backlog!</h2>
                <p>Don't have an account yet? Sign up <a href="/SignUp">here</a></p>
            </section>

            <form id="logIn" onSubmit={handleSubmit}>
                <div className="email">
                    <label htmlFor="userEmailLogIn" className="label-section"><CiMail className="icons-form"/></label>
                    <input id="userEmailLogIn" className="input-felte" name="email" type="email" placeholder="Email..." autoComplete="email" required />
                </div>

                <div className="password">
                    <label htmlFor="passwordLogIn" className="label-section"><IoLockClosedOutline className="icons-form"/></label>
                    <input id="passwordLogIn" className="input-felte" name="password" type="password" placeholder="Password" autoComplete="current-password" required/>
                </div>
                {error && <p role="alert">{error}</p>}
                <button className="form-button get-startet-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Log in"}
                </button>
            </form>
        </>
    );
}