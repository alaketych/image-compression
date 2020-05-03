const path              = require('path')
const express           = require('express')
const flash             = require('connect-flash')
const session           = require('express-session')
const expressHandlebars = require('express-handlebars')

const app = express()

app.use(flash())
app.use(session({
  secret: 'alaketych',
  resave: true,
  saveUninitialized: true,
}))
app.use(express.static(__dirname + '/public'))
app.use((request, response, next) => {
  response.locals.error_message   = request.flash('error_message')
  response.locals.success_message = request.flash('success_message')
  next()
})

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'layout',
    partialsDir: [
        path.join(__dirname, 'views/partials')
    ],
    extname: 'handlebars',
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

const routes = require('./routes/routes')
app.use('/', routes)

app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), () =>
  console.log(`Server is running on PORT: ${app.get("port")}`)
);