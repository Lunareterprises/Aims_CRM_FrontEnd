


import React, { useState } from 'react';
import { Card, Dropdown, Button, Row, Col, Table } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaRupeeSign, FaUniversity } from 'react-icons/fa';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faBank } from "@fortawesome/free-solid-svg-icons";

  import '../Banking/Banking.css'
const Bankingdashboard = () => {
  const [showChart, setShowChart] = useState(true);

  const toggleChart = () => setShowChart(!showChart);

  const data = {
    labels: ['05 Jan', '07 Jan', '09 Jan', '11 Jan', '13 Jan', '15 Jan', '17 Jan', '19 Jan', '21 Jan', '23 Jan', '25 Jan', '27 Jan', '29 Jan', '31 Jan', '01 Feb', '03 Feb'],
    datasets: [
      {
        label: 'Cash In Hand',
        data: Array(16).fill(0),
        borderColor: '#6c757d',
        backgroundColor: '#6c757d',
        pointRadius: 5,
      },
      {
        label: 'Bank Balance',
        data: Array(16).fill(0),
        borderColor: '#28a745',
        backgroundColor: '#28a745',
        pointRadius: 5,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `${value / 1000}K`
        }
      }
    }
  };


  const accounts = [
    { name: "Petty Cash", icon: faCamera, bankAmount: "Rs.0.00", zohoAmount: "Rs.0.00" },
    { name: "Undeposited Funds", icon: faCamera, bankAmount: "Rs.0.00", zohoAmount: "Rs.0.00" },
    { name: "AIMS Payroll - Bank Account", icon: faBank, bankAmount: "Rs.0.00", zohoAmount: "Rs.0.00" },
  ];

  return (

    <>
    
 


 
 
    <Card className="p-3 shadow-sm rounded mb-5">

      {/* <Row className="mb-3 gx-2"> */}
      <div className='spacemanger'>

        {/* <Col xs={6}> */}
        <div>
          <Dropdown>
            <Dropdown.Toggle variant="light" className="">
              All Accounts
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Account 1</Dropdown.Item>
              <Dropdown.Item>Account 2</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </div>
        {/* </Col> */}
        {/* <Col xs={6}> */}
        <div>

          <Dropdown>
            <Dropdown.Toggle variant="light" className="">
              Last 30 days
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Last 7 days</Dropdown.Item>
              <Dropdown.Item>Last 30 days</Dropdown.Item>
              <Dropdown.Item>Last 90 days</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
            </div>
        {/* </Col> */}
      </div>

      {/* </Row> */}

      <Row className="text-center mb-4">
        <Col xs={6} className="mb-3 mb-md-0">
          <div className="bg-light p-3 rounded-circle mx-auto" style={{ width: '60px', height: '60px' }}>
            <FaRupeeSign size={28} className="text-secondary" />
          </div>
          <h6 className="mt-2">Cash In Hand</h6>
          <h5>Rs.0.00</h5>
        </Col>

        <Col xs={6}>
          <div className="bg-light p-3 rounded-circle mx-auto" style={{ width: '60px', height: '60px' }}>
            <FaUniversity size={28} className="text-success" />
          </div>
          <h6 className="mt-2">Bank Balance</h6>
          <h5>Rs.0.00</h5>
        </Col>
      </Row>

      <Button variant="link" className="text-decoration-none" onClick={toggleChart}>
        {showChart ? 'Hide Chart ▲' : 'Show Chart ▼'}
      </Button>

      {showChart && (
        <div style={{ height: '300px' }}>
          <Line data={data} options={options} />
        </div>
      )}
    </Card>

    <div className="container mt-4">
      <h5>Active Accounts</h5>
      <Table striped bordered responsive hover className="account-table">
        <thead>
          <tr>
            <th>ACCOUNT DETAILS</th>
            <th>UNCATEGORIZED</th>
            <th>PENDING CHECKS</th>
            <th>AMOUNT IN BANK</th>
            <th>AMOUNT IN AIMS BOOKS</th>
            <th>ACTION</th>

          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={index}>
              <td>
                <FontAwesomeIcon icon={account.icon} className="me-2 ms-3" />
                {account.name}
              </td>
              <td> </td>
              <td> </td>
              <td>{account.bankAmount}</td>
              <td>{account.zohoAmount}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="link" className="action-btn">
                    &#x25BC;
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Edit Account</Dropdown.Item>
                    <Dropdown.Item>View Transactions</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </>

  );
};

export default Bankingdashboard;

