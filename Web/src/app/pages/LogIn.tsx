// Logg inn-felt med brukernavn og passord. Disse sammenlignes med informasjonen som er lagret i databasen (passord hashes) og lar brukeren logge inn dersom de matcher

export function LogIn() {
    return(
        <>
            <section className="intro">
                <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2>The best place to defeat your video game backlog!</h2>
                <p>Don't have an account yet? Sign up <a href="/SignUp">here</a></p>
            </section>

            <form className="get-startet">
                <label htmlFor="usernameLogIn" className="label-section">Username</label>
                <input id="usernameLogIn" className="input-felte" name="username" type="text" min={1} max={20} placeholder="Username..." required/>

                <label htmlFor="passwordLogIn" className="label-section">Password</label>
                <input id="passwordLogIn" className="input-felte" name="password" type="password" min={1} max={20} placeholder="Password" required/>
            </form>
        </>
    )
}