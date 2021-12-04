import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Todo } from "./todo.types";

export const todosApi = createApi({
  reducerPath: "todos",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:7000/api" }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getAllTodos: builder.query<Todo[], void>({
      query: () => "/todos",
      providesTags: (result = []) =>
        result
          ? [
              ...result.map((t) => ({ type: "Todos" as const, id: t.id })),
              {
                type: "Todos" as const,
                id: "LIST",
              },
            ]
          : [{ type: "Todos" as const, id: "LIST" }],
    }),
    updateTodo: builder.mutation<Todo, { isDone: boolean; id: string }>({
      query: ({ id, isDone }) => ({
        url: `/update-todo/${id}`,
        method: "PUT",
        body: { isDone },
      }),
      invalidatesTags: ["Todos"],
      // onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
      //   try {
      //     const { data: updatedTodo } = await queryFulfilled;
      //     dispatch(
      //       todosApi.util.updateQueryData("getAllTodos", undefined, (draft) => {
      //         return draft.map((todo) => (todo.id === id ? updatedTodo : todo));
      //       })
      //     );
      //   } catch (e) {}
      // },
    }),
    addTodo: builder.mutation<Todo, { name: string }>({
      query: ({ name }) => ({
        url: `/add-todo`,
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["Todos"],
    }),
    deleteTodo: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/delete-todo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todos"],
    }),
  }),
});

export const {
  useGetAllTodosQuery,
  useUpdateTodoMutation,
  useAddTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
