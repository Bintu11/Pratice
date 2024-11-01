const mysql=require("mysql2");
const connection=mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"",
    database:"mini_task_manager"
});

connection.connect((err)=>{
    if(err){
    console.log("error occerded on connection");
    }
    console.log("database connected");
    
});
module.exports=connection;

