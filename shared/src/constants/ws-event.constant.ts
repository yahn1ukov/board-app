export const WS_EVENT = {
  TASK: {
    CREATED: "task:created",
    UPDATED: "task:updated",
    DELETED: "task:deleted",
  },
  SYSTEM: {
    JOINED: "system:joined",
    LOGOUT: "system:logout",
  },
} as const;
