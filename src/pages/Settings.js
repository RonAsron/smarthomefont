import React, { useState, useEffect } from "react";
import { fetchEntities } from "../api/homeAssistantApi";
import { Checkbox, Button, Typography, Row, Col, Spin, message } from "antd";

const { Title } = Typography;

const Settings = ({ onEntitiesSelected }) => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntities, setSelectedEntities] = useState([]);

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

    getEntities();
  }, []);

  const handleSelectEntity = (entityId) => {
    setSelectedEntities((prevSelected) =>
      prevSelected.includes(entityId)
        ? prevSelected.filter((id) => id !== entityId)
        : [...prevSelected, entityId]
    );
  };

  const handleSaveSelection = () => {
    // ตรวจสอบว่ามีการเลือกอุปกรณ์หรือไม่
    if (selectedEntities.length === 0) {
      message.warning("กรุณาเลือกอุปกรณ์ที่ต้องการแสดงก่อน");
      return;
    }

    // ตรวจสอบว่า onEntitiesSelected คือฟังก์ชัน
    if (typeof onEntitiesSelected === "function") {
      onEntitiesSelected(selectedEntities);
    } else {
      console.error("onEntitiesSelected is not a function.");
      message.error("เกิดข้อผิดพลาดในการบันทึกการเลือกอุปกรณ์");
    }
  };

  return (
    <div style={{ padding: "30px", background: "#E3F2FD", minHeight: "100vh" }}>
      <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
        🔧 Settings
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
        <div style={{ textAlign: "center" }}>
          <Title level={4}>เลือกอุปกรณ์ที่ต้องการแสดง</Title>
          <Row gutter={[16, 16]} justify="center">
            {entities.map((entity) => (
              <Col key={entity.entity_id} xs={24} sm={12} md={8} lg={6}>
                <Checkbox
                  checked={selectedEntities.includes(entity.entity_id)}
                  onChange={() => handleSelectEntity(entity.entity_id)}
                >
                  {entity.attributes.friendly_name}
                </Checkbox>
              </Col>
            ))}
          </Row>

          <Button
            type="primary"
            shape="round"
            size="large"
            onClick={handleSaveSelection}
            style={{ marginTop: "20px" }}
          >
            บันทึกการเลือก
          </Button>
        </div>
      )}
    </div>
  );
};

export default Settings;
