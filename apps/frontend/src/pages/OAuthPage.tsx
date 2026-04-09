import { AuthService } from "@/api/auth";
import { useFetch } from "@/hooks/useFetch";
import { useAuthStore } from "@/stores/auth";
import { ROUTE } from "@/utils/constants/route.constant";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { request } = useFetch();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      navigate(ROUTE.AUTH, { replace: true });
      return;
    }

    const handleAuth = async () => {
      setAccessToken(token);
      await request(AuthService.getMe);
      navigate(ROUTE.BOARD, { replace: true });
    };

    handleAuth();
  }, [searchParams, navigate, setAccessToken, request]);

  return <p>Authentication...</p>;
}
