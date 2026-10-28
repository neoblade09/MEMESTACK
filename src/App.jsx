import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://memestack-api.onrender.com/api";
const DATA_URL = "/data/memes.json";

const CATEGORIES = [
  "All Memes",
  "Funny",
  "Relatable",
  "Reaction",
  "Trending",
];

const FAVORITES_KEY = "memestack-favorites";

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function normalizeMeme(meme, index) {
  return {
    ...meme,
    id: meme.id ?? index + 1,
    title: String(meme.title || meme.name || `Meme ${index + 1}`),
    category: CATEGORIES.includes(meme.category)
      ? meme.category
      : "Funny",
    image: meme.image || meme.url || "",
    description:
      meme.description || "A meme worth sharing with your friends.",
  };
}

function Toast({ toast, onClose }) {
  if (!toast) return null;

  const colors = {
    success: "#16a34a",
    error: "#dc2626",
    info: "#4f46e5",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        maxWidth: "calc(100vw - 32px)",
        padding: "14px 18px",
        borderRadius: "12px",
        background: "#171717",
        color: "#fff",
        borderLeft: `4px solid ${colors[toast.type] || colors.info}`,
        boxShadow: "0 12px 40px rgba(0,0,0,.25)",
        fontSize: "14px",
      }}
    >
      <span>{toast.message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        style={{
          border: 0,
          background: "transparent",
          color: "#fff",
          cursor: "pointer",
          fontSize: "20px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

/*
 * Keeping image state in its own component fixes the ESLint
 * set-state-in-effect error. The key on MemeCardImage below
 * resets this component whenever the image URL changes.
 */
function MemeCardImage({ meme }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="meme-image">
      {!imageFailed && meme.image ? (
        <>
          {!imageLoaded && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                fontSize: "24px",
              }}
            >
              ⏳
            </div>
          )}

          <img
            src={meme.image}
            alt={meme.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity .2s ease",
            }}
          />
        </>
      ) : (
        <div className="image-fallback">
          <span className="fallback-emoji">😂</span>
          <span>{meme.title}</span>
          <small>Image unavailable</small>
        </div>
      )}

      <span className="image-view-label">VIEW MEME ↗</span>
    </div>
  );
}

