import Post from '../models/Post.js'
import { readFileSync } from 'fs'
import { join } from 'path'

export const getAllPosts = async (req, res) => {
  const { category } = req.query

  const query = {}

  if (category) {
    query.category = new RegExp(`^${category}$`, 'i') // case insensitive match
  }

  try {
    const posts = await Post.find(query).lean()
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const getPost = async (req, res) => {
  const { id } = req.params
  try {
    const post = await Post.findById(id).lean()

    // If no post
    if (!post) {
      return res.status(400).json({ message: 'Post no found' })
    }

    return res.json(post)
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Invalid post ID' })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const addPost = async (req, res) => {
  const { firstname, lastname, title, img, content, category } = req.body

  // Confirm data
  if (!firstname || !title || !content || !category) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Check for duplicate title
  const duplicate = await Post.findOne({ title }).lean().exec()

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate post title' })
  }

  // Create and store the new post
  const post = await Post.create({
    firstname,
    lastname,
    title,
    img,
    content,
    category
  })

  if (post) {
    // Created
    return res.status(201).json({ message: 'New post created' })
  } else {
    return res.status(400).json({ message: 'Invalid post data received' })
  }
}

export const updatePost = async (req, res) => {
  const { id, title, img, content, category } = req.body

  // Confirm data
  if (!title || !content || !category) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Confirm post exists to update
  const post = await Post.findById(id).exec()

  if (!post) {
    return res.status(400).json({ message: 'Post not found' })
  }

  // Check for duplicate title
  const duplicate = await Post.findOne({ title }).lean().exec()

  // Allow renaming of the original post
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate post title' })
  }

  post.title = title
  post.img = img
  post.content = content
  post.category = category

  const updatedPost = await post.save()

  res.json(`'${updatedPost.title}' updated`)
}

export const deletePost = async (req, res) => {
  const { id } = req.body

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: 'Post ID required' })
  }

  // Confirm post exists to delete
  const post = await Post.findById(id).exec()

  if (!post) {
    return res.status(400).json({ message: 'Post not found' })
  }

  const result = await post.deleteOne()

  const reply = `Post '${result.title}' with ID ${result._id} deleted`

  res.json(reply)
}
