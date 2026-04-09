export const WS_EVENT = {
  CONNECT: "connect",
  SYSTEM: {
    JOINED: "system:joined",
    LOGOUT: "system:logout",
  },
  TASK: {
    CREATED: "task:created",
    UPDATED: "task:updated",
    DELETED: "task:deleted",
  },
} as const;
