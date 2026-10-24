// Selve base of operations for brukeren, hvor de får vist alle spillene de eier (spillene de har lagt til i library)

import { VscSearchCompact } from "react-icons/vsc";
import { LibraryList } from '@/components/userComponents/LibraryList';

export function Library() {
    return(
        <>
            <section id="my-games-start">
                <h1 id="my-games-title">My games</h1>
                {/* SØKEFELTE */}
                
            <div id="top-library">
                <section className='search-felte-library'>
                    <input id="find-my-game-felte" name="search" placeholder="Search for my game..." max={40}/>

                    <label htmlFor='find-my-game-felte' className='search-label-library'>
                        <VscSearchCompact/>
                    </label>
                </section>
                <a href="/Filter">Filter</a>
            </div>
            </section>

        <section className="my-games"><LibraryList></LibraryList></section>
        </>
)
}