import { AuthCard } from "@/components/auth/AuthCard";
import { AuthTitle } from "@/components/auth/AuthTitle";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import OAuthButton from "@/components/auth/OAuthButton";
import { API_ENDPOINT, PROVIDER_TYPE } from "@board/shared";
import GoogleIcon from "@mui/icons-material/Google";

export default function AuthPage() {
  function handleOAuth(callbackUrl: string) {
    window.location.href = `${import.meta.env.VITE_BASE_HTTP_URL}/${callbackUrl}`;
  }

  return (
    <AuthWrapper>
      <AuthCard>
        <AuthTitle>Authorization</AuthTitle>

        <OAuthButton
          icon={GoogleIcon}
          provider={PROVIDER_TYPE.GOOGLE}
          onClick={() => handleOAuth(`${API_ENDPOINT.AUTH.INDEX}/${API_ENDPOINT.AUTH.GOOGLE}`)}
        />
      </AuthCard>
    </AuthWrapper>
  );
}
