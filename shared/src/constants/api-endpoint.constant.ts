export const API_ENDPOINT = {
  AUTH: {
    INDEX: "auth",
    GOOGLE: "google/callback",
    ME: "me",
    REFRESH: "refresh",
    LOGOUT: "logout",
  },
  USER: {
    INDEX: "users",
    ONLINE: "online",
  },
  TASK: {
    INDEX: "tasks",
    GET: ":id",
    UPDATE: ":id",
    DELETE: ":id",
  },
} as const;
