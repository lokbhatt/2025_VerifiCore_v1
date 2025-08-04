import { Outlet } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import MainLayout from "./admin/MainLayout";
import MainLayoutM from "./member/MainLayout";

function MemberLayout(){
    return(
      <ProtectedRoute allowedRoles={["member"]}>
        <MainLayoutM>
            <Outlet/>
        </MainLayoutM>
      </ProtectedRoute>
    );
};

function AdminLayout(){
    return(
        <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
                <Outlet/>
            </MainLayout>
        </ProtectedRoute>
    );
};

export {AdminLayout, MemberLayout};