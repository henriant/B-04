// Viser alle spillene som matcher søkefilter som brukeren skriver i søkefeltet Search.tsx. Disse kan klikkes på for å vise GameInfo.tsx for det spesifikke spillet.

export function SearchResults() {
    return(
        <>
            <section id="search-results">
                <h1 id="search-results-title">Games matching your search:</h1>
            <article className="seacrhResults-game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/GameInfo"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
                <button className="add-button">Add</button>
            </article>
                
            <article className="seacrhResults-game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/GameInfo"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
                <button className="add-button">Add</button>
            </article>
                
            <article className="seacrhResults-game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/GameInfo"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
                <button className="add-button">Add</button>
            </article>
                
            <article className="seacrhResults-game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/GameInfo"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
                <button className="add-button">Add</button>
            </article>

            <article className="seacrhResults-game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/GameInfo"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
                <button className="add-button">Add</button>
            </article>
                        <article className="seacrhResults-game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/GameInfo"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
                <button className="add-button">Add</button>
            </article>
                
            <article className="seacrhResults-game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/GameInfo"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
                <button className="add-button">Add</button>
            </article>
                
            <article className="seacrhResults-game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/GameInfo"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
                <button className="add-button">Add</button>
            </article>
                
            <article className="seacrhResults-game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/GameInfo"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
                <button className="add-button">Add</button>
            </article>

            <article className="seacrhResults-game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/GameInfo"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
                <button className="add-button">Add</button>
            </article>
                
            </section>
        </>
    )
}