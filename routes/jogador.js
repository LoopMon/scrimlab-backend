const express = require("express")
const router = express.Router()

const Jogador = require("../models/jogadores")

// GET - Buscar todos os jogadores
router.get("/", async (req, res) => {
  try {
    const jogadores = await Jogador.find({})
    res.status(200).json({
      mensagemSucesso: "Jogadores recuperados com sucesso",
      jogadores: jogadores,
    })
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao buscar os jogadores",
      erro: err,
    })
  }
})

// POST - Criar um novo jogador
router.post("/", async (req, res) => {
  const novoJogador = new Jogador({
    nome: req.body.nome,
    imagem: req.body.imagem,
  })

  try {
    const jogadorSalvo = await novoJogador.save()
    res.status(201).json({
      mensagemSucesso: "Jogador criado com sucesso",
      jogador: jogadorSalvo,
    })
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao salvar o jogador",
      erro: err,
    })
  }
})

/* DELETE - Deletar um jogador pelo ID
router.delete("/:id", async (req, res) => {
  try {
    const jogadorDeletado = await Jogador.findByIdAndDelete(req.params.id);
    if (!jogadorDeletado) {
      return res.status(404).json({ mensagemErro: "Jogador não encontrado" });
    }
    res.status(200).json({
      mensagemSucesso: `Jogador ${req.params.id} deletado com sucesso`,
    });
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao deletar o jogador",
      erro: err,
    });
  }
});
*/

/* PATCH - Atualizar um jogador pelo ID
router.patch("/:id", async (req, res) => {
  try {
    const jogadorAtualizado = await Jogador.findByIdAndUpdate(
      req.params.id,
      { $set: { nome: req.body.nome, imagem: req.body.imagem } },
      { new: true }
    );
    if (!jogadorAtualizado) {
      return res.status(404).json({ mensagemErro: "Jogador não encontrado" });
    }
    res.status(200).json({
      mensagemSucesso: `Jogador ${req.params.id} atualizado com sucesso`,
      jogador: jogadorAtualizado,
    });
  } catch (err) {
    res.status(500).json({
      mensagemErro: "Erro ao atualizar o jogador",
      erro: err,
    });
  }
});
*/

module.exports = router
