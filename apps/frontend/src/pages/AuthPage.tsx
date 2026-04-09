import OAuthButton from "@/components/oauth/OAuthButton";
import { API_ENDPOINT, PROVIDER_TYPE } from "@board/shared";
import GoogleIcon from "@mui/icons-material/Google";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function AuthPage() {
  function handleOAuth(callbackUrl: string) {
    window.location.href = `${import.meta.env.VITE_BASE_HTTP_URL}/${callbackUrl}`;
  }

  return (
    <Box component="main" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ width: 320, p: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography sx={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>Authorization</Typography>

        <OAuthButton
          icon={GoogleIcon}
          provider={PROVIDER_TYPE.GOOGLE}
          onClick={() => handleOAuth(`${API_ENDPOINT.AUTH.INDEX}/${API_ENDPOINT.AUTH.GOOGLE}`)}
        />
      </Paper>
    </Box>
  );
}
