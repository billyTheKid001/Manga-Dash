// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import type { Manga } from "./api/jikan";
import { fetchTopManga, searchManga } from "./api/jikan";

type MangaSectionProps = {
    id: string;
    title: string;
    subtitle: string;
    accentClass: string;
    mangas: Manga[];
};

function MangaSection({
                          id,
                          title,
                          subtitle,
                          accentClass,
                          mangas,
                      }: MangaSectionProps) {
    if (!mangas || mangas.length === 0) return null;

    return (
        <section id={id} className={`section ${accentClass}`}>
            <div className="section-header">
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>

            <div className="carousel">
                <button
                    className="carousel-arrow left"
                    onClick={(e) => {
                        const track = (e.currentTarget.parentElement as HTMLElement).querySelector(
                            ".carousel-track"
                        );
                        if (track) {
                            track.scrollBy({ left: -320, behavior: "smooth" });
                        }
                    }}
                >
                    ‹
                </button>

                <div className="carousel-track">
                    {mangas.map((manga) => (
                        <div key={manga.id} className="manga-card">
                            <div className="manga-image-wrapper">
                                <img
                                    src={manga.coverUrl}
                                    alt={manga.title}
                                    onError={(e) => {
                                        e.currentTarget.src = "/manga-placeholder.png";
                                    }}
                                />
                            </div>
                            <div className="manga-pill">{manga.tagline || "Manga"}</div>
                            <h3>{manga.title}</h3>
                            <button className="manga-btn">Infos rapides</button>
                        </div>
                    ))}
                </div>

                <button
                    className="carousel-arrow right"
                    onClick={(e) => {
                        const track = (e.currentTarget.parentElement as HTMLElement).querySelector(
                            ".carousel-track"
                        );
                        if (track) {
                            track.scrollBy({ left: 320, behavior: "smooth" });
                        }
                    }}
                >
                    ›
                </button>
            </div>
        </section>
    );
}

function App() {
    const [allMangas, setAllMangas] = useState<Manga[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Manga[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // Chargement initial : top mangas depuis Jikan
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);

                // On charge 5 pages max pour éviter le 429 (≈ 75 mangas)
                const pagesToLoad = [1, 2, 3, 4, 5];

                const all: Manga[] = [];

                for (const page of pagesToLoad) {
                    console.log("[JIKAN] Appel top manga page", page);
                    const pageMangas = await fetchTopManga(page);
                    all.push(...pageMangas);

                    // petite pause entre chaque appel pour ne pas spammer l'API
                    await new Promise((resolve) => setTimeout(resolve, 1100));
                }

                // Dédoublonnage par id (au cas où)
                const uniqueById = Array.from(
                    new Map(all.map((m) => [m.id, m])).values()
                );

                setAllMangas(uniqueById);
            } catch (err) {
                console.error("Erreur lors du chargement des mangas :", err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    // Répartition en catégories
    const { shonen, seinen, shojo } = useMemo(() => {
        const shonen = allMangas.filter((m) => m.demographic === "shounen");
        const seinen = allMangas.filter((m) => m.demographic === "seinen");
        const shojo = allMangas.filter((m) => m.demographic === "shoujo");

        return {
            shonen: shonen.length ? shonen : allMangas.slice(0, 20),
            seinen: seinen.length ? seinen : allMangas.slice(20, 40),
            shojo: shojo.length ? shojo : allMangas.slice(40, 60),
        };
    }, [allMangas]);

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const query = searchTerm.trim();

        if (!query) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const results = await searchManga(query);
            setSearchResults(results);
        } catch (err) {
            console.error("Erreur recherche Jikan :", err);
        } finally {
            setSearchLoading(false);
        }
    }

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                }}
            >
                Chargement des mangas Jikan...
            </div>
        );
    }

    const progressPercent = Math.min(allMangas.length / 2, 100); // 0–200 mangas => 0–100%

    return (
        <div className="app">
            {/* NAVBAR */}
            <header className="navbar">
                <div className="logo-ship">
                    <span className="logo-emoji">⛵️</span>
                    <span className="logo-text">MANGADASH</span>
                </div>

                <nav className="navbar-links">
                    <a href="#top">Accueil</a>
                    <a href="#shonen">Shonen</a>
                    <a href="#seinen">Seinen</a>
                    <a href="#shojo">Shojo</a>
                    <a href="#contact">Contact</a>
                </nav>

                <form
                    onSubmit={handleSearch}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher un manga..."
                        style={{
                            borderRadius: "999px",
                            padding: "0.4rem 0.8rem",
                            border: "1px solid rgba(148,163,184,0.5)",
                            background: "rgba(15,23,42,0.8)",
                            color: "#e5e7eb",
                        }}
                    />
                </form>
            </header>

            <main id="top">
                {/* HERO */}
                <section className="hero">
                    <div className="hero-content">
                        <h1>
                            Embarque pour un <span className="highlight">voyage manga</span>
                        </h1>
                        <p>
                            Un tableau de bord connecté à l&apos;API Jikan pour explorer des
                            centaines de mangas : shonen, seinen, shojo et bien plus encore.
                        </p>

                        <div className="hero-buttons">
                            <a href="#shonen" className="btn primary">
                                Commencer l&apos;aventure
                            </a>
                            <a href="#shonen" className="btn ghost">
                                Explorer les catégories
                            </a>
                        </div>
                    </div>

                    <div className="hero-side">
                        <div className="hero-card">
                            <h2>Statut du navire</h2>
                            <p>Progression vers le trésor :</p>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <p className="progress-text">
                                {allMangas.length} mangas chargés depuis Jikan
                            </p>
                            <p className="hero-tip">
                                Utilise la recherche pour accéder à tout le catalogue ⚡️
                            </p>
                        </div>
                    </div>
                </section>

                {/* Résultats de recherche */}
                {searchResults.length > 0 && (
                    <MangaSection
                        id="search"
                        title={`Résultats pour "${searchTerm}"`}
                        subtitle={
                            searchLoading
                                ? "Chargement..."
                                : `${searchResults.length} résultats sur l'API Jikan`
                        }
                        accentClass="accent-seinen"
                        mangas={searchResults}
                    />
                )}

                {/* SECTIONS PAR GENRE */}
                <MangaSection
                    id="shonen"
                    title="Shonen"
                    subtitle="Aventures, combats épiques et héros déterminés."
                    accentClass="accent-shonen"
                    mangas={shonen}
                />

                <MangaSection
                    id="seinen"
                    title="Seinen"
                    subtitle="Histoires plus matures, atmosphères sombres ou réalistes."
                    accentClass="accent-seinen"
                    mangas={seinen}
                />

                <MangaSection
                    id="shojo"
                    title="Shojo"
                    subtitle="Romance, émotions et évolution personnelle."
                    accentClass="accent-shojo"
                    mangas={shojo}
                />

                {/* SECTION CONTACT */}
                <section id="contact" className="section contact-section">
                    <div className="section-header">
                        <h2>Contact</h2>
                        <p>Une idée de fonctionnalité ou une pépite à ajouter au tableau ?</p>
                    </div>
                    <p style={{ color: "var(--text-muted)" }}>
                        Tu pourras plus tard brancher un vrai formulaire ici jeune hokage ou roi des pirates c'est toi qui décide. Pour
                        l&apos;instant, profite juste du dashboard 😄
                        <br />
                    </p>

                    <form action="post">
                        

                    </form>
                </section>
            </main>
        </div>
    );
}

export default App;