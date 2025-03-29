import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faCreditCard,
  faFileInvoice,
  faMoneyCheck,
  faReceipt,
  faShoppingBag,
  faUniversity,
} from '@fortawesome/free-solid-svg-icons'
import { faIntercom } from '@fortawesome/free-brands-svg-icons'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },

  {
    component: CNavTitle,
    name: 'Pages',
  },

  {
    component: CNavItem,
    name: 'Products',
    to: '/dashboard/Products',
    icon: <FontAwesomeIcon className="nav-icon me-2" icon={faShoppingBag} />,

    // <CIcon icon={cilDrop} customClassName="nav-icon" />
  },

  {
    component: CNavItem,
    name: 'Banking',
    to: '/dashboard/Banking',
    icon: <FontAwesomeIcon className="nav-icon me-2" icon={faUniversity} />,

    // <CIcon icon={cilDrop} customClassName="nav-icon" />
  },

  {
    component: CNavGroup,
    name: 'Sales',
    // to: '/buttons',
    icon: <FontAwesomeIcon icon={faFileInvoice} className="nav-icon" />,
    
    items: [
      {
        component: CNavItem,
        name: 'Customer',
        to: '/dashboard/Customer',
      },

      {
        component: CNavItem,
        name: 'Sales Order',
        to: '/dashboard/Salesorder',
      },
      {
        component: CNavItem,
        name: 'Delivery Challans',
        to: '/dashboard/Deliverychallans',
      },
      {
        component: CNavItem,
        name: 'Invoices Sales',
        to: '/dashboard/Invoicessales',
      },
      {
        component: CNavItem,
        name: 'Payments Received',
        to: '/dashboard/Paymentsreceived',
      },
      // {
      //   component: CNavItem,
      //   name: 'Recurring Invoices',
      //   to: '/dashboard/Recurringinvoices',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Credit Notes',
      //   to: '/dashboard/Creditnotes',
      // },
    ],
  },




  
  // {
  //   component: CNavGroup,
  //   name: 'Time Tracking',
  //   // to: '/buttons',
  //   icon: <FontAwesomeIcon icon={faIntercom} className="nav-icon" />,
  //   items: [
     
  //     {
  //       component: CNavItem,
  //       name: 'Projects',
  //       to: '/dashboard/projects',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Timesheet',
  //       to: '/dashboard/timesheet',
  //     },
  //   ],
  // },





  {
    component: CNavGroup,
    name: 'Purchases',
    // to: '/buttons',
    icon: <FontAwesomeIcon icon={faMoneyCheck} className="nav-icon"  />,
    items: [

      {
        component: CNavItem,
        name: ' Vendors',
        to: '/dashboard/Vendors',
      },
      {
        component: CNavItem,
        name: 'Expenses',
        to: '/dashboard/Expenses',
      },

     
      // {
      //   component: CNavItem,
      //   name: 'Recurring Expenses',
      //   to: '/dashboard/RecurringExpenses',
      // },
      {
        component: CNavItem,
        name: ' Purchase Order',
        to: '/dashboard/Purchaseorder',
      },
      // {
      //   component: CNavItem,
      //   name: 'Bills',
      //   to: '/dashboard/Bills',
      // },
      {
        component: CNavItem,
        name: 'Payments Made',
        to: '/dashboard/Paymentsmade',
      },
      // {
      //   component: CNavItem,
      //   name: 'Recurring Bills',
      //   to: '/dashboard/Recurringbills',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Vendor Credit',
      //   to: '/dashboard/Vendorcredit',
      // },
    ],
  },


 


  
  {
    component: CNavGroup,
    name: 'Accountants',
    // to: '/buttons',
    icon: <FontAwesomeIcon icon={faReceipt}  className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Manual Journals',
        to: '/dashboard/ManualJournals',
      },
     
      {
        component: CNavItem,
        name: 'Chart of Accounts',
        to: '/dashboard/Accountants',
      },
      {
        component: CNavItem,
        name: 'Currency Adjestment',
        to: '/dashboard/CurrencyAdjestment',
      },
      {
        component: CNavItem,
        name: 'Budgets',
        to: '/dashboard/Budgets',
      },
     
    ],
  },
  {
    component: CNavItem,
    name: 'Report',
    to: '/dashboard/report',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,

    // <CIcon icon={cilDrop} customClassName="nav-icon" />
  },

  // {
  //   component: CNavItem,
  //   name: 'Company',
  //   to: '/Company',
  //   icon: <FontAwesomeIcon className="nav-icon me-2" icon={faBuilding} />,

  //   // <CIcon icon={cilDrop} customClassName="nav-icon" />
  // },
  // {
  //   component: CNavItem,
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },

  // {
  //   component: CNavItem,
  //   name: 'Invoice',
  //   to: '/Invoice',
  //   icon: <FontAwesomeIcon className="nav-icon me-2" icon={faFileInvoice} />,

  //   // <CIcon icon={cilDrop} customClassName="nav-icon" />
  // },

  // {
  //   component: CNavGroup,
  //   name: 'Invoices',
  //   to: '/base',
  //   icon: <FontAwesomeIcon className="nav-icon me-2" icon={faFileInvoice} />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Invoices',
  //       to: '/base/accordion',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Add Invoices',
  //       to: '/base/accordion',
  //     },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Accordion',
  //     //   to: '/base/accordion',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Breadcrumb',
  //     //   to: '/base/breadcrumbs',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Cards',
  //     //   to: '/base/cards',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Carousel',
  //     //   to: '/base/carousels',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Collapse',
  //     //   to: '/base/collapses',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'List group',
  //     //   to: '/base/list-groups',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Navs & Tabs',
  //     //   to: '/base/navs',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Pagination',
  //     //   to: '/base/paginations',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Placeholders',
  //     //   to: '/base/placeholders',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Popovers',
  //     //   to: '/base/popovers',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Progress',
  //     //   to: '/base/progress',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Spinners',
  //     //   to: '/base/spinners',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Tables',
  //     //   to: '/base/tables',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Tabs',
  //     //   to: '/base/tabs',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Tooltips',
  //     //   to: '/base/tooltips',
  //     // },
  //   ],
  // },

  // {
  //   component: CNavGroup,
  //   name: 'Payments',
  //   // to: '/buttons',
  //   icon: <FontAwesomeIcon icon={faCreditCard} className="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Payment Details',
  //       to: '/PaymentTab',
  //     },
  //   ],
  // },

  // {
  //   component: CNavGroup,
  //   name: 'Tax/Charges',
  //   to: '/buttons',
  //   icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Tax',
  //       to: '/buttons/button-groups',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Discount ',
  //       to: '/buttons/dropdowns',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Shipping Charge ',
  //       to: '/buttons/dropdowns',
  //     },
  //   ],
  // },

  // {
  //   component: CNavGroup,
  //   name: 'Billing ',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'User List',
  //       to: '/forms/form-control',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'User Role',
  //       to: '/forms/select',
  //     },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Checks & Radios',
  //     //   to: '/forms/checks-radios',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Range',
  //     //   to: '/forms/range',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Input Group',
  //     //   to: '/forms/input-group',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Floating Labels',
  //     //   to: '/forms/floating-labels',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Layout',
  //     //   to: '/forms/layout',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Validation',
  //     //   to: '/forms/validation',
  //     // },
  //   ],
  // },

  // {
  //   component: CNavGroup,
  //   name: 'User Management',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'User List',
  //       to: '/forms/form-control',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'User Role',
  //       to: '/forms/select',
  //     },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Checks & Radios',
  //     //   to: '/forms/checks-radios',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Range',
  //     //   to: '/forms/range',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Input Group',
  //     //   to: '/forms/input-group',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Floating Labels',
  //     //   to: '/forms/floating-labels',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Layout',
  //     //   to: '/forms/layout',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Validation',
  //     //   to: '/forms/validation',
  //     // },
  //   ],
  // },

  // {
  //   component: CNavGroup,
  //   name: 'Reports',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Sale Report',
  //       to: '/forms/form-control',
  //     },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Select',
  //     //   to: '/forms/select',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Checks & Radios',
  //     //   to: '/forms/checks-radios',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Range',
  //     //   to: '/forms/range',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Input Group',
  //     //   to: '/forms/input-group',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Floating Labels',
  //     //   to: '/forms/floating-labels',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Layout',
  //     //   to: '/forms/layout',
  //     // },
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Validation',
  //     //   to: '/forms/validation',
  //     // },
  //   ],
  // },

  // {
  //   component: CNavItem,
  //   name: 'Clients',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   // badge: {
  //   //   color: 'info',
  //   //   text: 'NEW',
  //   // },
  // },

  // {
  //   component: CNavItem,
  //   name: 'Accountants',
  //   to: '/Generalledger',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   // badge: {
  //   //   color: 'info',
  //   //   text: 'NEW',
  //   // },
  // },

  // {
  //   component: CNavItem,
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Icons',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Free',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'NEW',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Flags',
  //       to: '/icons/flags',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Brands',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },

  // {
  //   component: CNavGroup,
  //   name: 'Notifications',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Alerts',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Badges',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Modal',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Toasts',
  //       to: '/notifications/toasts',
  //     },
  //   ],
  // },

  // {
  //   component: CNavItem,
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },
 
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav
