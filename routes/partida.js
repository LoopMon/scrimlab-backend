const express = require("express");
const router = express.Router();

const Partida = require("../models/partida");

// Rota para obter todas as partidas
router.get("/", async (req, res, next) => {
  try {
    const partidas = await Partida.find({});
    res.status(200).json({
      message: "Partidas recuperadas com sucesso",
      partidas,
    });
  } catch (err) {
    return res.status(500).json({
      errorTitle: "Erro ao buscar as partidas",
      error: err,
    });
  }
});

// Rota para criar uma nova partida
router.post("/", async (req, res, next) => {
  const { nomeMapa, imgMapa, data, score, idUsuario, times } = req.body;
  const partida = new Partida({
    nomeMapa,
    imgMapa,
    data,
    score,
    idUsuario,
    times,
  });

  try {
    const novaPartida = await partida.save();
    res.status(201).json({
      message: "Partida criada com sucesso",
      novaPartida,
    });
  } catch (err) {
    return res.status(500).json({
      errorTitle: "Erro ao criar a partida",
      error: err,
    });
  }
});

/* Rota para deletar uma partida pelo ID
router.delete("/:id", async (req, res, next) => {
  try {
    const partidaId = req.params.id;
    const partidaDeletada = await Partida.findByIdAndDelete(partidaId);

    if (!partidaDeletada) {
      return res.status(404).send({ message: "Partida não encontrada" });
    }

    res.status(200).send({ message: `Partida ${partidaId} deletada com sucesso` });
  } catch (error) {
    res.status(500).send({ message: "Erro ao deletar a partida", error });
  }
});
*/

/* Rota para atualizar uma partida pelo ID
router.patch("/:id", async (req, res, next) => {
  try {
    const partidaId = req.params.id;
    const updateFields = req.body;

    const partidaAtualizada = await Partida.findByIdAndUpdate(
      partidaId,
      { $set: updateFields },
      { new: true }
    );

    if (!partidaAtualizada) {
      return res.status(404).send({ message: "Partida não encontrada" });
    }

    res.status(200).send({ message: `Partida ${partidaId} atualizada com sucesso`, partidaAtualizada });
  } catch (error) {
    res.status(500).send({ message: "Erro ao atualizar a partida", error });
  }
});
*/

module.exports = router;
