import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API, { getImageUrl, FALLBACK_IMAGE, normalizeImageList } from "../api";
import Loader from "../components/Loader";
import { PLACE_CATEGORIES } from "../constants/placeCategories";

function StateDetails() {
  const { id } = useParams();
  const [places, setPlaces] = useState([]);
  const [stateName, setStateName] = useState("");
  const [stateDesc, setStateDesc] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/states").then((res) => {
      const found = res.data.find((s) => s._id === id);
      if (found) {
        setStateName(found.name);
        setStateDesc(found.description || "");
      }
    });
  }, [id]);

  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/places/search?state=${id}&name=${search}&category=${category}&city=${city}`);
        console.log("[StateDetails] places response:", res.data);
        console.log(
          "[StateDetails] normalized images:",
          res.data.map((place) => ({
            id: place._id,
            name: place.name,
            images: normalizeImageList(place.images),
          }))
        );
        setPlaces(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, [id, search, category, city]);

  useEffect(() => {
    API.get("/cities").then((res) => {
      setCities(res.data.filter((c) => c.state?._id === id || c.state === id));
    });
  }, [id]);

  const getBadgeClass = (cat) =>
    ({
      Heritage: "badge-heritage",
      Nature: "badge-nature",
      Adventure: "badge-adventure",
      Religious: "badge-religious",
    }[cat] || "badge-heritage");

  return (
    <>
      <section className="detail-page-hero state-page-hero">
        <div className="detail-page-hero-overlay" />
        <div className="detail-page-hero-content">
          <div className="breadcrumb detail-breadcrumb">
            <Link to="/">Home</Link>
            <span className="separator">{"\u203A"}</span>
            <span>{stateName || "State"}</span>
          </div>
          <span className="travel-kicker">Destination Guide</span>
          <h1>{stateName || "Explore India"}</h1>
          <p>{stateDesc || "Discover the best destinations, heritage sites, and hidden gems"}</p>
        </div>
      </section>

      <section className="travel-section">
        <div className="container">
          <div className="destination-filter-bar">
            <input
              type="text"
              placeholder="Search places..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {PLACE_CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="section-header travel-section-header">
            <div>
              <span className="section-label">Places to visit</span>
              <h2>Explore {stateName || "destinations"}</h2>
            </div>
            <span className="section-badge">
              {places.length} {places.length === 1 ? "place" : "places"}
            </span>
          </div>

          {loading ? (
            <Loader />
          ) : places.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">{"\u{1F3D4}\uFE0F"}</div>
              <p>No tourist places found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="destination-grid">
              {places.map((place) => {
                const placeImages = normalizeImageList(place.images);

                return (
                  <article key={place._id} className="destination-card place-destination-card">
                    <Link to={`/place/${place._id}`} className="destination-card-image">
                      <img
                        src={
                          placeImages.length > 0
                            ? getImageUrl(placeImages[0])
                            : FALLBACK_IMAGE
                        }
                        alt={place.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = FALLBACK_IMAGE;
                        }}
                      />
                    </Link>
                    <div className="destination-card-content">
                      <h3>{place.name}</h3>
                      <span className="destination-card-location">
                        {place.city?.name || "Featured place"}, {stateName || "India"}
                      </span>
                      <p>{place.description}</p>
                      <div className="place-card-meta-row">
                        <span className={`place-card-badge ${getBadgeClass(place.category)}`}>
                          {place.category}
                        </span>
                        {place.bestTime ? <span className="detail-muted">Best Time: {place.bestTime}</span> : null}
                      </div>
                      <Link to={`/place/${place._id}`} className="btn btn-primary destination-btn">
                        View Details
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
export default StateDetails;