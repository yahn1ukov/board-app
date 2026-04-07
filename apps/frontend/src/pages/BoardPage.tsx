import { UserService } from "@/api/user";
import { useFetch } from "@/hooks/useFetch";
import { useBoardStore } from "@/stores/board";
import { useEffect } from "react";

export default function BoardPage() {
  const { isLoading, request } = useFetch();

  const { onlineUsers, connect, disconnect } = useBoardStore();

  useEffect(() => {
    connect();

    const init = async () => {
      await request(UserService.getOnlineUsers);
    };

    init();

    return () => disconnect();
  }, [request, connect, disconnect]);

  if (isLoading && !onlineUsers.length) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>Online Users</p>
      <ul>
        {onlineUsers.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}
