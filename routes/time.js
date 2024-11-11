const express = require("express")
const router = express.Router()

const Time = require("../models/times")

// GET - Buscar todos os times
router.get("/", async (req, res) => {
  try {
    const times = await Time.find({}).populate("jogadores")
    res.status(200).json({
      mensagemSucesso: "Times recuperados com sucesso",
      times: times,
    })
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao buscar os times",
      erro: err,
    })
  }
})

// GET - Buscar um time por ID
router.get("/:id", async (req, res) => {
  try {
    const timeId = req.params.id
    const time = await Time.findById(timeId).populate("jogadores")

    if (!time) {
      return res.status(404).json({ mensagemErro: "Time não encontrado" })
    }

    res.status(200).json({
      mensagemSucesso: "Time recuperado com sucesso",
      time: time,
    })
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao buscar o time",
      erro: err,
    })
  }
})

// POST - Criar um novo time
router.post("/", async (req, res) => {
  const novoTime = new Time({
    nome: req.body.nome,
    logo: req.body.logo,
    pais: req.body.pais,
    jogadores: req.body.jogadores, // array de IDs dos jogadores
  })

  try {
    const timeSalvo = await novoTime.save()
    res.status(201).json({
      mensagemSucesso: "Time criado com sucesso",
      time: timeSalvo,
    })
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao salvar o time",
      erro: err,
    })
  }
})

/* PATCH - Atualizar um time pelo ID
router.patch("/:id", async (req, res) => {
  try {
    const timeAtualizado = await Time.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          nome: req.body.nome,
          logo: req.body.logo,
          pais: req.body.pais,
          jogadores: req.body.jogadores, // atualiza o array de IDs dos jogadores
        },
      },
      { new: true }
    ).populate("jogadores");
    if (!timeAtualizado) {
      return res.status(404).json({ mensagemErro: "Time não encontrado" });
    }
    res.status(200).json({
      mensagemSucesso: `Time ${req.params.id} atualizado com sucesso`,
      time: timeAtualizado,
    });
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao atualizar o time",
      erro: err,
    });
  }
});
*/

module.exports = router
