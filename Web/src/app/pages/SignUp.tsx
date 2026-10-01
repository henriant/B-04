// Lar brukeren opprette en ny bruker med brukernavn og passord. Dette blir lagret i databasen vår (passordet hashes), slik at det senere kan brukes til sammenligning når brukeren vil logge inn.
export function SignUp() {
    return(
        <>
            <section>
                <a href="/LogIn">LOGO</a>
                <h2>The best place to defeat your video game backlog!</h2>
                <p>Already have an account? Log in <a href="/LogIn">here</a></p>
            </section>

            <form>
                <input placeholder="E-mail"/>
                <input placeholder="Username..."/>
                <input placeholder="Password"/>
            </form>
        </>
    )
}