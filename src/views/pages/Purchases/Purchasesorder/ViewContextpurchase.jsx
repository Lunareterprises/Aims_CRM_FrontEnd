// PurchaseContextview.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const PurchaseContextview = createContext()

export const PurchaseProviderview = ({ children }) => {
  const user_id = sessionStorage.getItem('user_id')
  const token = sessionStorage.getItem('token')
  const po_id = sessionStorage.getItem('po_id')

  const [data, setData] = useState([
    { key: '1', item: 'Select Your Product',ac:'select your bank', quantity: 1, rate: 0, discount: 0, amount: 0 },
  ])
  // const [newdata, setNewData] = useState([])

  const [refreshKey, setRefreshKey] = useState(0)
  const [saleid, setsaleid] = useState(po_id)

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

  const [shipping, setShipping] = useState(440)

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

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1)
  }

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
          label: customer.i_name,
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
    console.log('Updated Data:', data)
  }, [data])

  const [accountsList, setAccountsList] = useState([])

  const fetchAccounts = async () => {
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/bank-details',
        {},
        {
          headers: { Authorization: `Bearer ${token}`, user_id },
        },
      )

      if (response.data.result === true) {
        const mappedAccounts = response.data.list.map((account) => ({
          value: account.bd_id,
          label: account.bd_acc_bank_name,
        }))
        setAccountsList(mappedAccounts)
      } else {
        console.error(response.data.message)
        setAccountsList([])
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  }

  // Fetch accounts on component mount
  useEffect(() => {
    fetchProducts()
    Products()
    fetchSalesOrder()

    fetchAccounts() // Fetch accounts
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
      ac:'select your bank',
      quantity: 1,
      rate: 0,
      discount: 0,
      amount: 0,
    }
    setData([...data, newItem])
    setKeyCounter(keyCounter + 1)
  }

  //  // Delete list product

  const [showDeleteModallist, setShowDeleteModallist] = useState(false)
  const [deleteEmpId, setDeleteEmpId] = useState(null)
  const handleDeleteConfirmation = (key, main_id) => {
    // setData(data.filter((item) => item.key !== key))
    setShowDeleteModallist(true)

    console.log(main_id, 'keykeykey')
    setDeleteEmpId(main_id) // Store the employee ID
    setShowDeleteModallist(true) // Show the delete confirmation modal
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModallist(false) // Close the modal
    setDeleteEmpId(null) // Reset the employee ID
  }

  const Excutivedelete = async () => {
    try {
      const del = {
        sales_order_item_id: deleteEmpId,
      }
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/sales/delete',
        del,

        {
          headers: { Authorization: `Bearer ${token}`, user_id },
        },
      )

      console.log(response)
      if (response.data.result === true) {
        setShowDeleteModallist(false)
        fetchSalesOrder()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleCalculate = (record, field, value) => {
    if (!record) {
      console.error("Error: 'record' is undefined in handleCalculate.")
      return
    }

    const updatedData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = { ...item, [field]: value }

        if (field === 'item') {
          const product = productslist.find((prod) => prod.value === value)
          updatedItem.item = product ? product.label : 'Unknown'
          updatedItem.id = product ? product.value : null
          updatedItem.rate = product ? Number(product.rate) || 0 : 0
        }

        if (field === 'ac') {
          const account = accountsList.find((acc) => acc.value === value)
          updatedItem.ac = account ? account.label : 'Unknown'
          updatedItem.ac_id = account ? account.value : null
        }

        if (field !== 'item') {
          updatedItem.amount =
            updatedItem.rate * updatedItem.quantity * (1 - updatedItem.discount / 100)
        }

        return updatedItem
      }
      return item
    })

    setData(updatedData)
    console.log(updatedData, 'Updated Data')
  }

  // Calculate commission and total
  const commissionAmount = (subTotal * selectedCommission.rate) / 100
  const totalAmount = subTotal - commissionAmount + adjustment + shipping

  //-------------------------

  const [totalAmounts, setTotalAmounts] = useState(0)

  const fetchSalesOrder = async () => {
    try {
      if (!po_id) {
        console.error('Sale ID is undefined')
        return
      }
  
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/purchase-order',
        { po_id },
        {
          headers: { Authorization: `Bearer ${token}`, user_id },
        },
      )
  
      console.log('API Response:', response.data)
  
      if (response.data.result) {
        const salesOrder = response.data.list?.[0]
  
        if (!salesOrder) {
          console.error('No sales order found')
          return
        }
  
        setShipping(Number(salesOrder.so_shipping_charge) || 0)
        setAdjustment(Number(salesOrder.po_adjustment) || 0)
        setAccountType(salesOrder.po_tds_tcs || 'N/A')
        setTotalAmounts(Number(salesOrder.po_total_amount) || 0)
  
        const formattedItems = salesOrder.purchase_order_item
          ? salesOrder.purchase_order_item.map((item, index) => {
              // Find product name using ID
              const product = productslist.find((prod) => prod.value === item.is_item_id)
  
              // Find the default bank for this item
              const account = accountsList?.find((acc) => acc.value === item.is_item_account_id)
  
              return {
                key: index.toString(),
                id: item.is_item_id, // Keep ID for reference
                main_id: item.is_id,
                item: product ? product.label : item.is_item_name || 'Unknown', // Store name instead of ID
                quantity: Number(item.is_quantity) || 1,
                rate: Number(item.is_rate) || 0,
                discount: Number(item.is_discount) || 0,
                amount: Number(item.is_amount) || 0,
                ac: account ? account.label : item.is_item_account_name || 'Unknown',
                ac_id: account ? account.value : item.is_item_account_id, // Store account ID
              }
            })
          : []
  
        console.log('Formatted Items:', formattedItems)
        setData(formattedItems)
  
        setRefreshKey((prev) => prev + 1) // Ensure UI refreshes
      }
    } catch (error) {
      console.error('Error fetching sales order:', error)
    }
  }
  
  
  

  // Recalculate subTotal when data changes
  useEffect(() => {
    const newSubTotal = data.reduce((acc, item) => acc + item.amount, 0)
    setSubTotal(newSubTotal)
  }, [data])

  // console.log(shipping,'shippingshipping');

  return (
    <PurchaseContextview.Provider
      value={{
        productslist,
        showDeleteModallist,
        accountsList,
        setShowDeleteModallist,
        handleCloseDeleteModal,
        handleDeleteConfirmation,
        setProductslist,
        accountType,
        setAccountType,
        fetchAccounts,
        saleid,
        handleRefresh,

        setsaleid,
        data,
        Products,
        fetchSalesOrder,
        productsitem,
        commissionOptions,
        selectedCommission,
        shipping,
        setShipping,
        setSelectedCommission,
        adjustment,
        setAdjustment,
        Excutivedelete,
        subTotal,
        commissionAmount,
        totalAmount,
        handleAdditem,

        handleCalculate,
      }}
    >
      {children}
    </PurchaseContextview.Provider>
  )
}

export const usepurchaseview = () => useContext(PurchaseContextview)
