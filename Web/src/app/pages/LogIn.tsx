// Logg inn-felt med brukernavn og passord. Disse sammenlignes med informasjonen som er lagret i databasen (passord hashes) og lar brukeren logge inn dersom de matcher

export function LogIn() {
    return(
        <>
            <section>
                <a href="/LogIn">LOGO</a>
                <h2>The best place to defeat your video game backlog!</h2>
                <p>Don't have an account yet? Sign up <a href="/SignUp">here</a></p>
            </section>

            <form>
                <input placeholder="Username..."/>
                <input placeholder="Password"/>
            </form>
        </>
    )
}