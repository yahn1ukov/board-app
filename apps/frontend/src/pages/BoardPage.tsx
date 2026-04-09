import { TaskService } from "@/api/task";
import { UserService } from "@/api/user";
import BoardContainer from "@/components/board/BoardContainer";
import BoardHeader from "@/components/board/BoardHeader";
import TaskCard from "@/components/task/TaskCard";
import TaskModal from "@/components/task/TaskModal";
import { useFetch } from "@/hooks/useFetch";
import { useBoardStore } from "@/stores/board";
import { MODAL_TYPE } from "@/utils/constants/modal.constant";
import type { ModalState } from "@/utils/types/modal.type";
import { SECTION_TYPE, type GetTaskPreviewResponseDto, type SectionType } from "@board/shared";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";

export default function BoardPage() {
  const { isLoading, request } = useFetch();

  const { tasks, onlineUsers, connect, disconnect } = useBoardStore();

  const [modal, setModal] = useState<ModalState>({ open: false });
  const [activeTask, setActiveTask] = useState<GetTaskPreviewResponseDto | null>(null);

  useEffect(() => {
    connect(async () => {
      await request(UserService.getOnlineUsers);
    });

    const init = async () => {
      await request(TaskService.getTasks);
    };

    init();

    return () => disconnect();
  }, [request, connect, disconnect]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((task) => task.id === event.active.id);

    setActiveTask(task ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) {
      return;
    }

    const GAP = 1000;
    const overId = String(over.id);

    const isSection = Object.values<string>(SECTION_TYPE).includes(overId);
    const section: SectionType = isSection
      ? (overId as SectionType)
      : (tasks.find((task) => task.id === overId)?.section ?? activeTask.section);

    const sortedColumnTasks = tasks
      .filter((task) => task.section === section && task.id !== activeTask.id)
      .sort((a, b) => a.position - b.position);

    let position: number;

    if (isSection) {
      const last = sortedColumnTasks[sortedColumnTasks.length - 1];
      position = last ? last.position + GAP : GAP;
    } else {
      const overIndex = sortedColumnTasks.findIndex((task) => task.id === overId);

      if (overIndex === -1) {
        const last = sortedColumnTasks[sortedColumnTasks.length - 1];
        position = last ? last.position + GAP : GAP;
      } else if (overIndex === 0) {
        position = sortedColumnTasks[0].position / 2;
      } else {
        const before = sortedColumnTasks[overIndex - 1];
        const after = sortedColumnTasks[overIndex];
        position = (before.position + after.position) / 2;
      }
    }

    if (activeTask.section === section && activeTask.position === position) {
      return;
    }

    await TaskService.updateTask(activeTask.id, { section, position });
  }

  function handleOpenModal(mode: typeof MODAL_TYPE.PREVIEW | typeof MODAL_TYPE.EDIT, task: GetTaskPreviewResponseDto) {
    setModal({ open: true, mode, task });
  }

  function handleOpenCreate() {
    setModal({
      open: true,
      mode: MODAL_TYPE.CREATE,
      defaultSection: SECTION_TYPE.TODO,
    });
  }

  async function handleDelete(id: string) {
    await TaskService.deleteTask(id);
  }

  function handleCloseModal() {
    setModal({ open: false });
  }

  const isInitialLoading = isLoading && !onlineUsers.length;

  return (
    <Box sx={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <BoardHeader onAddTask={() => handleOpenCreate()} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(event) => handleDragStart(event)}
        onDragEnd={(event) => handleDragEnd(event)}
      >
        <BoardContainer
          tasks={tasks}
          isLoading={isInitialLoading}
          onPreview={(task) => handleOpenModal(MODAL_TYPE.PREVIEW, task)}
          onEdit={(task) => handleOpenModal(MODAL_TYPE.EDIT, task)}
          onDelete={(id) => handleDelete(id)}
        />

        <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
          {activeTask && (
            <Paper elevation={6} sx={{ width: "100%", opacity: 0.95, cursor: "grabbing" }}>
              <TaskCard task={activeTask} />
            </Paper>
          )}
        </DragOverlay>
      </DndContext>

      {modal.open && modal.mode === MODAL_TYPE.CREATE && (
        <TaskModal
          open
          mode={MODAL_TYPE.CREATE}
          defaultSection={modal.defaultSection}
          onClose={() => handleCloseModal()}
        />
      )}

      {modal.open && (modal.mode === MODAL_TYPE.PREVIEW || modal.mode === MODAL_TYPE.EDIT) && (
        <TaskModal open mode={modal.mode} task={modal.task} onClose={() => handleCloseModal()} />
      )}
    </Box>
  );
}
