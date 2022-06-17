let express = require('express');
let app = express();
let fs = require('fs');
const mysql=require('mysql');
const port=8080;
const db = mysql.createConnection(
    {
        user:"root",
        host: "127.0.0.1",
        password: "",
        database: "csau",
        port: 3306,
    }
)
db.connect((err)=>{
    if(err)
    {
        throw err;
    }
    console.log("MySQL Connected");
})
app.get('/maxAge', function(req, res){
    fs.readFile(__dirname + "/" + "backend_task1.json", 'utf8', function(err, data){
        data = JSON.parse(data)
        let result1=[],max=Number.MIN_VALUE;
        for (let value of data.people)
        {
            if(max<value.age)
            {
                max=value.age;
            }
        }
        for (let value of data.people)
        {
            if(max===value.age)
            {
                result1.push(value); 
            }
        }
        res.send(result1);
    });
})
app.get('/phoneMatch', function(req, res){
    fs.readFile(__dirname + "/" + "backend_task1.json", 'utf8', function(err, data){
        data = JSON.parse(data);
        let result2=[];
        for (let value of data.people)
        {
            if(value.number[0]===value.number[9])
            {
                result2.push(value);
            }
        }
        res.send(result2);
    });
})
app.post('/membershipRegistration', function(req,res){
    const name=req.body.name;
    const rgno=req.body.rgno;
    const dept=req.body.dept;
    const tag=req.body.tag;
    const domain=req.body.domain;
    const phno=req.body.phno;
    const email=req.body.email;
    let resulterror=["","","",""];
    if(name.length>30)
    {
        resulterror[0]="Length of name is larger 30";
    }
    else if(name.length===0)
    {
        resulterror[0]="Length of name should not be 0";
    }
    if(rgno<1000000000||rgno>9999999999)
    {
        resulterror[1]="Registration number should be length of 10";
    }
    if(phno<1000000000||phno>9999999999)
    {
        resulterror[2]="Phone number should be length of 10";
    }
    if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
    {
        resulterror[3]="Invalid email address";
    }
    if(resulterror[0].length>=1||resulterror[1].length>=1||resulterror[2].length>=1||resulterror[3].length>=1)
    {
        res.send(resulterror);
    }
    else
    {
        db.query("SELECT * FROM REGISTRATION WHERE EMAIL=?", [email],
        (err,result)=>{
            if(err)
            {
                console.log(err);
                res.send("Unsuccessful");
            }
            else
            {
                if(result.length==1)
                {
                    res.send("Already Registred with this email");
                }
                else
                {
                    db.query("INSERT INTO REGISTRATION VALUES (?,?,?,?,?,?,?)",
                    [email,name,rgno,dept,tag,domain,phno],
                    (err,result)=>{
                        if(err)
                        {
                            console.log(err);
                            res.send("Unsuccessful");
                        }
                        else{
                            res.send("Sucesss");
                        }
                    });
                }
            }
        })
    }
})
var server = app.listen(port, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("REST API demo app listening at http://%s:%s", host, port)
})