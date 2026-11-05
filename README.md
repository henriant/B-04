B-04
Prosjekt-repo for gruppe B-04 i Webapplikasjoner og Mobilprogrammering H2026

--------------------------- Introduksjon til prosjektet ---------------------------

Velkommen til Backlog Defeater! Dette prosjektet er laget for dem som eier mange spill, og som kanskje ikke har spilt gjennom alle. Brukeren kan her opprette en konto og søke etter spill fra IGDB Api, eid av Twitch. Brukeren kan da velge spillet de ser etter og legge det til i sitt bibliotek, hvor de kan velge status på spillet (planned, playing og completed). Hvis brukeren ønsker, kan hen slette brukeren fra sin profilside.

----- Mobilapplikasjonen -----
Mobilappen er bygget med React Native. Expo router organiserer skjermer og navigasjonen i Home, Search, Library og Profile. Når brukeren søker etter spill, sender søkeskjermen forespørsel gjennom den delte API-klienten. Dette søket utføres mens brukeren skriver, med en kort delay for å unngå unødvendige API-kall. Søkeresultatene vises med navn og coverbilde . Brukeren kan da åpne et spill ved å klikke på det for å se detaljer, eller legge det til i biblioteket med en valgt status.

Workeren henter spillinfo fra IGDB og håndterer bibliotekoperasjoner mot D1. Twitch-credentials som trengs for IGDB brukes på server siden og skal ikke ligge i selve mobilappen.

----- Webapplikasjonen -----
Webapplikasjonen er bygget med React, TypeScript og RedwoodSDK. RedwoodSDK-rutene viser sider som Home, Library SearchResults og GameInfo og et felles Layout komponent lar oss gjennbruke blant annet navigasjon og søkefelt

Når bruker sender inn et søk, sendes bruker til SearchResults med søket som URL-parameter. SearchResults bruker den delte API-klienten til å hente spill fra API-et og viser navn og coverbilde. Den henter også biblotekstatus så brukeren kan se om spillet allerede ligger i bilbioteket. Her kan brukeren legge til spillet eller endre status på det.

----- Hvordan kjøre Backlog Defeater -----

For å sette opp prosjektene må du:
- Sørge for at pnpm er installert på din maskin
- Kjøre pnpm install i rot mappen (B-04-main)

For å kjøre web:
- opprett lokal database med: pnpm db:local:migrate
- start lokalt API i samme terminal: pnpm db:local:migrate
----- I NY TERMINAL -----
- cd web
- pnpm run dev

For å kjøre mobil:
- opprett lokal database med: pnpm db:local:migrate
- start lokalt API i samme terminal: pnpm db:local:migrate
----- I NY TERMINAL -----
- cd mobile
- npx expo start

----- Hvordan kjøre testene -----

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


----- Notater fra sign-off -----

Oppsummering fra sign-off 1.10.26
Roller
•	Per nå har vi en rolle, user. Brukere av plattformen

Krav – hva skal brukeren kunne gjøre
•	Som bruker skal jeg kunne:
o	Logge inn
o	Søke etter spill
o	Få opp mer info om spillet
o	Legge til spill i en liste
o	Kunne logge ut

•	Videre utvikling
o	Kunne logge inn/koble til med annen konto
	F. eks. steam konto
	Xbox/microsoft

KI – avtalen
•	Gjøre avtalen mer offisielt, med paragrafer
•	Skrive inn konsekvenser ved brudd på avtalen
•	Medlemmene skriver under avtalen
Passord – hvordan håndterer vi dette
•	Passord skal hashes når den sendes
•	Vi hasher pass og sammen input fra bruker og hash i databasen
•	
Ikon lucide
•	Installer pnpm lucide  for web. I terminal kjør: pnpm add lucide
Og npm lucide for mobil. I terminalen kjør: npm install lucide

•	Kan også legge til ikonene i figma
Stilsetting
•	Tailwind
•	CSS

Komponenter
•	Ordne bedre struktur i Component-mappe
o	Lage egne komponentmappe – f. eks. egen mappe for user komponenter, games komponenter osv

Vite test
•	Funksjonstester komponenter
o	eks at epost input sjekker at eposten er ordentlig



