import type { GetTaskPreviewResponseDto } from "@board/shared";
import { SECTION_TYPE } from "@board/shared";
import Box from "@mui/material/Box";
import SortableTaskCard from "../task/SortableTaskCard";
import BoardColumn from "./BoardColumn";

interface State {
  tasks: GetTaskPreviewResponseDto[];
  isLoading: boolean;
}

interface Actions {
  onPreview(task: GetTaskPreviewResponseDto): void;
  onEdit(task: GetTaskPreviewResponseDto): void;
  onDelete(id: string): void;
}

type Props = State & Actions;

export default function BoardContainer({ tasks, isLoading, onPreview, onEdit, onDelete }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        flexGrow: 1,
        overflowX: "auto",
        overflowY: "hidden",
        alignItems: "flex-start",
      }}
    >
      {Object.values(SECTION_TYPE).map((section) => {
        const columnTasks = tasks.filter((task) => task.section === section).sort((a, b) => a.position - b.position);

        return (
          <BoardColumn key={section} section={section} tasks={columnTasks} isLoading={isLoading}>
            {columnTasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onPreview={(task) => onPreview(task)}
                onEdit={(task) => onEdit(task)}
                onDelete={(id) => onDelete(id)}
              />
            ))}
          </BoardColumn>
        );
      })}
    </Box>
  );
}
