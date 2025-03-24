import React, { useEffect, useState } from "react";
import { Dropdown, DropdownButton, Card, Row, Col } from "react-bootstrap";
import "../DashboardComponents/DashboardComponents.css";
import { ProgressBar } from "react-bootstrap";
import axios from "axios";
const TotalReceivablesPayables = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const user_id = sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("token");

  const [payables, setPayables] = useState([]);

  useEffect(() => {
    Apipayables();
  }, []);

  const Apipayables = async () => {
    try {
      const tokencheck = sessionStorage.getItem("token");
      console.log(token, "insidelist");
      const response = await axios.get(
        "https://lunarsenterprises.com:5016/crm/dashboard",

        {
          headers: {
            Authorization: `Bearer ${tokencheck}`,
          },
        }
      );

      if (response.data.result == true) {
        setPayables(response.data.data);
        console.log(response.data.data, "response.data.data");
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching dash:", error);
    }
  };

 const recievableData = payables?.recievableData || {};
const receivableDue = recievableData.dueTotal || 0;
const receivableTotal = recievableData.currentTotal || 0;

const totalRecievable = recievableData.totalRecievable || 0;
const currentRecievedCount = recievableData.currentRecievedCount || 0;

const receivablePercentage = receivableTotal > 0 ? ((totalRecievable / currentRecievedCount) * 100).toFixed(2) : 0;

const payableData = payables?.payableData || {};
const payableTotal = payableData.currentTotal || 0;
const payableDue = payableData.dueTotal || 0;

const totalRecievablpayable = payableData.totalRecievable || 0;
const currentRecievedCountpay = payableData.currentRecievedCount || 0;


const payablePercentage = payableTotal > 0 ? (( currentRecievedCountpay / totalRecievablpayable) * 100).toFixed(2) : 0;


  return (
    <div className="p-1">
      <Row>
        {/* Total Receivables */}
        <Col md={6} className="p-3">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h5>Total Receivables</h5>
                <DropdownButton
                  title={
                    <>
                      <i className="fas fa-plus me-2"></i> New
                    </>
                  }
                  //   variant="link"
                  align="end"
                  size="sm"
                  className="shadow-none "
                  id="receivables-dropdown"
                >
                  <Dropdown.Item>New Invoice</Dropdown.Item>
                  <Dropdown.Item>New Payment</Dropdown.Item>
                  <Dropdown.Item>New Recurring Invoice</Dropdown.Item>
                </DropdownButton>
              </div>
              <p className="text-muted">Total Unpaid Invoices Rs.0.00</p>
              <ProgressBar now={receivablePercentage} label={`${receivablePercentage}%`}
                variant="success"
                className="custom-progress-bar mb-2"
              />
              <div className="d-flex justify-content-between">
                <div>
                  <span className="text-primary">CURRENT</span>
                  <h4>Rs.{receivableTotal}</h4>
                </div>
                <div>
                  <span className="text-danger">OVERDUE ({receivablePercentage}%)</span>
                  <h4>Rs.{receivableDue}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Payables */}
        <Col md={6} className="p-3">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex  justify-content-between align-items-center">
                <h5>Total Payables</h5>
                <DropdownButton
                  title={
                    <>
                      <i className="fas fa-plus me-2"></i> New
                    </>
                  }
                  //   variant="link"
                  align="end"
                  size="sm"
                  className="shadow-none"
                  id="payables-dropdown"
                >
                  <Dropdown.Item>New Bill</Dropdown.Item>
                  <Dropdown.Item>New Vendor Payment</Dropdown.Item>
                  <Dropdown.Item>New Recurring Bill</Dropdown.Item>
                </DropdownButton>
              </div>
              <p className="text-muted">Total Unpaid Bills Rs.{payableTotal}</p>
              <ProgressBar now={payablePercentage} label={`${payablePercentage}%`}
                variant="success"
                className="custom-progress-bar mb-2"
              />

              <div className="d-flex justify-content-between">
                <div>
                  <span className="text-primary">CURRENT</span>
                  <h4>Rs.{payableData.currentTotal || 0}</h4>
                </div>
                <div>
                  <span className="text-danger">OVERDUE</span>
                  <h4>Rs.{payableData.dueTotal || "N/A"}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TotalReceivablesPayables;
