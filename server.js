import express from "express"
import pool from "./db.js"
import cors from "cors"
import bcrypt from "bcryptjs"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import "dotenv/config"; 

const app = express()
const PORT = 3000 //colocar no .env
const JWT_SECRET = process.env.JWT_SECRET


app.use(express.json())
app.use(cors({
    origin: "http://localhost:5432",
    credentials: true
}))
app.use(cookieParser())

app.use(express.static('public')) //chama o arquivo do front


function autenticarToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ mensagem: "Acesso negado. Faça login." });
  }

  try {
    const usuario = jwt.verify(token, JWT_SECRET)
    req.usuario = usuario
    next();
  } catch (error) {
    return res.status(403).json({ mensagem: "Token inválido ou expirado." });
  }
}

//fazer JWT
// ======================================= CLIENTES ==========================================================================================
app.get('/clientes', async (req, res) => {
    const clientes = await pool.query('SELECT * FROM clientes')
    res.json(clientes.rows)
})

app.post('/register', async (req, res) => {
    const {nome, email, senha, cpf} = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(senha, salt)

    const novoCliente = await pool.query('INSERT INTO clientes (nome, email, senha, cpf) VALUES ($1, $2, $3, $4)  RETURNING *', [nome, email, hashedPassword, cpf])
    res.json(novoCliente.rows)
})

app.post('/login', async (req, res) => {
    const {nome, email, senha} = req.body

    const queryText = 'SELECT * FROM clientes WHERE nome = $1 AND email = $2'
    const result = await pool.query(queryText, [nome, email])
    const user = result.rows[0]

    if(!user) {
        return res.status(401).json({ message: 'Credenciais Inválidas'})
    }

    const isPassword = await bcrypt.compare(senha, user.senha)

    if(!isPassword) {
        return res.status(401).json({message: "Credenciais Inválidas"})
    }res.json({menssagem: "Login Realizado com Sucesso"}), user.nome

})
// ======================================= BARBEIROS ==========================================================================================
app.get('/barbeiros', async (req, res) => {
    const barbeiros = await pool.query('SELECT * FROM barbeiros')
    res.json(barbeiros.rows)
})

app.post('/registerbarbeiro', async (req,res) => {
    const {nome, email, senha, cpf} = req.body //precisa do CPF? Para logar sim

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(senha, salt)

    const novoBarbeiro = await pool.query('INSERT INTO barbeiros (nome, email, senha, cpf) VALUES ($1, $2, $3, $4) RETURNING *', [nome, email, hashedPassword, cpf])
    res.json(novoBarbeiro.rows)
})

app.post('/loginbarbeiro', async (req, res) => {
    const {nome, email, senha,} = req.body

    const queryText = 'SELECT * FROM barbeiros WHERE nome = $1 AND email = $2'
    const result = await pool.query(queryText, [nome, email])
    const user = result.rows[0]

    if(!user) {
        return res.status(401).json({ message: 'Credenciais Inválidas'})
    }

    const isPassword = await bcrypt.compare(senha, user.senha)

    if(!isPassword) {
        return res.status(401).json({message: "Credenciais Inválidas"})
    }res.json({menssagem: "Login Realizado com Sucesso"}), user.nome

})
     
// ======================================= SERVIÇOS ==========================================================================================
app.get('/servicos', async (req, res) => {
    const servicos = await pool.query('SELECT * FROM servicos')
    res.json(servicos)
})

app.post('/registerservicos', async (req, res) => {
    const {nome_servico, preco, duracao} = req.body

    const novoServico = await pool.query('INSERT INTO servicos (nome_servico, preco, duracao) VALUES ($1, $2, $3) RETURNING *', [nome_servico, preco, duracao])
    res.json(novoServico.rows)
})


// ======================================= GERENCIAMENTO ==========================================================================================
app.get('/gerenciamento', async (req, res) => {
    const barbeiros = await pool.query('SELECT * FROM gerenciamento  INNER JOIN clientes ON gerenciamento.id_clientes = clientes.id INNER JOIN barbeiros ON gerenciamento.id_barbeiros = barbeiros.id INNER JOIN servicos ON gerenciamento.id_servicos = servicos.id ORDER BY gerenciamento.data ASC, gerenciamento.horario ASC')
    res.json(barbeiros.rows)
})


app.post('/gerenciamento', async (req, res) => {

    const {id_clientes, id_barbeiros, id_servicos, data, horario} = req.body

    const novoAgendamento = await pool.query(
        `INSERT INTO gerenciamento
        (id_clientes, id_barbeiros, id_servicos, data, horario)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [id_clientes, id_barbeiros, id_servicos, data, horario]
    )

    res.json(novoAgendamento.rows)
})


app.put('/gerenciamento/:id', async (req, res) => {

    const {id} = req.params
    const {id_clientes, id_barbeiros, id_servicos, data, horario} = req.body

    const atualizarAgendamento = await pool.query(
        `UPDATE gerenciamento
        SET id_clientes = $1,
            id_barbeiros = $2,
            id_servicos = $3,
            data = $4,
            horario = $5
        WHERE id = $6
        RETURNING *`,
        [id_clientes, id_barbeiros, id_servicos, data, horario, id]
    )

    res.json(atualizarAgendamento.rows[0])
})

app.delete('/gerenciamento/:id', async (req, res) => {

    const {id} = req.params

    const excluirAgendamento = await pool.query(
        'DELETE FROM gerenciamento WHERE id = $1 RETURNING *',
        [id]
    )

    res.json({mensagem: "Agendamento excluído com sucesso"})
})
 // =============================================================== PORTA ==================================================================================================
app.listen(PORT, () => {
    console.log("API rodando em http://localhost:3000")
})