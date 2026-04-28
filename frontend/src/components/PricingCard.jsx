import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingCard = ({ title, price, isPopular, features, buttonText, buttonLink, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={`relative flex flex-col p-8 rounded-[2rem] border ${
                isPopular 
                ? 'border-emerald-500 bg-emerald-500/5 shadow-2xl shadow-emerald-500/10' 
                : 'border-[var(--app-border)] bg-white/5'
            }`}
        >
            {isPopular && (
                <div className="absolute top-0 right-8 -translate-y-1/2">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Most Popular
                    </span>
                </div>
            )}
            
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-[var(--app-text)]">{title}</h3>
                <div className="mt-4 flex items-baseline text-[var(--app-text)]">
                    <span className="text-5xl font-extrabold tracking-tight">₹{price}</span>
                    <span className="ml-1 text-xl font-medium text-muted">/mo</span>
                </div>
                <p className="mt-2 text-sm text-muted">Billed monthly. Cancel anytime.</p>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                        <span className="ml-3 text-sm text-[var(--app-text)]">{feature}</span>
                    </li>
                ))}
            </ul>

            <Link 
                to={buttonLink}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 ${
                    isPopular 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/25' 
                    : 'bg-white/10 text-[var(--app-text)] hover:bg-white/20'
                }`}
            >
                {buttonText}
            </Link>
        </motion.div>
    );
};

export default PricingCard;
