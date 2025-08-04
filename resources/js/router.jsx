// src/router.jsx
import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "./Layout/PublicLayout";
import ProtectedRoute from "./auth/ProtectedRoute";
import { Navigate } from "react-router-dom";

import RegisterPage from './pages/auth/Register';
import LoginPage from "./pages/auth/Login";
import MemberDashboard from "./pages/member/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import Home from "./pages/Frontend/Home";
import About from "./pages/Frontend/About";
import Contact from "./pages/Frontend/Contact";
import PrivacyPolicy from "./pages/Frontend/PrivacyPolicy";
import Message from "./components/Message";
import District from "./pages/admin/ParentData/District/District";
import DistrictCreate from "./pages/admin/ParentData/District/DistrictCreate";
import DistrictEdit from "./pages/admin/ParentData/District/DistrictEdit";
import {AdminLayout, MemberLayout} from "./Layout/BackendLayout";
import DistrictShow from "./pages/admin/ParentData/District/DistrictShow";
import DistrictTrash from "./pages/admin/ParentData/District/DistrictTrash";
import Municipality from "./pages/admin/ParentData/Municipality/Municipality";
import MunicipalityCreate from "./pages/admin/ParentData/Municipality/MunicipalityCreate";
import MunicipalityShow from "./pages/admin/ParentData/Municipality/MunicipalityShow";
import MunicipalityEdit from "./pages/admin/ParentData/Municipality/MuniciplaityEdit";
import MunicipalityTrash from "./pages/admin/ParentData/Municipality/MunicipalityTrash";
import WardCreate from "./pages/admin/ParentData/Ward/wardCreate";
import Ward from "./pages/admin/ParentData/Ward/Ward";
import WardEdit from "./pages/admin/ParentData/Ward/WardEdit";
import WardShow from "./pages/admin/ParentData/Ward/WardShow";
import WardTrash from "./pages/admin/ParentData/Ward/WardTrash";
import Gender from "./pages/admin/ParentData/Gender/Gender";
import GenderCreate from "./pages/admin/ParentData/Gender/GenderCreate";
import GenderEdit from "./pages/admin/ParentData/Gender/GenderEdit";
import GenderShow from "./pages/admin/ParentData/Gender/GenderShow";
import GenderTrash from "./pages/admin/ParentData/Gender/GenderTrash";
import KycMember from "./pages/member/kyc/Kyc";
import KycCreate from "./pages/member/kyc/KycCreate";
import KycShowMember from "./pages/member/kyc/KycShow";
import KycEdit from "./pages/member/kyc/KycEdit";
import KycIndex from "./pages/admin/kyc/Kyc";
import KycShowAdmin from "./pages/admin/kyc/KycShow";
import KycTrash from "./pages/admin/kyc/KycTrash";
import User from "./pages/admin/user/User";
import UserShow from "./pages/admin/user/UserShow";
import UserEdit from "./pages/admin/user/UserEdit";
import UserTrash from "./pages/admin/user/UserTrash";
import AdminProfile from "./pages/admin/Profile";
import MemberShow from "./pages/member/user/MemberShow";
import MemberEdit from "./pages/member/user/MemberEdit";

const router = createBrowserRouter([
  {
    path: "/message",
    element: <Message />,
  },
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about-us", element: <About /> },
      { path: "contact-us", element: <Contact /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      {
        path: "register/:role",
        element: <RegisterPage />,
      },
      {
        path: "login/:role",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/member",
    element: <MemberLayout/>,
    children: [
      { index: true, element: <Navigate to="dashboard"/>},
      { path: 'dashboard', element: <MemberDashboard />},

      { path: "user/:id", element: <MemberShow /> },
      { path: "user/:id/edit", element: <MemberEdit /> },

      { path: 'kyc', element: <KycMember />},
      { path: 'kyc/create', element: <KycCreate />},
      { path: 'kyc/:id', element: <KycShowMember />},
      { path: 'kyc/:id/edit', element: <KycEdit />},
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout/>,
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <AdminDashboard /> }, 

      { path: "admin-profile", element: <AdminProfile /> },
      
      { path: "user", element: <User /> },
      { path: "user/:id", element: <UserShow /> },
      { path: "user/:id/edit", element: <UserEdit /> },
      { path: "user/trash", element: <UserTrash /> },

      // for district 
      { path: "parent-data/district", element: <District /> },
      { path: "parent-data/district/create", element: <DistrictCreate /> },
      { path: "parent-data/district/:id", element: <DistrictShow /> },
      { path: "parent-data/district/:id/edit", element: <DistrictEdit /> },
      { path: "parent-data/district/trash", element: <DistrictTrash /> },
      
      // for municipality
      { path: "parent-data/municipality", element: <Municipality /> },
      { path: "parent-data/municipality/create", element: <MunicipalityCreate /> },
      { path: "parent-data/municipality/:id", element: <MunicipalityShow /> },
      { path: "parent-data/municipality/:id/edit", element: <MunicipalityEdit /> },
      { path: "parent-data/municipality/trash", element: <MunicipalityTrash /> },
      
      // for ward
      { path: "parent-data/ward", element: <Ward /> },
      { path: "parent-data/ward/create", element: <WardCreate /> },
      { path: "parent-data/ward/:id", element: <WardShow /> },
      { path: "parent-data/ward/:id/edit", element: <WardEdit /> },
      { path: "parent-data/ward/trash", element: <WardTrash /> },
      
      // for gender
      { path: "parent-data/gender", element: <Gender /> },
      { path: "parent-data/gender/create", element: <GenderCreate /> },
      { path: "parent-data/gender/:id", element: <GenderShow /> },
      { path: "parent-data/gender/:id/edit", element: <GenderEdit /> },
      { path: "parent-data/gender/trash", element: <GenderTrash /> },

      // for kyc
      { path: 'kyc', element: <KycIndex />},
      { path: 'kyc/:id', element: <KycShowAdmin />},
      { path: 'kyc/trash', element: <KycTrash />},
    ],
  },
]);

export default router;
