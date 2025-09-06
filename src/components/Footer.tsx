import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-t border-t-4 backdrop-blur-xs">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold text-black">EcoFinds</h2>
            <p className="mt-2 text-gray-500 max-w-xs">
              Your trusted marketplace for second-hand treasures. Join us in making consumption more sustainable.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">About Us</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-gray-500 hover:text-black transition-colors">Our Story</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black transition-colors">How It Works</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black transition-colors">Community Guidelines</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Mail size={18} className="text-gray-400" />
                <a href="mailto:support@ecofinds.com" className="text-gray-500 hover:text-black transition-colors">support@ecofinds.com</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Phone size={18} className="text-gray-400" />
                <span className="text-gray-500">(123) 456-7890</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <MapPin size={18} className="text-gray-400" />
                <span className="text-gray-500">Ahmedabad, Gujarat, India</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} EcoFinds. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}