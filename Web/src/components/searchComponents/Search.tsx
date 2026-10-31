// Selve søkefeltet. Ved et søk, blir brukeren sendt til SearchResults.tsx, hvor spillene som matcher søkekriteriene vises.

// Samler søkefelt og søkeknapp i en form. Router til SearchResults.tsx ved submit. Bruker VscSearchCompact fra react-icons som søkeknapp,og respekterer skjermlesere (best practice on top!!!)
import { VscSearchCompact } from "react-icons/vsc";

export function Search() {
    return (
        <form className="search-bar" action="/SearchResults" method="get" role="search">
            <input id="search-input" name="q" type="search" placeholder="Search for games you own..." aria-label="Search for games you own" maxLength={80} required />
            <button className="search-submit" type="submit" aria-label="Search">
                <VscSearchCompact aria-hidden="true" />
            </button>
        </form>
    );
}