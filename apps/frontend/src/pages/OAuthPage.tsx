import { useAuthStore } from "@/stores/auth";
import { ROUTE } from "@/utils/constants/route.constant";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setAccessToken(token);

      navigate(ROUTE.BOARD, { replace: true });
    } else {
      navigate(ROUTE.AUTH, { replace: true });
    }
  }, [searchParams, navigate, setAccessToken]);

  return <p>Authentication...</p>;
}
