const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
    partidasCriadas: [{ type: Schema.Types.ObjectId, ref: 'partida' }]
})

module.exports = mongoose.model('usuario', schema)