
import { Link } from 'react-router-dom';

export default function Footer() {
    const footerLinks = {
        Platform: ['Browse Turfs', 'Book Now', 'Tournaments', 'Teams', 'Mobile App'],
        Support: ['Help Center', 'Contact Us', 'Live Chat', 'FAQ', 'Feedback'],
        Company: ['About Us', 'Careers', 'Press', 'Partners', 'Investors'],
        Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Data Protection', 'Compliance']
    };

    return (
        <footer className="bg-black border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                                <i className="ri-football-line text-white text-xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-white font-pacifico">TurfPlay</h3>
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Revolutionizing sports facility booking with cutting-edge technology and premium turfs. Your game, your way.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                                <i className="ri-facebook-fill text-white"></i>
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                                <i className="ri-twitter-x-fill text-white"></i>
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                                <i className="ri-instagram-line text-white"></i>
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                                <i className="ri-linkedin-fill text-white"></i>
                            </a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-white font-semibold mb-4">{category}</h4>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link}>
                                        <Link to={link === "Book Now" ? "/booking" : link === "Browse Turfs" ? "/#popular-turfs" : link === "Contact Us" ? "/contact" : "#"} className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <div>
                            <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
                            <p className="text-gray-400">Get the latest news and exclusive offers</p>
                        </div>
                        <div className="flex space-x-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
                            />
                            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 cursor-pointer whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    <p className="text-gray-400">
                        © 2024 TurfPlay. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6">
                        <Link to="#" className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">
                            Privacy Policy
                        </Link>
                        <Link to="#" className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">
                            Terms of Service
                        </Link>
                        <Link to="#" className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">
                            Cookie Settings
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}