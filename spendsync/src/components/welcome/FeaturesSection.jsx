import React from 'react'
import { motion } from 'framer-motion'
import FeatureCard from './FeatureCard'
import { FaClock, FaShareAlt, FaUsers, FaSearch, FaChartLine, FaLock } from 'react-icons/fa'

const containerVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } }
}

function FeaturesSection() {
	const features = [
		{ icon: FaClock, title: 'Daily Expense Tracking', description: 'Log your expenses with an automatic 24-hour reset, keeping your spending habits up-to-date.' },
		{ icon: FaShareAlt, title: 'Social Feed', description: 'Share spending moments with your followers — from daily essentials to exciting purchases.' },
		{ icon: FaUsers, title: 'Friend & Profile System', description: 'Connect with friends, view their 24-hour expense posts, and discover new profiles.' },
		{ icon: FaSearch, title: 'Real-Time Search', description: 'Quickly find users and explore their public spending posts.' },
		{ icon: FaChartLine, title: 'Insights & Visuals', description: 'Get beautiful, interactive visuals to understand your spending patterns over time.' },
		{ icon: FaLock, title: 'Private or Public Spending', description: 'Keep expenses private or share specific purchases publicly with a photo.' }
	]

	return (
		<section className="px-6 py-16 md:px-12 lg:px-16 bg-gray-800 bg-opacity-50 relative z-10">
			<motion.div className="max-w-6xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
				<motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-12" variants={itemVariants}>Features That Make a Difference</motion.h2>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((f, i) => (
						<FeatureCard key={i} Icon={f.icon} title={f.title} description={f.description} />
					))}
				</div>
			</motion.div>
		</section>
	)
}

export default FeaturesSection


