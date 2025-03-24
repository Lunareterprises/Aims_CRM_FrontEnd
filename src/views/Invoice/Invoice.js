import React, { useState } from 'react'
import { Table, Badge, Button, Collapse, Form, Pagination } from 'react-bootstrap'
import '../Generalledger/Generalledger.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoice, faPlus } from '@fortawesome/free-solid-svg-icons'
import AddInvoice from './AddInvoice'
const Invoice = () => {
  const [details, setDetails] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const items = [
    {
      id: 1,
      name: 'Samppa Nori',
      avatar: '1.jpg',
      registered: '2021-03-01',
      role: 'Member',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Estavan Lykos',
      avatar: '2.jpg',
      registered: '2018-02-07',
      role: 'Staff',
      status: 'Banned',
    },
    {
      id: 3,
      name: 'Chetan Mohamed',
      avatar: '3.jpg',
      registered: '2020-01-15',
      role: 'Admin',
      status: 'Inactive',
    },
    // Add more items as needed
  ]

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Active':
        return 'success'
      case 'Inactive':
        return 'secondary'
      case 'Pending':
        return 'warning'
      case 'Banned':
        return 'danger'
      default:
        return 'primary'
    }
  }

  const toggleDetails = (index) => {
    const position = details.indexOf(index)
    const newDetails = [...details]
    if (position !== -1) {
      newDetails.splice(position, 1)
    } else {
      newDetails.push(index)
    }
    setDetails(newDetails)
  }

  // Filtering logic for search, startDate, and endDate
  const filteredItems = items.filter((item) => {
    const itemDate = new Date(item.registered)
    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null

    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDateRange = (!start || itemDate >= start) && (!end || itemDate <= end)

    return matchesSearch && matchesDateRange
  })

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)




  const [showModal, setShowModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(null);

  const handleAddTarget = (empId) => {
    setSelectedEmpId(empId); // Set the selected employee ID
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmpId(null);
  };

  return (
    <div>
      <div className="mb-3">
        <button
        onClick={handleAddTarget}
          type="button"
          className="btn btn-sm btn-danger text-capitalize"
          //   disabled={item.et_task_status == 'approved'}
          // onClick={() => Rejectbtn(item.et_id, 'approved')}
        >
          <i className="me-1"></i>
          <FontAwesomeIcon icon={faPlus} className='me-2' />
          Add Invoice
        </button>
      </div>
      <div className="row mb-3">
        <div className="col-md-6 mb-4">
          <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-6 d-flex">
          <Form.Control
            type="date"
            placeholder="Start date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="me-2"
          />
          <Form.Control
            type="date"
            placeholder="End date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Registered</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((item) => (
            <React.Fragment key={item.id}>
              <tr>
                <td>
                  <img
                    src={`./../../images/avatars/${item.avatar}`}
                    alt={item.name}
                    width="50"
                    height="50"
                  />
                </td>
                <td>{item.name}</td>
                <td>{new Date(item.registered).toLocaleDateString()}</td>
                <td>{item.role}</td>
                <td>
                  <Badge bg={getBadgeVariant(item.status)}>{item.status}</Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => toggleDetails(item.id)}
                  >
                    {details.includes(item.id) ? 'Hide' : 'Show'}
                  </Button>
                </td>
              </tr>
              <tr>
                <td colSpan="6">
                  <Collapse in={details.includes(item.id)}>
                    <div>
                      <h4>{item.name}</h4>
                      <p>User since: {item.registered}</p>
                      <Button variant="danger" size="sm" className="me-2">
                        Delete
                      </Button>
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </Pagination.Prev>
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item
            active={i + 1 === currentPage}
            key={i}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Pagination.Next>
      </Pagination>
      <AddInvoice showtask={showModal} handleClosetask={handleCloseModal} empIdtask={selectedEmpId} />

    </div>
  )
}

export default Invoice
