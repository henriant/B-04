# B-04
Prosjekt-repo for gruppe B-04 i Webapplikasjoner og Mobilprogrammering H2026

Introduksjon til prosjektet:

/// Kort forklaring av hva prosjektet gjør samt hvordan man installerer og kjører det.

For å sette opp prosjektene må du kjøre:
- pnpm install i rot mappen (B-04)

For å kjøre webappen må du:
- cd inn i ./Web/
- pnpm run dev
For å slutte den må du:
- CTRL+C i terminalen

For å kjøre mobilappen må du:
- cd inn i ./Mobile/
- npx expo start (--android eller --IOS for å velge emulator)

KI avtale:

Vi har lyst til å lære noe fra dette faget, så vi kommer til å bruke KI som er verktøy til å hjelpe oss når vi sitter fast
Hvis vi ikke vet hvordan å gjøre noe, spør vi KI om å forklare det til oss, så legger vi det inn i prosjektet med en sitering til hva vi spurte
Vi kommer ikke til å spørre KI om å gjøre ting for oss, siden det kan hende den tar med ting som blir for avansert for oss eller som ikke er del av pensum

--------------------------- Kravspekk -----------------------------------------------------
BACKLOG DEFEATER

Frontend:
- Innloggingsside med form for brukernavn og passord
- Registreringsside for nye brukere
- Hjemskjerm med spillbiblioteket ditt (henter ut spillene fra API som du har lagret)
    - Logo til backlog defeater øverst i hjørnet
    - Navbar med innlogget bruker, hjem, søk osv. (innstillinger?)
    - "Hei, (bruker)! Hva har du spilt i dag?" 
    - Biblioteket sorterer som standard spillene du registrerte at du spilte nyligst (andre sorteringsmåter kan også byttes etter brukers behov)
    - Biblioteket består av tre deler: Fullførte spill, spill brukeren spiller, og spill brukeren ikke har spilt
    - Knapp for å legge til nye spill (åpner søkemotor for spillene i API)
    - Bruker skal kunne trykke på et spill (enten i biblioteket eller søkemotoren) som åpner en egen side som viser bilde og info om dette spesifikke spillet
    - Drop-down når du trykker på søkefeltet som viser hva du har søkt på tidligere (localstorage, cookies)
    - (Notere spillsession og timer spilt manuelt)
    - (Utvalg/reklame for spill du ikke har spilt og ikke eier) 

Backend:
- Innloggingsside
    - Lagre og opprette registrerte brukere (brukernavn, kryptert passord og userID)
    - Verifiserer innloggingskriteriene, slik at riktig bruker logges inn
- Hjemskjerm
    - Velkommen-beskjed henter ut brukerens navn (brukernavn, fornavn...?)
    - Liste med spill som tilhører den innloggede brukeren hentes ut og vises i biblioteket
    - Legg-til-spill-knapp som åpner et søkefelt/vindu hvor du kan søke etter spill i API-et. Etter tre? tegn (og andre kriterier?) begynner den å hente ut matchende spill fra APIet (ved navn på spillet)
- Databasen
    - Hver bruker i databasen har en tilknyttet liste som er deres bibliotek. Spillene fra APIet som brukeren lagrer i biblioteket må da også lagres i databasen (?)
    - Bruker består av:
        - UserID, brukernavn, hashet passord, liste med spill med egen statistikk, en lagret kopi av alle spillene en bruker har i biblioteket for å få dette tilknyttet brukerens liste (kan være vi finner en bedre løsning på dette senere)



