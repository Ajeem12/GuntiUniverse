import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./newspay/redux/store.js";

const queryClient = new QueryClient();



ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />

    </Provider>
  </QueryClientProvider>
);


