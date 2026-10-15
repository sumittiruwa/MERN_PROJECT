import Header from "./header.jsx";
import { useMemo, useState } from "react";
import {
  Search, MapPin, Navigation, Pill, ShieldCheck,
  ArrowRight, Cross, Phone, X, LocateFixed,
  CheckCircle2, AlertCircle, SlidersHorizontal
} from "lucide-react";
import "./UserHome.css";

const pharmacies = [
  {
    id: 1,
    name: "City Care Pharmacy",
    address: "New Baneshwor, Kathmandu",
    latitude: 27.6915,
    longitude: 85.342,
    phone: "9800000001",
    open: true,
    medicines: [
      { name: "Paracetamol", price: 25, stock: 120, unit: "per strip" },
      { name: "Cetirizine", price: 45, stock: 35, unit: "per strip" },
      { name: "Vitamin C", price: 160, stock: 22, unit: "per pack" },
      { name: "Omeprazole", price: 85, stock: 12, unit: "per strip" },
    ],
  },
  {
    id: 2,
    name: "Health Plus Pharmacy",
    address: "Koteshwor, Kathmandu",
    latitude: 27.678,
    longitude: 85.348,
    phone: "9800000002",
    open: true,
    medicines: [
      { name: "Paracetamol", price: 22, stock: 80, unit: "per strip" },
      { name: "Amoxicillin", price: 120, stock: 18, unit: "per strip" },
      { name: "Cetirizine", price: 40, stock: 50, unit: "per strip" },
    ],
  },
  {
    id: 3,
    name: "LifeLine Medical Hall",
    address: "Tinkune, Kathmandu",
    latitude: 27.686,
    longitude: 85.353,
    phone: "9800000003",
    open: false,
    medicines: [
      { name: "Paracetamol", price: 24, stock: 45, unit: "per strip" },
      { name: "Omeprazole", price: 80, stock: 30, unit: "per strip" },
      { name: "Vitamin C", price: 150, stock: 14, unit: "per pack" },
    ],
  },
  {
    id: 4,
    name: "Community Medical Store",
    address: "Old Baneshwor, Kathmandu",
    latitude: 27.700,
    longitude: 85.337,
    phone: "9800000004",
    open: true,
    medicines: [
      { name: "Amoxicillin", price: 115, stock: 26, unit: "per strip" },
      { name: "Paracetamol", price: 23, stock: 60, unit: "per strip" },
      { name: "Cetirizine", price: 42, stock: 17, unit: "per strip" },
    ],
  },
];

