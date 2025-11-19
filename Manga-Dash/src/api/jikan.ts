// src/api/jikan.ts

const BASE_URL = "https://api.jikan.moe/v4";

export interface JikanImageSet {
    jpg?: { image_url: string };
    webp?: { image_url: string };
}

export interface JikanManga {
    mal_id: number;
    title: string;
    synopsis: string | null;
    images: JikanImageSet;
    type: string | null;
    demographics?: { name: string }[];
}

export type Demographic = "shounen" | "seinen" | "shoujo" | "autre";

export interface Manga {
    id: string;
    title: string;
    coverUrl: string;
    tagline: string;
    description: string;
    demographic: Demographic;
}

const PLACEHOLDER = "/manga-placeholder.png";

function mapDemographic(api: JikanManga): Demographic {
    const d = api.demographics?.[0]?.name?.toLowerCase() ?? "";
    if (d.includes("shounen")) return "shounen";
    if (d.includes("seinen")) return "seinen";
    if (d.includes("shoujo") || d.includes("shojo")) return "shoujo";
    return "autre";
}

function mapJikanManga(api: JikanManga): Manga {
    return {
        id: String(api.mal_id),
        title: api.title,
        coverUrl:
            api.images.webp?.image_url ??
            api.images.jpg?.image_url ??
            PLACEHOLDER,
        tagline: api.type ?? "Manga",
        description: api.synopsis ?? "Pas de description disponible.",
        demographic: mapDemographic(api),
    };
}

// ---------------------------
//     FETCH TOP MANGA
// ---------------------------

export async function fetchTopManga(page = 1): Promise<Manga[]> {
    console.log("[JIKAN] Appel top manga...");

    const res = await fetch(`${BASE_URL}/top/manga?page=${page}`);
    console.log("[JIKAN] Status:", res.status);

    if (!res.ok) return [];

    const json = await res.json();

    if (!json.data || !Array.isArray(json.data)) {
        console.warn("[JIKAN] data vide !");
        return [];
    }

    return json.data.map(mapJikanManga);
}

// ---------------------------
//       SEARCH
// ---------------------------

export async function searchManga(query: string): Promise<Manga[]> {
    if (!query.trim()) return [];

    const res = await fetch(`${BASE_URL}/manga?q=${encodeURIComponent(query)}`);
    const json = await res.json();

    if (!json.data || !Array.isArray(json.data)) return [];

    return json.data.map(mapJikanManga);
}