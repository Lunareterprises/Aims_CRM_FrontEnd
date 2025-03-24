// DraggableTableDiv.jsx
import React, { useState } from 'react'
import { Table, Select, Input, Button } from 'antd'
import ReactDragListView from 'react-drag-listview'
import { useForm, Controller } from 'react-hook-form'
import { Dropdown, DropdownButton, Form, InputGroup } from 'react-bootstrap'

import { AddRBuseSales } from './AddRecurringcontext'

const { Option } = Select

const AddTableRecurring = () => {
  const { control } = useForm()

  const {
    accountType,
    setAccountType,
    productslist,
    setProductslist,
    data,
    commissionOptions,
    selectedCommission,
    setSelectedCommission,
    adjustment,
    setAdjustment,
    shipping,
    setShipping,
    subTotal,
    commissionAmount,
    totalAmount,
    handleAdditem,
    handleDeleteitem,
    handleCalculate,
  } = AddRBuseSales()
  console.log(productslist, 'productslist')

  const columns = [
    {
      title: 'Drag',
      dataIndex: 'drag',
      render: () => (
        <span className="drag-handle" style={{ cursor: 'grab' }}>
          ☰
        </span>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'ITEM DETAILS',
      dataIndex: 'item',
      render: (_, record) => (
        <Controller
          name={`item-${record.item}`}
          control={control}
          rules={{ required: 'Select or add a Customer' }}
          render={({ field }) => (
            <Select
              {...field}
              value={record.item}
              options={productslist}
              placeholder="Select or add a Customer"
              onChange={(value) => handleCalculate(record, 'item', value)}
              style={{ minWidth: 150 }}
            >
              {productslist.length === 0 && (
                <Option value="Select Your Product">Select Your Product</Option>
              )}
            </Select>
          )}
        />
      ),

      responsive: ['sm'],
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
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
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
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
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
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'AMOUNT',
      dataIndex: 'amount',
      render: (_, record) => <span>{record.amount.toFixed(2)}</span>,
      responsive: ['sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'ACTION',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => handleDeleteitem(record.key)} danger>
          Delete
        </Button>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
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
        <p className="text-end fw-bold">{subTotal.toFixed(2)}</p>

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

        <InputGroup className="mb-2">
          <Form.Control placeholder="Shipping Charge" disabled />
          <Form.Control
            type="number"
            value={shipping}
            onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
          />
        </InputGroup>

        <hr />
        <h5>
          <strong>Total ( Rs. )</strong>
        </h5>
        <p className="text-end fw-bold">{totalAmount.toFixed(2)}</p>
      </div>
    </div>
  )
}

export default AddTableRecurring
