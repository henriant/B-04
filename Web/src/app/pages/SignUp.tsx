import { CiMail } from "react-icons/ci";
import { IoLockClosedOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";

// Lar brukeren opprette en ny bruker med brukernavn og passord. Dette blir lagret i databasen vår (passordet hashes), slik at det senere kan brukes til sammenligning når brukeren vil logge inn.
export function SignUp() {
    return(
        <>
            <section className="intro">
                <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2>The best place to defeat your video game backlog!</h2>
                <p>Already have an account? Log in <a href="/LogIn">here</a></p>
            </section>

            <form className="get-startet">
                <label htmlFor="email" className="label-section">Email</label>
                <div className="password">
                <CiMail className="icons-form"/>
                    <input id="email" className="input-felte" name="email" type="email" placeholder="Email" required/>
                </div>

                <label htmlFor="userNameSignUp" className="label-section">Name</label>
                <div id="name">
                    <LuUserRound className="icons-form"/>
                    <input id="userNameSignUp" className="input-felte" name="userNameSignUp" type="text" min={1} max={20} placeholder="Name..." required/>
                </div>

                <label htmlFor="passwordSignUp" className="label-section">Password</label>
                <div className="password">
                    <IoLockClosedOutline className="icons-form"/>    
                    <input id="passwordSignUp" className="input-felte" name="passwordSignUp" type="password" min={1} max={20} placeholder="Password" required/>
                </div>
                <button className="form-button get-startet-button">Sign up</button>
            </form>
        </>
    )
}