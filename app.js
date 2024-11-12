const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
var path = require("path")
const mongoose = require("mongoose")

const Jogador = require("./models/jogadores")
const Time = require("./models/times")
const Usuario = require("./models/usuarios")

const loadData = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

var appRoutes = require("./routes/app")
var usuarioRoutes = require("./routes/usuario")
var partidaRoutes = require("./routes/partida")
var jogadorRoutes = require("./routes/jogador")
var timeEmPartidaRoutes = require("./routes/timeEmPartida")
var timeRoutes = require("./routes/time")

const app = express()
const cors = require("cors")
const times = require("./models/times")

// Conexão com o MongoDB
// C:/'Program Files'/MongoDB/Server/8.0/bin/mongod.exe --dbpath
mongoose
  .connect("mongodb://127.0.0.1:27017/scrimlab")
  .then(async () => {
    console.log("Conexão com o MongoDB estabelecida com sucesso.")

    const dataJogadores = loadData("./mongod_playground/insert_players.json")
    const dataTimes = loadData("./mongod_playground/insert_teams.json")

    try {
      const existeJogador = await Jogador.findOne()
      const existeTime = await Time.findOne()
      const existeUsuario = await Usuario.findOne()

      if (!existeJogador) {
        await Jogador.insertMany([...dataJogadores])
        console.log("+ Jogadores inseridos com sucesso.")
      }

      if (!existeTime) {
        const jogadores = await Jogador.find({})
        let jogadorIndex = 0

        dataTimes.forEach((time) => {
          // Buscar os 5 jogadores do time
          const jogadoresTime = jogadores.slice(jogadorIndex, jogadorIndex + 5)
          // Pegar o ID dos jogadores
          const idJogadoresTime = jogadoresTime.map((jogador) => jogador._id)
          // inserir os 5 jogadores no time
          time.jogadores = idJogadoresTime
          jogadorIndex += 5
        })
        await times.insertMany(dataTimes)
        console.log("+ Times inseridos com sucesso.")
      }
      if (!existeUsuario) {
        await Usuario.create({
          nome: "lucas",
          email: "lucas@email",
          senha: "123",
        })
        console.log("+ Usuarios inseridos com sucesso.")
      }
    } catch (error) {
      console.error("Erro ao inserir dados:", error)
    }
  })
  .catch((error) => {
    console.error("Erro na conexão com o MongoDB:", error)
  })

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hbs")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, "public")))

// Configuração do CORS
app.use(cors())
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  )
  next()
})

app.use("/usuario", usuarioRoutes)
app.use("/partida", partidaRoutes)
app.use("/jogador", jogadorRoutes)
app.use("/time", timeRoutes)
app.use("/timeEmPartida", timeEmPartidaRoutes)
app.use("/", appRoutes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({
    message: "Desculpe, você está numa rota fora dos meus limites :(",
  })
})

module.exports = app
