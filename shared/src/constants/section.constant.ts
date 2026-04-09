export const SECTION_TYPE = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  REVIEW: "review",
  DONE: "done",
} as const;

export const SECTION_LABELS = {
  [SECTION_TYPE.TODO]: "To Do",
  [SECTION_TYPE.IN_PROGRESS]: "In Progress",
  [SECTION_TYPE.REVIEW]: "Review",
  [SECTION_TYPE.DONE]: "Done",
} as const;
