const connection = require("../database/db_config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRound = 10;
const secret = "apiman_backend_batch";

exports.registration = async (req, res) => {
  try {
    const { name, phoneno, password } = req.body;

    connection.query(
      "SELECT * FROM task_users WHERE phoneno = ?",
      [phoneno],
      async (err, result) => {
        if (err) {
          return res.status(500).send({
            status: 500,
            success: false,
            message: `Failed to verify user`,
            data: null,
          });
        }
        if (result.length === 1)
          return res.status(200).send({
            status: 200,
            success: true,
            message: "User already exists",
            data: null,
          });

        const salt = await bcrypt.genSalt(saltRound);
        console.log("salt", salt);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("hash", hashedPassword);

        connection.query(
          "INSERT INTO task_users (name, phoneno, password) VALUES (?, ?, ?)",
          [name, phoneno, hashedPassword],
          (err, result) => {
            if (err) {
              return res.status(500).send({
                status: 500,
                success: false,
                message: `Failed to register user`,
                data: null,
              });
            }

            if (result.affectedRows > 0) {
              return res.status(201).send({
                status: 201,
                success: true,
                message: "User registration successfully",
                data: null,
              });
            }
          }
        );
      }
    );
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success: false,
      message: `Failed to create task ${err}`,
      data: null,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { phoneno, password } = req.body;

    connection.query(
      "SELECT * FROM task_users WHERE phoneno = ?",
      [phoneno],
      async (err, result) => {
        if (err) {
          return res.status(500).send({
            status: 500,
            success: false,
            message: `Failed to verify user`,
            data: null,
          });
        }
        if (result.length !== 1)
          return res.status(200).send({
            status: 200,
            success: true,
            message: "User not exists",
            data: null,
          });

        const comparePassword = await bcrypt.compare(
          password,
          result[0].password
        );

        if (!comparePassword)
          return res.status(401).send({
            status: 401,
            success: false,
            message: "Password Mismatch",
            data: null,
          });

        const token = jwt.sign(
          { id: result[0].user_id, name: result[0].name },
          secret,
          { expiresIn: '1h' }
        );
       //token does not store in the database
        return res.status(200).send({
          status: 200,
          success: true,
          message: "User Login Successful",
          data: {
            user: result[0],
            token,
          },
        });
      }
    );
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success: false,
      message: `Failed to create task ${err}`,
      data: null,
    });
  }
};

exports.profileData = async (req, res) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).send({
        status: 401,
        success: false,
        message: "Token not found",
        data: null,
      });
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    
    const decode = jwt.verify(token, secret);
    console.log(decode);
    connection.query(
      "SELECT * FROM task_users WHERE user_id = ?",
      [decode.id],
      (err, result) => {
        if (err) {
          return res.status(500).send({
            status: 500,
            success: false,
            message: `Failed to get user data`,
            data: null,
          });
        }

        if (result.length === 1) {
          return res.status(200).send({
            status: 200,
            success: true,
            message: "User Data",
            data: result[0]
          });
        } else {
          return res.status(400).send({
            status: 400,
            success: true,
            message: "User Not found",
            data: null,
          });
        }
      }
    );
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success: false,
      message: `Failed to Get user profile data ${err}`,
      data: null,
    });
  }
};

