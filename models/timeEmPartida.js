
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    idPartida: { type: Schema.Types.ObjectId, ref: 'partida', required: true },
    idTime: [{ type: Schema.Types.ObjectId, ref: 'time', required: true }],
    time: { type: Date, required: true },
    estatisticaJogador: [[{ type: String, required: false }]]
})

module.exports = mongoose.model('timeEmPartida', schema)