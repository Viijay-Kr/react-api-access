import { DeleteIcon } from "@chakra-ui/icons";
import { Checkbox, Input, Stack, Text } from "@chakra-ui/react";
import React, { useCallback } from "react";
import "./App.css";
import {
  useGetAllTodos,
  useDeleteTodo,
  useCreateTodo,
  useUpdateTodo,
} from "./api";

export default function App() {
  return (
    <Stack spacing={2} direction={"column"} alignItems={"start"} my={5} mx={10}>
      <Text as="b">React Query</Text>
      <AddToDo />
      <Todos />
    </Stack>
  );
}

const Todos = () => {
  const { data: todos } = useGetAllTodos();
  const { mutate: deleteTodo } = useDeleteTodo();
  const { mutate: updateTodo } = useUpdateTodo();
  return (
    <Stack spacing={2} direction="column">
      {todos?.map((todo) => (
        <Stack key={todo.id} spacing={2} align={"center"} direction={"row"}>
          <Checkbox
            style={{ textDecoration: todo.isDone ? "line-through" : "none" }}
            onChange={() => {
              updateTodo({
                id: todo.id,
                isDone: !todo.isDone,
              });
            }}
            size="sm"
            outline={"none"}
            colorScheme={"green"}
            defaultChecked={todo.isDone}
          >
            {todo.name}
          </Checkbox>
          <DeleteIcon
            onClick={() => deleteTodo({ id: todo.id })}
            cursor={"pointer"}
            w={3}
            h={3}
            color="red.500"
          />
        </Stack>
      ))}
    </Stack>
  );
};

const AddToDo = () => {
  const { mutate: addToDo } = useCreateTodo();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const onAddTodo = useCallback(
    (event) => {
      if (inputRef.current && event.key === "Enter") {
        addToDo({
          name: inputRef.current?.value,
        });
        inputRef.current.value = "";
      }
    },
    [addToDo]
  );

  return (
    <Input
      ref={inputRef}
      onKeyPress={onAddTodo}
      placeholder="Add ToDo"
      type={"text"}
      size={"sm"}
      width={"100%"}
    />
  );
};
