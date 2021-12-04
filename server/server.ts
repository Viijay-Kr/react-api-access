import restify from "restify";
import corsMiddleware from "restify-cors-middleware";

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
const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ["http://localhost:3000"],

  allowHeaders: ["API-Token"],
  exposeHeaders: ["API-Token-Expiry"],
});

server.pre(cors.preflight);
server.use(cors.actual);

// Create a get todos route
server.get("/api/todos", (req, res, next) => {
  res.send(200, TODOS);
  return next();
});

// create a add todo route
server.post("/api/add-todo", (req, res, next) => {
  const todo: TODO = {
    ...req.body,
    id: String(Math.random()),
    isDone: false,
  };
  TODOS.push(todo);
  res.send(200, todo);
  return next();
});

// create a delete todo route
server.del("/api/delete-todo/:id", (req, res, next) => {
  const id = req.params.id;
  const index = TODOS.findIndex((todo) => todo.id === id);
  res.send(200, TODOS.splice(index, 1));
  return next();
});

// create a update todo route
server.put("/api/update-todo/:id", (req, res, next) => {
  const id = req.params.id;
  const isDone = req.body.isDone;
  const index = TODOS.findIndex((todo) => todo.id === id);
  TODOS[index].isDone = isDone;
  res.send(200, TODOS[index]);
  return next();
});

// listen the server at localhost:7000
server.listen(7000, () => {
  console.log("server is listening at port http://localhost:7000");
});
