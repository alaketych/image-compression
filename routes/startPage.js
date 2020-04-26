const express = require('express')
const router = express.Router()

router.get('/', (request, response) => {
    response.render('compress')
})

router.get('/result', (request, response) => {
    response.render('result')
})

module.exports = router