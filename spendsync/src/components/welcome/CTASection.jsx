import React from 'react'
import { motion } from 'framer-motion'

const containerVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } }
}

const glowVariants = {
	rest: { boxShadow: '0 0 0 0 rgba(251, 146, 60, 0)' },
	hover: { boxShadow: '0 0 20px 5px rgba(251, 146, 60, 0.4)', transition: { duration: 0.3, type: 'spring', stiffness: 400, damping: 10 } }
}

function CTASection({ onGetStarted }) {
	return (
		<section className="px-6 py-16 md:px-12 lg:px-16 relative z-10">
			<motion.div className="max-w-4xl mx-auto text-center" initial="hidden" animate="visible" variants={containerVariants}>
				<motion.h2 className="text-3xl md:text-4xl font-bold mb-6" variants={itemVariants}>Ready to Take Control of Your Finances?</motion.h2>
				<motion.p className="text-xl text-gray-300 mb-8" variants={itemVariants}>
					Join thousands of users who are already tracking their expenses and sharing their financial journey.
				</motion.p>
				<motion.button onClick={onGetStarted} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg" variants={glowVariants} initial="rest" whileHover="hover" whileTap={{ scale: 0.95 }}>
					Start Your Journey Today
				</motion.button>
			</motion.div>
		</section>
	)
}

export default CTASection


