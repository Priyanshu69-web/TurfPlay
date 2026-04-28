import React from 'react';
import PricingCard from './PricingCard';

const PricingSection = () => {
    return (
        <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-[var(--app-text)] sm:text-5xl">
                    Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">pricing</span>
                </h2>
                <p className="mt-4 text-xl text-muted max-w-2xl mx-auto">
                    Choose the plan that best fits your turf management needs. 7-day free trial on all plans.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <PricingCard 
                    title="Basic Plan"
                    price="999"
                    isPopular={false}
                    delay={0.1}
                    features={[
                        "Manage up to 2 turfs",
                        "Unlimited bookings",
                        "Basic analytics dashboard",
                        "Email support",
                        "Manual slot generation"
                    ]}
                    buttonText="Start 7-Day Trial"
                    buttonLink="/register"
                />
                
                <PricingCard 
                    title="Pro Plan"
                    price="2499"
                    isPopular={true}
                    delay={0.2}
                    features={[
                        "Manage unlimited turfs",
                        "Unlimited bookings",
                        "Advanced revenue analytics",
                        "Priority 24/7 support",
                        "Automated slot generation",
                        "Custom branding options"
                    ]}
                    buttonText="Start 7-Day Trial"
                    buttonLink="/register"
                />
            </div>
            
            <div className="mt-12 text-center">
                <p className="text-muted">Need a custom enterprise solution? <a href="/contact" className="text-emerald-400 font-semibold hover:underline">Contact sales</a></p>
            </div>
        </div>
    );
};

export default PricingSection;
