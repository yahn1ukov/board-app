export const MODAL_TYPE = {
  CREATE: "create",
  PREVIEW: "preview",
  EDIT: "edit",
} as const;

export const TITLE_TYPE = {
  [MODAL_TYPE.CREATE]: "New Task",
  [MODAL_TYPE.PREVIEW]: "Task Details",
  [MODAL_TYPE.EDIT]: "Edit Task",
} as const;
