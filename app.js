const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require('dotenv').config();

const apiKey = process.env.MAILCHIMP_API_KEY;
const listID = process.env.MAILCHIMP_LIST_ID;


const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public")); //we have index.html in that we linked css but css is not any online link so we need this statement...

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){

    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const emailID = req.body.email;
    
    const data = {
        members: [
            {
                email_address: emailID,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us22.api.mailchimp.com/3.0/lists/" + listID;

    const options = {
        method: "POST",
        auth: "kashan2912:" + apiKey
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }
        else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})



app.post("/failure", function(req, res){
    res.redirect("/");
})

app.post("/success", function(req, res){
    res.redirect("/");
})



app.listen(process.env.PORT || 3000, function(){
    console.log("Server listening on port 3000.");
})