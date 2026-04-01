import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { getImageUrl } from "../api";
import Loader from "../components/Loader";
import { PLACE_CATEGORIES } from "../constants/placeCategories";

function AdminDashboard() {
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);

  const [stateName, setStateName] = useState("");
  const [stateDesc, setStateDesc] = useState("");
  const [stateImage, setStateImage] = useState("");

  const [cityName, setCityName] = useState("");
  const [cityState, setCityState] = useState("");

  const [placeName, setPlaceName] = useState("");
  const [placeDesc, setPlaceDesc] = useState("");
  const [placeCategory, setPlaceCategory] = useState("");
  const [placeState, setPlaceState] = useState("");
  const [placeCity, setPlaceCity] = useState("");
  const [placeBestTime, setPlaceBestTime] = useState("");
  const [placeEntryFee, setPlaceEntryFee] = useState("");
  const [placeTimings, setPlaceTimings] = useState("");
  const [placeHistoricalInfo, setPlaceHistoricalInfo] = useState("");
  const [placeNearby, setPlaceNearby] = useState("");
  const [placeLocationLink, setPlaceLocationLink] = useState("");
  const [placeImages, setPlaceImages] = useState("");

  const [stateEditId, setStateEditId] = useState(null);
  const [cityEditId, setCityEditId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchAll();
  }, [navigate, token]);

useEffect(() => {
  document.body.classList.add("admin-page");

  return () => {
    document.body.classList.remove("admin-page");
  };
}, []);

