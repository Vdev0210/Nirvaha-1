import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('progress')
  
  const userStats = {
    meditationTime: '45h 30m',
    sessionsCompleted: 128,
    streakDays: 15,
    achievements: 8
  }

  const recentActivities = [
    {
      type: 'meditation',
      title: 'Morning Mindfulness',
      duration: '15 minutes',
      date: '2 hours ago',
      icon: '🧘‍♀️'
    },
    {
      type: 'sound',
      title: '432 Hz Healing',
      duration: '20 minutes',
      date: 'Yesterday',
      icon: '🎵'
    },
    {
      type: 'chat',
      title: 'Divine Chat Session',
      duration: '10 minutes',
      date: '2 days ago',
      icon: '💭'
    }
  ]

  const achievements = [
    {
      title: 'Early Bird',
      description: 'Complete 10 morning meditations',
      progress: 80,
      icon: '🌅'
    },
    {
      title: 'Sound Master',
      description: 'Try all sound healing frequencies',
      progress: 60,
      icon: '🔮'
    },
    {
      title: 'Zen Seeker',
      description: 'Maintain a 7-day streak',
      progress: 100,
      icon: '✨'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-300 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          className="bg-dark-100 rounded-3xl p-8 mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary blur-3xl" />
          </div>
          
          <div className="relative z-10 flex items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-primary/50 flex items-center justify-center text-4xl">
              🧘‍♀️
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Sarah Peace</h1>
              <p className="text-gray-400">Spiritual Seeker • Member since January 2024</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {Object.entries(userStats).map(([key, value], index) => (
            <div key={key} className="bg-dark-100 rounded-2xl p-6 border border-primary/20">
              <h3 className="text-gray-400 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="bg-dark-100 rounded-3xl p-8 border border-primary/20">
          <div className="flex space-x-4 mb-8">
            {['progress', 'activities', 'achievements'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-lg transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-dark-300'
                    : 'text-gray-400 hover:text-primary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-dark-200 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Weekly Progress</h3>
                  {/* Add your progress chart component here */}
                  <div className="h-64 bg-dark-100 rounded-xl flex items-center justify-center text-gray-400">
                    Progress Chart Placeholder
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'activities' && (
              <motion.div
                key="activities"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="bg-dark-200 rounded-2xl p-6 flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{activity.icon}</div>
                      <div>
                        <h3 className="text-white font-semibold">{activity.title}</h3>
                        <p className="text-gray-400">{activity.duration}</p>
                      </div>
                    </div>
                    <span className="text-gray-400">{activity.date}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-4"
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="bg-dark-200 rounded-2xl p-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <h3 className="text-white font-semibold">{achievement.title}</h3>
                        <p className="text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-right text-gray-400 mt-2">{achievement.progress}%</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Profile 