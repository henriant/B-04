import type { LayoutProps } from 'rwsdk/router'
{/* Ikoner */}
import { VscSearchCompact } from "react-icons/vsc";
import { FaFacebookSquare, FaInstagram } from 'react-icons/fa';
import { AiFillTikTok } from 'react-icons/ai';
import { Search } from '../searchComponents/Search';



// holder på nav-bar og footer som skal gjenbrukes i alle pages
export function Layout({ children } : LayoutProps) {
    return(
        <div>
            {/* Header */}
            <header className='meny'>
                <a href="/"><img className='logoNav' src='./backlogDefeaterSecondaryLogo2_blue_white2.png' alt='Backlog Defeater logo'/></a>
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

            // Søkefeltet
                <Search />

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
                <a href="/"><img className='logoNav' src='./backlogDefeaterSecondaryLogo2_blue_white2.png' alt='Backlog Defeater logo'/></a>
                
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
                    <ul className='sosialMedia'>
                        <li><FaInstagram className='sosialMedia-icons'/></li> {/*Skal vi hente hele mappe med ikoner fra Font Awesome? */} {/*Ja, det er en god idé!*/}
                        <li><FaFacebookSquare className='sosialMedia-icons'/></li>
                        <li><AiFillTikTok className='sosialMedia-icons'/></li>
                    </ul>
                </section>
                
            </footer>
        </div>
    )
}