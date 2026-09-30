import { Layout } from "../../components/Layout"

// Hovedsiden, en introduksjon til nettsiden vår, samt en oppfordring til å opprette bruker eller logge inn.

export function Home() {
    return (
        <main>
            <Layout></Layout>
            <h1>Backlog Defeater</h1>
            <section>
                <h2>The best place to defeat your video game backlog!</h2>
                <p>lorem ipsum lorem ipsum lorem imsum lorem ipsum</p>
            </section>
            <section>
                <article>
                    <p>Log in to get started!</p>
                    <button>Log in</button>
                    <button>Sign up</button>
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