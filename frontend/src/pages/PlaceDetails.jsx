import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API, { FALLBACK_IMAGE, getImageUrl, normalizeImageList } from "../api";
import Loader from "../components/Loader";

function PlaceDetails() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    setLoading(true);
    setPlace(null);

    console.log("[PlaceDetails] requested place id:", id);

    API.get(`/places/${id}`)
      .then((res) => {
        if (!isActive) return;

        console.log("[PlaceDetails] place response:", res.data);
        console.log("[PlaceDetails] fetched place id:", res.data?._id);
        console.log("[PlaceDetails] normalized images:", normalizeImageList(res.data?.images));
        setPlace(res.data);
      })
      .catch((err) => {
        if (!isActive) return;
        console.log(err);
      })
      .finally(() => {
        if (!isActive) return;
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    console.log("[PlaceDetails] destination state:", place);
  }, [place]);

  if (loading) return <Loader />;

  if (!place) {
    return (
      <div className="container" style={{ paddingTop: "120px" }}>
        <div className="empty-state">
          <div className="empty-state-icon">{"\u{1F50D}"}</div>
          <p>Place not found.</p>
        </div>
      </div>
    );
  }

  const getBadgeClass = (cat) =>
    ({
      Heritage: "badge-heritage",
      Nature: "badge-nature",
      Adventure: "badge-adventure",
      Religious: "badge-religious",
    }[cat] || "badge-heritage");

  const placeImages = normalizeImageList(place.images);
  const heroImage = placeImages.length > 0 ? getImageUrl(placeImages[0]) : FALLBACK_IMAGE;
  const infoItems = [
    { label: "Category", value: place.category, show: !!place.category },
    { label: "Best Time to Visit", value: place.bestTime, show: !!place.bestTime },
    { label: "Entry Fee", value: place.entryFee, show: !!place.entryFee },
    { label: "Timings", value: place.timings, show: !!place.timings },
    { label: "City", value: place.city?.name, show: !!place.city },
    { label: "State", value: place.state?.name, show: !!place.state },
    {
      label: "Location",
      value: place.locationLink,
      show: !!place.locationLink,
      href: place.locationLink,
    },
  ].filter((item) => item.show);

  return (
    <>
      <section className="detail-page-hero place-page-hero">
        <img
          src={heroImage}
          alt={place.name}
          className="detail-page-hero-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        <div className="detail-page-hero-overlay" />
        <div className="detail-page-hero-content">
          <div className="breadcrumb detail-breadcrumb">
            <Link to="/">Home</Link>
            <span className="separator">{"\u203A"}</span>
            {place.state && (
              <>
                <Link to={`/state/${place.state._id}`}>{place.state.name}</Link>
                <span className="separator">{"\u203A"}</span>
              </>
            )}
            <span>{place.name}</span>
          </div>
          <span className="travel-kicker">Featured Destination</span>
          <h1>{place.name}</h1>
          <p>{place.description || "Discover travel details, nearby attractions, and useful planning information."}</p>
        </div>
      </section>

      <section className="travel-section">
        <div className="container">
          {infoItems.length > 0 && (
            <div className="info-grid modern-info-grid">
              {infoItems.map((item, i) => (
                <div className="info-card" key={i}>
                  <div className="info-card-label">{item.label}</div>
                  <div className="info-card-value">
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noreferrer">
                        Open in Maps
                      </a>
                    ) : (
                      item.value
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="place-detail-layout">
            <div className="place-detail-main">
              {place.description && (
                <div className="detail-description">
                  <span className={`place-card-badge ${getBadgeClass(place.category)}`}>
                    {place.category}
                  </span>
                  <h2>About {place.name}</h2>
                  <p>{place.description}</p>
                </div>
              )}

              {place.historicalInfo && (
                <div className="detail-description">
                  <h2>Historical Information</h2>
                  <p>{place.historicalInfo}</p>
                </div>
              )}

              {place.nearbyAttractions && (
                <div className="detail-description">
                  <h2>Nearby Attractions</h2>
                  <p>{place.nearbyAttractions}</p>
                </div>
              )}
            </div>

            <aside className="place-detail-side">
              <div className="detail-side-card">
                <h3>Plan your visit</h3>
                <p>Browse practical details and continue exploring similar destinations nearby.</p>
                {place.locationLink ? (
                  <a className="btn btn-primary btn-full" href={place.locationLink} target="_blank" rel="noreferrer">
                    Open in Maps
                  </a>
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

export default PlaceDetails;
