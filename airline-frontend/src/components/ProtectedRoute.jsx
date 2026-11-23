
import { Navigate, Outlet, useLocation } from "react-router-dom";

function getUserRole(token) {
    try {
        const payload = token.split(".")[1];

        const decodedPayload = JSON.parse(
            atob(
                payload
                    .replace(/-/g, "+")
                    .replace(/_/g, "/")
            )
        );

        const role =
            decodedPayload.role ||
            decodedPayload.roles ||
            decodedPayload.authorities;

        if (Array.isArray(role)) {
            return role.map((item) =>
                typeof item === "string"
                    ? item.replace("ROLE_", "")
                    : item.authority?.replace("ROLE_", "")
            );
        }

        if (typeof role === "string") {
            return [role.replace("ROLE_", "")];
        }

        return [];
    } catch {
        return [];
    }
}

function ProtectedRoute({ allowedRoles }) {
    const location = useLocation();
    const token = localStorage.getItem("token");

    if (!token) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    if (allowedRoles) {
        const userRoles = getUserRole(token);

        const hasPermission = allowedRoles.some((role) =>
            userRoles.includes(role)
        );

        if (!hasPermission) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />;
}

export default ProtectedRoute;
