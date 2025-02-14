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
  "Smart plug Fan Downstairs Socket 1",
  "Reception Smart Light",
  "หลอดไฟ Tuya 16 ล้านสี",
  // "asron",
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

// เปิด/ปิดอุปกรณ์
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

// เปลี่ยนสีของหลอดไฟ
export const setLightColor = async (entityId, rgbColor = null, colorTemp = null) => {
  try {
    const data = {};
    if (rgbColor) {
      data["rgb_color"] = rgbColor;
    }
    if (colorTemp) {
      data["color_temp"] = colorTemp;
    }
    await apiClient.post(`/services/light/turn_on`, {
      entity_id: entityId,
      ...data,
    });
  } catch (error) {
    console.error("Error setting light color:", error);
    throw error;
  }
};
