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
      setSelectedColor((prev) => ({ ...prev, [entity.entity_id]: color }));
      await setLightColor(entity.entity_id, color);
    } catch (error) {
      console.error("Failed to change light color:", entity.entity_id);
    }
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
            // ถ้าเป็น door sensor ให้แสดงแค่สถานะ
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
                      สถานะ: <strong>{entity.state === "on" ? "เปิด" : "ปิด"}</strong>
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
                    สถานะ: <strong>{entity.state === "on" ? "เปิด" : "ปิด"}</strong>
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
                            onChange={(color) =>
                              handleColorChange(entity, color.hex)
                            }
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
