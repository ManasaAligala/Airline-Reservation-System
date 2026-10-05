import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

    // =========================
    // DASHBOARD STATISTICS
    // =========================

    const [stats, setStats] = useState({
        users: 0,
        bookings: 0,
        passengers: 0,
        flights: 0,
        revenue: 0
    });

    const [statsLoading, setStatsLoading] = useState(true);

    // =========================
    // ADMIN MENU
    // =========================

    const adminMenu = [
        {
            title: "User Management",
            description: "View and manage registered users",
            path: "/admin/users"
        },
        {
            title: "Booking Management",
            description: "View and manage all bookings",
            path: "/admin/bookings"
        },
        {
            title: "Passenger Management",
            description: "View passenger information",
            path: "/admin/passengers"
        },
        {
            title: "Flight Management",
            description: "Manage flights and flight information",
            path: "/admin/flights"
        },
        {
            title: "Airport Management",
            description: "Manage airports",
            path: "/admin/airports"
        },
        {
            title: "Aircraft Management",
            description: "Manage aircraft",
            path: "/admin/aircraft"
        },
        {
            title: "Schedule Management",
            description: "Manage flight schedules",
            path: "/admin/schedules"
        },
        {
            title: "Pricing Management",
            description: "Manage flight ticket pricing",
            path: "/admin/pricing"
        },
        {
            title: "Reports",
            description: "Generate reservation reports",
            path: "/admin/reports"
        }
    ];

    // =========================
    // FETCH DASHBOARD STATISTICS
    // =========================

    useEffect(() => {

        const fetchStatistics = async () => {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("Admin token not found.");
                    setStatsLoading(false);
                    return;
                }

                const headers = {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                };

                const [
                    usersResponse,
                    bookingsResponse,
                    passengersResponse,
                    flightsResponse,
                    paymentsResponse
                ] = await Promise.all([
                    fetch("http://localhost:8080/api/users", {
                        method: "GET",
                        headers: headers
                    }),

                    fetch("http://localhost:8080/api/bookings", {
                        method: "GET",
                        headers: headers
                    }),

                    fetch("http://localhost:8080/api/passengers", {
                        method: "GET",
                        headers: headers
                    }),

                    fetch("http://localhost:8080/api/flights", {
                        method: "GET",
                        headers: headers
                    }),

                    fetch("http://localhost:8080/api/payments", {
                        method: "GET",
                        headers: headers
                    })
                ]);

                if (
                    !usersResponse.ok ||
                    !bookingsResponse.ok ||
                    !passengersResponse.ok ||
                    !flightsResponse.ok ||
                    !paymentsResponse.ok
                ) {
                    throw new Error("Failed to fetch dashboard statistics.");
                }

                const users = await usersResponse.json();
                const bookings = await bookingsResponse.json();
                const passengers = await passengersResponse.json();
                const flights = await flightsResponse.json();
                const payments = await paymentsResponse.json();

                // Calculate only successful payment revenue
                const revenue = payments
                    .filter(
                        payment =>
                            payment.paymentStatus === "SUCCESS"
                    )
                    .reduce(
                        (total, payment) =>
                            total + payment.amount,
                        0
                    );

                setStats({
                    users: users.length,
                    bookings: bookings.length,
                    passengers: passengers.length,
                    flights: flights.length,
                    revenue: revenue
                });

            } catch (error) {

                console.error(
                    "Error fetching dashboard statistics:",
                    error
                );

            } finally {

                setStatsLoading(false);

            }
        };

        fetchStatistics();

    }, []);

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    // =========================
    // DASHBOARD UI
    // =========================

    return (

        <div className="admin-dashboard">

            {/* =========================
                HEADER
            ========================= */}

            <header className="admin-header">

                <div>

                    <h1>
                        ✈️ Airline Reservation System
                    </h1>

                    <p>
                        Admin Dashboard
                    </p>

                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="admin-content">

                {/* Welcome Section */}

                <div className="welcome-section">

                    <h2>
                        Welcome, Administrator
                    </h2>

                    <p>
                        Manage users, bookings, flights, airports,
                        aircraft, schedules and reports from here.
                    </p>

                </div>


                {/* =========================
                    DASHBOARD STATISTICS
                ========================= */}

                <div className="statistics-section">

                    <h2>
                        Dashboard Statistics
                    </h2>

                    <div className="statistics-grid">

                        {/* Total Users */}

                        <div className="stat-card">

                            <h3>
                                Total Users
                            </h3>

                            <p>
                                {statsLoading
                                    ? "..."
                                    : stats.users
                                }
                            </p>

                        </div>


                        {/* Total Bookings */}

                        <div className="stat-card">

                            <h3>
                                Total Bookings
                            </h3>

                            <p>
                                {statsLoading
                                    ? "..."
                                    : stats.bookings
                                }
                            </p>

                        </div>


                        {/* Total Passengers */}

                        <div className="stat-card">

                            <h3>
                                Total Passengers
                            </h3>

                            <p>
                                {statsLoading
                                    ? "..."
                                    : stats.passengers
                                }
                            </p>

                        </div>


                        {/* Total Flights */}

                        <div className="stat-card">

                            <h3>
                                Total Flights
                            </h3>

                            <p>
                                {statsLoading
                                    ? "..."
                                    : stats.flights
                                }
                            </p>

                        </div>


                        {/* Total Revenue */}

                        <div className="stat-card">

                            <h3>
                                Total Revenue
                            </h3>

                            <p>
                                {statsLoading
                                    ? "..."
                                    : `₹${stats.revenue.toFixed(2)}`
                                }
                            </p>

                        </div>

                    </div>

                </div>


                {/* =========================
                    ADMIN MANAGEMENT MENU
                ========================= */}

                <div className="admin-menu">

                    {adminMenu.map((item) => (

                        <div
                            className="admin-card"
                            key={item.title}
                            onClick={() => navigate(item.path)}
                        >

                            <h3>
                                {item.title}
                            </h3>

                            <p>
                                {item.description}
                            </p>

                            <button>
                                Manage
                            </button>

                        </div>

                    ))}

                </div>

            </main>

        </div>
    );
}

export default AdminDashboard;