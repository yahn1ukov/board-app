import { AuthService } from "@/api/auth";
import { useAuthStore } from "@/stores/auth";
import { useBoardStore } from "@/stores/board";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState, type MouseEvent } from "react";

interface Actions {
  onAddTask(): void;
}

type Props = Actions;

export default function BoardHeader({ onAddTask }: Props) {
  const onlineUsers = useBoardStore((state) => state.onlineUsers);
  const logout = useAuthStore((state) => state.logout);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  function handleOpenPopover(event: MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClosePopover() {
    setAnchorEl(null);
  }

  async function handleLogout() {
    await AuthService.logout();
    logout();
  }

  const open = Boolean(anchorEl);

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Box
          onClick={(event) => handleOpenPopover(event)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <AvatarGroup
            max={4}
            slotProps={{
              additionalAvatar: { sx: { width: 28, height: 28, fontSize: 12 } },
            }}
            sx={{ "& .MuiAvatar-root": { width: 28, height: 28, fontSize: 12 } }}
          >
            {onlineUsers.map((user) => (
              <Avatar key={user.id} src={user.avatarUrl ?? undefined} alt={user.email} />
            ))}
          </AvatarGroup>

          <Typography variant="body2">{onlineUsers.length} online</Typography>
        </Box>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => handleClosePopover()}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <List dense sx={{ minWidth: 220, py: 1 }}>
            {onlineUsers.map((user) => (
              <ListItem key={user.id}>
                <ListItemAvatar>
                  <Avatar src={user.avatarUrl ?? undefined} alt={user.email} sx={{ width: 32, height: 32 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`}
                  secondary={user.email}
                />
              </ListItem>
            ))}
          </List>
        </Popover>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => onAddTask()}
          sx={{ mr: 1 }}
        >
          Add Task
        </Button>

        <IconButton color="inherit" onClick={() => handleLogout()} title="Logout">
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
