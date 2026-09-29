import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Load the logged-in user's profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (!token) {
        setError("Please log in to view your profile.");
        return;
      }

      const response = await axios.get(
        "http://localhost:8080/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data);

      setFormData({
        firstName: response.data.firstName || "",
        lastName: response.data.lastName || "",
        phoneNumber: response.data.phoneNumber || "",
      });
    } catch (err) {
      console.error("Profile loading error:", err);
      setError("Unable to load your profile. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile form changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save profile changes
  const handleUpdate = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await axios.put(
        "http://localhost:8080/api/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data);

      setFormData({
        firstName: response.data.firstName || "",
        lastName: response.data.lastName || "",
        phoneNumber: response.data.phoneNumber || "",
      });

      setEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to update profile. Please try again."
      );
    }
  };

  // Handle password form changes
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Change the logged-in user's password
  const handleChangePassword = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8080/api/users/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        typeof response.data === "string"
          ? response.data
          : "Password changed successfully!"
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setChangingPassword(false);
    } catch (err) {
      console.error("Password change error:", err);

      setError(
        err.response?.data?.message ||
          (typeof err.response?.data === "string"
            ? err.response.data
            : "Unable to change password. Check your current password and try again.")
      );
    }
  };

  if (loading) {
    return <h2>Loading profile...</h2>;
  }

  if (!profile) {
    return <h2>{error || "Profile information is unavailable."}</h2>;
  }

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "10px 18px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "8px",
    marginTop: "8px",
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "25px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>My Profile</h1>

      <hr />

      {message && (
        <p style={{ color: "green" }}>{message}</p>
      )}

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {/* Profile section */}
      {!editing ? (
        <>
          <p>
            <strong>First Name:</strong> {profile.firstName || "N/A"}
          </p>

          <p>
            <strong>Last Name:</strong> {profile.lastName || "N/A"}
          </p>

          <p>
            <strong>Email:</strong> {profile.email || "N/A"}
          </p>

          <p>
            <strong>Phone Number:</strong>{" "}
            {profile.phoneNumber || "N/A"}
          </p>

          <p>
            <strong>Role:</strong> {profile.role || "N/A"}
          </p>

          <button
            type="button"
            onClick={() => {
              setMessage("");
              setError("");
              setEditing(true);
            }}
            style={{
              ...buttonStyle,
              backgroundColor: "#007bff",
            }}
          >
            Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdate}>
          <h2>Edit Profile</h2>

          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              ...buttonStyle,
              backgroundColor: "green",
            }}
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                phoneNumber: profile.phoneNumber || "",
              });
              setEditing(false);
              setError("");
              setMessage("");
            }}
            style={{
              ...buttonStyle,
              backgroundColor: "gray",
            }}
          >
            Cancel
          </button>
        </form>
      )}

      <hr style={{ margin: "25px 0" }} />

      {/* Change password section */}
      {!changingPassword ? (
        <>
          <h2>Security</h2>

          <p>Keep your account secure by updating your password.</p>

          <button
            type="button"
            onClick={() => {
              setChangingPassword(true);
              setMessage("");
              setError("");
            }}
            style={{
              ...buttonStyle,
              backgroundColor: "#6c42a6",
            }}
          >
            Change Password
          </button>
        </>
      ) : (
        <form onSubmit={handleChangePassword}>
          <h2>Change Password</h2>

          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            required
            style={inputStyle}
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            autoComplete="new-password"
            minLength={8}
            required
            style={inputStyle}
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            autoComplete="new-password"
            minLength={8}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              ...buttonStyle,
              backgroundColor: "green",
            }}
          >
            Update Password
          </button>

          <button
            type="button"
            onClick={() => {
              setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
              setChangingPassword(false);
              setError("");
              setMessage("");
            }}
            style={{
              ...buttonStyle,
              backgroundColor: "gray",
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default Profile;