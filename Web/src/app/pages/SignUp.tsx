"use client";

import { useState, type ComponentProps } from "react";
import { CiMail } from "react-icons/ci";
import { IoLockClosedOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { signUp } from "@/lib/auth-client";

// Lar brukeren opprette en ny bruker med brukernavn og passord. Dette blir lagret i databasen vår (passordet hashes), slik at det senere kan brukes til sammenligning når brukeren vil logge inn.
export function SignUp() {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = async (event) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "");
        const name = String(formData.get("name") ?? "");
        const password = String(formData.get("password") ?? "");

        try {
            const result = await signUp.email({
                email,
                name,
                password,
                callbackURL: "/Library",
            });

            if (result.error) {
                setError(result.error.message ?? "Could not create your account.");
                return;
            }

            window.location.assign("/Library");
        } catch (cause: unknown) {
            console.error("Sign-up failed:", cause);
            setError("Could not create your account. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <>
            <section className="intro">
                <a href="/"><img className='logoHome' src='./backlogDefeaterSecondaryLogo2_blue_white2.png' alt='Backlog Defeater logo'/></a>
                <h2>The best place to defeat your video game backlog!</h2>
                <p>Already have an account? Log in <a href="/LogIn">here</a></p>
            </section>

            <form id="signUp" onSubmit={handleSubmit}>
                <div className="password">
                    <label htmlFor="email" className="label-section"><CiMail className="icons-form"/></label>
                    <input id="email" className="input-felte" name="email" type="email" placeholder="Email" required/>
                </div>

                <div id="name">
                    <label htmlFor="userNameSignUp" className="label-section"><LuUserRound className="icons-form"/></label>
                    <input id="userNameSignUp" className="input-felte" name="name" type="text" minLength={1} maxLength={20} placeholder="Name..." autoComplete="name" required/>
                </div>

                <div className="password">
                    <label htmlFor="passwordSignUp" className="label-section"><IoLockClosedOutline className="icons-form"/>    </label>
                    <input id="passwordSignUp" className="input-felte" name="password" type="password" minLength={8} placeholder="Password" autoComplete="new-password" required/>
                </div>
                {error && <p role="alert">{error}</p>}
                <button className="form-button get-startet-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing up..." : "Sign up"}
                </button>
            </form>
        </>
    )
}