import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { OrganisationPage } from "./pages/OrganisationPage";
import { SheetPage } from "./pages/SheetPage";
import { ReportPage } from "./pages/ReportPage";
import { OperatorPage } from "./pages/OperatorPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/operator" element={<OperatorPage />} />
      <Route path="/organisation" element={<OrganisationPage />} />
      <Route path="/sheet/:sheetId" element={<SheetPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/scope-1" element={<Navigate to="/sheet/fuels" replace />} />
      <Route path="/scope-2" element={<Navigate to="/sheet/energy" replace />} />
      <Route path="/scope-3" element={<Navigate to="/sheet/wtt-fuels" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
