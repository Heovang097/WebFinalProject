const express = require("express")
const app = express(); 
const morgan = require("morgan");
const exphbs = require("express-handlebars");
app.use(morgan("dev"));
const PORT = 3000;

app.engine('hbs', exphbs({
    defaultLayout: "main.hbs",
}));
app.set('view engine', 'hbs');

app.get("/", function(req,res) {
    res.send("<b> Hello </b> World");
});

app.get("/home", function(req,res) {
    res.render("home");
});

app.get("/away", function(req,res) {
    res.render("away");
    //res.sendFile(__dirname + "/bs4/album.html");
});

app.use(express.urlencoded({
    extended:true
}))

app.use("/", require('./controllers/category.route.js'));

app.listen(PORT, function () {
    console.log(`listening on at address: http://localhost:${PORT}`);
});