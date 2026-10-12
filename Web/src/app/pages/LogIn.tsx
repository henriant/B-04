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
                <label htmlFor="username" className="label-section">Username</label>
                <input id="username" className="input-felte" name="username" type="text" min={1} max={20} placeholder="Username..."/>

                <label htmlFor="password" className="label-section">Password</label>
                <input id="password" className="input-felte" name="password" type="password" min={1} max={20} placeholder="Password"/>
            </form>
        </>
    )
}