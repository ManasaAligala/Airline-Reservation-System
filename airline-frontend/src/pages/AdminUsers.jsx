import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminUsers.css";

function AdminUsers() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login as Admin.");
                setLoading(false);
                return;
            }

            const response = await fetch(
                "http://localhost:8080/api/users",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 401) {
                setError("Unauthorized. Please login again.");
                setLoading(false);
                return;
            }

            if (response.status === 403) {
                setError("Access denied. Admin access required.");
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();

            setUsers(data);
            setLoading(false);

        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Unable to load users.");
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/admin-dashboard");
    };

    return (
        <div className="admin-users">

            <header className="admin-users-header">

                <div>
                    <h1>✈️ Airline Reservation System</h1>
                    <p>User Management</p>
                </div>

                <button
                    className="back-button"
                    onClick={handleBack}
                >
                    ← Back to Dashboard
                </button>

            </header>

            <main className="admin-users-content">

                <div className="users-title-section">
                    <h2>Registered Users</h2>

                    <p>
                        View all users registered in the airline reservation system.
                    </p>
                </div>

                {loading && (
                    <p className="loading-message">
                        Loading users...
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <div className="users-table-container">

                        <table className="users-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Role</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="no-users"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id}>

                                            <td>{user.id}</td>

                                            <td>
                                                {user.firstName}
                                            </td>

                                            <td>
                                                {user.lastName}
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>
                                                {user.phoneNumber}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        user.role === "ADMIN"
                                                            ? "role-admin"
                                                            : "role-customer"
                                                    }
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                        </tr>
                                    ))
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </main>

        </div>
    );
}

export default AdminUsers;