function MemeCard({
  meme,
  isFavorite,
  onFavorite,
  onOpen,
  onShare,
}) {
  return (
    <article className="meme-card">
      <button
        type="button"
        className="meme-image-button"
        onClick={() => onOpen(meme)}
        aria-label={`View ${meme.title}`}
      >
        <MemeCardImage key={meme.image} meme={meme} />
      </button>

      <div className="meme-details">
        <div className="meme-heading">
          <h3>{meme.title}</h3>

          <button
            type="button"
            className={`favorite-button ${isFavorite ? "favorited" : ""}`}
            onClick={() => onFavorite(meme.id)}
            aria-label={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
            aria-pressed={isFavorite}
            title={isFavorite ? "Remove favorite" : "Add favorite"}
          >
            {isFavorite ? "♥" : "♡"}
          </button>
        </div>

        <p className="meme-description">{meme.description}</p>

        <div className="meme-card-bottom">
          <span className="category-tag">{meme.category}</span>

          <button
            type="button"
            className="share-button"
            onClick={() => onShare(meme)}
          >
            ↗ Share
          </button>

          <button
            type="button"
            className="share-button"
            onClick={() => onOpen(meme)}
          >
            Explore →
          </button>
        </div>
      </div>
    </article>
  );
}

function MemeModal({
  meme,
  onClose,
  isFavorite,
  onFavorite,
  onShare,
  onDownload,
}) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="meme-modal"
        role="dialog"
        aria-modal="true"
        aria-label={meme.title}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="modal-image">
          {!imageFailed && meme.image ? (
            <img
              src={meme.image}
              alt={meme.title}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="image-fallback">
              <span className="fallback-emoji">😂</span>
              <span>{meme.title}</span>
              <small>Image unavailable</small>
            </div>
          )}
        </div>

        <div className="modal-content">
          <span className="category-tag">{meme.category}</span>

          <h2>{meme.title}</h2>

          <p>{meme.description}</p>

          <div className="modal-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => onShare(meme)}
            >
              ↗ Share meme
            </button>

            <button
              type="button"
              className={`secondary-button ${isFavorite ? "favorited" : ""}`}
              onClick={() => onFavorite(meme.id)}
            >
              {isFavorite ? "♥ Saved" : "♡ Add to favorites"}
            </button>

            <button
              type="button"
              className="secondary-button download-button"
              onClick={() => onDownload(meme)}
            >
              ↓ Download image
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => onShare(meme, true)}
            >
              📋 Copy image link
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [memes, setMemes] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Memes");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(readFavorites);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [dataMessage, setDataMessage] = useState("");
  const [lastRandomId, setLastRandomId] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchRef = useRef(null);
  const toastTimer = useRef(null);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  /*
   * Favorites are saved in localStorage.
   * console.error avoids calling a state update from this effect,
   * fixing the remaining ESLint set-state-in-effect error.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error(
        "Favorites could not be saved in this browser.",
        error
      );
    }
  }, [favorites]);

  useEffect(() => {
    let cancelled = false;

    async function loadMemes() {
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE}/memes`);

        if (!response.ok) {
          throw new Error("The meme API request failed.");
        }

        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : result.memes ?? result.data ?? result.results;

        if (!Array.isArray(data)) {
          throw new Error("The API returned an unexpected response.");
        }

        if (!cancelled) {
          setMemes(data.map(normalizeMeme));
          setDataMessage("");
        }
      } catch {
        try {
          const response = await fetch(DATA_URL);

          if (!response.ok) {
            throw new Error("Local data unavailable.");
          }

          const data = await response.json();

          if (!Array.isArray(data)) {
            throw new Error("Invalid local data.");
          }

          if (!cancelled) {
            setMemes(data.map(normalizeMeme));
            setDataMessage(
              "Showing memes from the local data file because the API is unavailable."
            );
          }
        } catch {
          if (!cancelled) {
            setMemes([]);
            setDataMessage(
              "Memes could not be loaded. Check that the frontend and backend are running."
            );
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMemes();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleShortcuts(event) {
      const target = event.target;

      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (
        event.key === "/" &&
        !isTyping &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (
        event.key === "Escape" &&
        !selectedMeme &&
        document.activeElement === searchRef.current
      ) {
        setSearch("");
        searchRef.current.blur();
      }
    }

    window.addEventListener("keydown", handleShortcuts);

    return () => {
      window.removeEventListener("keydown", handleShortcuts);
    };
  }, [selectedMeme]);

  function toggleFavorite(id) {
    const alreadyFavorite = favorites.includes(id);

    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id]
    );

    const meme = memes.find((item) => item.id === id);

    notify(
      alreadyFavorite
        ? `${meme?.title || "Meme"} removed from favorites`
        : `${meme?.title || "Meme"} added to favorites`
    );
  }

  async function shareMeme(meme, copyOnly = false) {
    if (!meme.image) {
      notify("This meme has no image link to share.", "error");
      return;
    }

    const shareData = {
      title: meme.title,
      text: `Check out ${meme.title} on MEMESTACK!`,
      url: meme.image,
    };

    if (
      !copyOnly &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share(shareData);
        notify("Meme shared successfully!");
        return;
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(meme.image);
      notify("Meme link copied to clipboard!");
    } catch {
      window.prompt("Copy this meme image link:", meme.image);
    }
  }

  async function downloadMeme(meme) {
    if (!meme.image) {
      notify("This meme has no image to download.", "error");
      return;
    }

    try {
      const response = await fetch(meme.image);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const safeName =
        meme.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "meme";

      const extension = blob.type.includes("png") ? "png" : "jpg";

      link.href = objectUrl;
      link.download = `${safeName}.${extension}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

      notify("Download started!");
    } catch {
      notify(
        "Direct download is blocked by the image host. Opening the image instead.",
        "info"
      );

      window.open(meme.image, "_blank", "noopener,noreferrer");
    }
  }

  const visibleMemes = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = memes.filter((meme) => {
      const categoryMatches =
        activeCategory === "All Memes" ||
        meme.category === activeCategory;

      const searchMatches =
        !query ||
        meme.title.toLowerCase().includes(query) ||
        meme.category.toLowerCase().includes(query) ||
        (meme.description || "").toLowerCase().includes(query);

      const favoritesMatch =
        !showFavorites || favorites.includes(meme.id);

      return categoryMatches && searchMatches && favoritesMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "az") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "za") {
        return b.title.localeCompare(a.title);
      }

      if (sortBy === "newest") {
        return Number(b.id) - Number(a.id);
      }

      if (sortBy === "oldest") {
        return Number(a.id) - Number(b.id);
      }

      return 0;
    });
  }, [
    memes,
    activeCategory,
    search,
    showFavorites,
    favorites,
    sortBy,
  ]);

  function changeCategory(category) {
    setActiveCategory(category);
    setShowFavorites(false);
  }

  function toggleFavoritesView() {
    setShowFavorites((current) => !current);
    setActiveCategory("All Memes");
  }

  function resetGallery() {
    setActiveCategory("All Memes");
    setShowFavorites(false);
    setSearch("");
    setSortBy("default");
    setSelectedMeme(null);
  }

  function surpriseMe() {
    if (memes.length === 0) {
      notify("No memes are available yet.", "error");
      return;
    }

    const candidates = memes.filter(
      (meme) => meme.id !== lastRandomId
    );

    const pool = candidates.length > 0 ? candidates : memes;

    const randomMeme =
      pool[Math.floor(Math.random() * pool.length)];

    setLastRandomId(randomMeme.id);
    setSearch("");
    setActiveCategory("All Memes");
    setShowFavorites(false);
    setSelectedMeme(randomMeme);

    notify("Your random meme is ready! 🎲", "info");
  }

  function clearFavorites() {
    if (favorites.length === 0) {
      notify("Your favorites list is already empty.", "info");
      return;
    }

    const confirmed = window.confirm(
      `Remove all ${favorites.length} saved favorites?`
    );

    if (!confirmed) {
      return;
    }

    setFavorites([]);
    notify("All favorites have been cleared.");
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <a
          href="#home"
          className="logo"
          onClick={resetGallery}
        >
          MEME<span>STACK</span>
          <span className="logo-dot">.</span>
        </a>

        <div className="nav-search">
          <span className="search-icon">⌕</span>

          <input
            ref={searchRef}
            type="search"
            className="search-box"
            placeholder="Search memes..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search memes"
          />

          <kbd title="Press / to search">/</kbd>
        </div>

        <button
          type="button"
          className={`favorites-nav ${showFavorites ? "selected" : ""}`}
          onClick={toggleFavoritesView}
          aria-pressed={showFavorites}
        >
          <span>♥</span> Favorites

          {favorites.length > 0 && (
            <span className="favorite-count">
              {favorites.length}
            </span>
          )}
        </button>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-badge">
            <span className="status-dot" />
            YOUR DAILY DOSE OF INTERNET
          </div>

          <h1>
            The internet is
            <br />
            <span>funnier together.</span>
          </h1>

          <p>
            Discover the memes everyone is talking about.
            Find your favorites, share a laugh, and keep scrolling.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button"
              onClick={surpriseMe}
            >
              🎲 Surprise Me!
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={resetGallery}
            >
              Explore memes ↓
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>{memes.length.toString().padStart(2, "0")}</strong>
              <span>MEMES TO EXPLORE</span>
            </div>

            <span className="stats-divider" />

            <div>
              <strong>{favorites.length.toString().padStart(2, "0")}</strong>
              <span>YOUR FAVORITES</span>
            </div>
          </div>

          <div className="hero-decoration decoration-one">✳</div>
          <div className="hero-decoration decoration-two">✦</div>
        </section>

        <section className="gallery-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {showFavorites ? "YOUR COLLECTION" : "THE GOOD STUFF"}
              </span>

              <h2>
                {showFavorites
                  ? "Your favorites"
                  : activeCategory === "All Memes"
                    ? "Explore memes"
                    : `${activeCategory} memes`}

                <span className="heading-period">.</span>
              </h2>
            </div>

            <span className="results-count">
              {visibleMemes.length}{" "}
              {visibleMemes.length === 1 ? "MEME" : "MEMES"}
            </span>
          </div>

          <div className="category-bar">
            <div className="category-list">
              {CATEGORIES.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`category-btn ${
                    activeCategory === category && !showFavorites
                      ? "active"
                      : ""
                  }`}
                  onClick={() => changeCategory(category)}
                >
                  {category === "All Memes" && <span>✦ </span>}
                  {category}
                </button>
              ))}
            </div>

            <label
              className="sort-label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              SORT:

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort memes"
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #d4d4d8",
                  background: "transparent",
                  color: "inherit",
                  cursor: "pointer",
                  maxWidth: "100%",
                }}
              >
                <option value="default">Featured</option>
                <option value="newest">ID: High to Low</option>
                <option value="oldest">ID: Low to High</option>
                <option value="az">Name: A–Z</option>
                <option value="za">Name: Z–A</option>
              </select>
            </label>
          </div>

          {dataMessage && (
            <p className="data-notice" role="status">
              {dataMessage}
            </p>
          )}

          {loading ? (
            <div className="empty-state">
              <span className="empty-emoji">⏳</span>
              <h3>Loading memes...</h3>
              <p>MEMESTACK is fetching your collection.</p>
            </div>
          ) : visibleMemes.length > 0 ? (
            <div className="meme-grid">
              {visibleMemes.map((meme) => (
                <MemeCard
                  key={meme.id}
                  meme={meme}
                  isFavorite={favorites.includes(meme.id)}
                  onFavorite={toggleFavorite}
                  onOpen={setSelectedMeme}
                  onShare={shareMeme}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-emoji">
                {showFavorites ? "♡" : "⌕"}
              </span>

              <h3>
                {showFavorites
                  ? "No favorites yet"
                  : memes.length === 0
                    ? "No memes available"
                    : "No memes found"}
              </h3>

              <p>
                {showFavorites
                  ? "Tap the heart on a meme to save it here."
                  : "Try another search or choose a different category."}
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={resetGallery}
              >
                Explore all memes
              </button>
            </div>
          )}

          {showFavorites && favorites.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "12px 0",
              }}
            >
              <button
                type="button"
                className="secondary-button"
                onClick={clearFavorites}
              >
                🧹 Clear all favorites
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <a
          href="#home"
          className="footer-logo"
          onClick={resetGallery}
        >
          MEME<span>STACK</span>.
        </a>

        <p>Built for laughs. Powered by the internet. ✦</p>

        <span className="footer-copyright">© 2026 MEMESTACK</span>
      </footer>

      {selectedMeme && (
        <MemeModal
          key={selectedMeme.id}
          meme={selectedMeme}
          onClose={() => setSelectedMeme(null)}
          isFavorite={favorites.includes(selectedMeme.id)}
          onFavorite={toggleFavorite}
          onShare={shareMeme}
          onDownload={downloadMeme}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}