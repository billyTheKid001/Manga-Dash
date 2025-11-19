import React, { useEffect, useRef, useState, useMemo } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import "./App.css";

import onepiece from "./images/onepiece.jpg";
import naruto from "./images/naruto.jpg";
import mha from "./images/hero-academia.jpg";
import jjk from "./images/jjk.jpg";

import berserk from "./images/berserk.jpg";
import monster from "./images/monster.jpg";
import vinland from "./images/vinland-saga.jpg";
import tokyoghoul from "./images/tokyo-ghoul.jpg";

import fruits from "./images/basket.jpg";
import yourlie from "./images/yourlie.jpg";
import kimitodoke from "./images/todoke.jpg";
import nana from "./images/nana.jpg";

// ---------------- TYPES ----------------

type Manga = {
  title: string;
  description: string;
  tag?: string;
  image: string;
  episodesVF?: string;
  episodesVO?: string;
  seasons?: number;
  releaseDate?: string;
};

type MangaSection = {
  id: string;
  title: string;
  subtitle: string;
  accentClass: string;
  mangas: Manga[];
};

// ---------------- DONNÉES ----------------

const SECTIONS: MangaSection[] = [
  {
    id: "shonen",
    title: "Shonen",
    subtitle: "Aventures, combats épiques et héros déterminés.",
    accentClass: "accent-shonen",
    mangas: [
      {
        title: "One Piece",
        description:
          "L’équipage du Chapeau de Paille en route vers le trésor ultime.",
        tag: "Aventure",
        image: onepiece,
        episodesVF: "en cours",
        episodesVO: "1100+",
        seasons: 20,
        releaseDate: "1999",
      },
      {
        title: "Naruto",
        description:
          "Le parcours d’un ninja rejeté qui veut devenir Hokage.",
        tag: "Ninja",
        image: naruto,
        episodesVF: "220",
        episodesVO: "220",
        seasons: 5,
        releaseDate: "2002",
      },
      {
        title: "My Hero Academia",
        description:
          "Un monde de super-héros et de super-vilains explosifs.",
        tag: "Héros",
        image: mha,
        episodesVF: "138+",
        episodesVO: "138+",
        seasons: 7,
        releaseDate: "2016",
      },
      {
        title: "Jujutsu Kaisen",
        description:
          "Malédictions, exorcistes et combats surnaturels nerveux.",
        tag: "Occulte",
        image: jjk,
        episodesVF: "24+",
        episodesVO: "24+",
        seasons: 2,
        releaseDate: "2020",
      },
    ],
  },
  {
    id: "seinen",
    title: "Seinen",
    subtitle: "Histoires plus matures, atmosphères sombres ou réalistes.",
    accentClass: "accent-seinen",
    mangas: [
      {
        title: "Berserk",
        description:
          "Une quête de vengeance dans un univers médiéval brutal.",
        tag: "Dark Fantasy",
        image: berserk,
        episodesVF: "25 (1997) + 24 (2016)",
        episodesVO: "25 + 24",
        seasons: 2,
        releaseDate: "1997",
      },
      {
        title: "Monster",
        description:
          "Un thriller psychologique autour d’un chirurgien brillant.",
        tag: "Thriller",
        image: monster,
        episodesVF: "74",
        episodesVO: "74",
        seasons: 1,
        releaseDate: "2004",
      },
      {
        title: "Vinland Saga",
        description: "Vikings, guerre et quête de sens.",
        tag: "Historique",
        image: vinland,
        episodesVF: "48",
        episodesVO: "48",
        seasons: 2,
        releaseDate: "2019",
      },
      {
        title: "Tokyo Ghoul",
        description: "Entre humanité et monstruosité, la frontière est mince.",
        tag: "Horreur",
        image: tokyoghoul,
        episodesVF: "24 + 24 (re:)",
        episodesVO: "24 + 24",
        seasons: 4,
        releaseDate: "2014",
      },
    ],
  },
  {
    id: "shojo",
    title: "Shojo",
    subtitle: "Romance, émotions et évolution personnelle.",
    accentClass: "accent-shojo",
    mangas: [
      {
        title: "Fruits Basket",
        description:
          "Une lycéenne au milieu d’une famille frappée par une malédiction.",
        tag: "Émotion",
        image: fruits,
        episodesVF: "26 (2001) + 63 (2019)",
        episodesVO: "26 + 63",
        seasons: 4,
        releaseDate: "2001",
      },
      {
        title: "Your Lie in April",
        description: "Musique, amour et cicatrices du passé.",
        tag: "Musique",
        image: yourlie,
        episodesVF: "22",
        episodesVO: "22",
        seasons: 1,
        releaseDate: "2014",
      },
      {
        title: "Kimi ni Todoke",
        description: "Une romance douce et maladroite.",
        tag: "Romance",
        image: kimitodoke,
        episodesVF: "38",
        episodesVO: "38",
        seasons: 2,
        releaseDate: "2009",
      },
      {
        title: "Nana",
        description: "Deux Nanas, deux vies, une amitié forte.",
        tag: "Slice of Life",
        image: nana,
        episodesVF: "47",
        episodesVO: "47",
        seasons: 1,
        releaseDate: "2006",
      },
    ],
  },
];

