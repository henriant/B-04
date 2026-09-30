// holder på nav-bar og footer som skal gjenbrukes i alle pages
export function Layout() {
    return(
        <div>
            <header>
                <nav>
                    <ul>
                        <li>
                            <a href="http://localhost:5173">LOGO</a>
                        </li>
                        <li>
                            <a href="http://localhost:5173">Home</a>
                        </li>
                        <li>
                            <a href="./pages/Library.tsx">Library</a>

                        </li>
                        <li>
                            <a href="./pages/LogIn.tsx">Log in</a>
                        </li>
                        <li>
                            <a href="./pages/SignUp.tsx">Sign up</a>
                        </li>
                    </ul>
                </nav>
                <input placeholder="Search..."></input>
            </header>
            <footer>
                <p>TEKST</p>
            </footer>
        </div>
    )
}