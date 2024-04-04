import { Schema, model } from 'mongoose'

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
})

export default model('Category', categorySchema)
