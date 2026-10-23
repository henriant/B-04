// Logg inn-felt med brukernavn og passord. Disse sammenlignes med informasjonen som er lagret i databasen (passord hashes) og lar brukeren logge inn dersom de matcher
import { CiMail } from "react-icons/ci";
import { IoLockClosedOutline } from "react-icons/io5";


export function LogIn() {
    return(
        <>
            <section className="intro">
                <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2>The best place to defeat your video game backlog!</h2>
                <p>Don't have an account yet? Sign up <a href="/SignUp">here</a></p>
            </section>

            <form className="get-startet">
                <label htmlFor="userEmailLogIn" className="label-section">Email</label>
                <div className="email">
                    <CiMail className="icons-form"/>
                    <input id="userEmailLogIn" className="input-felte" name="email" type="mail" min={1} max={30} placeholder="Email..." required />
                </div>

                <label htmlFor="passwordLogIn" className="label-section">Password</label>
                <div className="password">
                    <IoLockClosedOutline className="icons-form"/>
                    <input id="passwordLogIn" className="input-felte" name="password" type="password" min={1} max={20} placeholder="Password" required/>
                </div>
                <button className="form-button get-startet-button">Log in</button>
            </form>
        </>
    )
}