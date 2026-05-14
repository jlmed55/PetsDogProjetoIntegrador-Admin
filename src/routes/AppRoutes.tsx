import { Route, Routes, BrowserRouter } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";
import { UnauthorizePage } from "../pages/UnauthorizePage";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<PublicRoutes />} />
                <Route path="/app/*" element={<PrivateRoutes />} />
                <Route path="/unauthorized" element={<UnauthorizePage />} />
            </Routes>
        </BrowserRouter>
    );
}