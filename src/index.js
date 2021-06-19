const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const path = require('path')

const grades = require('./Functions/grades')

app.engine('.hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', '.hbs')

const PORT = 3000

app.use(express.static(path.join(__dirname, '/public')))

app.get('/grades/:data', (req, res) => {
    data = JSON.parse(req.params.data)
    var gr = []
    grades(data)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.send(err)
        })
})

app.use('/', (req, res) => {
    res.render('home')
})

app.listen(3000)