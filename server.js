const path = require('path')
const express = require('express')
const expressHandlebars = require('express-handlebars')

const app = express()

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'layout',
    partialsDir: [
        path.join(__dirname, 'views/partials')
    ],
    extname: 'handlebars',
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')


const startPage = require('./routes/startPage')
app.use('/', startPage)

app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), () =>
  console.log(`Server is running on PORT: ${app.get("port")}`)
);