import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 2
    },
    lastname: {
      type: String,
      required: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    profile_img: {
      type: String,
      default: ''
    },
    password: {
      type: String
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'user'],
      default: 'user'
    },
    google_auth: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: 'joinedAt',
      updatedAt: 'updatedAt'
    }
  }
)

export default model('User', userSchema)
