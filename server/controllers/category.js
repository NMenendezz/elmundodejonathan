import Category from '../models/Category.js'

// Fetch all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
    res.status(200).json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Create a new category
export const newCategory = async (req, res) => {
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ error: 'category name is required' })
  }

  try {
    const category = new Category({ name })
    await category.save()
    res.status(201).json(category)
  } catch (error) {
    console.error('Error creating category:', error)
    res.status(500).json({ error: 'category name already exist' })
  }
}
