import React from 'react'
import { motion } from 'framer-motion'

const cardVariants = {
	hidden: { y: 50, opacity: 0 },
	visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 12 } }
}

function FeatureCard({ Icon, title, description }) {
	return (
		<motion.div
			className="bg-gray-800 p-6 rounded-xl border border-gray-700"
			variants={cardVariants}
			whileHover={{ y: -10, borderColor: '#fb923c', boxShadow: '0 10px 30px rgba(251, 146, 60, 0.2)' }}
			transition={{ type: 'spring', stiffness: 300, damping: 15 }}
		>
			<motion.div className="w-12 h-12 bg-orange-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-4" whileHover={{ rotate: 15, scale: 1.1, backgroundColor: 'rgba(251, 146, 60, 0.3)' }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
				<Icon className="text-orange-400 text-xl" />
			</motion.div>
			<h3 className="text-xl font-semibold mb-2">{title}</h3>
			<p className="text-gray-400">{description}</p>
		</motion.div>
	)
}

export default FeatureCard


