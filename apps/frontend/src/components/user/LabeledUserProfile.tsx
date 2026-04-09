import UserProfile from "@/components/user/UserProfile";
import type { UserBase } from "@board/shared";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface State {
  label: string;
  user: UserBase;
  size?: "sm" | "md";
}

type Props = State;

export default function LabeledUserProfile({ label, user, size }: Props) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <UserProfile user={user} size={size} />
    </Box>
  );
}
