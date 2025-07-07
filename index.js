const express = require("express")
const mysql = require("mysql2")
const port =3000
const app = express()

const dbconnection = mysql.createConnection({
    host:"localhost",
    port:"3306",
    user:"root",
    password:"",
    database:"blog"
})
dbconnection.connect((err)=>{
    if(err){
        console.log("Failed to connect to DB",err.message);
        
    } else{
        console.log("Logged to DB");
        
    }
})
//authentication --> Registeration,Login, forgetPassw
app.use(express.json())//global

app.post("/auth/register", (req,res,next)=>{
    const {fName,lName,email,password,dob} = req.body;
    console.log({fName,lName,email,password,dob});//debug
    let query = `SELECT * FROM users where email =?` //? avoids SQL injection
    dbconnection.execute(query, [email],(err,result)=>{
        if(err){
            return res.status(500).json({message:"Server Error",success:false})
        } 
        if(result.length>0){
            return res.status(409).json({message:"user already exist",success:false})
        }
        query = `INSERT INTO users (firstName,lastName,email,password,dob) VALUES (?,?,?,?,?)`
        dbconnection.execute(query, [fName,lName,email,password,dob],(err,result)=>{
            if(err){
                return res.status(500).json({message:"Server Error", success:false})
            }
            return res.status(201).json({message:"user created Successfully",success:true, userID:result.insertId})

        })
    })
    
})

app.post("/auth/login",(req,res,next)=>{
    const {email, password} = req.body
    console.log({email,password});
    
    let query = `SELECT *  FROM users where email = ?`
    dbconnection.execute(query, [email], (err,result)=>{
        if(err){
            return res.status(500).json({message:"server error", success:false})
        }
        //fail case
        if(result.length==0 || password!=result[0]["password"]){
            return res.status(401).json({message:"invalid", success:true})
        }
        result[0].password=null
        return res.status(200).json({message:"login success", success:true,data:result[0]})
    })
})




app.listen(port,()=>{
    console.log('====================================');
    console.log("Application is running on port ", port);
    console.log('====================================');
})