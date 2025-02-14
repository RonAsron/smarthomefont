import axios from 'axios';

const API_URL = "https://homeassistant.picsmart.space/api";

// Call the function to log the URL
logApiUrl();

export const registerUser = async (userData) => {
  try {

    const response = await axios.post(`${API_URL}/register/`, userData);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error.response?.data || error.message);
    throw new Error("Registration failed. Please try again.");
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`https://homeassistant.picsmart.space/api/login/`, credentials);
    console.log("Login response:", response.data);

    const { access, refresh } = response.data;
    if (access && refresh) {
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      return response.data;
    } else {
      throw new Error("Login failed. No tokens received.");
    }
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw new Error("Login failed. Please check your credentials.");
  }
};

const accessToken = localStorage.getItem("accessToken");
console.log(accessToken);  


export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  console.log("User logged out successfully.");
};

export const getUserProfile = async () => {
  try {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("No access token found. Please log in.");

    const response = await axios.get(`${API_URL}/user/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  } catch (error) {
    if (error.response?.data?.code === "token_not_valid") {
      console.log("Access token expired. Trying to refresh...");
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          const response = await axios.get(`${API_URL}/user/`, {
            headers: { Authorization: `Bearer ${newAccessToken}` },
          });
          return response.data;
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        logoutUser();
        throw new Error("Session expired. Please log in again.");
      }
    }
    throw new Error(error.response?.data?.detail || "Failed to fetch user profile.");
  }
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available.");

    const response = await axios.post(`${API_URL}/token/refresh/`, {
      refresh: refreshToken,
    });

    const { access } = response.data;
    localStorage.setItem("accessToken", access);
    return access;
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data || error.message);
    logoutUser();
    throw new Error("Session expired. Please log in again.");
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("No access token found. Please log in.");

    let data;
    let headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    if (userData.profile_picture && userData.profile_picture instanceof File) {
      data = new FormData();
      data.append("profile_picture", userData.profile_picture);
      headers["Content-Type"] = "multipart/form-data";
    } else {
      data = JSON.stringify({
        username: userData.username,
        email: userData.email,
        phone_number: userData.phone_number,
        date_of_birth: userData.date_of_birth,
        address: userData.address,
        profile_picture: userData.profile_picture,
      });
      headers["Content-Type"] = "application/json";
    }

    const response = await axios.put(`${API_URL}/user/`, data, { headers });

    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error.response?.data || error.message);
    throw new Error("Failed to update profile.");
  }
};
