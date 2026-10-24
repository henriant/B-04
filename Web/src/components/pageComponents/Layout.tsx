import type { LayoutProps } from 'rwsdk/router'
import { VscSearchCompact } from "react-icons/vsc";
import { FaFacebookSquare, FaInstagram } from 'react-icons/fa';
import { AiFillTikTok } from 'react-icons/ai';



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
                    <label htmlFor='search' className='search-icon-label'>

                        {/*seacrh ikon */}
                        <VscSearchCompact id='search-icon'/>
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
                        <li><a href="/">Backlog  Defeater</a></li>
                        <li>We use the <a href="https://www.igdb.com/api">IGDB API</a> for game data</li>
                    </ul>
                </section>

                <section>
                    <h4>Contact us</h4>
                        <ul>
                            <li>E-mail: <a href='mailto:backlogdefeater@gmail.com' target='_blank'>backlogdefeater@gmail.com</a></li>
                        </ul>
                </section>

                <section className='sosialMedia-section'>
                    <h4>Social media</h4>
                    <ul className='sosialMedia-icons'>
                        <li><FaInstagram /></li> {/*Skal vi hente hele mappe med ikoner fra Font Awesome? */} {/*Ja, det er en god idé!*/}
                        <li><FaFacebookSquare /></li>
                        <li><AiFillTikTok /></li>
                    </ul>
                </section>
                
            </footer>
        </div>
    )
}