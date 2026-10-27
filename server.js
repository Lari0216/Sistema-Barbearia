import express from "express"
import pool from "./db.js"
import cors from "cors"
import bcrypt from "bcryptjs"

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())
app.use(express.static('front')) //chama o arquivo do front

app.get('/')



app.listen(PORT, () => {
    console.log("API rodando em http://localhost:3000")
})