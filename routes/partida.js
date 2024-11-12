const express = require("express")
const router = express.Router()

const Partida = require("../models/partidas")

// Rota para obter todas as partidas
router.get("/", async (req, res, next) => {
  try {
    const partidas = await Partida.find({})
    res.status(200).json({
      message: "Partidas recuperadas com sucesso",
      partidas,
    })
  } catch (err) {
    return res.status(500).json({
      errorTitle: "Erro ao buscar as partidas",
      error: err,
    })
  }
})

// Rota para obter uma partida por ID
router.get("/:id", async (req, res, next) => {
  try {
    const partidaId = req.params.id
    const partida = await Partida.findById(partidaId)

    if (!partida) {
      return res.status(404).json({ message: "Partida não encontrada" })
    }

    res.status(200).json({
      message: "Partida recuperada com sucesso",
      partida,
    })
  } catch (err) {
    return res.status(500).json({
      errorTitle: "Erro ao buscar a partida",
      error: err,
    })
  }
})

// Rota para obter uma partida pelo nome do mapa
router.get("/mapa/:nome", async (req, res, next) => {
  try {
    const nomeMapa = req.params.nome
    const partida = await Partida.find({ nomeMapa })

    if (!partida) {
      return res.status(404).json({ message: "Partida com o mapa especificado não encontrada" })
    }

    res.status(200).json({
      message: "Partida recuperada com sucesso",
      partida,
    })
  } catch (err) {
    return res.status(500).json({
      errorTitle: "Erro ao buscar a partida",
      error: err,
    })
  }
})


// Rota para criar uma nova partida
router.post("/", async (req, res, next) => {
  const { nomeMapa, imgMapa, data, score, idUsuario, times } = req.body
  const partida = new Partida({
    nomeMapa,
    imgMapa,
    data,
    score,
    idUsuario,
    times,
  })

  try {
    const novaPartida = await partida.save()
    res.status(201).json({
      message: "Partida criada com sucesso",
      novaPartida,
    })
  } catch (err) {
    return res.status(500).json({
      errorTitle: "Erro ao criar a partida",
      error: err,
    })
  }
})

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

// Rota para atualizar o score de uma partida pelo ID
router.patch("/:id", async (req, res, next) => {
  const { score } = req.body; // Desestruturação para pegar o score do corpo da requisição

  if (!score) {
    return res.status(400).json({ message: "O score é obrigatório para atualização." });
  }

  try {
    const partidaId = req.params.id;

    // Atualiza apenas o campo 'score' da partida
    const partidaAtualizada = await Partida.findByIdAndUpdate(
      partidaId,
      { $set: { score } },  // Atualiza o score
      { new: true }  // Retorna o documento atualizado
    );

    if (!partidaAtualizada) {
      return res.status(404).json({ message: "Partida não encontrada" });
    }

    res.status(200).json({
      message: `Partida ${partidaId} atualizada com sucesso`,
      partidaAtualizada,
    });
  } catch (err) {
    res.status(500).json({
      message: "Erro ao atualizar a partida",
      error: err,
    });
  }
});

module.exports = router