useEffect(() => {
  if (!placeState) {
    if (placeCity) setPlaceCity("");
    return;
  }

  const cityBelongsToState = cities.some(
    (c) => c._id === placeCity && (c.state?._id || c.state) === placeState
  );

  if (placeCity && !cityBelongsToState) {
    setPlaceCity("");
  }
}, [placeCity, placeState, cities]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, c, p] = await Promise.all([
        API.get("/states"),
        API.get("/cities"),
        API.get("/places"),
      ]);
      setStates(s.data);
      setCities(c.data);
      setPlaces(p.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const addState = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: stateName.trim(),
        description: stateDesc.trim(),
        image: stateImage.trim(),
      };

      if (stateEditId) {
        await API.put(`/states/update/${stateEditId}`, body, { headers });
        showMsg("State updated!");
      } else {
        await API.post("/states/add", body, { headers });
        showMsg("State added!");
      }
      resetStateForm();
      fetchAll();
    } catch (err) {
      showMsg(err.response?.data?.message || "Error", "error");
    }
  };

  const addCity = async (e) => {
    e.preventDefault();
    try {
      const body = { name: cityName.trim(), state: cityState };

      if (cityEditId) {
        await API.put(`/cities/update/${cityEditId}`, body, { headers });
        showMsg("City updated!");
      } else {
        await API.post("/cities/add", body, { headers });
        showMsg("City added!");
      }
      resetCityForm();
      fetchAll();
    } catch (err) {
      showMsg(err.response?.data?.message || "Error", "error");
    }
  };

  const editState = (state) => {
    setStateEditId(state._id);
    setStateName(state.name || "");
    setStateDesc(state.description || "");
    setStateImage(state.image || "");
    setActiveSection("states");
  };

  const resetStateForm = () => {
    setStateEditId(null);
    setStateName("");
    setStateDesc("");
    setStateImage("");
  };

  const editCity = (city) => {
    setCityEditId(city._id);
    setCityName(city.name || "");
    setCityState(city.state?._id || city.state || "");
    setActiveSection("cities");
  };

  const resetCityForm = () => {
    setCityEditId(null);
    setCityName("");
    setCityState("");
  };

  const deleteState = async (id) => {
    if (!window.confirm("Delete this state?")) return;
    try {
      await API.delete(`/states/delete/${id}`, { headers });
      showMsg("State deleted!");
      fetchAll();
    } catch (err) {
      showMsg(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const deleteCity = async (id) => {
    if (!window.confirm("Delete this city?")) return;
    try {
      await API.delete(`/cities/delete/${id}`, { headers });
      showMsg("City deleted!");
      fetchAll();
    } catch (err) {
      showMsg(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const savePlace = async (e) => {
    e.preventDefault();

    if (!placeCity) {
      showMsg("Please select a city", "error");
      return;
    }

    if (placeLocationLink && !/^https?:\/\//i.test(placeLocationLink.trim())) {
      showMsg("Location link must start with http:// or https://", "error");
      return;
    }

    const body = {
      name: placeName.trim(),
      description: placeDesc.trim(),
      historicalInfo: placeHistoricalInfo.trim(),
      category: placeCategory,
      state: placeState,
      city: placeCity,
      bestTime: placeBestTime.trim(),
      entryFee: placeEntryFee.trim(),
      timings: placeTimings.trim(),
      nearbyAttractions: placeNearby.trim(),
      locationLink: placeLocationLink.trim(),
      images: placeImages.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editId) {
        await API.put(`/places/update/${editId}`, body, { headers });
        showMsg("Place updated!");
      } else {
        await API.post("/places/add", body, { headers });
        showMsg("Place added!");
      }
      resetPlaceForm();
      fetchAll();
    } catch (err) {
      showMsg(err.response?.data?.message || "Error", "error");
    }
  };

  const editPlace = (p) => {
    setEditId(p._id);
    setPlaceName(p.name);
    setPlaceDesc(p.description || "");
    setPlaceCategory(p.category || "");
    setPlaceState(p.state?._id || "");
    setPlaceCity(p.city?._id || "");
    setPlaceBestTime(p.bestTime || "");
    setPlaceEntryFee(p.entryFee || "");
    setPlaceTimings(p.timings || "");
    setPlaceHistoricalInfo(p.historicalInfo || "");
    setPlaceNearby(p.nearbyAttractions || "");
    setPlaceLocationLink(p.locationLink || "");
    setPlaceImages((p.images || []).join(", "));
    setActiveSection("places");
  };

  const deletePlace = async (id) => {
    if (!window.confirm("Delete this place?")) return;
    try {
      await API.delete(`/places/delete/${id}`, { headers });
      showMsg("Place deleted!");
      fetchAll();
    } catch {
      showMsg("Delete failed", "error");
    }
  };

  const resetPlaceForm = () => {
    setEditId(null);
    setPlaceName("");
    setPlaceDesc("");
    setPlaceCategory("");
    setPlaceState("");
    setPlaceCity("");
    setPlaceBestTime("");
    setPlaceEntryFee("");
    setPlaceTimings("");
    setPlaceHistoricalInfo("");
    setPlaceNearby("");
    setPlaceLocationLink("");
    setPlaceImages("");
  };

  const availableCities = placeState
    ? cities.filter((c) => (c.state?._id || c.state) === placeState)
    : cities;

  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/admin/login");
};

  const navigationItems = [
    { key: null, label: "Dashboard", badge: "01" },
    { key: "states", label: "States", badge: "02" },
    { key: "cities", label: "Cities", badge: "03" },
    { key: "places", label: "Destinations", badge: "04" },
  ];

  const sectionTitle =
    activeSection === "states"
      ? "Manage States"
      : activeSection === "cities"
        ? "Manage Cities"
        : activeSection === "places"
          ? "Manage Destinations"
          : "Overview";

  const sectionDescription =
    activeSection === "states"
      ? "Create and refine the state stories featured on the public website."
      : activeSection === "cities"
        ? "Keep city collections organized so destination discovery stays clean."
        : activeSection === "places"
          ? "Add, update, and polish destination details before they go live."
          : "Monitor content health and jump quickly into the section you want to update.";

  const dashboardMetrics = [
    {
      label: "Total States",
      value: states.length,
      detail: "Regions currently published",
      section: "states",
    },
    {
      label: "Total Cities",
      value: cities.length,
      detail: "City guides in the system",
      section: "cities",
    },
    {
      label: "Total Destinations",
      value: places.length,
      detail: "Travel spots ready to manage",
      section: "places",
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className={`admin-layout ${activeSection === null ? "no-scroll-page" : ""}`}>
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">TB</span>
          <div className="sidebar-brand-copy">
            <span className="sidebar-brand-name">TravelBharat</span>
            <span className="sidebar-brand-subtitle">Content Studio</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.badge}
              className={`nav-item ${activeSection === item.key ? "active" : ""}`}
              onClick={() => setActiveSection(item.key)}
            >
              <span className="nav-item-badge">{item.badge}</span>
              <span className="nav-item-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-summary">
          <span className="sidebar-summary-label">Live content</span>
          <strong>{states.length + cities.length + places.length} records</strong>
          <p>Everything here updates the TravelBharat experience your visitors see.</p>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-copy">
            <span className="admin-topbar-kicker">Admin Workspace</span>
            <h2>{sectionTitle}</h2>
            <p>{sectionDescription}</p>
          </div>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
        </header>

        <div className="admin-content">
          {message.text && (
            <div className={`toast toast-${message.type}`}>
              {message.type === "success" ? "\u2705" : "\u274C"} {message.text}
            </div>
          )}

          {activeSection === null && (
            <div className="dashboard-welcome">
              <div className="dashboard-welcome-copy">
                <span className="dashboard-kicker">TravelBharat Admin Panel</span>
                <h2>Welcome to Admin</h2>
                <p>Manage your travel destinations, states, and cities in one polished workspace.</p>
              </div>
              <div className="dashboard-action-row">
                <button type="button" className="btn btn-outline" onClick={() => setActiveSection("states")}>
                  Review States
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setActiveSection("cities")}>
                  Open Cities
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setActiveSection("places")}>
                  Manage Destinations
                </button>
              </div>
              <div className="admin-metric-grid">
                {dashboardMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="admin-metric-card"
                    onClick={() => setActiveSection(metric.section)}
                  >
                    <div className="admin-metric-card-header">
                      <h3>{metric.label}</h3>
                      <span>{metric.detail}</span>
                    </div>
                    <h1>{metric.value}</h1>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "states" && (
            <>
              <div className="dashboard-section">
                <h2>{stateEditId ? "Edit State" : "Add State"}</h2>
                <form onSubmit={addState}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>State Name</label>
                      <input placeholder="Enter state name" value={stateName} onChange={(e) => setStateName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input placeholder="Enter image URL" value={stateImage} onChange={(e) => setStateImage(e.target.value)} />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea placeholder="Enter description" value={stateDesc} onChange={(e) => setStateDesc(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      {stateEditId ? "Update State" : "Add State"}
                    </button>
                    {stateEditId && (
                      <button type="button" className="btn btn-outline" onClick={resetStateForm}>Cancel</button>
                    )}
                  </div>
                </form>
              </div>

              <div className="dashboard-section">
                <h2>All States</h2>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th className="image-column">Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.map((s) => (
                        <tr key={s._id}>
                          <td>
                            {s.image ? (
                              <img
                                src={getImageUrl(s.image)}
                                alt={s.name}
                                className="table-img"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200";
                                }}
                              />
                            ) : "-"}
                          </td>
                          <td><strong>{s.name}</strong></td>
                          <td className="table-description">{s.description || "-"}</td>
                          <td>
                            <div className="table-actions">
                              <button className="btn btn-primary btn-sm" onClick={() => editState(s)}>Edit</button>
                              <button className="btn btn-danger btn-sm" onClick={() => deleteState(s._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {states.length === 0 && (
                        <tr>
                          <td colSpan="4" className="table-empty">No states found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeSection === "cities" && (
            <>
              <div className="dashboard-section">
                <h2>{cityEditId ? "Edit City" : "Add City"}</h2>
                <form onSubmit={addCity}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>City Name</label>
                      <input placeholder="Enter city name" value={cityName} onChange={(e) => setCityName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <select value={cityState} onChange={(e) => setCityState(e.target.value)} required>
                        <option value="">Select State</option>
                        {states.map((s) => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      {cityEditId ? "Update City" : "Add City"}
                    </button>
                    {cityEditId && (
                      <button type="button" className="btn btn-outline" onClick={resetCityForm}>Cancel</button>
                    )}
                  </div>
                </form>
              </div>

              <div className="dashboard-section">
                <h2>All Cities</h2>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>City Name</th>
                        <th>State</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cities.map((c) => (
                        <tr key={c._id}>
                          <td><strong>{c.name}</strong></td>
                          <td>{c.state?.name || "-"}</td>
                          <td>
                            <div className="table-actions">
                              <button className="btn btn-primary btn-sm" onClick={() => editCity(c)}>Edit</button>
                              <button className="btn btn-danger btn-sm" onClick={() => deleteCity(c._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {cities.length === 0 && (
                        <tr>
                          <td colSpan="3" className="table-empty">No cities found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeSection === "places" && (
            <>
              <div className="dashboard-section">
                <h2>{editId ? "Edit Destination" : "Add Destination"}</h2>
                <form onSubmit={savePlace}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Destination Name</label>
                      <input placeholder="Enter destination name" value={placeName} onChange={(e) => setPlaceName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select value={placeCategory} onChange={(e) => setPlaceCategory(e.target.value)} required>
                        <option value="">Select Category</option>
                        {PLACE_CATEGORIES.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <select value={placeState} onChange={(e) => setPlaceState(e.target.value)} required>
                        <option value="">Select State</option>
                        {states.map((s) => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <select value={placeCity} onChange={(e) => setPlaceCity(e.target.value)} required>
                        <option value="">Select City</option>
                        {availableCities.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Best Time to Visit</label>
                      <input placeholder="e.g., October to March" value={placeBestTime} onChange={(e) => setPlaceBestTime(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Entry Fee</label>
                      <input placeholder="e.g., Rs 50" value={placeEntryFee} onChange={(e) => setPlaceEntryFee(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Timings</label>
                      <input placeholder="e.g., 6AM - 6PM" value={placeTimings} onChange={(e) => setPlaceTimings(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Location / Map Link</label>
                      <input
                        type="url"
                        placeholder="https://maps.google.com/..."
                        value={placeLocationLink}
                        onChange={(e) => setPlaceLocationLink(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Image URLs (comma-separated)</label>
                      <input placeholder="url1, url2, ..." value={placeImages} onChange={(e) => setPlaceImages(e.target.value)} />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea placeholder="Enter description" value={placeDesc} onChange={(e) => setPlaceDesc(e.target.value)} required />
                    </div>
                    <div className="form-group full-width">
                      <label>Historical Info</label>
                      <textarea placeholder="Enter historical information" value={placeHistoricalInfo} onChange={(e) => setPlaceHistoricalInfo(e.target.value)} />
                    </div>
                    <div className="form-group full-width">
                      <label>Nearby Attractions</label>
                      <textarea placeholder="Enter nearby attractions" value={placeNearby} onChange={(e) => setPlaceNearby(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      {editId ? "Update Destination" : "Add Destination"}
                    </button>
                    {editId && (
                      <button type="button" className="btn btn-outline" onClick={resetPlaceForm}>Cancel</button>
                    )}
                  </div>
                </form>
              </div>

              <div className="dashboard-section">
                <h2>All Destinations</h2>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th className="image-column">Image</th>
                        <th>Details</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {places.map((p) => (
                        <tr key={p._id}>
                          <td>
                            {p.images?.length > 0 ? (
                              <img
                                src={getImageUrl(p.images[0])}
                                alt={p.name}
                                className="table-img"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200";
                                }}
                              />
                            ) : "-"}
                          </td>
                          <td className="table-details">
                            <strong>{p.name}</strong><br />
                            <span className="table-meta">
                              {p.category} {"\u00B7"} {p.state?.name || "Unknown"}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="btn btn-primary btn-sm" onClick={() => editPlace(p)}>Edit</button>
                              <button className="btn btn-danger btn-sm" onClick={() => deletePlace(p._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {places.length === 0 && (
                        <tr>
                          <td colSpan="3" className="table-empty">No destinations found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
