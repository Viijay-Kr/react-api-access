import restify from "restify";
import cors from "cors";
interface TODO {
  id: string;
  name: string;
  isDone: boolean;
}
const TODOS: TODO[] = [];

// create a resitfy server
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());
// use restify cors plugin
server.use(cors());

// Create a get todos route
server.get("/todos", (req, res, next) => {
  res.send(200, TODOS);
  return next();
});

// create a add todo route
server.post("/add-todo", (req, res, next) => {
  const todo: TODO = req.body;
  todo.id = Math.random().toString();
  TODOS.push(todo);
  res.send(201);
  return next();
});

// create a delete todo route
server.del("/delete-todo/:id", (req, res, next) => {
  const id = req.params.id;
  const index = TODOS.findIndex((todo) => todo.id === id);
  TODOS.splice(index, 1);
  res.send(200);
  return next();
});

// create a update todo route
server.put("/update-todo/:id", (req, res, next) => {
  const id = req.params.id;
  const isDone = req.body.isDone;
  const index = TODOS.findIndex((todo) => todo.id === id);
  TODOS[index].isDone = isDone;
  res.send(200);
  return next();
});

// listen the server at localhost:7000
server.listen(7000, () => {
  console.log("server is listening at port http://localhost:7000");
});
