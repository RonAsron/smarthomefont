import React, { useState, useEffect } from "react";
import {
  fetchEntities,
  toggleDevice,
  setLightColor,
} from "../api/homeAssistantApi";
import { Card, Button, Typography, Spin, Row, Col, Modal, Slider } from "antd";
import {
  BulbOutlined,
  BgColorsOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Wheel } from "@uiw/react-color";

const { Title } = Typography;

const Dashboard = () => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState({});
  const [colorTemp, setColorTemp] = useState({});
  const [modalVisible, setModalVisible] = useState(null);

  useEffect(() => {
    const getEntities = async () => {
      try {
        const data = await fetchEntities();
        setEntities(data);
      } catch {
        console.error("ไม่สามารถดึงข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    // เรียกใช้ getEntities ทุกๆ 10 วินาที (หรือเวลาอื่นตามต้องการ)
    const intervalId = setInterval(getEntities, 10000); // 10 วินาที

    // เรียก getEntities ครั้งแรกเมื่อ component โหลด
    getEntities();

    // ล้างการตั้งค่า interval เมื่อ component ถูกทำลาย
    return () => clearInterval(intervalId);
  }, []);

  const handleToggle = async (entity) => {
    try {
      const newState = await toggleDevice(
        entity.entity_id,
        entity.state === "on"
      );
      setEntities((prevEntities) =>
        prevEntities.map((e) =>
          e.entity_id === entity.entity_id
            ? { ...e, state: newState ? "on" : "off" }
            : e
        )
      );
    } catch (error) {
      console.error("Failed to toggle entity:", entity.entity_id);
    }
  };

  const handleColorChange = async (entity, color) => {
    try {
      // ตรวจสอบว่า color.hex มีค่า
      if (!color || !color.hex) {
        throw new Error("Color hex is undefined.");
      }

      console.log("Setting color to:", color.hex); // log สีที่ส่งไป

      // แปลงสีจาก hex เป็น hs (hue, saturation)
      const hsColor = hexToHs(color.hex); 
      console.log("Converted HS color:", hsColor); // log ค่า HS ที่แปลงแล้ว

      // ตั้งค่า selectedColor
      setSelectedColor((prev) => ({ ...prev, [entity.entity_id]: color.hex }));

      // ส่งค่า hs_color ไปยัง setLightColor
      await setLightColor(entity.entity_id, hsColor);
    } catch (error) {
      console.error("Failed to change light color:", entity.entity_id);
      console.error("Error details:", error.message); // log ข้อความ error
    }
  };

  // ฟังก์ชันแปลง Hex เป็น HS
  const hexToHs = (hex) => {
    const rgb = hexToRgb(hex);
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    let v = max;

    const delta = max - min;
    if (max !== 0) {
      s = delta / max;
    }
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / delta;
          if (g < b) h += 6;
          break;
        case g:
          h = (b - r) / delta + 2;
          break;
        case b:
          h = (r - g) / delta + 4;
          break;
      }
      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);

    return [h, s];
  };

  const hexToRgb = (hex) => {
    const result = /^#([a-fA-F0-9]{6})$/.exec(hex);
    if (!result) {
      return null;
    }
    return [
      parseInt(result[1].substring(0, 2), 16),
      parseInt(result[1].substring(2, 4), 16),
      parseInt(result[1].substring(4, 6), 16),
    ];
  };

  const handleColorTempChange = async (entity, temp) => {
    try {
      setColorTemp((prev) => ({ ...prev, [entity.entity_id]: temp }));
      await setLightColor(entity.entity_id, null, temp);
    } catch (error) {
      console.error("Failed to change light color temp:", entity.entity_id);
    }
  };

  return (
    <div style={{ padding: "30px", background: "#E3F2FD", minHeight: "100vh" }}>
      <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
        🏠 Smart Home Dashboard
      </Title>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {entities.map((entity) => {
            if (entity.entity_id === "binary_sensor.door_sensor_door") {
              return (
                <Col key={entity.entity_id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: "12px",
                      background: entity.state === "on" ? "#E1F5FE" : "#FAFAFA",
                      textAlign: "center",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      minHeight: "250px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "15px",
                    }}
                  >
                    <Title level={4} style={{ color: "#1565C0" }}>
                      {entity.attributes.friendly_name}
                    </Title>

                    <PoweroffOutlined
                      style={{
                        fontSize: "40px",
                        color: entity.state === "on" ? "#FFD700" : "#BDBDBD",
                      }}
                    />

                    <p
                      style={{
                        fontSize: "16px",
                        marginTop: "10px",
                        color: "#424242",
                      }}
                    >
                    </p>
                  </Card>
                </Col>
              );
            }

            // สำหรับอุปกรณ์ประเภทอื่นๆ
            const supportsColorTemp =
              entity.entity_id.startsWith("light.") &&
              entity.attributes.supported_color_modes?.includes("color_temp");

            return (
              <Col key={entity.entity_id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  style={{
                    borderRadius: "12px",
                    background: entity.state === "on" ? "#E1F5FE" : "#FAFAFA",
                    textAlign: "center",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    minHeight: supportsColorTemp ? "350px" : "250px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "15px",
                  }}
                >
                  <Title level={4} style={{ color: "#1565C0" }}>
                    {entity.attributes.friendly_name}
                  </Title>

                  <BulbOutlined
                    style={{
                      fontSize: "40px",
                      color:
                        entity.state === "on"
                          ? selectedColor[entity.entity_id] || "#FFD700"
                          : "#BDBDBD",
                    }}
                  />

                  <p
                    style={{
                      fontSize: "16px",
                      marginTop: "10px",
                      color: "#424242",
                    }}
                  >
                  </p>

                  <Button
                    type={entity.state === "on" ? "danger" : "primary"}
                    shape="round"
                    icon={<PoweroffOutlined />}
                    size="large"
                    style={{ marginTop: "10px", width: "100%" }}
                    onClick={() => handleToggle(entity)}
                  >
                    {entity.state === "on" ? "ปิด" : "เปิด"}
                  </Button>

                  {supportsColorTemp && (
                    <>
                      <Button
                        shape="circle"
                        icon={<BgColorsOutlined />}
                        size="large"
                        style={{
                          marginTop: "10px",
                          background: selectedColor[entity.entity_id] || "#fff",
                          color: "#000",
                          width: "50px",
                          height: "50px",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => setModalVisible(entity.entity_id)}
                      />

                      <Modal
                        title="เลือกสีและอุณหภูมิ"
                        open={modalVisible === entity.entity_id}
                        onCancel={() => setModalVisible(null)}
                        footer={null}
                        centered
                        width={300}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Wheel
                            color={selectedColor[entity.entity_id] || "#ffffff"}

                            onChange={(color) => {
                              console.log("Color changed to:", color.hex); // log เพื่อให้แน่ใจว่า color.hex มีค่า
                              handleColorChange(entity, color);
                            }}
                            size={180}
                          />
                        </div>

                        <p
                          style={{
                            marginTop: "10px",
                            textAlign: "center",
                            fontSize: "14px",
                          }}
                        >
                          อุณหภูมิสี (K)
                        </p>
                        <Slider
                          min={2000}
                          max={6500}
                          step={100}
                          value={colorTemp[entity.entity_id] || 4000}
                          onChange={(temp) =>
                            handleColorTempChange(entity, temp)
                          }
                          style={{
                            width: "90%",
                            margin: "0 auto",
                            display: "block",
                          }}
                        />
                      </Modal>
                    </>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
