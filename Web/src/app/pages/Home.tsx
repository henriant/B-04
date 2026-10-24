// Hovedsiden, en introduksjon til nettsiden vår, samt en oppfordring til å opprette bruker eller logge inn.

import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

export function Home() {
    return (
        <>


        { /* Test for og SearchResults pages*/ }
        <a href="/SearchResults">SearchResults</a>


            <section className="intro">
                <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h1>Backlog Defeater</h1>
                <h2>The best place to defeat your video game backlog!</h2>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever</p>
            </section>

            <section>
                <article className="get-startet-form">
                    <p>Log in to get started!</p>
                    <form action="/LogIn">
                        <button className="form-button">Log in</button>
                    </form>
                    <form action="/SignUp">
                        <button className="form-button">Sign up</button>
                    </form>
                </article>
            </section>

            <section id="game-suggestions">
                <h2>Game suggestions</h2>
                <FaArrowLeft id='left-arrow'/>

                <article className="gameSugestion">
                    <p>Game image</p> {/*Spillets forsidebilde */}
                </article>
                <article className="gameSugestion">
                    <p>Game image</p> {/*Spillets forsidebilde */}
                </article>
                <article className="gameSugestion">
                    <p>Game image</p> {/*Spillets forsidebilde */}
                </article>
                <FaArrowRight  id='right-arrow'/>
            </section>
        </>
    )
}