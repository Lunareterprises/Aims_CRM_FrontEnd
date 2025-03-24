import React, { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Dropdown, Card, ListGroup, Badge, Col, Row } from 'react-bootstrap'
import '../../components/AppHeader.css' // For custom styles if needed

const StructureChart = () => {
  const [sortByOverview, setSortByOverview] = useState('Current Week') // State for dropdown selection

  const Overview = [
    {
      title: 'Clients Added',
      value: 197,
      percentage: '1.15%',
      color: '#007bff', // Blue
      trend: 'up',
    },
    {
      title: 'Contracts Signed',
      value: 634,
      percentage: '1.15%',
      color: '#dc3545', // Red
      trend: 'down',
    },
    {
      title: 'Invoice Sent',
      value: 512,
      percentage: '3.14%',
      color: '#007bff', // Blue
      trend: 'up',
    },
  ]

  const handleSortChangeOverview = (e) => {
    setSortBy(e.target.value)
  }

  const data = [
    { name: 'Invoiced', value: 56.3 },
    { name: 'Collected', value: 25.4 },
    { name: 'Outstanding', value: 18.3 },
  ]

  const COLORS = ['#4CAF50', '#8BC34A', '#C8E6C9'] // Colors for the chart segments

  const [activeIndex, setActiveIndex] = useState(null)
  const [sortBy, setSortBy] = useState('Weekly') // State to track the selected option

  const onPieEnter = (_, index) => {
    setActiveIndex(index) // Highlight the hovered segment
  }

  const onPieLeave = () => {
    setActiveIndex(null) // Reset highlight when hover ends
  }

  const handleSortChange = (event) => {
    setSortBy(event.target.value) // Update the selected sort option
  }

  const transactions = [
    {
      category: 'Recent',
      items: [
        {
          icon: 'paypal',
          title: 'Salary',
          date: '20 Sep, 2022',
          amount: '+$500.00',
          positive: true,
        },
        {
          icon: 'shopping-bag',
          title: 'Online Shopping',
          date: '28 Mar, 2022',
          amount: '-$120.45',
          positive: false,
        },
      ],
    },
    {
      category: 'Yesterday',
      items: [
        {
          icon: 'wrench',
          title: 'Maintenance',
          date: '18 Sep, 2022',
          amount: '+$25.52',
          positive: true,
        },
        {
          icon: 'bus',
          title: 'Bus Booking',
          date: '30 Nov, 2022',
          amount: '-$84.45',
          positive: false,
        },
        {
          icon: 'paper-plane',
          title: 'Flight Booking',
          date: '12 Feb, 2022',
          amount: '+$53.23',
          positive: true,
        },
        {
          icon: 'building',
          title: 'Office Rent',
          date: '12 Apr, 2022',
          amount: '+$42.63',
          positive: true,
        },
      ],
    },
  ]

  const [filter, setFilter] = useState('Today')

  return (
    <>
      <div
        style={{
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h4 style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>This Week's Overview</h4>
          <div>
            <select
              value={sortByOverview}
              onChange={handleSortChangeOverview}
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '5px 10px',
                fontSize: '14px',
                color: '#666',
                backgroundColor: '#fff',
                outline: 'none',
              }}
            >
              <option value="Current Week">Current Week</option>
              <option value="Last Week">Last Week</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Data Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
          }}
        >
          {Overview.map((item, index) => (
            <div
              key={index}
              style={{
                textAlign: 'center',
                borderRight: index !== Overview.length - 1 ? '1px solid #e0e0e0' : 'none',
                padding: '0 10px',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontWeight: 'bold',
                  fontSize: '24px',
                  color: '#333',
                }}
              >
                {item.value}
              </h3>
              <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>{item.title}</p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '12px',
                    color: '#fff',
                    backgroundColor: item.color,
                    padding: '2px 8px',
                    borderRadius: '15px',
                  }}
                >
                  {item.percentage}
                </span>
                <span style={{ fontSize: '12px', color: '#666' }}>since last week</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Row>
        <Col lg={6} sm={12} className="mb-4">
          <div
            className="mb-4 mt-4"
            style={{
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              padding: '20px',
            //   width: '100%',
            //   maxWidth: '400px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Header Section */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h4 style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>Structure</h4>
              <div>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '5px 10px',
                    fontSize: '14px',
                    color: '#666',
                    backgroundColor: '#fff',
                    outline: 'none',
                  }}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>

            {/* Donut Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index]}
                      outerRadius={activeIndex === index ? 90 : 80} // Highlight on hover
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Details Section */}
            {data.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderTop: index !== 0 ? '1px solid #e0e0e0' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: COLORS[index],
                      borderRadius: '50%',
                    }}
                  ></div>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>{item.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', color: '#333', fontWeight: 'bold' }}>
                    {item.name === 'Invoiced'
                      ? '$56,236'
                      : item.name === 'Collected'
                        ? '$12,596'
                        : '$1,568'}
                  </span>
                  <span
                    style={{
                      color: index === 1 ? 'red' : 'green',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '14px',
                    }}
                  >
                    {index === 1 ? '-0.7%' : index === 0 ? '+0.2%' : '+0.4%'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Col>

        <Col lg={6} sm={12} className="mb-4 mt-4">
          <Card className="recent-transactions-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Transaction</h5>
              <div>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '5px 10px',
                    fontSize: '14px',
                    color: '#666',
                    backgroundColor: '#fff',
                    outline: 'none',
                  }}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </Card.Header>
            <Card.Body>
              {transactions.map((section, index) => (
                <div key={index} className="mb-3">
                  <h6 className="text-muted">{section.category}</h6>
                  <ListGroup variant="flush">
                    {section.items.map((item, idx) => (
                      <ListGroup.Item
                        key={idx}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center">
                          <i
                            className={`bi bi-${item.icon} me-3 text-primary`}
                            style={{ fontSize: '1.5rem' }}
                          ></i>
                          <div>
                            <div>{item.title}</div>
                            <small className="text-muted">{item.date}</small>
                          </div>
                        </div>
                        <Badge bg={item.positive ? 'success' : 'danger'}>{item.amount}</Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default StructureChart
