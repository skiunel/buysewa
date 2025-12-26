import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#003366] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="h-8 w-8 text-[#00CC99]" />
              <div>
                <span className="text-2xl font-bold">BUYSEWA</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-[#00CC99]">✓ Blockchain Verified</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Nepal's most trusted e-commerce platform with blockchain-powered verified reviews. 
              Shop with confidence, knowing every review is authentic.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
              <Youtube className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white">Size Guide</a></li>
              <li><a href="#" className="hover:text-white">Contact Support</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Blockchain Technology</a></li>
              <li><a href="#" className="hover:text-white">Seller Program</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-[#00CC99]" />
                <span>Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#00CC99]" />
                <span>+977-1-4001234</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#00CC99]" />
                <span>support@buysewa.com</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-[#00CC99] bg-opacity-20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-[#00CC99]" />
                <span className="text-sm font-medium text-[#00CC99]">Blockchain Guarantee</span>
              </div>
              <p className="text-xs text-gray-300">
                Every review is cryptographically verified and stored on blockchain for ultimate transparency.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              © 2024 BUYSEWA. All rights reserved. Made with ❤️ in Nepal.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Shield className="h-4 w-4 text-[#00CC99]" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Shield className="h-4 w-4 text-[#00CC99]" />
                <span>PCI Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Shield className="h-4 w-4 text-[#00CC99]" />
                <span>Blockchain Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}