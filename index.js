const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const port = 3000
const hostname = 'localhost'

const db = "infosys"
const tbl = "spring"

app.use(cors())

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

var corsOptions = {
    origin: '*',
    methods: "GET",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// MySQl connection
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: db
});

// Connect with MySql
connection.connect((err) => {
    if (err)
        throw (err)
    console.log("MySql Connected")
});

// routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')

})
app.post('/create', (req,res) => {
    res.status(200)
    res.setHeader('Content-Type', 'application/json')
    // console.log(req.body)
    var resp = req.body
    console.log(resp['id'])
    connection.query("INSERT into " + tbl + " VALUES (" + resp['id'] + ",\'" + resp['name'] + "\',\'" + resp['desig'] + "\',\'" + resp['dept'] + "\'," + resp['sal'] + ",\'" + resp['loc'] + "\')", function (err, result) {
        if (err) throw err;
        console.log("Result: " + JSON.stringify(result));
        res.end(JSON.stringify(result))
    });
})

app.post('/update', (req,res) => {
    res.status(200)
    res.setHeader('Content-Type', 'application/json')
    // console.log(req.body)
    var resp = req.body
    console.log(resp['id'])
    connection.query("UPDATE " + tbl + " SET empname= \'" + resp['name'] + "\', empdesig=\'" + resp['desig'] + "\',empdept=\'" + resp['dept'] + "\',empsal=" + resp['sal'] + ",emploc=\'" + resp['loc'] + "\' where empid = " + resp['id'], function (err, result) {
        if (err) throw err;
        console.log("Result: " + JSON.stringify(result));
        res.end(JSON.stringify(result))
    });
})

app.post('/search', (req, res) => {
    // Display all data
    res.status(200)
    res.setHeader('Content-Type', 'application/json')
    var getStatus = req.body
    connection.query("SELECT * from " + tbl + " where empdept = \'" + getStatus['delete'] + "\'", function (err, result) {
        if (err) throw err;
        console.log("Result: " + JSON.stringify(result));
        res.end(JSON.stringify(result))
    });
})

app.post('/delete', (req,res) => {
    res.status(200)
    res.setHeader('Content-Type', 'application/json')
    var delId = req.body['delID']

    connection.query("DELETE from " + tbl + " where empid = " + delId, function (err, result) {
        if (err) throw err;
        console.log("Result: " + JSON.stringify(result));
        res.end(JSON.stringify(result))
    });
})

app.get('/*', (req, res) => {
    res.status(404)
    res.end("<h1>404 Error</h1>")
})

// Http connection
app.listen(port, hostname, () => {
    console.log(`App listening at http://${hostname}:${port}`)
})