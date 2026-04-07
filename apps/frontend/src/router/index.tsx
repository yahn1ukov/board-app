import AuthPage from "@/pages/AuthPage";
import BoardPage from "@/pages/BoardPage";
import OAuthPage from "@/pages/OAuthPage";
import { useAuthStore } from "@/stores/auth";
import { ROUTE } from "@/utils/constants/route.constant";
import { createBrowserRouter, Navigate, Outlet, type RouteObject } from "react-router-dom";

export const PublicRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  if (accessToken) {
    return <Navigate to={ROUTE.BOARD} replace />;
  }

  return <Outlet />;
};

export const PrivateRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  if (!accessToken) {
    return <Navigate to={ROUTE.AUTH} replace />;
  }

  return <Outlet />;
};

const routes: RouteObject[] = [
  {
    element: <PublicRoute />,
    children: [
      { path: ROUTE.AUTH, element: <AuthPage /> },
      { index: true, element: <AuthPage /> },
      { path: ROUTE.OAUTH, element: <OAuthPage /> },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      { path: ROUTE.BOARD, element: <BoardPage /> },
      { index: true, element: <BoardPage /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
