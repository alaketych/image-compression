const fs        = require('fs');
const path      = require('path')
const express   = require('express')
const multer    = require('multer')
const router    = express.Router()

const imagemin          = require('imagemin')
const imageminMozjpeg   = require('imagemin-mozjpeg')   //lossy jpeg
const imageminJpegtran  = require('imagemin-jpegtran')  //lossless jpeg
const imageminPngquant  = require('imagemin-pngquant')  //lossy png
const imageminOptipng   = require('imagemin-optipng')   //lossless png
const imageminGiflossy  = require('imagemin-giflossy')  //lossy gif
const imageminGifsicle  = require('imagemin-gifsicle')  //lossless gif
const imageminSvgo      = require('imagemin-svgo')      //lossy svg
const imageminWebp      = require('imagemin-webp')      //lossy webp

const Vibrant   = require('node-vibrant')
const RLE       = require('../alghoritms/rle')

function imageBase64(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

router.use(express.static(__dirname + '/public'))

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
    fileFilter: (request, file, callback) => {
        const ext = path.extname(file.originalname).toLowerCase()

        if(ext !== '.jpg'   && ext !== '.jpeg'  && ext !== '.jpe'  && ext !== '.jif'  && ext !== '.jfif' && ext !== '.jfi' &&     //jpg
           ext !== '.jp2'   && ext !== '.j2k'   && ext !== '.jpf'  && ext !== '.jpx'  && ext !== '.jpm'  && ext !== 'mj2'  &&     //jpeg2000
           ext !== '.png'   && ext !== '.gif'   && ext !== '.webp' && ext !== '.tiff' && ext !== '.tif'  &&                       //png + gif + webp + tiff
           ext !== '.raw'   && ext !== '.arw'   && ext !== '.cr2'  && ext !== '.hrw'  && ext !== '.k25'  &&                       //raw
           ext !== '.ind'   && ext !== '.indd'  && ext !== '.indt' &&                                                             //indd
           ext !== '.bmp'   && ext !== '.dip'   &&                                                                                //bmp
           ext !== '.heif'  && ext !== '.heic') {                                                                                 //heif
            return callback(new Error)
        }
        callback(null, true)
    }
}).single('uploadImage');

router.get('/', (request, response) => {
    response.render('upload')
})

router.get('/result/:filename', (request, response) => {
    response.render('result', {
        compressedImage: compressedImage
    })
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
                response.redirect(`/${request.file.filename}`);

                console.log(request.file)
            }
        }
    })
})

router.get('/:filename', (request, response) => {
    let fileName = request.params.filename

    let pathToCheck = path.join(__dirname, '../public/uploads/' + fileName)
    if (fs.existsSync(pathToCheck)) {
        let imageDestination = `${request.protocol}://${request.headers.host}/uploads/${fileName}`;
        response.render('compress', {
            userImage: imageDestination
        })

        var bitmap = imageBase64(pathToCheck);
        const encode = RLE.Encode(bitmap)

        Vibrant.from(pathToCheck).getPalette()
                .then(palette => {
                    console.log(palette)
                })
    }
    else {
        response.send('Oops.')
    }
})

router.post('/compress', async (request, response) => {
    const compressedImage = await imagemin(['uploads/' + request.params.filename], {
        destination: 'compressed',
        plugins: [
            imageminMozjpeg(),
            imageminJpegtran(),

            imageminPngquant(),
            imageminOptipng(),

            imageminGiflossy(),
            imageminGifsicle(),

            imageminSvgo(),
            imageminWebp()
        ]
    })

    response.redirect(`/result/${request.file.filename}`)
})

module.exports = router