const path = require('path')
const express = require('express')
const multer = require('multer')
const router = express.Router()

const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (request,  file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()
                                + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
}).single('uploadImage');

router.get('/', (request, response) => {
    response.render('compress')
})

router.post('/upload', (request, response) => {
    upload(request, response, (error) => {
        if(error) {
            console.log('error')
        }
        else {
            console.log(request.file)
            response.send('test')
        }
    })
})

module.exports = router