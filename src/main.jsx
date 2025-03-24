import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import store from './store'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SalesProviderview } from './components/Saleorderviewcontext'
import { SalesProvider } from './views/pages/Banking/SalesContext'
import { AddDeliverychallansProviderview } from './components/Deliverycontext'
import { ViewDeliverychallansProvider } from './components/contextViewDeliverychallans'
import { AddRBSalesProvider } from './views/pages/Purchases/Recurringbill/AddRecurringcontext'
import { POSalesProvider } from './views/pages/Purchases/Purchasesorder/AddContextPurchasesorder'
import { PurchaseProviderview } from './views/pages/Purchases/Purchasesorder/ViewContextpurchase'
import { AuthProvider } from './components/Authication/Authication'
import App from './App'



createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <PurchaseProviderview>
    <POSalesProvider>
      <AddRBSalesProvider>
        <ViewDeliverychallansProvider>
          <AddDeliverychallansProviderview>
            <SalesProviderview>
              <SalesProvider>
                <Provider store={store}>
                  <I18nextProvider i18n={i18n}>
                    <App />
                  </I18nextProvider>
                </Provider>
              </SalesProvider>
            </SalesProviderview>
          </AddDeliverychallansProviderview>
        </ViewDeliverychallansProvider>
      </AddRBSalesProvider>
    </POSalesProvider>
  </PurchaseProviderview>
  </AuthProvider>
)
