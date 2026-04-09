import LabeledUserProfile from "@/components/user/LabeledUserProfile";
import { useAuthStore } from "@/stores/auth";
import { formatDate } from "@/utils/formatters";
import type { GetTaskPreviewResponseDto } from "@board/shared";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

interface State {
  task: GetTaskPreviewResponseDto;
}

interface Actions {
  onPreview?(task: GetTaskPreviewResponseDto): void;
  onEdit?(task: GetTaskPreviewResponseDto): void;
  onDelete?(id: string): void;
}

type Props = State & Actions;

export default function TaskCard({ task, onPreview, onEdit, onDelete }: Props) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthor = !!currentUser && currentUser.id === task.author.id;

  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="body2" fontWeight={700} gutterBottom>
          {task.title}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <LabeledUserProfile label="Author" user={task.author} size="sm" />

        <LabeledUserProfile label="Assignee" user={task.assignee} size="sm" />

        <Divider sx={{ my: 1 }} />

        <Typography variant="caption" color="text.secondary">
          {formatDate(task.createdAt)}
        </Typography>
      </CardContent>

      {(onPreview || (isAuthor && (onEdit || onDelete))) && (
        <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
          {onPreview && (
            <Tooltip title="Preview">
              <IconButton size="small" onClick={() => onPreview(task)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {isAuthor && (
            <>
              {onEdit && (
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => onEdit(task)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {onDelete && (
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => onDelete(task.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </CardActions>
      )}
    </Card>
  );
}
