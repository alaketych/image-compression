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
    limits: {fileSize: 100000000},
    fileFilter: function(request, file, callback) {
        const ext = path.extname(file.originalname).toLowerCase()

        if(ext !== '.jpg'   && ext !== '.jpeg'  && ext !== '.jpe'  && ext !== '.jif'  && ext !== '.jfif' && ext !== '.jfi' &&     //jpg
           ext !== '.jp2'   && ext !== '.j2k'   && ext !== '.jpf'  && ext !== '.jpx'  && ext !== '.jpm'  && ext !== 'mj2'  &&     //jpeg2000
           ext !== '.png'   && ext !== '.gif'   && ext !== '.webp' && ext !== '.tiff' && ext !== '.tif'  &&                       //png + gif + webp + tiff
           ext !== '.raw'   && ext !== '.arw'   && ext !== '.cr2'  && ext !== '.hrw'  && ext !== '.k25'  &&                       //raw
           ext !== '.ind'   && ext !== '.indd'  && ext !== '.indt' &&                                                             //indd
           ext !== '.bmp'   && ext !== '.dip'   &&                                                                                //bmp
           ext !== '.heif'  && ext !== '.heic'  ) {                                                                               //heif
            return callback(new Error)
        }
        callback(null, true)
    }
}).single('uploadImage');

router.get('/', (request, response) => {
    response.render('upload')
})

router.post('/upload', (request, response) => {
    upload(request, response, (error) => {
        if(error) {
            request.flash('error_message', 'Only images are allowed')
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
                response.redirect('/compress')

                console.log(request.file)
            }
        }
    })
})

router.get('/compress', (request, response) => {
    response.render('compress', {
        file: `uploads/${request.file}`
    })
})

module.exports = router