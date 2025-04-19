import React, { useEffect } from 'react'

const doctors = [
  {
    name: "Dr. Preetha Reddy",
    title: "Executive Vice Chairperson, Apollo Hospitals Enterprise Limited.",
    description: "Dr. Preetha Reddy, Executive Vice Chairperson of Apollo Hospitals Enterprise Limited and a founding member of the Apollo Group.",
    image: "/assets/team/founder.jpg",
    price: 0
  },
  {
    name: "Dr. Suneeta Reddy",
    title: "Managing Director",
    description: "Dr. Suneeta Reddy, the Managing Director of Apollo Hospitals, is renowned for her visionary leadership.",
    image: "/assets/team/founder.jpg",
    price: 0
  },
  {
    name: "Ms. Shobana Kamineni",
    title: "Promoter Director, Apollo Hospitals Enterprise Limited",
    description: "Ms. Shobana Kamineni, the 3rd daughter of legendary Dr. Prathap C Reddy, is a Promoter Director of Apollo Hospitals.",
    image: "/assets/team/founder.jpg",
    price: 0
  },
  {
    name: "Dr. Sangita Reddy",
    title: "Joint Managing Director",
    description: "Dr. Sangita Reddy, a Global Healthcare Evangelist, a pioneering Indian Entrepreneur and a leader in healthcare.",
    image: "/assets/team/founder.jpg",
    price: 0
  }
]

const PersonalizedTherapy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-dark-300 text-white pt-32 pb-12 relative w-full">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 bg-dark-300" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="absolute inset-0 -z-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dark-200 via-dark-300 to-dark-100" />
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(var(--primary-rgb),0.1)_0%,transparent_70%)]" />
        </div>
        <h1
          className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary relative z-10"
        >
          Personalized Therapy Session with Doctors
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-dark-100/50 backdrop-blur-lg rounded-3xl p-6 border border-primary/10 hover:border-primary/30 transition-all"
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-64 object-cover rounded-2xl mb-4"
              />
              <h2 className="text-2xl font-semibold mb-1 text-white">{doctor.name}</h2>
              <h3 className="text-md font-medium mb-2 text-primary">{doctor.title}</h3>
              <p className="text-gray-400 mb-4">{doctor.description}</p>
              <p className="text-lg font-semibold text-white">Price: ₹{doctor.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PersonalizedTherapy
