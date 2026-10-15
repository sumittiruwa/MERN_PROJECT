import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Cross,
  LayoutDashboard,
  Pill,
  ShoppingCart,
  CalendarCheck,
  Building2,
  Settings,
  LogOut,
  Search,
  Bell,
  Plus,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle2,
  Menu,
  X,
  ArrowUpRight,
  Mail,
  UserRound,
} from "lucide-react";
import "./Dashboard.css";

const initialMedicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    stock: 120,
    price: 25,
    status: "In Stock",
  },
  {
    id: 2,
    name: "Amoxicillin 500mg",
    category: "Antibiotics",
    stock: 8,
    price: 120,
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Cetirizine 10mg",
    category: "Allergy",
    stock: 65,
    price: 40,
    status: "In Stock",
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    category: "Digestive Health",
    stock: 4,
    price: 85,
    status: "Low Stock",
  },
  {
    id: 5,
    name: "Vitamin C 500mg",
    category: "Vitamins",
    stock: 0,
    price: 150,
    status: "Out of Stock",
  },
];

const initialOrders = [
  {
    id: "#PH1024",
    customer: "Aarav Sharma",
    medicine: "Paracetamol 500mg",
    amount: 125,
    status: "Pending",
  },
  {
    id: "#PH1023",
    customer: "Anisha KC",
    medicine: "Cetirizine 10mg",
    amount: 80,
    status: "Completed",
  },
  {
    id: "#PH1022",
    customer: "Rohan Thapa",
    medicine: "Vitamin C 500mg",
    amount: 300,
    status: "Pending",
  },
];

const navigation = [
  { label: "Overview", icon: LayoutDashboard, page: "overview" },
  { label: "Medicine Inventory", icon: Pill, page: "inventory" },
  { label: "Orders", icon: ShoppingCart, page: "orders" },
  { label: "Reservations", icon: CalendarCheck, page: "reservations" },
  { label: "Pharmacy Profile", icon: Building2, page: "profile" },
  { label: "Settings", icon: Settings, page: "settings" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState(initialMedicines);

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pharmaUser")) || {};
    } catch {
      return {};
    }
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
  });

  const pharmacyName =
    user.pharmacyName || user.name || "Your Pharmacy";

  const lowStock = medicines.filter(
    (medicine) => medicine.stock > 0 && medicine.stock <= 10
  );

  const outOfStock = medicines.filter(
    (medicine) => medicine.stock === 0
  );

  const filteredMedicines = medicines.filter((medicine) =>
    `${medicine.name} ${medicine.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function logout() {
    localStorage.removeItem("pharmaToken");
    localStorage.removeItem("pharmaUser");
    navigate("/");
    window.location.reload();
  }

  function addMedicine(event) {
    event.preventDefault();

    const stock = Number(newMedicine.stock);
    const price = Number(newMedicine.price);

    if (
      !newMedicine.name.trim() ||
      !newMedicine.category.trim() ||
      !Number.isFinite(stock) ||
      !Number.isFinite(price) ||
      stock < 0 ||
      price < 0
    ) {
      return;
    }

    setMedicines((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: newMedicine.name.trim(),
        category: newMedicine.category.trim(),
        stock,
        price,
        status:
          stock === 0
            ? "Out of Stock"
            : stock <= 10
              ? "Low Stock"
              : "In Stock",
      },
    ]);

    setNewMedicine({
      name: "",
      category: "",
      stock: "",
      price: "",
    });

    setShowAddForm(false);
    setActivePage("inventory");
  }

  function changeStock(id, amount) {
    setMedicines((previous) =>
      previous.map((medicine) => {
        if (medicine.id !== id) return medicine;

        const stock = Math.max(0, medicine.stock + amount);

        return {
          ...medicine,
          stock,
          status:
            stock === 0
              ? "Out of Stock"
              : stock <= 10
                ? "Low Stock"
                : "In Stock",
        };
      })
    );
  }

  function renderInventory() {
    return (
      <>
        <div className="dash-section-heading">
          <div>
            <h2>Medicine Inventory</h2>
            <p>Manage your medicines, quantities and prices.</p>
          </div>

          <button
            className="dash-primary-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={17} />
            Add Medicine
          </button>
        </div>

        {showAddForm && (
          <form className="dash-add-form" onSubmit={addMedicine}>
            <h3>Add a medicine</h3>

            <div className="dash-form-grid">
              <label>
                Medicine name
                <input
                  required
                  value={newMedicine.name}
                  onChange={(event) =>
                    setNewMedicine({
                      ...newMedicine,
                      name: event.target.value,
                    })
                  }
                  placeholder="e.g. Paracetamol 500mg"
                />
              </label>

              <label>
                Category
                <input
                  required
                  value={newMedicine.category}
                  onChange={(event) =>
                    setNewMedicine({
                      ...newMedicine,
                      category: event.target.value,
                    })
                  }
                  placeholder="e.g. Pain Relief"
                />
              </label>

              <label>
                Stock quantity
                <input
                  required
                  type="number"
                  min="0"
                  value={newMedicine.stock}
                  onChange={(event) =>
                    setNewMedicine({
                      ...newMedicine,
                      stock: event.target.value,
                    })
                  }
                  placeholder="0"
                />
              </label>

              <label>
                Price (Rs.)
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={newMedicine.price}
                  onChange={(event) =>
                    setNewMedicine({
                      ...newMedicine,
                      price: event.target.value,
                    })
                  }
                  placeholder="0.00"
                />
              </label>
            </div>

            <button type="submit" className="dash-primary-button">
              Save Medicine
            </button>
          </form>
        )}

        <div className="dash-table-card">
          <div className="dash-table-toolbar">
            <div>
              <h3>All Medicines</h3>
              <span>{filteredMedicines.length} items shown</span>
            </div>

            <div className="dash-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search medicines..."
              />
            </div>
          </div>

          <div className="dash-table-scroll">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Adjust stock</th>
                </tr>
              </thead>

              <tbody>
                {filteredMedicines.map((medicine) => (
                  <tr key={medicine.id}>
                    <td>
                      <div className="dash-medicine-name">
                        <span className="dash-medicine-icon">
                          <Pill size={18} />
                        </span>
                        <strong>{medicine.name}</strong>
                      </div>
                    </td>
                    <td>{medicine.category}</td>
                    <td>{medicine.stock} units</td>
                    <td>Rs. {medicine.price.toFixed(2)}</td>
                    <td>
                      <span
                        className={`dash-status ${
                          medicine.status === "In Stock"
                            ? "status-success"
                            : medicine.status === "Low Stock"
                              ? "status-warning"
                              : "status-danger"
                        }`}
                      >
                        {medicine.status}
                      </span>
                    </td>
                    <td>
                      <div className="dash-stock-controls">
                        <button
                          type="button"
                          aria-label={`Decrease ${medicine.name} stock`}
                          onClick={() => changeStock(medicine.id, -1)}
                        >
                          −
                        </button>
                        <button
                          type="button"
                          aria-label={`Increase ${medicine.name} stock`}
                          onClick={() => changeStock(medicine.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredMedicines.length === 0 && (
                  <tr>
                    <td colSpan="6" className="dash-empty">
                      No medicines found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  function renderOrders() {
    return (
      <>
        <div className="dash-section-heading">
          <div>
            <h2>Orders</h2>
            <p>Review recent customer orders.</p>
          </div>
        </div>

        <div className="dash-table-card">
          <div className="dash-table-scroll">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Medicine</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {initialOrders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>{order.customer}</td>
                    <td>{order.medicine}</td>
                    <td>Rs. {order.amount}</td>
                    <td>
                      <span
                        className={`dash-status ${
                          order.status === "Completed"
                            ? "status-success"
                            : "status-warning"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  function renderProfile() {
    return (
      <div className="dash-profile-card">
        <div className="dash-profile-icon">
          <Building2 size={30} />
        </div>
        <h2>{pharmacyName}</h2>
        <p className="dash-profile-subtitle">
          Pharmacy owner account
        </p>

        <div className="dash-profile-detail">
          <Mail size={18} />
          <span>{user.email || "No email available"}</span>
        </div>

        <div className="dash-profile-detail">
          <UserRound size={18} />
          <span>{user.name || "Pharmacy owner"}</span>
        </div>

        <div className="dash-profile-detail">
          <CheckCircle2 size={18} />
          <span>Signed in as an approved pharmacy owner</span>
        </div>

        <p className="dash-profile-note">
          To add your pharmacy address and phone number, connect this
          page to your pharmacy registration API.
        </p>
      </div>
    );
  }

  function renderOverview() {
    return (
      <>
        <div className="dash-welcome">
          <div>
            <p className="dash-eyebrow">PHARMACY MANAGEMENT</p>
            <h2>Pharmacy Dashboard</h2>
            <p>
              Welcome back, {user.name || "Pharmacy Owner"}.
              Here is your pharmacy overview.
            </p>
          </div>

          <button
            className="dash-primary-button"
            onClick={() => {
              setActivePage("inventory");
              setShowAddForm(true);
            }}
          >
            <Plus size={17} />
            Add Medicine
          </button>
        </div>

        <div className="dash-stats-grid">
          <article className="dash-stat-card">
            <div className="dash-stat-top">
              <span>Total Medicines</span>
              <span className="dash-stat-icon icon-green">
                <Package size={20} />
              </span>
            </div>
            <h3>{medicines.length}</h3>
            <p>In your local inventory list</p>
          </article>

          <article className="dash-stat-card">
            <div className="dash-stat-top">
              <span>Low Stock</span>
              <span className="dash-stat-icon icon-orange">
                <AlertTriangle size={20} />
              </span>
            </div>
            <h3>{lowStock.length}</h3>
            <p>Medicines needing restocking</p>
          </article>

          <article className="dash-stat-card">
            <div className="dash-stat-top">
              <span>Pending Orders</span>
              <span className="dash-stat-icon icon-blue">
                <ShoppingCart size={20} />
              </span>
            </div>
            <h3>
              {initialOrders.filter(
                (order) => order.status === "Pending"
              ).length}
            </h3>
            <p>Orders awaiting action</p>
          </article>

          <article className="dash-stat-card">
            <div className="dash-stat-top">
              <span>Inventory Value</span>
              <span className="dash-stat-icon icon-purple">
                <TrendingUp size={20} />
              </span>
            </div>
            <h3>
              Rs.{" "}
              {medicines
                .reduce(
                  (total, medicine) =>
                    total + medicine.stock * medicine.price,
                  0
                )
                .toLocaleString("en-IN")}
            </h3>
            <p>Estimated stock value</p>
          </article>
        </div>

        <div className="dash-content-grid">
          <section className="dash-panel dash-inventory-panel">
            <div className="dash-panel-heading">
              <div>
                <h3>Medicine Inventory</h3>
                <p>Stock levels across your sample inventory</p>
              </div>

              <button
                className="dash-text-button"
                onClick={() => setActivePage("inventory")}
              >
                View all <ArrowUpRight size={16} />
              </button>
            </div>

            <div className="dash-table-scroll">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.slice(0, 5).map((medicine) => (
                    <tr key={medicine.id}>
                      <td>
                        <div className="dash-medicine-name">
                          <span className="dash-medicine-icon">
                            <Pill size={17} />
                          </span>
                          <strong>{medicine.name}</strong>
                        </div>
                      </td>
                      <td>{medicine.stock}</td>
                      <td>Rs. {medicine.price}</td>
                      <td>
                        <span
                          className={`dash-status ${
                            medicine.status === "In Stock"
                              ? "status-success"
                              : medicine.status === "Low Stock"
                                ? "status-warning"
                                : "status-danger"
                          }`}
                        >
                          {medicine.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="dash-panel dash-alert-panel">
            <div className="dash-panel-heading">
              <div>
                <h3>Stock Alerts</h3>
                <p>Review medicines that need attention</p>
              </div>
              <AlertTriangle size={20} className="dash-alert-heading-icon" />
            </div>

            {lowStock.length === 0 && outOfStock.length === 0 ? (
              <p className="dash-empty">All stock levels look good.</p>
            ) : (
              [...lowStock, ...outOfStock].map((medicine) => (
                <div className="dash-alert-item" key={medicine.id}>
                  <span className="dash-alert-icon">
                    <AlertTriangle size={17} />
                  </span>
                  <div className="dash-alert-info">
                    <strong>{medicine.name}</strong>
                    <span>
                      {medicine.stock === 0
                        ? "Out of stock"
                        : `Only ${medicine.stock} units remaining`}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="dash-restock-button"
                    onClick={() => {
                      setActivePage("inventory");
                      setSearch(medicine.name);
                    }}
                  >
                    Review
                  </button>
                </div>
              ))
            )}

            <button
              className="dash-secondary-button"
              onClick={() => setActivePage("inventory")}
            >
              Manage inventory
            </button>
          </section>
        </div>

        <section className="dash-panel dash-orders-panel">
          <div className="dash-panel-heading">
            <div>
              <h3>Recent Orders</h3>
              <p>Example orders for the dashboard layout</p>
            </div>

            <button
              className="dash-text-button"
              onClick={() => setActivePage("orders")}
            >
              View orders <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="dash-table-scroll">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Medicine</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {initialOrders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>{order.customer}</td>
                    <td>{order.medicine}</td>
                    <td>Rs. {order.amount}</td>
                    <td>
                      <span
                        className={`dash-status ${
                          order.status === "Completed"
                            ? "status-success"
                            : "status-warning"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  }

  function renderPage() {
    switch (activePage) {
      case "inventory":
        return renderInventory();
      case "orders":
      case "reservations":
        return renderOrders();
      case "profile":
        return renderProfile();
      case "settings":
        return (
          <section className="dash-panel dash-placeholder">
            <Settings size={34} />
            <h2>Settings</h2>
            <p>Account and notification settings can be added here.</p>
          </section>
        );
      default:
        return renderOverview();
    }
  }

  return (
    <div className="pharmacy-dashboard">
      {sidebarOpen && (
        <button
          className="dash-mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`dash-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Link to="/" className="dash-brand">
          <span className="dash-brand-icon">
            <Cross size={24} strokeWidth={3} />
          </span>
          <span>
            pharma<span>.</span>
            <small>PHARMACY PORTAL</small>
          </span>
        </Link>

        <div className="dash-sidebar-label">WORKSPACE</div>

        <nav className="dash-sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.page}
                type="button"
                className={`dash-nav-item ${
                  activePage === item.page ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.page);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {item.page === "inventory" && (
                  <span className="dash-nav-count">
                    {medicines.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-help-card">
            <span className="dash-help-icon">
              <Building2 size={20} />
            </span>
            <strong>Need assistance?</strong>
            <p>Manage your pharmacy account and inventory.</p>
            <button onClick={() => setActivePage("settings")}>
              Open settings <ArrowUpRight size={15} />
            </button>
          </div>

          <button className="dash-logout-button" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-topbar">
          <button
            className="dash-mobile-menu"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="dash-breadcrumb">
            <span>Pharma</span>
            <span>/</span>
            <strong>
              {navigation.find((item) => item.page === activePage)?.label ||
                "Overview"}
            </strong>
          </div>

          <div className="dash-topbar-right">
            <span className="dash-live-indicator">
              <span />
              Pharmacy portal
            </span>

            <button
              className="dash-notification-button"
              aria-label="View stock alerts"
              onClick={() => setActivePage("inventory")}
            >
              <Bell size={19} />
              {(lowStock.length + outOfStock.length) > 0 && (
                <span className="dash-notification-dot" />
              )}
            </button>

            <div className="dash-topbar-user">
              <span className="dash-avatar">
                {(user.name || "P").charAt(0).toUpperCase()}
              </span>
              <div>
                <strong>{user.name || "Pharmacy Owner"}</strong>
                <small>Pharmacy Owner</small>
              </div>
            </div>
          </div>
        </header>

        <div className="dash-page-content">
          {renderPage()}

          <footer className="dash-footer">
            <span>© {new Date().getFullYear()} Pharma</span>
            <span>Pharmacy management portal</span>
          </footer>
        </div>
      </main>
    </div>
  );
}