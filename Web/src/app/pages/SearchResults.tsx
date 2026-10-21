// Viser alle spillene som matcher søkefilter som brukeren skriver i søkefeltet Search.tsx. Disse kan klikkes på for å vise GameInfo.tsx for det spesifikke spillet.

export function SearchResults() {
    return(
        <>
            <section id="search-results">
                <h1 id="search-results-title">Games matching your search:</h1>
                <article className="game">
                    {/*Sette logo som bilde eksempel for spill så lenge*/}
                    <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                    <h2>Name of game</h2>
                    <p>Progress: <span id="progress"><span id="my-progress"></span></span></p>
                    <p>From:</p>
                </article>
                
                <article className="game">
                    {/*Sette logo som bilde eksempel for spill så lenge*/}
                    <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                    <h2>Name of game</h2>
                <p>Progress: <span id="progress"><span id="my-progress"></span></span></p>
                    <p>From:</p>
                </article>
                
                <article className="game">
                    {/*Sette logo som bilde eksempel for spill så lenge*/}
                    <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                    <h2>Name of game</h2>
                <p>Progress: <span id="progress"><span id="my-progress"></span></span></p>
                    <p>From:</p>
                </article>
                
                <article className="game">
                    {/*Sette logo som bilde eksempel for spill så lenge*/}
                    <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                    <h2>Name of game</h2>
                <p>Progress: <span id="progress"><span id="my-progress"></span></span></p>
                    <p>From:</p>
                </article>

                <article className="game">
                    {/*Sette logo som bilde eksempel for spill så lenge*/}
                    <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                    <h2>Name of game</h2>
                <p>Progress: <span id="progress"><span id="my-progress"></span></span></p>
                    <p>From:</p>
                </article>
                            <article className="game">
                    {/*Sette logo som bilde eksempel for spill så lenge*/}
                    <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                    <h2>Name of game</h2>
                <p>Progress: <span id="progress"><span id="my-progress"></span></span></p>
                    <p>From:</p>
                </article>
                
                <article className="game">
                    {/*Sette logo som bilde eksempel for spill så lenge*/}
                    <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                    <h2>Name of game</h2>
                <p>Progress: <span id="progress"><span id="my-progress"></span></span></p>
                    <p>From:</p>
                </article>
                
                <article className="game">
                    {/*Sette logo som bilde eksempel for spill så lenge*/}
                    <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                    <h2>Name of game</h2>
                <p>Progress: <span id="progress"><span id="my-progress"></span></span></p>
                    <p>From:</p>
                </article>
                
                <article className="game">
                    {/*Sette logo som bilde eksempel for spill så lenge*/}
                    <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                    <h2>Name of game</h2>
                <p>Progress: <span id="progress"><span id="my-progress"></span></span></p>
                    <p>From:</p>
                </article>

                <article className="game">
                    {/*Sette logo som bilde eksempel for spill så lenge*/}
                    <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                    <h2>Name of game</h2>
                <p>Progress: <span id="progress"><span id="my-progress"></span></span></p>
                    <p>From:</p>
                </article>
                
            </section>
        </>
    )
}