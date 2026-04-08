import { TaskService } from "@/api/task";
import { UserService } from "@/api/user";
import { useFetch } from "@/hooks/useFetch";
import { useBoardStore } from "@/stores/board";
import { useEffect } from "react";

export default function BoardPage() {
  const { isLoading, request } = useFetch();

  const { tasks, onlineUsers, connect, disconnect } = useBoardStore();

  useEffect(() => {
    connect();

    const init = async () => {
      await Promise.all([request(UserService.getOnlineUsers), request(TaskService.getTasks)]);
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
      <p>Tasks</p>
      <ul>{tasks.length ? tasks.map((task) => <li key={task.id}>{task.title}</li>) : <li>No Tasks Yet</li>}</ul>
    </div>
  );
}
