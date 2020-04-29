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
    limits: {fileSize: 100000},
}).single('uploadImage');

router.get('/', (request, response) => {
    response.render('compress')
})

router.post('/upload', (request, response) => {
    upload(request, response, (error) => {
        if(error) {
            request.flash('error_message', 'The download file exceeds! The file must not be larger than 100000 MB')
            response.redirect('/')
        }
        else {
            if(request.file == undefined) {
                request.flash('error_message', 'Image file was not been selected.')
                response.redirect('/')

                console.log(request.file)
            }
            else {
                request.flash('success_message', 'Image was uploaded successfully.')
                response.redirect('/')

                console.log(request.file)
            }
        }
    })
})

router.get('/result', (request, response) => {
    response.render('result')
})

module.exports = router