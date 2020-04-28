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
    storage: storage,
    limits: {fileSize: 1000000000},
}).single('uploadImage');

router.get('/', (request, response) => {
    response.render('compress')
})

router.post('/upload', (request, response) => {
    upload(request, response, (error) => {
        if(error) {
            request.flash('error_message', 'Image file is too big.')
        }
        else {
            if(request.file == undefined) {
                response.render('compress')
                request.flash('error_message', 'Image file has not been choosed')
            }
            else {
                response.render('result')
                console.log(request.file)
            }
        }
    })
})

router.get('/result', (request, response) => {
    response.render('result')
})

module.exports = router