function distanceBetween(lat1, lon1, lat2, lon2) {
  const rad = (degrees) => (degrees * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function UserHome() {
  const [medicineSearch, setMedicineSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const [sortBy, setSortBy] = useState("distance");

  function getMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Your browser does not support location access.");
      return;
    }

    setLocationLoading(true);
    setLocationMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationMessage("Your current location has been detected.");
        setLocationLoading(false);
      },
      () => {
        setLocationMessage(
          "Location access failed. Please allow location permission in your browser."
        );
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const results = useMemo(() => {
    const query = medicineSearch.trim().toLowerCase();
    const area = locationSearch.trim().toLowerCase();

    return pharmacies
      .map((pharmacy) => {
        const matchingMedicines = pharmacy.medicines.filter((medicine) =>
          medicine.name.toLowerCase().includes(query)
        );

        const distance = userLocation
          ? distanceBetween(
              userLocation.latitude,
              userLocation.longitude,
              pharmacy.latitude,
              pharmacy.longitude
            )
          : null;

        return { ...pharmacy, matchingMedicines, distance };
      })
      .filter((pharmacy) => pharmacy.matchingMedicines.length > 0)
      .filter(
        (pharmacy) =>
          !area ||
          pharmacy.address.toLowerCase().includes(area) ||
          pharmacy.name.toLowerCase().includes(area)
      )
      .filter((pharmacy) => !openOnly || pharmacy.open)
      .filter(
        (pharmacy) =>
          !nearbyOnly ||
          (pharmacy.distance !== null && pharmacy.distance <= 5)
      )
      .sort((a, b) => {
        if (sortBy === "price" && a.matchingMedicines[0] && b.matchingMedicines[0]) {
          return a.matchingMedicines[0].price - b.matchingMedicines[0].price;
        }
        if (a.distance !== null && b.distance !== null) {
          return a.distance - b.distance;
        }
        return a.name.localeCompare(b.name);
      });
  }, [medicineSearch, locationSearch, userLocation, nearbyOnly, openOnly, sortBy]);

  return (
    <div className="user-home">
      <Header />

      <main id="home">
        <section className="user-hero">
          <div className="hero-content">
            <span className="hero-label"><span /> SMART PHARMACY FINDER</span>
            <h1>Find your medicine.<br /><span>Closer to home.</span></h1>
            <p>
              Search for medicines and discover nearby pharmacies, current
              availability, and prices in one place.
            </p>

            <form
              className="medicine-search-form"
              onSubmit={(event) => {
                event.preventDefault();
                document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Search size={21} />
              <input
                value={medicineSearch}
                onChange={(event) => setMedicineSearch(event.target.value)}
                placeholder="Search medicine, e.g. Paracetamol"
                aria-label="Search medicine"
              />
              <button type="submit">Search medicine</button>
            </form>

            <div className="hero-hints">
              <span>Popular searches:</span>
              {["Paracetamol", "Cetirizine", "Vitamin C"].map((name) => (
                <button key={name} onClick={() => setMedicineSearch(name)}>{name}</button>
              ))}
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="hero-circle circle-back" />
            <div className="hero-circle circle-front" />
            <div className="hero-pill"><Pill size={95} strokeWidth={1.2} /></div>
            <div className="floating-card floating-availability">
              <CheckCircle2 size={22} />
              <div><strong>Availability</strong><span>Find medicines in stock</span></div>
            </div>
            <div className="floating-card floating-location">
              <MapPin size={22} />
              <div><strong>Near your location</strong><span>Explore nearby pharmacies</span></div>
            </div>
          </div>
        </section>

        <section className="user-trust-row">
          <div><span className="trust-icon"><Search size={19} /></span><div><strong>Easy search</strong><p>Find medicines quickly</p></div></div>
          <div><span className="trust-icon"><MapPin size={19} /></span><div><strong>Nearby pharmacies</strong><p>Explore local options</p></div></div>
          <div><span className="trust-icon"><ShieldCheck size={19} /></span><div><strong>Clear availability</strong><p>Check stock before visiting</p></div></div>
        </section>

        <section className="medicine-results-section" id="results">
          <div className="results-heading">
            <div>
              <span className="section-eyebrow">SEARCH & DISCOVER</span>
              <h2>Find medicines near you</h2>
              <p>Compare available stock and prices at listed pharmacies.</p>
            </div>
            <button className="location-button" onClick={getMyLocation} disabled={locationLoading}>
              <LocateFixed size={18} />
              {locationLoading ? "Finding location..." : userLocation ? "Refresh my location" : "Use my location"}
            </button>
          </div>

          {locationMessage && (
            <div className={`location-message ${userLocation ? "location-success" : ""}`}>
              {userLocation ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {locationMessage}
            </div>
          )}

          <div className="filter-bar">
            <label className="filter-input">
              <MapPin size={18} />
              <input
                value={locationSearch}
                onChange={(event) => setLocationSearch(event.target.value)}
                placeholder="Filter by area, e.g. Baneshwor"
                aria-label="Filter by pharmacy area"
              />
            </label>
            <label className="sort-select">
              <SlidersHorizontal size={17} />
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="distance">Sort by distance</option>
                <option value="price">Sort by price</option>
              </select>
            </label>
            <label className="filter-check">
              <input type="checkbox" checked={openOnly} onChange={(event) => setOpenOnly(event.target.checked)} />
              Open now
            </label>
            <label className="filter-check">
              <input type="checkbox" checked={nearbyOnly} onChange={(event) => setNearbyOnly(event.target.checked)} />
              Within 5 km
            </label>
          </div>

          <div className="results-count">
            <div><strong>{results.length} pharmacies</strong><span> match your search</span></div>
            {medicineSearch && (
              <button onClick={() => setMedicineSearch("")}>Clear medicine search <X size={14} /></button>
            )}
          </div>

          {results.length > 0 ? (
            <div className="user-pharmacy-list">
              {results.map((pharmacy) => (
                <article className="user-pharmacy-card" key={pharmacy.id}>
                  <div className="user-pharmacy-main">
                    <div className="user-pharmacy-icon"><Cross size={26} /></div>
                    <div className="user-pharmacy-details">
                      <div className="pharmacy-title-line">
                        <h3>{pharmacy.name}</h3>
                        <span className={`user-open-status ${pharmacy.open ? "is-open" : "is-closed"}`}>
                          <span /> {pharmacy.open ? "Open" : "Closed"}
                        </span>
                      </div>
                      <p className="pharmacy-address"><MapPin size={15} /> {pharmacy.address}</p>
                      <div className="pharmacy-meta">
                        <span><Pill size={14} /> {pharmacy.medicines.length} listed medicines</span>
                        {pharmacy.distance !== null && (
                          <span><Navigation size={14} /> {pharmacy.distance.toFixed(1)} km away</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="available-medicines">
                    <div className="available-heading">
                      <strong>Matching medicines</strong>
                      <span>{pharmacy.matchingMedicines.length} available listing(s)</span>
                    </div>
                    {pharmacy.matchingMedicines.map((medicine) => (
                      <div className="available-medicine-row" key={medicine.name}>
                        <div className="available-medicine-name">
                          <div className="small-pill"><Pill size={17} /></div>
                          <div><strong>{medicine.name}</strong><span>{medicine.unit}</span></div>
                        </div>
                        <div className="available-stock">
                          <span className={medicine.stock <= 20 ? "stock-low" : "stock-good"}>
                            {medicine.stock <= 20 ? "Low stock" : "In stock"}
                          </span>
                          <small>{medicine.stock} units</small>
                        </div>
                        <div className="medicine-price">Rs. {medicine.price}</div>
                      </div>
                    ))}
                  </div>

                  <div className="user-pharmacy-footer">
                    <a href={`tel:${pharmacy.phone}`} className="call-pharmacy"><Phone size={15} /> Call pharmacy</a>
                    <a
                      className="directions-link"
                      href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Get directions <ArrowRight size={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div><Search size={30} /></div>
              <h3>No matching pharmacies found</h3>
              <p>Try another medicine name or remove some filters.</p>
              <button onClick={() => { setMedicineSearch(""); setLocationSearch(""); setOpenOnly(false); setNearbyOnly(false); }}>
                Clear filters
              </button>
            </div>
          )}
          <p className="demo-note">
            <ShieldCheck size={15} /> Demo listings only. Confirm stock and price directly with the pharmacy before travelling.
          </p>
        </section>

        <section className="how-section" id="how-it-works">
          <span className="section-eyebrow">SIMPLE & CONVENIENT</span>
          <h2>How Pharma works</h2>
          <div className="how-grid">
            <article><span>01</span><Search size={24} /><h3>Search a medicine</h3><p>Enter the name of the medicine you need.</p></article>
            <article><span>02</span><MapPin size={24} /><h3>Compare nearby options</h3><p>Review listed stock, prices and locations.</p></article>
            <article><span>03</span><Phone size={24} /><h3>Confirm before visiting</h3><p>Call the pharmacy to confirm current availability.</p></article>
          </div>
        </section>
      </main>

    </div>
  );
}

export default UserHome;
