// DraggableTableDiv.jsx
import React, { useEffect, useState } from 'react'
import { Table, Select, Input, Button } from 'antd'
import ReactDragListView from 'react-drag-listview'
import { useForm, Controller } from 'react-hook-form'
import { Dropdown, DropdownButton, Form, InputGroup, Modal } from 'react-bootstrap'
import { usepurchaseview } from './ViewContextpurchase'

const { Option } = Select

const ViewTablepurchaseorder = () => {
  const { control } = useForm()

  const [counter, setCounter] = useState(0)

  const {
    accountType,
    setAccountType,
    productslist,
    data,
    handleDeleteConfirmation,
    Excutivedelete,
    showDeleteModallist,
    handleCloseDeleteModal,
    commissionOptions,
    selectedCommission,
    setSelectedCommission,
    adjustment,
    setAdjustment,
    accountsList,
    setShipping,
    subTotal,
    commissionAmount,
    totalAmount,
    handleAdditem,
    handleDeleteitem,
    handleCalculate,
  } = usepurchaseview()

  useEffect(() => {
    console.log(data, 'data inside component')

    const hasReloaded = sessionStorage.getItem('hasReloaded')

    if (!hasReloaded) {
      if (counter === 0) {
        setCounter(1) // Update counter to 1
      } else if (counter === 1) {
        sessionStorage.setItem('hasReloaded', 'true') // Store flag to prevent reloading again
        window.location.reload() // Reload only once
      }
    }
  }, [counter])

  const columns = [
    {
      title: 'ITEM DETAILS',
      dataIndex: 'item',
      render: (_, record) => {
        return (
          <Select
            showSearch
            style={{ minWidth: 200 }}
            placeholder="Select a Product"
            value={record.id} // Ensure value is properly mapped
            onChange={(value) => handleCalculate(record, 'item', value)}
            options={productslist.map((product) => ({
              value: product.value,
              label: product.label,
            }))}
          />
        )
      },
    },

    {
      title: 'ACCOUNT',
      dataIndex: 'ac',
      render: (_, record) => {
        return (
          <Select
            showSearch
            style={{ minWidth: 200 }}
            placeholder="Select an Account"
            value={record.ac_id} // Ensure value is properly mapped
            onChange={(value) => handleCalculate(record, 'ac', value)}
            options={accountsList?.map((account) => ({
              value: account.value,
              label: account.label,
            }))}
          />
        )
      },
    },
    

    {
      title: 'QUANTITY',
      dataIndex: 'quantity',
      render: (_, record) => (
        <Input
          type="number"
          value={record.quantity}
          onChange={(e) => handleCalculate(record, 'quantity', Number(e.target.value))}
          style={{ width: '100px' }}
        />
      ),
    },
    {
      title: 'RATE',
      dataIndex: 'rate',
      render: (_, record) => (
        <Input
          type="number"
          value={record.rate}
          onChange={(e) => handleCalculate(record, 'rate', Number(e.target.value))}
          style={{ width: '100px' }}
        />
      ),
    },
    {
      title: 'DISCOUNT %',
      dataIndex: 'discount',
      render: (_, record) => (
        <Input
          type="number"
          value={record.discount}
          onChange={(e) => handleCalculate(record, 'discount', Number(e.target.value))}
          style={{ width: '100px' }}
        />
      ),
    },
    {
      title: 'AMOUNT',
      dataIndex: 'amount',
      render: (_, record) => <span>{record.amount.toFixed(2)}</span>,
    },
    {
      title: 'ACTION',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => handleDeleteConfirmation(record.key, record.main_id)} danger>
          Delete
        </Button>
      ),
    },
  ]

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      // Here you might implement a function to reorder the table rows
      const newData = [...data]
      const item = newData.splice(fromIndex, 1)[0]
      newData.splice(toIndex, 0, item)
      // You could add an update function in context if you need to persist this change
    },
    handleSelector: '.drag-handle',
  }

  return (
    <>
      <div>
        <h6 className="mt-3">Product List</h6>
        <div style={{ overflowX: 'auto' }}>
          <ReactDragListView {...dragProps}>
            <Table
              columns={columns}
              pagination={false}
              dataSource={data}
              scroll={{ x: 'max-content' }}
            />
          </ReactDragListView>
        </div>
        <Button type="primary" onClick={handleAdditem} style={{ marginTop: 10 }}>
          Add Item
        </Button>

        <div className="p-3 mb-5 border rounded" style={{ width: '400px', marginTop: '20px' }}>
          <h6>
            <strong>Sub Total</strong>
          </h6>
          <p className="text-end fw-bold">{Number(subTotal || 0).toFixed(2)}</p>

          <Form.Group>
            <div>
              <Form.Check
                inline
                label="TDC"
                type="radio"
                value="TDC"
                // {...register('accountType', { required: true })}
                checked={accountType === 'TDC'}
                onChange={() => setAccountType('TDC')}
              />
              <Form.Check
                inline
                label="TCS"
                type="radio"
                value="TCS"
                // {...register('accountType', { required: true })}
                checked={accountType === 'TCS'}
                onChange={() => setAccountType('TCS')}
              />
            </div>
            {/* {errors.accountType && <span className="text-danger">This field is required</span>} */}
          </Form.Group>

          <InputGroup className="mb-2">
            <DropdownButton
              title={selectedCommission.label}
              variant="outline-secondary"
              id="commission-dropdown"
            >
              {commissionOptions.map((option, index) => (
                <Dropdown.Item key={index} onClick={() => setSelectedCommission(option)}>
                  {option.label}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <span className="ms-2"> - {commissionAmount.toFixed(2)}</span>
          </InputGroup>
          <p className="text-muted small">{selectedCommission.label}</p>

          <InputGroup className="mb-2">
            <Form.Control placeholder="Adjustment" disabled />
            <Form.Control
              type="number"
              value={adjustment}
              onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
            />
          </InputGroup>

          {/* <InputGroup className="mb-2">
          <Form.Control placeholder="Shipping Charge" disabled />
          <Form.Control
            type="number"
            value={shipping}
            onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
          />
        </InputGroup> */}

          <hr />
          <h5>
            <strong>Total ( Rs. )</strong>
          </h5>
          <p className="text-end fw-bold">{totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <Modal show={showDeleteModallist} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Product ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            No
          </Button>
          <Button variant="danger" onClick={Excutivedelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ViewTablepurchaseorder
