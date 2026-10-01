import type { LayoutProps } from 'rwsdk/router'

// holder på nav-bar og footer som skal gjenbrukes i alle pages
export function Layout({ children } : LayoutProps) {
    return(
        <div>
            <header>
                <nav>
                    <ul>
                        <li>
                            <a href="/">LOGO</a>
                        </li>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="/Library">Library</a>

                        </li>
                        <li>
                            <a href="/LogIn">Log in</a>
                        </li>
                        <li>
                            <a href="/SignUp">Sign up</a>
                        </li>
                    </ul>
                </nav>
                <input placeholder="Search..."></input>
            </header>
            <main>{children}</main>
            <footer>
                <a href="/">LOGO</a>
                
                <section>
                    <h2>About us</h2>
                    <ul>
                        <li>Backlog  Defeater</li>
                        <li>We use the <a href="https://www.igdb.com/api">IGDB API</a> for game data</li>
                    </ul>
                </section>

                <section>
                    <h2>Contact us</h2>
                        <ul>
                            <li>E-mail: backlogdefeater@gmail.com</li>
                        </ul>
                </section>

                <section>
                    <h2>Social media</h2>
                    <ul>
                        <li>Instagram</li> {/*Skal vi hente hele mappe med ikoner fra Font Awesome? */} {/*Ja, det er en god idé!*/}
                        <li>Facebook</li>
                        <li>TikTok</li>
                    </ul>
                </section>
                
            </footer>
        </div>
    )
}