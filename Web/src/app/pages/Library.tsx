// Selve base of operations for brukeren, hvor de får vist alle spillene de eier (spillene de har lagt til i library)

export function Library() {
    return(
        <>
        <section id="my-games-start">
            <h1 id="my-games-title">My games</h1>
            {/* SØKEFELTE */}
            <input id="find-my-game-felte" placeholder="Search for my game..." max={40}/>
        </section>

        <section className="my-games">
            
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