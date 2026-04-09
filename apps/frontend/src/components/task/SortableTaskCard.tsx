import type { GetTaskPreviewResponseDto } from "@board/shared";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Box from "@mui/material/Box";
import TaskCard from "./TaskCard";

interface State {
  task: GetTaskPreviewResponseDto;
}

interface Actions {
  onPreview(task: GetTaskPreviewResponseDto): void;
  onEdit(task: GetTaskPreviewResponseDto): void;
  onDelete(id: string): void;
}

type Props = State & Actions;

export default function SortableTaskCard({ task, onPreview, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onPreview={(task) => onPreview(task)}
        onEdit={(task) => onEdit(task)}
        onDelete={(id) => onDelete(id)}
      />
    </Box>
  );
}
