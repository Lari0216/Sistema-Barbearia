import express from "express"
import pool from "./db.js"
import cors from "cors"
import bcrypt from "bcryptjs"
import cookieParser from "cookie-parser"

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())
app.use(express.static('front')) //chama o arquivo do front

//fazer JWT
// ======================================= CLIENTES ==========================================================================================
app.get('/clientes', async (req, res) => {
    const clientes = pool.query('SELECT * FROM clientes')
    res.json(clientes)
})

app.post('/register', async (req, res) => {
    const {nome, email, senha, cpf} = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(senha, salt)

    const novoCliente = await pool.query('INSERT INTO clientes (nome, email, senha, cpf) VALUES ($1, $2, $3, $4) * REFERENCE', [nome, email, hashedPassword, cpf])
    res.json(novoCliente.rows)
})

app.post('/login', async (req, res) => {
    const {nome, email, senha, cpf} = req.body

    const queryText = 'SELECT * FROM clientes WHERE nome = $1 AND email = $2'
    const result = await pool.query(queryText, [nome, email])
    const user = result.rows[0]

    if(!user) {
        return res.status(401).json({ message: 'Credenciais Inválidas'})
    }

    const isPassword = await bcrypt.compare(senha, user.senha)

    if(!isPassword) {
        return res.status(401).json({message: "Credenciais Inválidas"})
    }

})
// ======================================= BARBEIROS ==========================================================================================
app.get('/barbeiros', async (req, res) => {
    const barbeiros = await pool.query('SELECT * FROM barbeiros')
    res.json(barbeiros)
})

app.post('/registerbarbeiro', async (req,res) => {
    const {nome, email, senha, cpf} = req.body //precisa do CPF?

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(senha, salt)

    const novoBarbeiro = await pool.query('INSERT INTO barbeiros (nome, email, senha, cpf) VALUES ($1m $2, $3, $4) * RETURNIGN', [nome, email, hashedPassword, cpf])
    res.json(novoBarbeiro.rows)
})


app.post('/loginbarbeiro', async (req, res) => {
    const {nome, email, senha, cpf} = req.body

    const queryText = 'SELECT * FROM barbeiros WHERE nome = $1 AND email = $2'
    const 
})
// ======================================= SERVIÇOS ==========================================================================================
app.get('/servicos', async (req, res) => {
    const servicos = await pool.query('SELECT * FROM servicos')
    res.json(servicos)
})


// ======================================= GERENCIAMENTO ==========================================================================================






app.listen(PORT, () => {
    console.log("API rodando em http://localhost:3000")
})