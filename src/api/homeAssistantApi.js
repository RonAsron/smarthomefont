import axios from "axios";

const API_BASE_URL = "http://localhost:8123/api";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1MzNkY2IyYmFmZTg0ZjRiODc2ZDAyNDMwNjljNDliNiIsImlhdCI6MTczOTA5NjI1MCwiZXhwIjoyMDU0NDU2MjUwfQ.Zlhmf_xVo97UvWwbz8VsNeErgTb33NjswIXzSHCdoTA";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    "Content-Type": "application/json",
  },
});

const ALLOWED_DEVICES = [
  "Reception Smart Light",
  "หลอดไฟ Tuya 16 ล้านสี",
  "Door Sensor Door",
  "WiFi smart plug Socket 1",
  "WIFIMCB Switch 1",
  "Switch 3 Gang Switch 1",
  "Switch 3 Gang Switch 2",
  "Switch 3 Gang Switch 3",
];

// ดึงเฉพาะอุปกรณ์ที่ต้องการ
export const fetchEntities = async () => {
  try {
    const response = await apiClient.get("/states");
    return response.data.filter(
      (entity) => ALLOWED_DEVICES.includes(entity.attributes.friendly_name)
    );
  } catch (error) {
    console.error("Error fetching entities:", error);
    throw error;
  }
};

export const toggleDevice = async (entityId, isOn) => {
  try {
    const newState = isOn ? "turn_off" : "turn_on";
    await apiClient.post(`/services/homeassistant/${newState}`, {
      entity_id: entityId,
    });
    return !isOn;
  } catch (error) {
    console.error("Error toggling device:", error);
    throw error;
  }
};
export const setLightColor = async (entityId, color = null, colorTemp = null) => {
  try {
    const data = {};
    const entity = await fetchDeviceStatus(entityId);
    const colorMode = entity.attributes.color_mode;

    if (colorMode === 'hs' && color) {
      data["hs_color"] = color;
    } else if (colorTemp) {
      data["color_temp"] = colorTemp;
    } else if (color) {
      data["rgb_color"] = color;
    }

    console.log("Sending data:", data);

    const response = await apiClient.post(`/services/light/turn_on`, {
      entity_id: entityId,
      ...data,
    });

    console.log("API response:", response.data);
  } catch (error) {
    console.error("Error setting light color:", error);
    throw error;
  }
};
export const fetchLogbook = async () => {
  try {
    const response = await apiClient.get("/logbook");
    console.log("Logbook data fetched:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching logbook data:", error);
    throw error;
  }
};


export const fetchDeviceStatus = async (entityId) => {
  try {
    const response = await apiClient.get(`/states/${entityId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching status for ${entityId}:`, error);
    throw error;
  }
};

export const changeDeviceState = async (entityId, state) => {
  try {
    await apiClient.post(`/services/homeassistant/turn_${state}`, {
      entity_id: entityId,
    });
    return state;
  } catch (error) {
    console.error(`Error changing state for ${entityId}:`, error);
    throw error;
  }
};
