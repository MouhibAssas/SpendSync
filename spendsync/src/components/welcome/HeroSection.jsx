import React from 'react'
import { FaArrowRight, FaDollarSign } from 'react-icons/fa'
import { motion } from 'framer-motion'

const containerVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } }
}

const floatingVariants = {
	animate: { y: [0, -15, 0], x: [0, 5, 0], transition: { duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } }
}

const glowVariants = {
	rest: { boxShadow: '0 0 0 0 rgba(251, 146, 60, 0)' },
	hover: { boxShadow: '0 0 20px 5px rgba(251, 146, 60, 0.4)', transition: { duration: 0.3, type: 'spring', stiffness: 400, damping: 10 } }
}

function TodayExpensesCard() {
	return (
		<motion.div className="relative" variants={itemVariants}>
			<motion.div className="absolute inset-0 bg-orange-500 opacity-20 blur-3xl rounded-full" variants={floatingVariants} animate="animate" />
			<motion.div className="relative bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700" whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">Today's Expenses</h3>
					<motion.span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>Live</motion.span>
				</div>
				<div className="space-y-3">
					{[
						{ name: 'Coffee', time: '9:30 AM', price: '$4.50' },
						{ name: 'Lunch', time: '12:45 PM', price: '$12.00' },
						{ name: 'Groceries', time: '5:20 PM', price: '$45.67' }
					].map((item, index) => (
						<motion.div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }} whileHover={{ x: 5, backgroundColor: '#374151' }}>
							<div className="flex items-center space-x-3">
								<motion.div className="w-10 h-10 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center" whileHover={{ rotate: 15, scale: 1.1 }}>
									<FaDollarSign className="text-yellow-400" />
								</motion.div>
								<div>
									<p className="font-medium">{item.name}</p>
									<p className="text-xs text-gray-400">{item.time}</p>
								</div>
							</div>
							<span className="font-semibold">{item.price}</span>
						</motion.div>
					))}
				</div>
				<motion.div className="mt-4 pt-4 border-t border-gray-600 flex justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }}>
					<span className="text-gray-400">Total Today</span>
					<motion.span className="text-xl font-bold text-orange-400" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 1.3, type: 'spring', stiffness: 200 }}>$62.17</motion.span>
				</motion.div>
			</motion.div>
		</motion.div>
	)
}

function HeroSection({ onGetStarted }) {
	return (
		<section className="px-6 py-16 md:px-12 lg:px-16 relative z-10">
			<motion.div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center" variants={containerVariants} initial="hidden" animate="visible">
				<motion.div variants={itemVariants}>
					<motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" variants={itemVariants}>
						Track Your Spending,
						<motion.span className="text-orange-400 block" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
							Share Your Moments
						</motion.span>
					</motion.h1>
					<motion.p className="text-xl text-gray-300 mb-8" variants={itemVariants}>
						A modern expense tracker that combines personal finance management with social features.
						Keep track of your daily spending while connecting with friends.
					</motion.p>
					<motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
						<motion.button onClick={onGetStarted} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center" variants={glowVariants} initial="rest" whileHover="hover" whileTap={{ scale: 0.95 }}>
							Get Started <FaArrowRight className="ml-2" />
						</motion.button>
						<motion.button className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all" whileHover={{ scale: 1.05, borderColor: '#fb923c' }} whileTap={{ scale: 0.95 }}>
							Learn More
						</motion.button>
					</motion.div>
				</motion.div>
				<TodayExpensesCard />
			</motion.div>
		</section>
	)
}

export default HeroSection
export { TodayExpensesCard }


