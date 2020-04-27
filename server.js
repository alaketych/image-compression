const path = require('path')
const multer = require('multer')
const express = require('express')
const bodyParser = require('body-parser')
const expressHandlebars = require('express-handlebars')

const app = express()

app.use(express.static(__dirname + '/public'));

const storage = multer.diskStorage({
  destination: '.public/uploads/',
  filename: (request,  file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.extname))
  }
})

const upload = multer({
  storage: storage
}).single('uploadImage');

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'layout',
    partialsDir: [
        path.join(__dirname, 'views/partials')
    ],
    extname: 'handlebars',
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')



const startPage = require('./routes/routes')
app.use('/', startPage)

app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), () =>
  console.log(`Server is running on PORT: ${app.get("port")}`)
);