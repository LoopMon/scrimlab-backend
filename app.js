const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
var path = require("path")
const mongoose = require("mongoose")

const Usuario = require("./models/usuarios")
const Jogador = require("./models/jogadores")
const Time = require("./models/times")
const Partida = require("./models/partidas")
const TimeEmPartida = require("./models/timesEmPartidas")

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
      const existePartida = await Partida.findOne()

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
        await Time.insertMany(dataTimes)
        console.log("+ Times inseridos com sucesso.")
      }

      if (!existeUsuario) {
        await Usuario.create({
          nome: "lucas",
          email: "lucas@email",
          senha: "123",
        })
        console.log("+ Usuario inserido com sucesso.")
      }

      if (!existePartida) {
        // Agora vamos adicionar as 20 partidas
        const usuario = await Usuario.findOne({ nome: "lucas" })
        const times = await Time.find() // Pega todos os times

        const mapas = [
          {
            name: "Ascent",
            img: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png",
          },
          {
            name: "Split",
            img: "https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/splash.png",
          },
          {
            name: "Fracture",
            img: "https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/splash.png",
          },
          {
            name: "Bind",
            img: "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/splash.png",
          },
          {
            name: "Breeze",
            img: "https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/splash.png",
          },
          {
            name: "Lotus",
            img: "https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/splash.png",
          },
          {
            name: "Sunset",
            img: "https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/splash.png",
          },
          {
            name: "Pearl",
            img: "https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/splash.png",
          },
          {
            name: "Icebox",
            img: "https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/splash.png",
          },
          {
            name: "Haven",
            img: "https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/splash.png",
          },
        ]

        const partidas = []

        for (let i = 0; i < 20; i++) {
          const mapaEscolhido = mapas[Math.floor(Math.random() * mapas.length)]

          partidas.push({
            nomeMapa: mapaEscolhido.name,
            imgMapa: mapaEscolhido.img, // Agora preenchemos com a URL da imagem correspondente
            data:
              i < 10
                ? new Date(Date.now() - Math.floor(Math.random() * 1000000000))
                : new Date(Date.now() + Math.floor(Math.random() * 1000000000)), // Passado para terminadas, futuro para não terminadas
            score: i < 10 ? "13:8" : "0:0", // Score 13:x para terminadas, 0:0 para não terminadas
            idUsuario: usuario._id, // "lucas" será associado à partida, não aos times
          })
        }

        // Inserir as partidas no banco de dados
        const partidasInseridas = await Partida.insertMany(partidas)
        console.log("+ Partidas inseridas com sucesso!")

        const timesEmPartidas = []
        for (let i = 0; i < 10; i++) {
          const time1 = times[Math.floor(Math.random() * times.length)]
          let time2
          do {
            time2 = times[Math.floor(Math.random() * times.length)]
          } while (time2._id.equals(time1._id))

          timesEmPartidas.push({
            idPartida: partidasInseridas[i]._id,
            idTime: time1._id,
            estatisticaJogador: [
              {
                abates: Math.floor(Math.random() * 35),
                mortes: Math.floor(Math.random() * 35),
                assistencias: Math.floor(Math.random() * 20),
              },
              {
                abates: Math.floor(Math.random() * 35),
                mortes: Math.floor(Math.random() * 35),
                assistencias: Math.floor(Math.random() * 20),
              },
              {
                abates: Math.floor(Math.random() * 35),
                mortes: Math.floor(Math.random() * 35),
                assistencias: Math.floor(Math.random() * 20),
              },
              {
                abates: Math.floor(Math.random() * 35),
                mortes: Math.floor(Math.random() * 35),
                assistencias: Math.floor(Math.random() * 20),
              },
              {
                abates: Math.floor(Math.random() * 35),
                mortes: Math.floor(Math.random() * 35),
                assistencias: Math.floor(Math.random() * 20),
              },
            ],
          })
          timesEmPartidas.push({
            idPartida: partidasInseridas[i]._id,
            idTime: time2._id,
            estatisticaJogador: [
              {
                abates: Math.floor(Math.random() * 35),
                mortes: Math.floor(Math.random() * 35),
                assistencias: Math.floor(Math.random() * 20),
              },
              {
                abates: Math.floor(Math.random() * 35),
                mortes: Math.floor(Math.random() * 35),
                assistencias: Math.floor(Math.random() * 20),
              },
              {
                abates: Math.floor(Math.random() * 35),
                mortes: Math.floor(Math.random() * 35),
                assistencias: Math.floor(Math.random() * 20),
              },
              {
                abates: Math.floor(Math.random() * 35),
                mortes: Math.floor(Math.random() * 35),
                assistencias: Math.floor(Math.random() * 20),
              },
              {
                abates: Math.floor(Math.random() * 35),
                mortes: Math.floor(Math.random() * 35),
                assistencias: Math.floor(Math.random() * 20),
              },
            ],
          })
        }

        await TimeEmPartida.insertMany(timesEmPartidas)
        console.log("+ TimesEmPartidas inseridos com sucesso!")
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
