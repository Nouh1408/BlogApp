const express = require("express");
const mysql = require("mysql2");
const port = 3000;
const app = express();

const dbconnection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "blog",
});
dbconnection.connect((err) => {
  if (err) {
    console.log("Failed to connect to DB", err.message);
  } else {
    console.log("Logged to DB",);
  }
});
//authentication --> Registeration,Login, forgetPassw
app.use(express.json()); //global

app.post("/auth/register", (req, res, next) => {
  const { fName, lName, email, password, dob } = req.body;
  console.log({ fName, lName, email, password, dob }); //debug
  let query = `SELECT * FROM users where email =?`; //? avoids SQL injection
  dbconnection.execute(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server Error", success: false });
    }
    if (result.length > 0) {
      return res
        .status(409)
        .json({ message: "user already exist", success: false });
    }
    query = `INSERT INTO users (firstName,lastName,email,password,dob) VALUES (?,?,?,?,?)`;
    dbconnection.execute(
      query,
      [fName, lName, email, password, dob],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Server Error", success: false });
        }
        return res.status(201).json({
          message: "user created Successfully",
          success: true,
          userID: result.insertId,
        });
      }
    );
  });
});

app.post("/auth/login", (req, res, next) => {
  const { email, password } = req.body;
  console.log({ email, password });

  let query = `SELECT *  FROM users where email = ?`;
  dbconnection.execute(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "server error", success: false });
    }
    //fail case 
    if (result.length == 0 || password != result[0]["password"]) {
      return res.status(401).json({ message: "invalid", success: true });
    }
    result[0].password = null;
    return res
      .status(200)
      .json({ message: "login success", success: true, data: result[0] });
  });
});
/**
 * the get user search moved above get id because on postman they match both are get both /user.
 * the reqest user/id read the search as id
 */
app.get('/user/search',(req,res)=>{ 
  //data sent in params ==> must be sent like in id 
  // body,
  //headers
  // query
  const {name} = req.query //--> object
  let query = 'SELECT * FROM users WHERE firstname LIKE ? OR lastname LIKE ?'
  dbconnection.execute(query, [`%${name}%`, `%${name}%`], (err,result)=>{
    if(err){
      return res.status(500).json({message:"server error", success:false})
    }
    return res.status(200).json({message:"done", success:true, data:result})
  })
} )
app.get("/user/:id", (req, res, next) => {
    let {id} = req.params
  let query = "SELECT email, dob, CONCAT(firstName,' ',lastName) AS fullName, CONVERT(DATEDIFF(now() , dob)/365, INT) AS age FROM users WHERE id = ?";
  dbconnection.execute(query, [id], (err, result) => {
    if (err) {
      return res.status();
    }
    // result[0].age = Math.round(result[0].age)
    // result[0].fullname = result[0].firstName + " "+ result[0].lastName
    // result[0].firstName = undefined
    // result[0].lastName = undefined
    // result[0].age = new Date().getFullYear()  -new Date(result[0].dob).getFullYear()
    return result.length == 0
      ? res.status(400).json({ message: "user not found", success: false })
      : res
          .status(200)
          .json({ message: "user found", success: true, data:result[0]});
  });
});
//u[date]
app.put('/user/:id', (req,res)=>{
    const {id} = req.params
    const {firstName, lastName, email, password, dob} = req.body //what data to be updated
    let query = 'SELECT * FROM users where id =?'
    
    dbconnection.execute(query, [id] ,(err,result)=>{
        if(err){
            return res.status(200).json({message:"server error", success:false})
        }
        if(result.length ==0){
            return res.status(404).json({message:"user not found",success:false})
        }
        query = 'UPDATE users SET firstName = ?,lastName = ?,email = ?,password = ?,dob = ? WHERE id =?'

        dbconnection.execute(query, [
            firstName ?? result[0].firstName,
            lastName??result[0].lastName,
             email?? result[0].email,
             password?? result[0].password,
             dob?? result[0].dob,
             id,
            ],(err,result)=>{
            if(err){
                res.status(500).json({message:"sserver errror", success:false})
            }
            return res.status(200).json({message:"user updated success", success:true})
        })
    })
})
app.delete("/user/:id", (req,res)=>{
    const { id } = req.params
    let query ="UPDATE users set deleted = true where id = ?"
    dbconnection.execute(query, [id], (err,result)=>{
        if(err){
            return res.status(500).json({message:"server error", success:false})
        }
        if(result)
        return res.status(200).json({message:"deleted", success:true})
    })
})
//search


app.listen(port, () => {
  console.log("====================================");
  console.log("Application is running on port ", port);
  console.log("====================================");
});
