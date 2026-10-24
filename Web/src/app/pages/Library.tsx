// Selve base of operations for brukeren, hvor de får vist alle spillene de eier (spillene de har lagt til i library)

import { VscSearchCompact } from "react-icons/vsc";

export function Library() {
    return(
        <>
        <section id="my-games-start">
            <h1 id="my-games-title">My games</h1>
            {/* SØKEFELTE */}
            
            <section className='search-felte-library'>
                <input id="find-my-game-felte" name="search" placeholder="Search for my game..." max={40}/>

                <label htmlFor='find-my-game-felte' className='search-label-library'>
                    <VscSearchCompact/>
                </label>
            </section>
        </section>

        <section className="my-games">
            
            <article className="game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/GameInfo"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
                <div className="filtrer-buttons">
                    <button className="filtrer-button">Planned</button>
                    <button className="filtrer-button">Playing</button>
                    <button className="filtrer-button">Finished</button>
                </div>
            </article>
            
            <article className="game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
               <div className="filtrer-buttons">
                <button className="filtrer-button">Planned</button>
                    <button className="filtrer-button">Playing</button>
                    <button className="filtrer-button">Finished</button>
               </div>
            </article>
            
            <article className="game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
               <div className="filtrer-buttons">
                <button className="filtrer-button">Planned</button>
                    <button className="filtrer-button">Playing</button>
                    <button className="filtrer-button">Finished</button>
               </div>
            </article>
            
            <article className="game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
               <div className="filtrer-buttons">
                <button className="filtrer-button">Planned</button>
                    <button className="filtrer-button">Playing</button>
                    <button className="filtrer-button">Finished</button>
               </div>
            </article>

            <article className="game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
               <div className="filtrer-buttons">
                <button className="filtrer-button">Planned</button>
                    <button className="filtrer-button">Playing</button>
                    <button className="filtrer-button">Finished</button>
               </div>
            </article>
            
            <article className="game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
               <div className="filtrer-buttons">
                <button className="filtrer-button">Planned</button>
                    <button className="filtrer-button">Playing</button>
                    <button className="filtrer-button">Finished</button>
               </div>
            </article>
            
            <article className="game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
               <div className="filtrer-buttons">
                <button className="filtrer-button">Planned</button>
                    <button className="filtrer-button">Playing</button>
                    <button className="filtrer-button">Finished</button>
               </div>
            </article>
            
            <article className="game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
               <div className="filtrer-buttons">
                <button className="filtrer-button">Planned</button>
                    <button className="filtrer-button">Playing</button>
                    <button className="filtrer-button">Finished</button>
               </div>
            </article>
            
            <article className="game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
               <div className="filtrer-buttons">
                <button className="filtrer-button">Planned</button>
                    <button className="filtrer-button">Playing</button>
                    <button className="filtrer-button">Finished</button>
               </div>
            </article>

            <article className="game">
                {/*Sette logo som bilde eksempel for spill så lenge*/}
                <a href="/"><img className='library-game-img' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                <h2><a href="/GameInfo">Name of game</a></h2>
               <div className="filtrer-buttons">
                <button className="filtrer-button">Planned</button>
                    <button className="filtrer-button">Playing</button>
                    <button className="filtrer-button">Finished</button>
               </div>
            </article>
            
        </section>
        </>
)
}