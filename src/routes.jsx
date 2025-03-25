import React, { useEffect } from 'react'

// import i18n from "./i18n"; // Ensure you import your i18n setup
import { t } from 'i18next'

//register

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Generalledger = React.lazy(() => import('./views/Generalledger/Generalledger'))

const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
// const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
// const Cards = React.lazy(() => import('./views/base/cards/Cards'))
// const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
// const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
// const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
// const Navs = React.lazy(() => import('./views/base/navs/Navs'))
// const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
// const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
// const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
// const Progress = React.lazy(() => import('./views/base/progress/Progress'))
// const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
// const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
// const Tables = React.lazy(() => import('./views/base/tables/Tables'))
// const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
// const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
// const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
// const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
// const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
// const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
// const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
// const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
// const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
// const Range = React.lazy(() => import('./views/forms/range/Range'))
// const Select = React.lazy(() => import('./views/forms/select/Select'))
// const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
// const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
// const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
// const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
// const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
// const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
// const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
// const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

// const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const Company = React.lazy(() => import('./views/Company/Company'))

const Invoice = React.lazy(() => import('./views/Invoice/Invoice'))
const Products = React.lazy(() => import('./views/pages/Products/Products'))
const ProductsView = React.lazy(() => import('./views/pages/Products/Productview'))

const EditProfile = React.lazy(() => import('./views/Profile/EditProfile'))
const Profile = React.lazy(() => import('./views/Profile/Profile'))
const LanguageSwitcher = React.lazy(() => import('./components/LanguageSwitcher'))
const PaymentCredit = React.lazy(() => import('./views/Payments/PaymentCredit'))
const PaymentDebit = React.lazy(() => import('./views/Payments/PaymentDebit'))
const PaymentTab = React.lazy(() => import('./views/Payments/TabPayments'))
const Bulkemail = React.lazy(() => import('./views/Profile/Bulkemail'))
const Banking = React.lazy(() => import('./views/pages/Banking/Banking'))
const Bankingview = React.lazy(() => import('./views/pages/Banking/Bankview'))

const Addbanking = React.lazy(() => import('./views/pages/Banking/Addbanking'))
const Bankingdashboard = React.lazy(() => import('./views/pages/Banking/Bankingdashboard'))

const Customer = React.lazy(() => import('./views/pages/Sales/Customers'))
const AddCustomers = React.lazy(() => import('./views/pages/Sales/AddCustomers'))
const Customerview = React.lazy(() => import('./views/pages/Sales/CustomerView'))

const Salesorder = React.lazy(() => import('./views/pages/Sales/Salesorder'))
const Saleorderview = React.lazy(() => import('./views/pages/Sales/Saleorderview'))

const AddSalesorder = React.lazy(() => import('./views/pages/Sales/AddsaleOrder'))
const Deliverychallans = React.lazy(() => import('./views/pages/Sales/Deliverychallans'))
const AddDeliverychallans = React.lazy(() => import('./views/pages/Sales/AddDeliverychallans'))
const ViewDeliverychallans = React.lazy(() => import('./views/pages/Sales/ViewDeliverychallans'))

const AddRecurringbills = React.lazy(
  () => import('./views/pages/Purchases/Recurringbill/AddRecurringbills'),
)

const Invoicessales = React.lazy(() => import('./views/pages/Sales/Invoices'))
const Paymentsreceived = React.lazy(() => import('./views/pages/Sales/Paymentsreceived'))
const Recurringinvoices = React.lazy(() => import('./views/pages/Sales/Recurringinvoices'))
const Creditnotes = React.lazy(() => import('./views/pages/Sales/Creditnotes'))

const Expenses = React.lazy(() => import('./views/pages/Purchases/Expenses'))
const Addexpense = React.lazy(() => import('./views/pages/Purchases/Addexpense'))
const Editexpense = React.lazy(() => import('./views/pages/Purchases/Editexpense'))

const Vendors = React.lazy(() => import('./views/pages/Purchases/Vendors'))

const AddVendors = React.lazy(() => import('./views/pages/Purchases/AddVendors'))
const Editvendor = React.lazy(() => import('./views/pages/Purchases/Editvendor'))

const RecurringExpenses = React.lazy(() => import('./views/pages/Purchases/RecurringExpenses'))
const Purchaseorder = React.lazy(
  () => import('./views/pages/Purchases/Purchasesorder/Purchaseorder'),
)
const AddPurchaseorder = React.lazy(
  () => import('./views/pages/Purchases/Purchasesorder/AddPurchasesorder'),
)

const ViewPurchaseorder = React.lazy(
  () => import('./views/pages/Purchases/Purchasesorder/Viewpurchaseorder'),
)

const Bills = React.lazy(() => import('./views/pages/Purchases/Bills'))
const Paymentsmade = React.lazy(() => import('./views/pages/Purchases/Paymentsmade'))
const Recurringbills = React.lazy(
  () => import('./views/pages/Purchases/Recurringbill/Recurringbills'),
)
const Vendorcredit = React.lazy(() => import('./views/pages/Purchases/Vendorcredit'))

