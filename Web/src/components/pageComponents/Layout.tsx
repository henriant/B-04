import type { LayoutProps } from 'rwsdk/router'

// holder på nav-bar og footer som skal gjenbrukes i alle pages
export function Layout({ children } : LayoutProps) {
    return(
        <div>
            {/* Header */}
            <header className='meny'>
                <a href="/"><img className='logoNav' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <nav>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="/Library">Library</a>

                        </li>
                    </ul>
                </nav>

                {/* SØKEFELTE */}
                <input placeholder="Search..." max={40}/>

                <nav>
                    <ul className='user-header-section'>
                        <li>
                            <a href="/LogIn">Log in</a>
                        </li>
                        <li>
                            <a href="/SignUp">Sign up</a>
                        </li>
                    </ul>
                </nav>
            </header>
            {/* Barnelementer */}
            <main>{children}</main>

            {/* Footer */}
            <footer id='bottom'>
                <a href="/"><img className='logoNav' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                
                <section>
                    <h4>About us</h4>
                    <ul>
                        <li>Backlog  Defeater</li>
                        <li>We use the <a href="https://www.igdb.com/api">IGDB API</a> for game data</li>
                    </ul>
                </section>

                <section>
                    <h4>Contact us</h4>
                        <ul>
                            <li>E-mail: backlogdefeater@gmail.com</li>
                        </ul>
                </section>

                <section>
                    <h4>Social media</h4>
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