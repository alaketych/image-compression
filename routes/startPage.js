const express = require('express')
const router = express.Router()

router.get('/', (request, response) => {
    response.render('index')
})

router.get('/compress', (request, response) => {
    response.render('compress')
})

router.get('/uploaded-image', (request, response) => {
    response.render('uploadedeImage')
})

router.post('/upload-image', (request, response) => {

})

module.exports = router