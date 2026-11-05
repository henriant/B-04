B-04
Prosjekt-repo for gruppe B-04 i Webapplikasjoner og Mobilprogrammering H2026

--------------------------- Introduksjon til prosjektet ---------------------------

/// Kort forklaring av hva prosjektet gjør

For å sette opp prosjektene må du kjøre:
- pnpm install i rot mappen (B-04)

For å kjøre testene:
- `pnpm test` kjører Web-testene med Vitest og API-integrasjonstestene med Vitest.
- `pnpm --filter web-tests test` kjører bare Web-testene.
- `pnpm --filter backend-tests test` kjører bare API-Workerens integrasjonstester.

Web-testene ligger i `Tests/web/`:
- Enhetstest av hjelpefunksjon (`Tests/web/library-filter.test.ts`): sjekker søk og statusfiltrering av biblioteket.
- Enhetstest av API-service (`Tests/web/api-client.test.ts`): sjekker søkeforespørsel, responsvalidering og API-feil i den delte klienten.
- Komponenttest (`Tests/web/LibraryList.test.tsx`): sjekker at biblioteklisten laster og viser spill med valgt status.
- Integrasjonstest av Web-hovedflyten (`Tests/web/SearchResults.integration.test.tsx`): bruker ekte `SearchResults`-UI og API-klient, men mock API-svar og server action, og sjekker at et søkeresultat kan legges til og vises som lagret.

Vitest-konfigurasjon og oppsett ligger også i `Tests/web/`. Web-testene bruker testdata og trenger ikke IGDB-credentials eller Cloudflare-tilgang. API-integrasjonstesten og dens konfigurasjon ligger i `Tests/backend/` og bruker Cloudflare Vitest-runtime med lokal D1. Ingen Playwright E2E-test er satt opp ennå.

For å opprette eller oppdatere den lokale testdatabasen:
- pnpm db:test:migrate

For å kjøre Backlog Defeater API (d1-http worker: IGDB-søk, innlogging og bibliotek) må du:
- Cd inn i `.\backend\api\d1-http\`
- Kjør `pnpm dev`
- Stopp med `CTRL+C`

`pnpm dev` bruker Cloudflare D1 remote og leser/skriver derfor til databasen
`backlog-defeater-db`. For lokal utvikling brukes i stedet `pnpm dev:api:local`,
som kobler til den lokale utviklingsdatabasen opprettet med `pnpm db:local:migrate`.
Den separate lokale testdatabasen opprettes/migreres med `pnpm db:test:migrate`.
Testdatabasen heter `backlog-defeater-test`; den er adskilt fra både utviklingsdatabasen
og Cloudflare-databasen. API-integrasjonstesten bruker en lokal D1 via konfigurasjonen
i `Tests/backend/`.

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

For å teste appene, opprett en bruker, eller logg inn med den allerede eksisterende brukeren laget spesifikt for Marius:
email: supermarius@letsago.com
passord: test12345678

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
