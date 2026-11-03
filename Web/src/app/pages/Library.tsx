// Selve base of operations for brukeren, hvor de får vist alle spillene de eier (spillene de har lagt til i library)
"use client";

import { useState } from "react";
import { VscSearchCompact } from "react-icons/vsc";
import { LibraryList } from '@/components/userComponents/LibraryList';

export function Library() {
    // Søket filtrerer spillene i biblioteket, ikke alle spill fra IGDB.
    const [query, setQuery] = useState("");

    return(
        <>
            <section id="my-games-start">
                <h1 id="my-games-title">My games</h1>
                <div id="top-library">
                    <section className='search-felte-library'>
                        {/* Oppdater søketeksten hver gang brukeren skriver. */}
                        <input
                            id="find-my-game-felte"
                            name="search"
                            type="search"
                            placeholder="Search for my game..."
                            maxLength={40}
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />

                        <label htmlFor='find-my-game-felte' className='search-label-library'>
                            <VscSearchCompact/>
                        </label>
                    </section>
                    <h2><a href="/Filter">Filter</a></h2>
                </div>
            </section>

            <section className="my-games">
                <LibraryList query={query} />
            </section>
        </>
    );
}