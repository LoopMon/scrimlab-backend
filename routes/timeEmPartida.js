const express = require("express")
const router = express.Router()

const TimeEmPartida = require("../models/timesEmPartidas")

// GET - Buscar todos os times em partidas
router.get("/", async (req, res) => {
  try {
    const timesEmPartida = await TimeEmPartida.find({})
      .populate({
        path: "idTime",
        populate: {
          path: "jogadores",
          model: "Jogador",
        },
      })
      .populate("idPartida")

    res.status(200).json({
      mensagemSucesso: "Times em partidas recuperados com sucesso",
      timesEmPartida: timesEmPartida,
    })
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao buscar os times em partidas",
      erro: err,
    })
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const partida = await TimeEmPartida.findById(id)
      .populate({
        path: "idTime",
        populate: {
          path: "jogadores", // Popula os jogadores dentro do idTime
          model: "Jogador",
        },
      })
      .populate("idPartida")

    if (!partida) {
      return res.status(404).json({
        mensagemErro: "Partida não encontrada",
      })
    }

    res.status(200).json({
      mensagemSucesso: "Partida recuperada com sucesso",
      partida: partida,
    })
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao buscar a partida",
      erro: err,
    })
  }
})

// POST - Criar um novo time em partida
router.post("/", async (req, res) => {
  const novoTimeEmPartida = new TimeEmPartida({
    idPartida: req.body.idPartida,
    idTime: req.body.idTime,
    time: req.body.time,
    estatisticaJogador: req.body.estatisticaJogador,
  })

  try {
    const timeEmPartidaSalvo = await novoTimeEmPartida.save()
    res.status(201).json({
      mensagemSucesso: "Time em partida criado com sucesso",
      timeEmPartida: timeEmPartidaSalvo,
    })
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao salvar o time em partida",
      erro: err,
    })
  }
})

// PATCH - Atualizar um time em partida pelo ID
router.patch("/:id", async (req, res) => {
  try {
    const timeEmPartidaAtualizado = await TimeEmPartida.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          idPartida: req.body.idPartida,
          idTime: req.body.idTime,
          time: req.body.time,
          estatisticaJogador: req.body.estatisticaJogador,
        },
      },
      { new: true }
    )
      .populate("idTime")
      .populate("idPartida")
    if (!timeEmPartidaAtualizado) {
      return res
        .status(404)
        .json({ mensagemErro: "Time em partida não encontrado" })
    }
    res.status(200).json({
      mensagemSucesso: `Time em partida ${req.params.id} atualizado com sucesso`,
      timeEmPartida: timeEmPartidaAtualizado,
    })
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao atualizar o time em partida",
      erro: err,
    })
  }
})

module.exports = router
