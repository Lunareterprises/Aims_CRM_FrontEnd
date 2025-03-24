import React, { useState } from 'react';
import { Dropdown, DropdownButton, Card, Row, Col } from 'react-bootstrap';
import { ProgressBar } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import '../DashboardComponents/DashboardComponents.css';

const Expensiveandprofit = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  

  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: [2000, 1800, 3000, 3500, 4000, 4500, 5000, 4800, 4700, 4900, 5100, 5300],
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
      {
        label: 'Monthly Losses',
        data: [1000, 1200, 1500, 1700, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600],
        fill: false,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-1">
      <Row>
        {/* Total Receivables */}
        <Col md={6} className="p-3">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h5>Income and Expensive</h5>
                <DropdownButton
                  title={
                    <>
                      <i className="fas fa-calendar me-2"></i> Select Month
                    </>
                  }
                  align="end"
                  size="sm"
                  className="shadow-none"
                  id="receivables-dropdown"
                >
                  <Dropdown.Item>New Invoice</Dropdown.Item>
                  <Dropdown.Item>New Payment</Dropdown.Item>
                  <Dropdown.Item>New Recurring Invoice</Dropdown.Item>
                </DropdownButton>
              </div>
              <p className="text-muted">Total Unpaid Invoices Rs.0.00</p>
              <ProgressBar now={60} label="60%" variant="success" className="custom-progress-bar mb-2" />
              <div style={{ height: '200px' }}>
                <Line data={lineChartData} options={chartOptions} />
              </div>
              <div className="d-flex justify-content-between mt-3">
                <div className="leftborder col-6">
                  <span className="text-primary">Total Income</span>
                  <h4>Rs.0.00</h4>
                </div>
                <div>
                  <span className="text-danger">Total Expensive</span>
                  <h4>Rs.0.00</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Payables */}
        <Col md={6} className="p-3">
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h5>Total Payables</h5>
                <DropdownButton
                  title={
                    <>
                      <i className="fas fa-calendar me-2"></i> Select Month
                    </>
                  }
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
              <p className="text-muted">Total Unpaid Bills Rs.0.00</p>
              <ProgressBar now={60} label="60%" variant="success" className="custom-progress-bar mb-2" />

              <div style={{ height: '200px' }}>
                <Line data={lineChartData} options={chartOptions} />
              </div>
              <div className="d-flex justify-content-between">
                <div className="leftborder col-6">
                  <span className="text-primary">CURRENT</span>
                  <h4>Rs.0.00</h4>
                </div>
                <div>
                  <span className="text-danger">OVERDUE</span>
                  <h4>Rs.0.00</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

     
      </Row>
    </div>
  );
};

export default Expensiveandprofit;
