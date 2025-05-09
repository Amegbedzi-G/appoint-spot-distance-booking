
import { MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-brand-400" />
              <span>SpotBook</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Professional services at your doorstep. Book appointments with the best service providers in your area.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-brand-300">Home</a></li>
              <li><a href="/services" className="text-gray-300 hover:text-brand-300">Services</a></li>
              <li><a href="/admin/login" className="text-gray-300 hover:text-brand-300">Admin Login</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xl font-medium mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                <span className="text-gray-300">123 Business St, City, Country</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                <a href="mailto:contact@spotbook.example" className="text-gray-300 hover:text-brand-300">
                  contact@spotbook.example
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-brand-300">
                  +123 456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} SpotBook. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
