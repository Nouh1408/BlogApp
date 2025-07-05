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
        console.log("Failed to connect to DB");
        
    } else{
        console.log("Logged to DB");
        
    }
})





app.listen(port,()=>{
    console.log('====================================');
    console.log("Application is running on port ", port);
    console.log('====================================');
})