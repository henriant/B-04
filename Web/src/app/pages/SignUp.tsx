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
                <label htmlFor="email" className="label-section">E-mail</label>
                <input id="email" className="input-felte" name="email" type="email" placeholder="E-mail" required/>

                <label htmlFor="usernameSignUp" className="label-section">Username</label>
                <input id="usernameSignUp" className="input-felte" name="usernameSignUp" type="text" min={1} max={20} placeholder="Username..." required/>

                <label htmlFor="passwordSignUp" className="label-section">Password</label>
                <input id="passwordSignUp" className="input-felte" name="passwordSignUp" type="password" min={1} max={20} placeholder="Password" required/>
                <button className="form-button get-startet-button">Sign up</button>
            </form>
        </>
    )
}