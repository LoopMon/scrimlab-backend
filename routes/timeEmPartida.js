const express = require("express");
const router = express.Router();

const TimeEmPartida = require("../models/timeEmPartida");

// GET - Buscar todos os times em partidas
router.get("/", async (req, res) => {
  try {
    const timesEmPartida = await TimeEmPartida.find({}).populate("idTime").populate("idPartida");
    res.status(200).json({
      mensagemSucesso: "Times em partidas recuperados com sucesso",
      timesEmPartida: timesEmPartida,
    });
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao buscar os times em partidas",
      erro: err,
    });
  }
});

// POST - Criar um novo time em partida
router.post("/", async (req, res) => {
  const novoTimeEmPartida = new TimeEmPartida({
    idPartida: req.body.idPartida,
    idTime: req.body.idTime, // array de IDs dos times
    time: req.body.time,
    estatisticaJogador: req.body.estatisticaJogador, // array de estatísticas dos jogadores
  });

  try {
    const timeEmPartidaSalvo = await novoTimeEmPartida.save();
    res.status(201).json({
      mensagemSucesso: "Time em partida criado com sucesso",
      timeEmPartida: timeEmPartidaSalvo,
    });
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao salvar o time em partida",
      erro: err,
    });
  }
});

// PATCH - Atualizar um time em partida pelo ID
router.patch("/:id", async (req, res) => {
  try {
    const timeEmPartidaAtualizado = await TimeEmPartida.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          idPartida: req.body.idPartida,
          idTime: req.body.idTime, // atualiza os IDs dos times
          time: req.body.time,
          estatisticaJogador: req.body.estatisticaJogador, // atualiza a estatística dos jogadores
        },
      },
      { new: true }
    ).populate("idTime").populate("idPartida");
    if (!timeEmPartidaAtualizado) {
      return res.status(404).json({ mensagemErro: "Time em partida não encontrado" });
    }
    res.status(200).json({
      mensagemSucesso: `Time em partida ${req.params.id} atualizado com sucesso`,
      timeEmPartida: timeEmPartidaAtualizado,
    });
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao atualizar o time em partida",
      erro: err,
    });
  }
});

module.exports = router;
