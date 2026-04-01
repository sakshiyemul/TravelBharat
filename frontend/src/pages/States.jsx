import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { getImageUrl } from "../api";
import Loader from "../components/Loader";

const featuredStates = [
  {
    name: "Maharashtra",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=900",
    location: "Mumbai, Konkan, Nashik",
    description: "Coastal drives, historic forts, and vibrant city escapes.",
  },
  {
    name: "Rajasthan",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=900",
    location: "Jaipur, Jodhpur, Udaipur",
    description: "Palaces, deserts, and timeless royal heritage.",
  },
  {
    name: "Kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=900",
    location: "Alleppey, Munnar, Kochi",
    description: "Backwaters, greenery, and calm tropical journeys.",
  },
  {
    name: "Himachal",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=900",
    location: "Manali, Shimla, Spiti",
    description: "Mountain villages, valleys, and scenic road trips.",
  },
  {
    name: "Goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=900",
    location: "North Goa, South Goa, Panaji",
    description: "Sunset beaches, palm-lined shores, and laid-back coastal scenes.",
  },
  {
    name: "Kashmir",
    image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&q=80&w=900",
    location: "Srinagar, Gulmarg, Pahalgam",
    description: "Lakes, meadows, and postcard mountain landscapes.",
  },
];

const categories = [
  { title: "Heritage", copy: "Forts, palaces, monuments, and timeless architecture." },
  { title: "Nature", copy: "Hill stations, forests, waterfalls, and quiet escapes." },
  { title: "Religious", copy: "Temples, shrines, and spiritual circuits across India." },
  { title: "Adventure", copy: "Treks, wildlife, rafting, and adrenaline-filled routes." },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=900",
];

function States() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [imageErrors, setImageErrors] = useState({});

  const scrollToStates = () => {
    const section = document.getElementById("states-list");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    API.get("/states")
      .then((res) => setStates(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(search.toLowerCase())
  );

  const getFallbackClass = (name = "") => {
    const variants = [
      "state-fallback-a",
      "state-fallback-b",
      "state-fallback-c",
      "state-fallback-d",
    ];

    const index =
      name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      variants.length;

    return variants[index];
  };

  return (
    <>
      <section className="travel-hero" id="top">
        <div className="travel-hero-overlay" />
        <div className="travel-hero-orb orb-one" />
        <div className="travel-hero-orb orb-two" />
        <div className="travel-hero-orb orb-three" />
        <div className="travel-hero-shell">
          <div className="travel-hero-content">
            <div className="travel-hero-frame" />
            <span className="travel-kicker">Tours & Travel</span>
            <h1>Explore the Beauty of India</h1>
            <p>Discover states, cities, and hidden gems</p>
            <div className="travel-hero-actions">
              <button className="btn btn-primary" type="button" onClick={scrollToStates}>
                Explore Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="travel-section">
        <div className="container">
          <div className="section-header travel-section-header">
            <div>
              <span className="section-label">Explore by State</span>
              <h2>India&apos;s most loved travel regions</h2>
            </div>
          </div>
          <div className="featured-state-grid">
            {featuredStates.map((item) => (
              <article key={item.name} className="featured-state-card">
                <div className="featured-state-card-image">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="travel-section travel-categories">
        <div className="container">
          <div className="section-header travel-section-header">
            <div>
              <span className="section-label">Categories</span>
              <h2>Choose how you want to explore</h2>
            </div>
          </div>
          <div className="category-showcase-grid">
            {categories.map((item) => (
              <article key={item.title} className="category-showcase-card">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="travel-section travel-about" id="about">
        <div className="container travel-about-grid">
          <div>
            <span className="section-label">About TravelBharat</span>
            <h2>A cleaner way to discover India</h2>
          </div>
          <p>
            TravelBharat helps travelers browse destinations with a simple visual experience.
            Explore states, discover places, and move through guides designed to feel like a real
            travel platform while keeping the original app functionality intact.
          </p>
        </div>
      </section>

      <section className="travel-section destinations-section" id="states-list">
        <div className="container">
          <div className="section-header travel-section-header">
            <div>
              <span className="section-label">Destinations</span>
              <h2>Browse all states and union territories</h2>
            </div>
            <span className="section-badge">
              {filteredStates.length} {filteredStates.length === 1 ? "state" : "states"}
            </span>
          </div>

          <div className="destination-search">
            <input
              type="text"
              placeholder="Search states or union territories"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <Loader />
          ) : filteredStates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">{"\u{1F3D4}\uFE0F"}</div>
              <p>No states found matching &quot;{search}&quot;</p>
            </div>
          ) : (
            <div className="destination-grid">
              {filteredStates.map((state) => (
                <article key={state._id} className="destination-card">
                  <Link to={`/state/${state._id}`} className="destination-card-image">
                    {state.image && !imageErrors[state._id] ? (
                      <img
                        src={getImageUrl(state.image)}
                        alt={state.name}
                        loading="lazy"
                        onError={() => {
                          setImageErrors((prev) => ({ ...prev, [state._id]: true }));
                        }}
                      />
                    ) : (
                      <div className={`state-card-fallback ${getFallbackClass(state.name)}`}>
                        <div className="state-card-fallback-mark">{state.name}</div>
                      </div>
                    )}
                  </Link>
                  <div className="destination-card-content">
                    <h3>{state.name}</h3>
                    <span className="destination-card-location">India</span>
                    <p>
                      {state.description || "Discover scenic routes, heritage spots, and local experiences."}
                    </p>
                    <Link to={`/state/${state._id}`} className="btn btn-primary destination-btn">
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="travel-section gallery-section">
        <div className="container">
          <div className="section-header travel-section-header">
            <div>
              <span className="section-label">Gallery</span>
              <h2>Scenes that inspire your next trip</h2>
            </div>
          </div>
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div key={`${image}-${index}`} className="gallery-card">
                <img src={image} alt={`Travel view ${index + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default States;
