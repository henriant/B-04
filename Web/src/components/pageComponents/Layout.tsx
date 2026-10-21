import type { LayoutProps } from 'rwsdk/router'
import { Search } from 'lucide-react';


// holder på nav-bar og footer som skal gjenbrukes i alle pages
export function Layout({ children } : LayoutProps) {
    return(
        <div>
            {/* Header */}
            <header className='meny'>
                <a href="/"><img className='logoNav' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <nav>
                    <ul>
                        <li className='meny-text'>
                            <a href="/">Home</a>
                        </li>
                        <li className='meny-text'>
                            <a href="/Library">Library</a>

                        </li>
                    </ul>
                </nav>

                <section className='search-felte'>
                    {/* SØKEFELTE */}
                    <input id='search' name='search' placeholder="Search..." max={40}/>
                    <label htmlFor='search' id='search-icon-label'>
                        <Search id='search-icon'/>
                    </label>
                </section>


                <nav>
                    <ul className='user-header-section'>
                        <li className='meny-text'>
                            <a href="/LogIn">Log in</a>
                        </li>
                        <li className='meny-text'>
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
                            <li>E-mail: <a href='mailto:backlogdefeater@gmail.com' target='_blank'>backlogdefeater@gmail.com</a></li>
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