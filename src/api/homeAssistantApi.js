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
export const setLightColor = async (entityId, color = null, colorTemp = null) => {
  try {
    const data = {};

    // ตรวจสอบโหมดสี
    const entity = await fetchDeviceStatus(entityId); // ดึงข้อมูลสถานะของ entity
    const colorMode = entity.attributes.color_mode;

    if (colorMode === 'hs' && color) {
      // ใช้ hs_color หากโหมดสีเป็น hs
      data["hs_color"] = color; // ส่งค่า hs_color (hue, saturation)
    } else if (colorTemp) {
      // ใช้ color_temp หากโหมดสีเป็น color_temp
      data["color_temp"] = colorTemp;
    } else if (color) {
      // ถ้าเป็น rgb_color ให้ส่ง rgb_color
      data["rgb_color"] = color;
    }

    console.log("Sending data:", data); // log ข้อมูลที่ส่งไป

    const response = await apiClient.post(`/services/light/turn_on`, {
      entity_id: entityId,
      ...data,
    });

    console.log("API response:", response.data); // log ข้อมูลตอบกลับจาก API
  } catch (error) {
    console.error("Error setting light color:", error);
    throw error;
  }
};
// ฟังก์ชันดึงข้อมูลจาก Logbook
export const fetchLogbook = async () => {
  try {
    const response = await apiClient.get("/logbook");
    
    // Log the response data to the console
    console.log("Logbook data fetched:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching logbook data:", error);
    throw error;
  }
};


// ฟังก์ชันสำหรับการดึงข้อมูลเกี่ยวกับสถานะของอุปกรณ์
export const fetchDeviceStatus = async (entityId) => {
  try {
    const response = await apiClient.get(`/states/${entityId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching status for ${entityId}:`, error);
    throw error;
  }
};

// ฟังก์ชันเปลี่ยนสถานะของอุปกรณ์ (เปิด/ปิด)
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
