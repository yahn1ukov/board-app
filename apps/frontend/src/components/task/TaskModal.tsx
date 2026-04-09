import { TaskService } from "@/api/task";
import { UserService } from "@/api/user";
import LabeledUserProfile from "@/components/user/LabeledUserProfile";
import UserProfile from "@/components/user/UserProfile";
import { useFetch } from "@/hooks/useFetch";
import { useBoardStore } from "@/stores/board";
import { MODAL_TYPE, TITLE_TYPE } from "@/utils/constants/modal.constant";
import { formatDate } from "@/utils/formatters";
import type { ModalType } from "@/utils/types/modal.type";
import {
  SECTION_LABELS,
  SECTION_TYPE,
  type CreateTaskRequestDto,
  type GetTaskPreviewResponseDto,
  type GetUserResponseDto,
  type SectionType,
  type UpdateTaskRequestDto,
} from "@board/shared";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

interface State {
  open: boolean;
}

interface Actions {
  onClose(): void;
}

interface CreateState extends State {
  mode: typeof MODAL_TYPE.CREATE;
  task?: never;
  defaultSection?: SectionType;
}

interface PreviewEditState extends State {
  mode: typeof MODAL_TYPE.PREVIEW | typeof MODAL_TYPE.EDIT;
  task: GetTaskPreviewResponseDto;
  defaultSection?: never;
}

type Props = (CreateState | PreviewEditState) & Actions;

type FormState = CreateTaskRequestDto | UpdateTaskRequestDto;

export default function TaskModal({ open, onClose, mode, task, defaultSection }: Props) {
  const [currentMode, setCurrentMode] = useState<ModalType>(mode);
  const [users, setUsers] = useState<GetUserResponseDto[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<GetUserResponseDto | null>(null);
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    section: SECTION_TYPE.TODO,
    assigneeId: "",
  });

  const boardTask = useBoardStore((state) => state.task);
  const createTask = useBoardStore((state) => state.createTask);

  const { isLoading: isSaving, request } = useFetch();

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadUsers = async () => {
      const result = await UserService.getAll();
      setUsers(result);
    };

    loadUsers();
  }, [open]);

  useEffect(() => {
    if (!open || !task) {
      return;
    }

    const loadTask = async () => {
      await TaskService.getTask(task.id);
    };

    loadTask();
  }, [open, task]);

  useEffect(() => {
    if (!boardTask || !task || boardTask.id !== task.id) {
      return;
    }

    const assignee = users.find((user) => user.email === boardTask.assignee.email) ?? null;
    setSelectedAssignee(assignee);

    setForm({
      title: boardTask.title,
      description: boardTask.description,
      section: boardTask.section,
      assigneeId: assignee?.id ?? "",
    });
  }, [boardTask, task, users]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setCurrentMode(mode);

    if (mode === MODAL_TYPE.CREATE) {
      setForm((prev) => ({ ...prev, section: defaultSection ?? SECTION_TYPE.TODO }));
      setSelectedAssignee(null);
    }
  }, [open, mode, defaultSection]);

  function handleChange({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleAssigneeChange(user: GetUserResponseDto | null) {
    setSelectedAssignee(user);
    setForm((prev) => ({ ...prev, assigneeId: user?.id ?? "" }));
  }

  async function handleSave() {
    if (currentMode === MODAL_TYPE.CREATE) {
      createTask(form as CreateTaskRequestDto);
      onClose();
      return;
    }

    if (currentMode === MODAL_TYPE.EDIT && task) {
      await request(() => TaskService.updateTask(task.id, form as UpdateTaskRequestDto));
      onClose();
    }
  }

  return (
    <Dialog open={open} onClose={() => onClose()} fullWidth maxWidth="sm" scroll="paper">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {TITLE_TYPE[currentMode]}
        <IconButton size="small" onClick={() => onClose()} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {currentMode === MODAL_TYPE.PREVIEW ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              {form.title ?? ""}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Status
                </Typography>
                <Typography variant="body2">{SECTION_LABELS[form.section ?? SECTION_TYPE.TODO]}</Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Created
                </Typography>
                <Typography variant="body2">{boardTask ? formatDate(boardTask.createdAt) : ""}</Typography>
              </Box>
            </Box>

            <Divider />

            {boardTask && <LabeledUserProfile label="Author" user={boardTask.author} />}

            {boardTask && <LabeledUserProfile label="Assignee" user={boardTask.assignee} />}

            <Divider />

            <Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                Description
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {form.description ?? ""}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField label="Title" name="title" value={form.title ?? ""} onChange={handleChange} fullWidth />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="section" value={form.section ?? SECTION_TYPE.TODO} label="Status" onChange={handleChange}>
                {(Object.entries(SECTION_LABELS) as [SectionType, string][]).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              options={users}
              value={selectedAssignee}
              onChange={(_, user) => handleAssigneeChange(user)}
              getOptionLabel={(user) => `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, user) => {
                const { key, ...rest } = props;
                return (
                  <Box component="li" key={key} {...rest}>
                    <UserProfile user={user} size="sm" />
                  </Box>
                );
              }}
              renderInput={(params) => <TextField {...params} label="Assignee" />}
            />

            <TextField
              label="Description"
              name="description"
              value={form.description ?? ""}
              onChange={handleChange}
              multiline
              rows={6}
              fullWidth
            />
          </Box>
        )}
      </DialogContent>

      {currentMode !== MODAL_TYPE.PREVIEW && (
        <DialogActions>
          <Button onClick={() => onClose()}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleSave()}
            disabled={isSaving || !form.title || !form.assigneeId}
            loading={isSaving}
            loadingPosition="start"
          >
            Save
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
