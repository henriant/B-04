import { CiMail } from "react-icons/ci";
import { IoLockClosedOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";

// Lar brukeren opprette en ny bruker med brukernavn og passord. Dette blir lagret i databasen vår (passordet hashes), slik at det senere kan brukes til sammenligning når brukeren vil logge inn.
export function SignUp() {
    return(
        <>
            <section className="intro">
                <a href="/"><img className='logoHome' src='./backlogDefeaterSecondaryLogo2_blue_white2.png' alt='Backlog Defeater logo'/></a>
                <h2>The best place to defeat your video game backlog!</h2>
                <p>Already have an account? Log in <a href="/LogIn">here</a></p>
            </section>

            <form id="signUp">
                <div className="password">
                    <label htmlFor="email" className="label-section"><CiMail className="icons-form"/></label>
                    <input id="email" className="input-felte" name="email" type="email" placeholder="Email" required/>
                </div>

                <div id="name">
                    <label htmlFor="userNameSignUp" className="label-section"><LuUserRound className="icons-form"/></label>
                    <input id="userNameSignUp" className="input-felte" name="userNameSignUp" type="text" min={1} max={20} placeholder="Name..." required/>
                </div>

                <div className="password">
                    <label htmlFor="passwordSignUp" className="label-section"><IoLockClosedOutline className="icons-form"/>    </label>
                    <input id="passwordSignUp" className="input-felte" name="passwordSignUp" type="password" min={1} max={20} placeholder="Password" required/>
                </div>
                <button className="form-button get-startet-button">Sign up</button>
            </form>
        </>
    )
}