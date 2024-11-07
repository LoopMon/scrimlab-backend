const express = require("express")
const bodyParser = require("body-parser")
var path = require("path")

const mongoose = require("mongoose")

var appRoutes = require("./routes/app")
var usuarioRoutes = require("./routes/usuario")
var partidaRoutes = require("./routes/partida")
var jogadorRoutes = require("./routes/jogador")
var timeEmPartidaRoutes = require("./routes/timeEmPartida")
var timeRoutes = require("./routes/time")

const app = express()
const cors = require("cors")

// Conexão com o MongoDB
// C:/'Program Files'/MongoDB/Server/8.0/bin/mongod.exe --dbpath
mongoose
  .connect("mongodb://127.0.0.1:27017/node-angular")
  .then(() => {
    console.log("Conexão com o MongoDB estabelecida com sucesso.")
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
  return res.render("index")
})

module.exports = app
