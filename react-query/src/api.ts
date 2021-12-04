import { useMutation, useQuery, useQueryClient } from "react-query";

interface Todo {
  id: string;
  name: string;
  isDone: boolean;
}
const BASE_URL = "http://localhost:7000/api";
export const useGetAllTodos = () => {
  const { data, error, isLoading, refetch } = useQuery<Todo[]>("todos", () => {
    return fetch(`${BASE_URL}/todos`).then((res) => res.json());
  });
  return { data, error, isLoading, refetch };
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  const updateTodo = ({ id, isDone }: { id: string; isDone: boolean }) => {
    return fetch(`${BASE_URL}/update-todo/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        id,
        isDone,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  return useMutation<Todo, {}, { id: string; isDone: boolean }>(updateTodo, {
    onSuccess: (data) => {
      queryClient.setQueryData<Todo[]>("todos", (prevData = []) => {
        return prevData.map((todo) => {
          if (todo.id === data.id) {
            return data;
          }
          return todo;
        });
      });
    },
    mutationKey: "updateTodo",
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  const createTodo = ({ name }: { name: string }) => {
    return fetch(`${BASE_URL}/add-todo`, {
      method: "POST",
      body: JSON.stringify({
        name,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };
  return useMutation<Todo, {}, { name: string }>(createTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
    mutationKey: "createTodo",
  });
};

// create a  hook called useDeleteTodo which deletes a todo and invalidates the todos query
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const deleteTodo = ({ id }: { id: string }) => {
    return fetch(`${BASE_URL}/delete-todo/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
  };
  return useMutation<Todo, {}, { id: string }>(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
    mutationKey: "deleteTodo",
  });
};
