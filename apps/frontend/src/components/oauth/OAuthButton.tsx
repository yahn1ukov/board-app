import type { ProviderType } from "@board/shared";
import type { SvgIconComponent } from "@mui/icons-material";
import Button from "@mui/material/Button";

interface State {
  icon: SvgIconComponent;
  provider: ProviderType;
  loading?: boolean;
}

interface Actions {
  onClick(): void;
}

type Props = State & Actions;

export default function OAuthButton({ icon: Icon, provider, loading, onClick }: Props) {
  return (
    <Button variant="outlined" startIcon={<Icon />} onClick={() => onClick()} loading={loading} loadingPosition="end">
      log in with {provider}
    </Button>
  );
}
