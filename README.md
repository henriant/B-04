# B-04
Prosjekt-repo for gruppe B-04 i Webapplikasjoner og Mobilprogrammering H2026

--------------------------- Introduksjon til prosjektet ---------------------------

Dokument:
https://docs.google.com/document/d/1xPGiPMfXj1Dv0fjIMI9oQ7GuXVQfSy6UwPikrsie6rE/edit?usp=sharing

/// Kort forklaring av hva prosjektet gjør

For å sette opp prosjektene må du kjøre:
- pnpm install i rot mappen (B-04)

For å kjøre Backlog Defeater API (IGDB-søk, innlogging og bibliotek) må du:
- Åpne `.\backend\api\d1-http\`
- Kjør `pnpm dev`
- Stopp med `CTRL+C`

Worker-konfigurasjonen bruker Cloudflare D1 remote også under lokal utvikling. Kall til
API-et fra `pnpm dev` leser og skriver derfor til Cloudflare-databasen
`backlog-defeater-db`. Ikke kjør tester eller migreringer mot databasen uten å være
klar over at de kan påvirke ekte data.

Web- og mobilappen skal bruke denne Worker-en for IGDB-søk, registrering, innlogging
og bibliotek. Mobilens API-adresse settes med `EXPO_PUBLIC_API_URL` og
`EXPO_PUBLIC_API_URL_ANDROID`; webappens adresse settes med `VITE_API_BASE_URL`.
Under lokal utvikling skal disse adressene peke på Worker-en på port `8790`.

`pnpm dev` bruker Wranglers lokale Cloudflare-autentisering. `CLOUDFLARE_D1_TOKEN`
i rotens `.env` brukes av Drizzle Kit for D1-operasjoner, men er ikke automatisk
det samme som `CLOUDFLARE_API_TOKEN` som Cloudflare Vitest-pluginen kan kreve for
remote bindinger.

For å kjøre webappen må du:
- cd inn i ./Web/
- pnpm run dev
For å slutte den må du:
- CTRL+C

For å kjøre mobilappen må du:
- cd inn i ./Mobile/
- npx expo start (--android eller --IOS for å velge emulator)
For å slutte den må du:
- CTRL+C

Ikke start den eldre Worker-en fra `backend/` for spill- eller bibliotek-API-et.
Ikke kjør `drizzle-kit push` mot Cloudflare som del av vanlig utvikling; databasen
administreres separat, og skjemaendringer må gjøres som en kontrollert migrering.

For å kjøre tester:
- pnpm test

--------------------------- Kravspekk ---------------------------

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


--------------------------- Pages ---------------------------

-LogIn.tsx 
    vannlig logg in skjema

-SignUp.tsx
    opprete brukeren

-Index.tsx 
    Når du er ikke logget inn:
        intro til nettsdie
        en knapp for logge inn og en for registrere 
        forskjellig kategorier med forskjellig spill ??

-Library.tsx 
    Når du er logget inn
        Velkom tekst "Hei ..."
        viser liste av alle spill brukeren eier

-SearchResults.tsx
    viser alle  resultate som brukeren skrevet i søke felte

-GameInfo.tsx
    Viser en spill som brukeren trykket på: står bilde av spill med informasjon om spill


--------------------------- Components ---------------------------

-Layout.tsx -> en ramme for nettsdie (header og footer), alle komponenter blir sendt til App.tsx som barn til Layout.tsx
    vi kan bruke Outlet for å vise komponenter uten å oppdatere hele nettside???

-Search.tsx 
    søk felte

-LibraryList.tsx
    liste av spill som brukeren eier

-EditLibrary.tsx 
    Add/Move knapp for å legge til spill til liste eller slette fra liste

-GameCard.tsx
    når noen hover over viser gamecard av spill og når brukeren skal trykke på så blir send til GameInfo.jsx


--------------------------- Ikke Med ---------------------------

- Live progress tracker i spillet
- Chat funksjon for å snakke med andre
