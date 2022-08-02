const router = require('express').Router()

const radicados = require('./controller')

router.get('/radicados', radicados.getRadicados)
router.post('/radicados', radicados.getRadicado)

module.exports = router