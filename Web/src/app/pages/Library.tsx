// Selve base of operations for brukeren, hvor de får vist alle spillene de eier (spillene de har lagt til i library)

export function Library() {
    return(
        <>
        <h1 id="my-games-title">My games</h1>
        {/* SØKEFELTE */}
        <input id="find-my-game-felte" placeholder="Search for my game..." max={40}/>
        </>
)
}