const Projects = React.lazy(() => import('./views/pages/TimeTracking/Projects'))
const AddProjects = React.lazy(() => import('./views/pages/TimeTracking/AddProject'))

const Timesheet = React.lazy(() => import('./views/pages/TimeTracking/Timesheet'))
const Report = React.lazy(() => import('./views/pages/Report/Report'))
const ManualJournals = React.lazy(() => import('./views/pages/ManualJournals/ManualJournals'))
const AddNewManualJournals = React.lazy(() => import('./views/pages/ManualJournals/AddNewManualJournals'))
const Accountants = React.lazy(() => import('./views/pages/Accountants/Accountants'))

const Createinvoice = React.lazy(() => import('./components/Invoicecomponent/InvoiceForm'))
const Editinvoice = React.lazy(() => import('./components/Invoicecomponent/EditInvoice/EditInvoice'))


const routes = [
  { path: '/', exact: true, name: t('Home') },
  { path: '/dashboard', name: t('Dashboard'), element: Dashboard },
  { path: '/Generalledger', name: t('General Ledger'), element: Generalledger, exact: true },
  { path: '/dashboard/Profile', name: t('Profile'), element: Profile, exact: true },
  {
    path: '/dashboard/Profile/EditProfile',
    name: t('Edit Profile'),
    element: EditProfile,
    exact: true,
  },
  ///-----------Banking----------------

  {
    path: '/dashboard/Banking',
    name: t('Banking'),
    element: Banking,
    exact: true,
  },
  {
    path: '/dashboard/Banking/Bankingview/:bd_id',
    name: t('Banking View'),
    element: Bankingview,
    exact: true,
  },

  {
    path: '/dashboard/Banking/Addbanking',
    name: t('Add Banking'),
    element: Addbanking,
    exact: true,
  },
  {
    path: '/dashboard/Bankingdashboard',
    name: t('Bankingdashboard'),
    element: Bankingdashboard,
    exact: true,
  },
  ///-----------Sales----------------
  {
    path: '/dashboard/Customer',
    name: t('Customer'),
    element: Customer,
    exact: true,
  },
  {
    path: '/dashboard/Customer/AddCustomers',
    name: t('AddCustomers'),
    element: AddCustomers,
    exact: true,
  },
  {
    path: '/dashboard/Customer/customerview/:cu_id',
    name: t('Customer View'),
    element: Customerview,
    exact: true,
  },

  {
    path: '/dashboard/Salesorder',
    name: t('Sales Order'),
    element: Salesorder,
    exact: true,
  },
  {
    path: '/dashboard/Salesorder/AddSalesorder',
    name: t('Add Sales Order'),
    element: AddSalesorder,
    exact: true,
  },

  {
    path: '/dashboard/Salesorder/Saleorderview/:so_id',
    name: t('Sale Order view'),
    element: Saleorderview,
    exact: true,
  },

  {
    path: '/dashboard/Deliverychallans',
    name: t('Delivery Challans'),
    element: Deliverychallans,
    exact: true,
  },

  {
    path: '/dashboard/Deliverychallans/AddDeliverychallans',
    name: t('Add Deliverychallans'),
    element: AddDeliverychallans,
    exact: true,
  },

  {
    path: '/dashboard/Deliverychallans/ViewDeliverychallans/:dc_id',
    name: t('View Delivery challans'),
    element: ViewDeliverychallans,
    exact: true,
  },

  {
    path: '/dashboard/Invoicessales',
    name: t('Invoices'),
    element: Invoicessales,
    exact: true,
  },

  {
    path: '/dashboard/Paymentsreceived',
    name: t('Payments Received'),
    element: Paymentsreceived,
    exact: true,
  },

  {
    path: '/dashboard/Recurringinvoices',
    name: t('Recurring Invoices '),
    element: Recurringinvoices,
    exact: true,
  },

  {
    path: '/dashboard/Creditnotes',
    name: t('Credit Notes  '),
    element: Creditnotes,
    exact: true,
  },

  {
    path: '/dashboard/Createinvoice',
    name: t('Create Invoice'),
    element: Createinvoice,
    exact: true,
  },
  {
    path: '/dashboard/Createinvoice/:id',
    name: t('Invoice View'),
    element: Editinvoice,
    exact: true,
  },
  

  //-----Purchases-------------

  {
    path: '/dashboard/Expenses',
    name: t('Expenses'),
    element: Expenses,
    exact: true,
  },

  {
    path: '/dashboard/Purchaseorder/AddPurchaseorder',
    name: t('Add Purchase order'),
    element: AddPurchaseorder,
    exact: true,
  },

  {
    path: '/dashboard/Purchaseorder/ViewPurchaseorder/:po_id',
    name: t('View Purchase Order'),
    element: ViewPurchaseorder,
    exact: true,
  },

  {
    path: '/dashboard/Vendors',
    name: t('Vendors'),
    element: Vendors,
    exact: true,
  },
  {
    path: '/dashboard/Vendors/AddVendors',
    name: t('Add Vendors'),
    element: AddVendors,
    exact: true,
  },

  {
    path: '/dashboard/Vendors/Editvendor/:ve_id',
    name: t('Edit vendor'),
    element: Editvendor,
    exact: true,
  },

  {
    path: '/dashboard/RecurringExpenses',
    name: t('Recurring Expenses'),
    element: RecurringExpenses,
    exact: true,
  },
  {
    path: '/dashboard/Expenses/Addexpense',
    name: t('Add Expenses'),
    element: Addexpense,
    exact: true,
  },
  {
    path: '/dashboard/Expenses/Editexpense/:ep_id',
    name: t('Add Expenses'),
    element: Editexpense,
    exact: true,
  },

  {
    path: '/dashboard/Purchaseorder',
    name: t('Purchase Order'),
    element: Purchaseorder,
    exact: true,
  },

  {
    path: '/dashboard/Bills',
    name: t('Bills'),
    element: Bills,
    exact: true,
  },

  {
    path: '/dashboard/Paymentsmade',
    name: t('Payments Made'),
    element: Paymentsmade,
    exact: true,
  },

  {
    path: '/dashboard/Recurringbills',
    name: t(' Recurring Bills '),
    element: Recurringbills,
    exact: true,
  },

  {
    path: '/dashboard/Vendorcredit',
    name: t('Vendor Credit Notes'),
    element: Vendorcredit,
    exact: true,
  },

  {
    path: '/dashboard/AddRecurringbills',
    name: t('Add Recurring bills'),
    element: AddRecurringbills,
    exact: true,
  },

  //-----Time Tracking-----------
  {
    path: '/dashboard/Projects',
    name: t(' Projects '),
    element: Projects,
    exact: true,
  },

  {
    path: '/dashboard/timesheet',
    name: t('Timesheet'),
    element: Timesheet,
    exact: true,
  },
  {
    path: '/dashboard/AddProjects',
    name: t('AddProjects'),
    element: AddProjects,
    exact: true,
  },

  //-----Report-----------

  {
    path: '/dashboard/report',
    name: t('Report'),
    element: Report,
    exact: true,
  },

  // -----Accountants------
  {
    path: '/dashboard/ManualJournals',
    name: t('ManualJournals'),
    element: ManualJournals,
    exact: true,
  },
  {
    path: '/dashboard/AddNewManualJournals',
    name: t('AddNewManualJournals'),
    element: AddNewManualJournals,
    exact: true,
  },
  {
    path: '/dashboard/Accountants',
    name: t('Accountants'),
    element: Accountants,
    exact: true,
  },

  {
    path: '/dashboard/Profile/Language',
    name: t('Language'),
    element: LanguageSwitcher,
    exact: true,
  },
  { path: '/dashboard/Products', name: t('Products'), element: Products, exact: true },
  {
    path: '/dashboard/Products/productsView/:i_id',
    name: t('Customer View'),
    element: ProductsView,
    exact: true,
  },

  { path: '/PaymentCredit', name: t('Payment Credit'), element: PaymentCredit, exact: true },
  { path: '/PaymentDebit', name: t('Payment Debit'), element: PaymentDebit, exact: true },

  { path: '/PaymentTab', name: t('Payments'), element: PaymentTab, exact: true },

  { path: '/dashboard/Profile/BulkEmail', name: t('Bulk Email'), element: Bulkemail, exact: true },

  { path: '/Company', name: 'Client Company', element: Company, exact: true },
  { path: '/Invoice', name: 'Invoice', element: Invoice },
  // { path: '/theme/typography', name: 'Typography', element: Typography },
  // { path: '/base', name: 'Base', element: Cards, exact: true },
  // { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  // { path: '/base/cards', name: 'Cards', element: Cards },
  // { path: '/base/carousels', name: 'Carousel', element: Carousels },
  // { path: '/base/collapses', name: 'Collapse', element: Collapses },
  // { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  // { path: '/base/navs', name: 'Navs', element: Navs },
  // { path: '/base/paginations', name: 'Paginations', element: Paginations },
  // { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  // { path: '/base/popovers', name: 'Popovers', element: Popovers },
  // { path: '/base/progress', name: 'Progress', element: Progress },
  // { path: '/base/spinners', name: 'Spinners', element: Spinners },
  // { path: '/base/tabs', name: 'Tabs', element: Tabs },
  // { path: '/base/tables', name: 'Tables', element: Tables },
  // { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  // { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  // { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  // { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  // { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  // { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  // { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  // { path: '/forms/select', name: 'Select', element: Select },
  // { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  // { path: '/forms/range', name: 'Range', element: Range },
  // { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  // { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  // { path: '/forms/layout', name: 'Layout', element: Layout },
  // { path: '/forms/validation', name: 'Validation', element: Validation },
  // { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  // { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  // { path: '/icons/flags', name: 'Flags', element: Flags },
  // { path: '/icons/brands', name: 'Brands', element: Brands },
  // { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  // { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  // { path: '/notifications/badges', name: 'Badges', element: Badges },
  // { path: '/notifications/modals', name: 'Modals', element: Modals },
  // { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  // { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
