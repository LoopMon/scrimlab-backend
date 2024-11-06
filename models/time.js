const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    nome: { type: String, required: true },
    logo: { type: String, required: true },
    pais: { type: String, required: true },
    jogadores: [{ type: Schema.Types.ObjectId, ref: 'jogador' }]
})

module.exports = mongoose.model('time', schema)