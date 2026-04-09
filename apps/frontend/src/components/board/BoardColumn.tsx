import type { GetTaskPreviewResponseDto } from "@board/shared";
import { SECTION_LABELS, type SectionType } from "@board/shared";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

interface State {
  section: SectionType;
  tasks: GetTaskPreviewResponseDto[];
  isLoading?: boolean;
  children: React.ReactNode;
}

type Props = State;

export default function BoardColumn({ section, tasks, isLoading, children }: Props) {
  const { setNodeRef } = useDroppable({ id: section });

  return (
    <Paper
      elevation={2}
      sx={{
        flex: 1,
        minWidth: 200,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
      }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {SECTION_LABELS[section]}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </Typography>
      </Box>

      <Box ref={setNodeRef} sx={{ overflowY: "auto", flexGrow: 1, px: 1, py: 1 }}>
        {isLoading ? (
          <Skeleton variant="rounded" height={80} sx={{ mb: 1 }} />
        ) : (
          <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
            {children}
          </SortableContext>
        )}
      </Box>
    </Paper>
  );
}
