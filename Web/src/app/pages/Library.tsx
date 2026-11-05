// Selve base of operations for brukeren, hvor de får vist alle spillene de eier (spillene de har lagt til i library)
"use client";

import { useState } from "react";
import { VscSearchCompact } from "react-icons/vsc";
import { LibraryList } from '@/components/userComponents/LibraryList';
import { useAuthSession } from "@/lib/auth-client";

import { statusOptions, type LibraryFilterStatus } from '@/constants/library';

export function Library() {
    const { data: session, isPending } = useAuthSession();
    // Søket filtrerer spillene i biblioteket, ikke alle spill fra IGDB.
    const [query, setQuery] = useState("");
    
    const [status, setStatus] = useState<LibraryFilterStatus>('all');
    

    if (isPending) {
        return <p role="status" className="text">Checking your session...</p>;
    }

    if (!session) {
        return (
            <section id="my-games-start">
                <h1 id="my-games-title">My games</h1>
                <p role="status" className="text">
                    Log in to view your library. <a href="/LogIn">Log in</a>
                </p>
            </section>
        );
    }

    return(
        <>
            <section id="my-games-start">
                <h1 id="my-games-title">My games</h1>
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

                    <section className="filterButtons">
                        {statusOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => setStatus(option.value)}
                                className={`filterButton ${status === option.value ? 'active' : ''}`}
                            >
                                <p className="filterText">{option.label}</p>
                            </button>
                        ))}
                    </section>    
                </div>
            </section>

        



            <section className="my-games">
                <LibraryList query={query} status={status}/>
            </section>
        </>
    );
}