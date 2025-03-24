import React, { useState } from 'react';
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CAvatar,
  CBadge,
  CButton,
  CCollapse,
  CCardBody,
  CFormInput,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import  '../Generalledger/Generalledger.css'

const Generalledger = () => {
  const [details, setDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const items = [
    { id: 1, name: 'Samppa Nori', avatar: '1.jpg', registered: '2021-03-01', role: 'Member', status: 'Active' },
    { id: 2, name: 'Estavan Lykos', avatar: '2.jpg', registered: '2018-02-07', role: 'Staff', status: 'Banned' },
    { id: 3, name: 'Chetan Mohamed', avatar: '3.jpg', registered: '2020-01-15', role: 'Admin', status: 'Inactive' },
    // Add more items as needed
  ];

  const getBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'secondary';
      case 'Pending':
        return 'warning';
      case 'Banned':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    const newDetails = [...details];
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails.push(index);
    }
    setDetails(newDetails);
  };

  // Filtering logic for search, startDate, and endDate
  const filteredItems = items.filter(item => {
    const itemDate = new Date(item.registered);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDateRange = (!start || itemDate >= start) && (!end || itemDate <= end);

    return matchesSearch && matchesDateRange;
  });

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div>
      <div className='row'>
        <div className='col-md-6'>
      <CFormInput
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-3 "
      />
      </div>
      <div className='col-md-6'>
<div className='datemain'>
      <CFormInput
        type="date"
        placeholder="Start date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="mb-3 date "
      />
      </div>
      <div className='datemain'>
      <CFormInput
        type="date"
        placeholder="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="mb-3 date "
      />
      </div>
      </div>

      </div>
      <CTable hover responsive className="table-striped custom-table">
    <CTableHead className="table-header">
      <CTableRow>
        <CTableHeaderCell>Avatar</CTableHeaderCell>
        <CTableHeaderCell>Name</CTableHeaderCell>
        <CTableHeaderCell>Registered</CTableHeaderCell>
        <CTableHeaderCell>Role</CTableHeaderCell>
        <CTableHeaderCell>Status</CTableHeaderCell>
        <CTableHeaderCell>Actions</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      {paginatedItems.map((item) => (
        <React.Fragment key={item.id}>
          <CTableRow>
            <CTableDataCell>
              <CAvatar src={`./../../images/avatars/${item.avatar}`} />
            </CTableDataCell>
            <CTableDataCell>{item.name}</CTableDataCell>
            <CTableDataCell>{new Date(item.registered).toLocaleDateString()}</CTableDataCell>
            <CTableDataCell>{item.role}</CTableDataCell>
            <CTableDataCell>
              <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
            </CTableDataCell>
            <CTableDataCell>
              <CButton
                color="primary"
                variant="outline"
                size="sm"
                onClick={() => toggleDetails(item.id)}
              >
                {details.includes(item.id) ? 'Hide' : 'Show'}
              </CButton>
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell colSpan="6">
              <CCollapse visible={details.includes(item.id)}>
                <CCardBody>
                  <h4>{item.name}</h4>
                  <p>User since: {item.registered}</p>
                  <CButton size="sm" color="danger" className="ms-1">Delete</CButton>
                </CCardBody>
              </CCollapse>
            </CTableDataCell>
          </CTableRow>
        </React.Fragment>
      ))}
    </CTableBody>
  </CTable>
      <CPagination align="center" className="mt-3">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </CPaginationItem>
        {[...Array(totalPages)].map((_, i) => (
          <CPaginationItem
            active={i + 1 === currentPage}
            key={i}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </CPaginationItem>
        ))}
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </CPaginationItem>
      </CPagination>
    </div>
  );
};

export default Generalledger;
