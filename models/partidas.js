const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
  nomeMapa: { type: String, required: true },
  imgMapa: { type: String, required: true },
  data: { type: Date },
  score: { type: String },
  idUsuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  times: [{ type: Schema.Types.ObjectId, ref: "TimeEmPartida" }],
})

module.exports = mongoose.model("Partida", schema)
