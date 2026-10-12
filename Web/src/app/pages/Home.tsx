// Hovedsiden, en introduksjon til nettsiden vår, samt en oppfordring til å opprette bruker eller logge inn.

export function Home() {
    return (
        <main>
            <section id="intro">
                <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h1>Backlog Defeater</h1>
                <h2>The best place to defeat your video game backlog!</h2>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever</p>
            </section>

            <section>
                <article id="get-startet-form">
                    <p>Log in to get started!</p>
                    <form action="/LogIn">
                        <button className="form-button">Log in</button>
                    </form>
                    <form action="/SignUp">
                        <button className="form-button">Sign up</button>
                    </form>
                </article>
            </section>
            <section>
                <h2>Games</h2>
                <article>
                    <p>Game image</p> {/*Spillets forsidebilde */}
                </article>
                <article>
                    <p>Game image</p> {/*Spillets forsidebilde */}
                </article>
                <article>
                    <p>Game image</p> {/*Spillets forsidebilde */}
                </article>
            </section>
        </main>
    )
}