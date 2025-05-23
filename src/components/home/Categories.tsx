// src/components/Categories.tsx
import React from 'react'
import { Link } from 'react-router-dom'

interface Category {
  key: string         // e.g. "seafood"
  label: string       // e.g. "Fish & Seafood"
  imageUrl: string    // URL or import of your category image
}

const categories: Category[] = [
  {
    key: 'fish',
    label: 'Fish',
    imageUrl: '/images/categories/fish.jpg',
  },
  {
    key: 'prawn',
    label: 'Prawn',
    imageUrl: '/images/categories/prawn.jpg',
  },
  {
    key: 'pickle',
    label: 'Pickles',
    imageUrl: '/images/categories/pickle.png',
  },
  {
    key: 'crab',
    label: 'Crab',
    imageUrl: '/images/categories/crab.jpg',
  },
  {
    key: 'chicken',
    label: 'Country Chicken',
    imageUrl: '/images/categories/chicken.jpg',
  },
  {
    key: 'meat',
    label: 'Snail Meat',
    imageUrl: '/images/categories/snail.jpg',
  },
]

const Categories: React.FC = () => (
  <section className="py-14 bg-sand-50">
    <h2 className="text-4xl font-semibold text-center mb-12 text-teal-800">Shop by Category</h2>

    <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
      {categories.map(cat => (
        <Link
          key={cat.key}
          to={`/products?category=${encodeURIComponent(cat.key)}`}
          className="group flex flex-col items-center text-center"
        >
          <div className="w-50 h-60 mb-4 overflow-hidden rounded-full border-4 border-sand-400 bg-white shadow-lg transition-transform transform group-hover:scale-110 group-hover:border-sea-500">
            <img
              src={cat.imageUrl}
              alt={cat.label}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-lg font-bold text-gray-800 group-hover:text-sea-600 transition-colors capitalize">
            {cat.label}
          </span>
        </Link>
      ))}
    </div>
  </section>
)

export default Categories
