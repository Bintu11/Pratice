const connection=require("../database/db_config");
const jwt = require("jsonwebtoken");
const secret = "apiman_backend_batch";

exports.createTask = (req, res) => {
  try {
    const { name, desc } = req.body;
    console.log("req", req.body);

    const authHeader = req.headers.authorization;

    // Check if the authorization header is present
    if (!authHeader) {
      return res.status(401).send({
        status: 401,
        success: false,
        message: "Authorization header is missing",
        data: null,
      });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    console.log(token);

    // Verify the token
    let decode;
    try {
      decode = jwt.verify(token, secret);
    } catch (jwtError) {
      return res.status(401).send({
        status: 401,
        success: false,
        message: `Unauthorized: ${jwtError.message}`,
      });
    }
    console.log(decode);

    // Database query to insert the task
    connection.query(
      "INSERT INTO tasks (task_name, task_desc, user_id) VALUES (?, ?, ?)",
      [name, desc, decode.id],
      (err, result) =>{
        if (err) {
          return res.status(500).send({
            status: 500,
            success: false,
            message: `Failed to create task ${err.message}`,
          });
        }
        console.log(result);
        return res.status(201).send({
          status: 201,
          success: true,
          message: "Task created successfully",
          data: result.insertId,
        });
      }
    );
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).send({
      status: 500,
      success: false,
      message: `Failed to create task ${err.message}`,
      data: null,
    });
  }
};


  exports.updateTask = (req, res) => {
    try {
      
      const task_id = req.params.id;
      
      const authHeader = req.headers.authorization;
      
      const token=authHeader.split(" ")[1];
      console.log(token);
      const decode=jwt.verify(token,secret);
      console.log(decode);
      const user_id=decode.id;
      

      connection.query(
        "UPDATE tasks SET status = ? WHERE task_id = ? AND user_id = ?",
       
        [1,task_id,user_id],
        (err, result) => {
          if (err) {
            return res.status(500).send({
              status: 500,
              success: false,
              message: `Failed to update task ${err.message}`,
              data: null,
            });
          }
          if (result.affectedRows > 0) {
            

              return res.status(200).send({
                status: 200,
                success: true,
                message: "Task Updated Successfully",
                data: null,
              });
            
          } else {
            return res.status(400).send({
              status: 400,
              success: false,
              message: "No task found",
              data: null,
            });
          }
        }
      );
    } catch (err) {
      return res.status(500).send({
        status: 500,
        success: false,
        message: `Failed to update task${err}`,
        data: null,
      });
    }
  };
  
  exports.getAllTask = (req, res) => {
    try {

      const token=req.headers.authorization.split(" ")[1];
      console.log(token);
      const decode=jwt.verify(token,secret);
      console.log(decode);
      
      
      connection.query("SELECT * FROM tasks where user_id=?",
        [decode.id],
         (err, result) => {
        if (err) {
          return res.status(501).send({
            status: 500,
            success: false,
            message: `Failed to get task list ${err.message}`,
            data: null,
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          message: "Task List",
          data: result,
        });
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        success: false,
        message: `Failed to get task list${err}`,
        data: null,
      });
    }
  };
  

 // Get tasks by task_id
exports.getTasksById = (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);

        const token=req.headers.authorization.split(" ")[1];
        console.log(token);
        const decode=jwt.verify(token,secret);


        connection.query("SELECT * FROM tasks WHERE task_id = ?",
           [id],
           //manual test(does not read params.id)
            (err, result) => {
            if (err) {
                return res.status(500).send({
                    status: 500,
                    success: false,
                    message: `Failed to get student ${err.message }`,
                    data: null,
                });
            }
            if (result.length > 0) {
              if(result[0].user_id == decode.id) {
                return res.status(200).send({
                    status: 200,
                    success: true,
                    message: "task found",
                    data: result[0],
                });
              } else {
                return res.status(401).send({
                    status: 401,
                    success: false,
                    message: "Unauthorized to access the task",
                    data: null,
                });
              }
            } else {
                return res.status(404).send({
                    status: 404,
                    success: false,
                    message: "No student found with the given ID",
                    data: null,
                });
            }
        });
    } catch (err) {
        return res.status(500).send({
            status: 500,
            success: false,
            message: `Failed to get student by ID ${err}`,
            data: null,
        });
    }
};

// Delete task by ID
exports.deleteTasksById = (req, res) => {
    try {
        const task_id = req.params.id;
        console.log(task_id);

        const token=req.headers.authorization.split(" ")[1];
        console.log(token);
        const decode=jwt.verify(token,secret);
        const user_id=decode.id;
        console.log(user_id);
        
        
        connection.query("DELETE FROM tasks where task_id = ? and user_id=? ",
          
           [task_id,user_id],
            (err, result) => {
            if (err) {
                return res.status(500).send({
                    status: 500,
                    success: false,
                    message: `Failed to delete student ${err.message}`,
                    data: null,
                });
            }
            if (result.affectedRows > 0) {

             
                return res.status(200).send({
                  status: 200,
                  success: true,
                  message: "task deleted successfully",
                  data: null,
              });
           
            } else {
                return res.status(404).send({
                    status: 404,
                    success: false,
                    message: "No task found with the given ID",
                    data: null,
                });
            }
        });
    } catch (err) {
        return res.status(500).send({
            status: 500,
            success: false,
            message: `Failed to delete task_id by ID ${err}`,
            data: null,
        });
    }
};