
import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AddRBSalesContext = createContext()

export const AddRBSalesProvider = ({ children }) => {
  const user_id = sessionStorage.getItem('user_id')
  const token = sessionStorage.getItem('token')

  // Global state for table data, products, commission, etc.
  const [data, setData] = useState([
    { key: '1', item: 'Select Your Product', quantity: 1, rate: 0, discount: 0, amount: 0 },
  ])

  console.log(data, 'data')

  const [handlename, setHandlename] = useState()
  const [productsitem, setProductsitem] = useState([])
  const [productslist, setProductslist] = useState([])

  const [keyCounter, setKeyCounter] = useState(3)
  const [selectedCommission, setSelectedCommission] = useState({
    label: 'Commission or Brokerage [2%]',
    rate: 2,
  })
  const [adjustment, setAdjustment] = useState(0.0)
  const [subTotal, setSubTotal] = useState(0)
  const [accountType, setAccountType] = useState('')

  const [shipping, setShipping] = useState(0)

  const commissionOptions = [
    { label: 'Commission or Brokerage [2%]', rate: 2 },
    { label: 'Commission or Brokerage (Reduced) [3.75%]', rate: 3.75 },
    { label: 'Dividend [10%]', rate: 10 },
    { label: 'Dividend (Reduced) [7.5%]', rate: 7.5 },
    { label: 'Other Interest than securities [10%]', rate: 10 },
    { label: 'Other Interest than securities (Reduced) [7.5%]', rate: 7.5 },
    { label: 'Payment of contractors for Others [2%]', rate: 2 },
    { label: 'Payment of contractors for Others (Reduced) [1.5%]', rate: 1.5 },
    { label: 'Payment of contractors HUF/Indiv [1%]', rate: 1 },
    { label: 'Payment of contractors HUF/Indiv (Reduced) [0.75%]', rate: 0.75 },
    { label: 'Professional Fees [10%]', rate: 10 },
    { label: 'Professional Fees (Reduced) [7.5%]', rate: 7.5 },
    { label: 'Rent on land or furniture etc [10%]', rate: 10 },
    { label: 'Rent on land or furniture etc (Reduced) [7.5%]', rate: 7.5 },
  ]

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/customers',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result === true) {
        const mappedProducts = response.data.list.map((customer) => ({
          value: customer.cu_id,
          label:
            `${customer.cu_salutation} ${customer.cu_first_name} ${customer.cu_last_name}`.trim(),
        }))
        setProductsitem(mappedProducts)
      } else {
        console.error(response.data.message)
        setProductsitem([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const Products = async () => {
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/item/list',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result === true) {
        const mappedProducts = response.data.list.map((customer) => ({
          value: customer.i_id,
          label:
            customer.i_name
        }))
        setProductslist(mappedProducts)
      } else {
        console.error(response.data.message)
        setProductslist([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
    Products()
  }, [])

  // Recalculate subTotal when data changes
  useEffect(() => {
    const newSubTotal = data.reduce((acc, item) => acc + item.amount, 0)
    setSubTotal(newSubTotal)
  }, [data])

  // Functions to update the table data
  const handleAdditem = () => {
    const newKey = keyCounter.toString()
    const newItem = {
      key: newKey,
      item: 'Select Your Product',
      quantity: 1,
      rate: 0,
      discount: 0,
      amount: 0,
    }
    setData([...data, newItem])
    setKeyCounter(keyCounter + 1)
  }

  const handleDeleteitem = (key) => {
    setData(data.filter((item) => item.key !== key))
  }

  const handleCalculate = (record, field, value) => {
    const updatedData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = { ...item, [field]: value }
        updatedItem.amount =
          updatedItem.rate * updatedItem.quantity * (1 - updatedItem.discount / 100)
        return updatedItem
      }
      return item
    })
    setData(updatedData)
  }

  // Calculate commission and total
  const commissionAmount = (subTotal * selectedCommission.rate) / 100
  const totalAmount = subTotal - commissionAmount + adjustment + shipping

  return (
    <AddRBSalesContext.Provider
      value={{
        productslist,
        setProductslist,
        accountType,
        setAccountType,
        handlename,
        data,
        Products,
        productsitem,
        commissionOptions,
        selectedCommission,
        shipping,
        setShipping,
        setSelectedCommission,
        adjustment,
        setAdjustment,
        subTotal,
        commissionAmount,
        totalAmount,
        handleAdditem,
        handleDeleteitem,
        handleCalculate,
      }}
    >
      {children}
    </AddRBSalesContext.Provider>
  )
}

export const AddRBuseSales = () => useContext(AddRBSalesContext)
