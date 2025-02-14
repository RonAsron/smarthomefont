// src/utils/auth.js
export const isLoggedIn = () => {
    const token = localStorage.getItem('authToken'); // เช็ค token หรือข้อมูลที่ใช้ในการตรวจสอบการล็อกอิน
    return token !== null; // ถ้ามี token แสดงว่า user ล็อกอินแล้ว
  };
  