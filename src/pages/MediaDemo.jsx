import React from 'react'
import { useNavigate } from 'react-router-dom'
import { DemoBlog, DemoVideo } from './DemoContent'

const MediaDemo = () => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate('/#our-services')
    // Smooth scroll after navigation
    setTimeout(() => {
      const element = document.getElementById('our-services')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <div className="min-h-screen bg-dark-300 pt-24 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
        </svg>
        <h1 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary">
          Blogs and Videos
        </h1>
        <section className="mb-12">
          <h2 className="text-4xl font-semibold mb-4">Blogs</h2>
          <p className="text-gray-400">
            This section contains our latest spiritual and wellness articles.
          </p>
          <DemoBlog />
        </section>
        <section>
          <h2 className="text-4xl font-semibold mb-4">Videos</h2>
          <p className="text-gray-400">
            This section contains our curated spiritual and wellness videos.
          </p>
          <DemoVideo />
        </section>
      </div>
    </div>
  )
}

export default MediaDemo
