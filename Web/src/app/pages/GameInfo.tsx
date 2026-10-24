// Viser full informasjon om ett spill, etter at brukeren klikker på spillet (enten i listen eller på et gameCard)

export function GameInfo() {
    return(
        <>
        <section>
            <h1 className="game-info-title">Game Info</h1>
            <div className="game-info">
                <a href="/"><img className='logoHome' src='./secondaryLogo.png' alt='Backlog Defeater logo'/></a>
                
                <article>
                    <h2>Name of game</h2>
                    <button className="filtrer-button">Planned</button>
                    <button className="filtrer-button">Playing</button>
                    <button className="filtrer-button">Finished</button>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets.</p>
                </article>
            </div>
        </section>
        </>
        )
}