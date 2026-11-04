// Selve base of operations for brukeren, hvor de får vist alle spillene de eier (spillene de har lagt til i library)
"use client";

import { useState } from "react";
import { VscSearchCompact } from "react-icons/vsc";
import { LibraryList } from '@/components/userComponents/LibraryList';
import { useAuthSession } from "@/lib/auth-client";

export function Library() {
    const { data: session, isPending } = useAuthSession();
    // Søket filtrerer spillene i biblioteket, ikke alle spill fra IGDB.
    const [query, setQuery] = useState("");

    if (isPending) {
        return <p role="status">Checking your session...</p>;
    }

    if (!session) {
        return (
            <section id="my-games-start">
                <h1 id="my-games-title">My games</h1>
                <p role="status">
                    Log in to view your library. <a href="/LogIn">Log in</a>
                </p>
            </section>
        );
    }

    return(
        <>
            <section id="my-games-start">
                <h1 id="my-games-title">My games</h1>
                <h2 className="library-greeting">What have you played today?</h2>
                <div id="top-library">
                    <section className='search-felte'>
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
                        <button className="search-icon-label" type="submit" aria-label="Search">
                            <VscSearchCompact aria-hidden="true" className='search-icon'/>
                        </button>
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