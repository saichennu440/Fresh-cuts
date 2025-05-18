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
    label: 'pickels',
    imageUrl: '/images/categories/pickles.jpg',
  },
  {
    key: 'crab',
    label: 'Crab',
    imageUrl: '/images/categories/crab.jpg',
  },
  {
    key: 'chicken',
    label: 'Country Chicken',
    imageUrl: '/images/categories/chicken.jpeg',
  },
  {
    key: 'meat',
    label: 'snail meat',
    imageUrl: '/images/categories/snail.jpeg',
  },
]

export const Categories: React.FC = () => (
  <section className="py-12">
    <h2 className="text-2xl font-semibold text-center mb-8">Shop by Category</h2>
    <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
      {categories.map(cat => (
        <Link
          key={cat.key}
          to={`/products?category=${encodeURIComponent(cat.key)}`}
          className="group flex flex-col items-center text-center"
        >
          <div className="w-32 h-32 mb-3 overflow-hidden rounded-full border-2 border-gray-200 group-hover:border-primary-600 transition">
            <img
              src={cat.imageUrl}
              alt={cat.label}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm group-hover:text-primary-600 transition">
            {cat.label}
          </span>
        </Link>
      ))}
    </div>
  </section>
)
