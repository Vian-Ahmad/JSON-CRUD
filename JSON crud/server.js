const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const port = 3000
const fs = require('fs')
const path = require('path')
const _dirname = path.resolve()
const jalurData = path.join(_dirname, 'db', 'data.json')
const datanya = JSON.parse(fs.readFileSync(path.join(jalurData), 'utf-8'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.render('list', { datanya });
})

app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/add', (req, res) => {
    const dataBaru = {
        name: req.body.name,
        height: parseInt(req.body.height),
        weight: parseFloat(req.body.weight),
        birthdate: req.body.birthdate,
        married: req.body.married === 'true' ? true : req.body.married === 'false' ? false : ''
    }

    if (!req.body.married) {
        dataBaru.married = null;
    }
    
    datanya.push(dataBaru)
    fs.writeFileSync(jalurData, JSON.stringify(datanya), "utf-8")

    res.redirect('/')
})

app.get('/delete/:id', (req, res) => {
    const id = req.params.id
    datanya.splice(id, 1)
    fs.writeFileSync(jalurData, JSON.stringify(datanya), "utf-8")
    res.redirect('/')

})

app.get('/edit/:id', (req, res) => {
    const id = req.params.id
    const dataEdit = datanya[id]
    res.render('edit', { dataEdit })
})

app.post('/edit/:id', (req, res) => {
    const id = req.params.id
    datanya[id] = { 
        name: req.body.name,
        height: parseInt(req.body.height),
        weight: parseFloat(req.body.weight),
        birthdate: req.body.birthdate,
        married: req.body.married === 'true' ? true : req.body.married === 'false' ? false : ''
     }
     if (!req.body.married) {
        datanya[id].married = null;
    }
    fs.writeFileSync(jalurData, JSON.stringify(datanya), "utf-8")
    res.redirect('/')

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})