import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Definerer typen for IGDBGame
export interface IGDBGame {
    id: number,
    name: string,
    summary?: string,
    cover?: {
        id: number,
        url: string
    }
}

// API-endepunktet vårt
app.get("/api/games/:id", async (req: Request, res: Response): Promise <void> => {
    try {
        const gameId = req.params.IGDBGame
        
        if (!gameId || isNaN(Number(gameId))) {
            res.status(400).json({ error: "Invalid og missing game id"})
            return
        }

        const response = await fetch('https://igdb.com', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Client-ID": process.env.IGDB_Client_ID || "",
                "Authorization": `Bearer ${process.env.IGDB_ACCESS_TOKEN || ""}`,
            },
            body: `fields name, summary, cover.url; where id = ${gameId};`,
        })

        if (!response.ok) {
            res.status(response.status).json({
                error: `IGDB API error: ${response.statusText}`
            })
            return
        }

        const data = (await response.json()) as unknown

        if (!Array.isArray(data) || data.length === 0) {
            res.status(404).json({error: "Game not found in IGDB API"})
            return
        }
    }


    // implementasjon for å gjøre om json fra igdb til typescript objekt. husk fallbacks og å sjekke typer

    catch (error) {
        const errorMessage = error instanceof Error ? error.message: "Error"
        res.status(500).json({ error: `Internal error: ${errorMessage}`})
    }
})
