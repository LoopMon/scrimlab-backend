const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
  idPartida: { type: Schema.Types.ObjectId, ref: "Partida", required: true },
  idTime: [{ type: Schema.Types.ObjectId, ref: "Time", required: true }],
  estatisticaJogador: [[{ type: String, required: false }]],
})

module.exports = mongoose.model("TimeEmPartida", schema)
