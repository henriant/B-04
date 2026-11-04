// Selve søkefeltet. Ved et søk, blir brukeren sendt til SearchResults.tsx, hvor spillene som matcher søkekriteriene vises.

// Samler søkefelt og søkeknapp i en form. Router til SearchResults.tsx ved submit. Bruker VscSearchCompact fra react-icons som søkeknapp,og respekterer skjermlesere (best practice on top!!!)
import { VscSearchCompact } from "react-icons/vsc";

export function Search() {
    return (
        <form className="search-felte" action="/SearchResults" method="get" role="search">
            <input id="search" name="q" type="search" placeholder="Search for games you own..." aria-label="Search for games you own" maxLength={80} required />
            <button className="search-icon-label" type="submit" aria-label="Search">
                <VscSearchCompact aria-hidden="true" className='search-icon' />
            </button>
        </form>
    )
}