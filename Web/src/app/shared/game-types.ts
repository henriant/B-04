export interface IgdbGameData {
    id: number;
    name: string;
    summary?: string;
    storyline?: string;
    rating?: number;
    first_release_date?: number;


    // Bilder for spill
    cover?: {
        id: number;
        url: string;
        image_id: string;
    };

    // Sjangre
    genres?: Array<{
        id: number;
        name: string;
    }>;

    // Plattformer hvor spillet kan spilles
    platforms?: Array<{
        id: number;
        name: string;
    }>;
}