// slug pour les URLs : "One Piece" -> "one-piece"
const slugify = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ---------------- CARROUSEL ----------------

function MangaCarousel({ section }: { section: MangaSection }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const scroll = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const amount = direction === "left" ? -300 : 300;
    track.scrollBy({ left: amount, behavior: "smooth" });
  };

  const toggleExpand = (title: string) => {
    setExpanded((prev) => (prev === title ? null : title));
  };

  return (
    <section id={section.id} className="section">
      <div className={`section-header ${section.accentClass}`}>
        <h2>{section.title}</h2>
        <p>{section.subtitle}</p>
      </div>
      <div className="carousel">
        <button
          className="carousel-arrow left"
          onClick={() => scroll("left")}
          aria-label="Précédent"
        >
          &lt;
        </button>
        <div className="carousel-track" ref={trackRef}>
          {section.mangas.map((manga) => {
            const isExpanded = expanded === manga.title;
            return (
              <article
                key={manga.title}
                className={`manga-card ${
                  isExpanded ? "manga-card-expanded" : ""
                }`}
              >
                <Link
                  to={`/manga/${slugify(manga.title)}`}
                  className="manga-image-wrapper"
                >
                  <img src={manga.image} alt={manga.title} />
                </Link>

                <div className="manga-header">
                  <div className="manga-pill">{manga.tag ?? "Manga"}</div>
                  <h3>{manga.title}</h3>
                </div>

                <button
                  className="manga-btn"
                  onClick={() => toggleExpand(manga.title)}
                >
                  {isExpanded ? "Fermer" : "Infos rapides"}
                </button>

                <div className={`manga-extra ${isExpanded ? "expanded" : ""}`}>
                  <p className="manga-extra-desc">{manga.description}</p>
                  <div className="manga-info-row">
                    <span>Épisodes VF</span>
                    <span>{manga.episodesVF ?? "-"}</span>
                  </div>
                  <div className="manga-info-row">
                    <span>Épisodes VO</span>
                    <span>{manga.episodesVO ?? "-"}</span>
                  </div>
                  <div className="manga-info-row">
                    <span>Saisons</span>
                    <span>{manga.seasons ?? "-"}</span>
                  </div>
                  <div className="manga-info-row">
                    <span>Date de sortie</span>
                    <span>{manga.releaseDate ?? "-"}</span>
                  </div>
                  <Link
                    to={`/manga/${slugify(manga.title)}`}
                    className="manga-details-link"
                  >
                    Voir la fiche complète →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <button
          className="carousel-arrow right"
          onClick={() => scroll("right")}
          aria-label="Suivant"
        >
          &gt;
        </button>
      </div>
    </section>
  );
}

// ---------------- PAGE ACCUEIL ----------------

function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "success">("idle");

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const progress = total > 0 ? doc.scrollTop / total : 0;
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Liste plate de tous les mangas (pour la recherche)
  const allMangas = useMemo(
    () =>
      SECTIONS.flatMap((section) =>
        section.mangas.map((manga) => ({
          ...manga,
          sectionId: section.id,
          sectionTitle: section.title,
        }))
      ),
    []
  );

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return allMangas.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.tag && m.tag.toLowerCase().includes(q))
    );
  }, [search, allMangas]);

  const handleAnchorClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    selector: string
  ) => {
    event.preventDefault();
    const element = document.querySelector(selector);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("success");
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setFormStatus("idle"), 4000);
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar-left">
          <div className="logo-ship">
            <span className="logo-emoji">⛵</span>
            <span className="logo-text">MangaDash</span>
          </div>
        </div>
        <nav className="navbar-links">
          <a href="#top" onClick={(e) => handleAnchorClick(e, "#top")}>
            Accueil
          </a>
          <a href="#shonen" onClick={(e) => handleAnchorClick(e, "#shonen")}>
            Shonen
          </a>
          <a href="#seinen" onClick={(e) => handleAnchorClick(e, "#seinen")}>
            Seinen
          </a>
          <a href="#shojo" onClick={(e) => handleAnchorClick(e, "#shojo")}>
            Shojo
          </a>
          <a href="#contact" onClick={(e) => handleAnchorClick(e, "#contact")}>
            Contact
          </a>
        </nav>

        {/* BARRE DE RECHERCHE */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Rechercher un manga..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="navbar-search-results">
              <p className="navbar-search-title">Recommandations :</p>
              {searchResults.slice(0, 5).map((manga) => (
                <Link
                  key={manga.title}
                  to={`/manga/${slugify(manga.title)}`}
                  className="navbar-search-item"
                >
                  <span>{manga.title}</span>
                  {manga.tag && <span className="tag-pill">{manga.tag}</span>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
            <h1>
              Embarque pour un <span className="highlight">voyage manga</span>
            </h1>
            <p>
              Un tableau de bord pour explorer tes mangas favoris par genre :
              shonen, seinen, shojo et bien plus. Utilise la recherche pour
              trouver ta prochaine pépite.
            </p>
            <div className="hero-buttons">
              <a
                href="#shonen"
                className="btn primary"
                onClick={(e) => handleAnchorClick(e, "#shonen")}
              >
                Commencer l'aventure
              </a>
              <a
                href="#seinen"
                className="btn ghost"
                onClick={(e) => handleAnchorClick(e, "#seinen")}
              >
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
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
              <p className="progress-text">
                {Math.round(scrollProgress * 100)}% du voyage complété
              </p>
            </div>
          </div>
        </section>

        {/* SECTIONS */}
        {SECTIONS.map((section) => (
          <MangaCarousel key={section.id} section={section} />
        ))}

        {/* CONTACT */}
        <section id="contact" className="section contact-section">
          <h2>Contact & idées</h2>
          <p>
            Tu veux ajouter d'autres catégories, séries ou fonctionnalités à
            MangaDash ? Envoie tes idées et construisons le meilleur tableau de
            bord manga.
          </p>
          <div className="contact-content">
            <div className="contact-grid">
              <div className="contact-card">
                <h3>Suggestions de mangas</h3>
                <p>
                  Propose tes shonen, seinen ou shojo favoris à mettre en avant.
                </p>
              </div>
              <div className="contact-card">
                <h3>Fonctionnalités</h3>
                <p>
                  Listes perso, suivi d'épisodes, stats de lecture… tout est
                  possible.
                </p>
              </div>
              <div className="contact-card">
                <h3>Collaboration</h3>
                <p>
                  Tu as un projet autour du manga ? On peut connecter les idées.
                </p>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Envoyer un message</h3>
              <label htmlFor="contact-name">
                Nom / pseudo
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Monkey D. Toi"
                  required
                />
              </label>
              <label htmlFor="contact-email">
                Email
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="toi@example.com"
                  required
                />
              </label>
              <label htmlFor="contact-message">
                Message
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Dis-nous tout sur ton manga ou fonctionnalité rêvée."
                  rows={4}
                  required
                />
              </label>
              <button type="submit" className="contact-submit">
                Envoyer
              </button>
              {formStatus === "success" && (
                <p className="contact-success">
                  Merci ! Ton message a bien été embarqué.
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

// ---------------- PAGE DÉTAIL MANGA ----------------

function MangaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  let manga: Manga | null = null;
  let section: MangaSection | null = null;

  for (const s of SECTIONS) {
    const found = s.mangas.find((m) => slugify(m.title) === slug);
    if (found) {
      manga = found;
      section = s;
      break;
    }
  }

  if (!manga || !section) {
    return (
      <div className="manga-page">
        <p>Manga introuvable.</p>
        <button onClick={() => navigate("/")}>Retour à l'accueil</button>
      </div>
    );
  }

  return (
    <div className="manga-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <div className="manga-page-content">
        <div className="manga-page-image">
          <img src={manga.image} alt={manga.title} />
        </div>
        <div className="manga-page-info">
          <h1>{manga.title}</h1>
          <p className="manga-page-section">{section.title}</p>
          <p className="manga-page-desc">{manga.description}</p>

          <div className="manga-page-grid">
            <div>
              <h4>Épisodes VF</h4>
              <p>{manga.episodesVF ?? "-"}</p>
            </div>
            <div>
              <h4>Épisodes VO</h4>
              <p>{manga.episodesVO ?? "-"}</p>
            </div>
            <div>
              <h4>Saisons</h4>
              <p>{manga.seasons ?? "-"}</p>
            </div>
            <div>
              <h4>Date de sortie</h4>
              <p>{manga.releaseDate ?? "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- ROUTES ----------------

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/manga/:slug" element={<MangaDetailPage />} />
    </Routes>
  );
}

export default App;
