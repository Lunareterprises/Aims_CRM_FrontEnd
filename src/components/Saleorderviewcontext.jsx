// SalesContextview.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const SalesContextview = createContext()

export const SalesProviderview = ({ children }) => {




  const user_id = sessionStorage.getItem('user_id')
  const token = sessionStorage.getItem('token')
  const so_id = sessionStorage.getItem('so_id')

  const [data, setData] = useState([
    { key: '1', item: 'Select Your Product', quantity: 1, rate: 0, discount: 0, amount: 0 },
  ])
  // const [newdata, setNewData] = useState([])

const [refreshKey, setRefreshKey] = useState(0);
  const [saleid, setsaleid] = useState(so_id)

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
    setRefreshKey(prevKey => prevKey + 1);
  };

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
    console.log('Updated Data:', data);
}, [data]);





  useEffect(() => {
    fetchProducts()
    Products()
    fetchSalesOrder()
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

 //  // Delete list product

 const [showDeleteModallist, setShowDeleteModallist] = useState(false)
 const [deleteEmpId, setDeleteEmpId] = useState(null)
 const handleDeleteConfirmation = (key ,main_id) => {
  // setData(data.filter((item) => item.key !== key))
  setShowDeleteModallist(true)

  console.log(main_id,'keykeykey');
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
     const response = await axios.post('https://lunarsenterprises.com:5016/crm/sales/delete', del,


      {
        headers: { Authorization: `Bearer ${token}`, user_id },
      }
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
      console.error("Error: 'record' is undefined in handleCalculate.");
      return;
    }
  
    const updatedData = data.map((item) => {
      if (item.key === record.key) {
        const updatedItem = { ...item, [field]: value };
  
        if (field === "item") {
          const product = productslist.find((prod) => prod.value === value);
          updatedItem.item = product ? product.label : "Unknown";
          updatedItem.id = product ? product.value : null;
          updatedItem.rate = product ? Number(product.rate) || 0 : 0;
        }
  
        if (field !== "item") {
          updatedItem.amount =
            updatedItem.rate * updatedItem.quantity * (1 - updatedItem.discount / 100);
        }
  
        return updatedItem;
      }
      return item;
    });
  
    setData(updatedData);
    // setNewData([...updatedData]); // Ensure state update triggers re-render
 console.log(updatedData,'antonytest');
 
  };
  

 
  
  

  
  

  // Calculate commission and total
  const commissionAmount = (subTotal * selectedCommission.rate) / 100
  const totalAmount = subTotal - commissionAmount + adjustment + shipping

  //-------------------------

  const [totalAmounts, setTotalAmounts] = useState(0)
  const fetchSalesOrder = async () => {
    try {
      if (!so_id) {
        console.error('Sale ID is undefined');
       
        return;
      }
  
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/sales-order',
        { so_id },
        {
          headers: { Authorization: `Bearer ${token}`, user_id },
        }
      );
  
      console.log('API Response:', response.data);
  
      if (response.data.result) {
        const salesOrder = response.data.list?.[0];
  
        if (!salesOrder) {
          console.error('No sales order found');
          return;
        }
  
        setShipping(Number(salesOrder.so_shipping_charge) || 0);
        setAdjustment(Number(salesOrder.so_adjustment_amount) || 0);
        setAccountType(salesOrder.so_tds_tcs || 'N/A');
        setTotalAmounts(Number(salesOrder.so_total_amount) || 0);
  
        const formattedItems = salesOrder.sales_order_item
          ? salesOrder.sales_order_item.map((item, index) => {
              // Find product name using ID
              const product = productslist.find((prod) => prod.value === item.is_item_id);
  
              return {
                key: index.toString(),
                id: item.is_item_id,  // Keep ID for reference
                main_id: item.is_id,
                item: product ? product.label : item.is_item_name || 'Unknown', // Store name instead of ID
                quantity: Number(item.is_quantity) || 1,
                rate: Number(item.is_rate) || 0,
                discount: Number(item.is_discount) || 0,
                amount: Number(item.is_amount) || 0,
              };
            })
          : [];
  
        console.log('Formatted Items:', formattedItems);
        setData(formattedItems);

        setRefreshKey(prev => prev + 1); // Ensure UI refreshes
        // sessionStorage.setItem('sales_Order_Items', JSON.stringify(formattedItems));
      }
    } catch (error) {
      console.error('Error fetching sales order:', error);
    }
  };

  
 
  

  // Recalculate subTotal when data changes
  useEffect(() => {
    const newSubTotal = data.reduce((acc, item) => acc + item.amount, 0)
    setSubTotal(newSubTotal)
  }, [data])

  // console.log(shipping,'shippingshipping');

  return (
    <SalesContextview.Provider
      value={{
        productslist,
        showDeleteModallist,
        setShowDeleteModallist,
        handleCloseDeleteModal,
        handleDeleteConfirmation,
        setProductslist,
        accountType,
        setAccountType,
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
    </SalesContextview.Provider>
  )
}

export const useSalesview = () => useContext(SalesContextview)
