const express = require("express");
const task_router = require("./routes/taskRoutes");
const task_user_router=require("./routes/userRoutes");

const app = express();
const port = 3001;
//hello
app.use(express.json());

// routes middleware(to use routerfile)
app.use("/task", task_router);
app.use("/user",task_user_router);

app.listen(port, () => {
  console.log("Server is running on port ", port);
});
