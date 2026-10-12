export type IGDBGame = {
    id: number;
    name: string;
    coverImageId?: string;
};

export function createApiClient ({ baseUrl }: { baseUrl: string}) {
    return {
        async getGames(): Promise<IGDBGame[]> {
            const res = await fetch(`${baseUrl}/games`);
            if (!res.ok) throw new Error (`Error ${res.status}`)
                return res.json();
        },
    };
}