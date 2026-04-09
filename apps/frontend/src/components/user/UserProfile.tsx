import type { UserBase } from "@board/shared";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface State {
  user: UserBase;
  size?: "sm" | "md";
}

type Props = State;

export default function UserProfile({ user, size = "md" }: Props) {
  const name = `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`;
  const avatarSx = size === "sm" ? { width: 28, height: 28, fontSize: 12 } : { width: 32, height: 32 };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar src={user.avatarUrl ?? undefined} alt={name} sx={avatarSx} />
      <Box>
        <Typography variant="body2" lineHeight={1.3}>
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary" lineHeight={1.3}>
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
}
