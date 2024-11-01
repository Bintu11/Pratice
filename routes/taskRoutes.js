

const { Router } = require("express");
const {
  createTask,
  getAllTask,
  updateTask,
  deleteTasksById,
  getTasksById
} = require("../controllers/taskcontroller");

const router = Router();

router.post("/create", createTask);
router.get("/getAll", getAllTask);
router.get("/getTasks/:id",getTasksById );
router.put("/update/:id", updateTask);
router.delete("/delete/:id",deleteTasksById );


// router.get("/tasks", getAllTasks);

module.exports = router;
