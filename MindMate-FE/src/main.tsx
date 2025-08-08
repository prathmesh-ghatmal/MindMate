// src/main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { Provider } from "react-redux"
import { store, persistor } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"
import { AuthProvider } from "@/context/AuthProvider"
import { Toaster } from "react-hot-toast"
import { BrowserRouter } from "react-router-dom"

ReactDOM.createRoot(document.getElementById("root")!).render(

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AuthProvider>
            <>
              <Toaster
                position="top-center"
                toastOptions={{
                  style: {
                    background: "#1f2937", // Tailwind: gray-800
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "12px 16px",
                  },
                }}
              />
              <App />
            </>
          </AuthProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>

)
