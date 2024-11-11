const express = require("express")
const router = express.Router()

const Usuario = require("../models/usuarios")

// Rota para login
// Rota para pegar todos os usuários
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find({})

    res.status(200).json({
      mensagemSucesso: "Usuários recuperados com sucesso",
      usuarios: usuarios,
    })
  } catch (err) {
    return res.status(500).json({
      mensagemErro: "Erro ao buscar os usuários",
      erro: err,
    })
  }
})

router.post("/signin", async (req, res) => {
  const { email, senha } = req.body
  try {
    const usuarioEncontrado = await Usuario.findOne({ email, senha })

    if (!usuarioEncontrado) {
      return res.status(404).json({
        mensagemErro: "Usuário não encontrado",
      })
    }

    res.status(200).json({
      mensagemSucesso: "Login realizado com sucesso",
      usuario: usuarioEncontrado,
    })
  } catch (err) {
    return res.status(500).json({
      mensagemErro: "Erro ao buscar o usuário",
      erro: err,
    })
  }
})

// Rota para cadastro
router.post("/signup", async (req, res) => {
  const { nome, email, senha } = req.body
  const novoUsuario = new Usuario({
    nome,
    email,
    senha,
  })

  try {
    const usuarioSalvo = await novoUsuario.save()

    res.status(201).json({
      mensagemSucesso: "Usuário cadastrado com sucesso",
      usuario: usuarioSalvo,
    })
  } catch (err) {
    return res.status(500).json({
      mensagemErro: "Erro ao salvar o usuário",
      erro: err,
    })
  }
})

module.exports = router
