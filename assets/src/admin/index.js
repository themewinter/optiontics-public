import ReactDOM from "react-dom/client";
import App from "./App";
import "./store";
import { renderInShadowDom } from "./shadow-dom";

const VENDOR_DASHBOARD_ID = "optiontics-vendor-dashboard";
const ADMIN_DASHBOARD_ID = "optiontics_dashboard";

const container =
  document.getElementById(VENDOR_DASHBOARD_ID) ||
  document.getElementById(ADMIN_DASHBOARD_ID);

if (container) {
  const isVendorDashboard = container.id === VENDOR_DASHBOARD_ID;

  if (isVendorDashboard) {
    const cssUrl = window.optiontics?.assets_url
      ? `${window.optiontics.assets_url}/css/admin.css`
      : undefined;

    renderInShadowDom(<App />, {
      element: container,
      cssUrl
    });
  } else {
    const rootEl = ReactDOM.createRoot(container);
    rootEl.render(<App />);
  }
}
