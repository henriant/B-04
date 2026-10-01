import express, { application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

console.log("Client ID found: ", !!process.env.TWITCH_CLIENT_ID);
console.log("Client Secret found: ", !!process.env.TWITCH_CLIENT_SECRET);  


const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

async function getTwitchAccessToken() : Promise<string> {
    if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
        throw new Error("Twitch client ID or secret is not set in environment variables.");
    }

    const response = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            "client_id": process.env.TWITCH_CLIENT_ID,
            "client_secret": process.env.TWITCH_CLIENT_SECRET,
            "grant_type": "client_credentials"
        })
    });

    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Twitch token could not be fetched: ${response.status} - ${errBody}`);   
    }

    const data = await response.json() as { access_token: string};
    return data.access_token;
}

// Test for å sjekke om serveren svarer i det heletatt
app.get("/api/top-games", async (req : Request, res : Response, next) => {
    try {
        const accessToken = await getTwitchAccessToken();
        console.log("Token successfully fetched. Connecting to IGDB...")

        const igdbResponse = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                "Client-ID" : process.env.TWITCH_CLIENT_ID || "",
                "Authorization" : `Bearer ${accessToken}`,
                "Content-Type" : "text/plain",
            },
            body: "fields name, total_rating; sort total_rating desc; limit 5;"
        });

        if (!igdbResponse.ok) {
            const errorText = await igdbResponse.text();
            throw new Error(`IGDB API failed: ${errorText}`);
        }

        const games = await igdbResponse.json();
        console.log("Response from IGDB: OK");
        res.json(games);

    }   catch (error: any) {
        console.error("ERROR: ", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log("The 5 top rated games from IGDB: http://localhost:5000/api/top-games");
});

