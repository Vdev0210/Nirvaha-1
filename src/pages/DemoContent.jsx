import React from 'react'

export const DemoBlog = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h3 className="text-2xl font-semibold mb-2">Demo Blog Post Title</h3>
      <p className="text-sm text-gray-500 mb-4">April 27, 2024</p>
      <p className="text-gray-700">
        This is a demo blog post. You can replace this content with your own blog posts in the future. The styling follows the website theme using Tailwind CSS.
      </p>
    </div>
  )
}

export const DemoVideo = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h3 className="text-2xl font-semibold mb-4">Demo Video</h3>
      <video
        controls
        className="w-full rounded-lg shadow-md"
        src="/videos/sound-healing-bg.mp4"
        type="video/mp4"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
