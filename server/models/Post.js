import { Schema, model } from 'mongoose'

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxlength: 200
    },
    url: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      default: ''
      // required: true,
    },
    img: {
      type: String,
      default: ''
    },
    content: {
      type: [String]
      // required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    tags: {
      type: [String]
      // required: true
    },
    draft: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: 'publishedAt',
      updatedAt: 'updatedAt'
    }
  }
)

export default model('Post', postSchema)
