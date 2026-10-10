import React from 'react';
import { LeafIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
export function Footer() {
  return <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
              backgroundColor: 'var(--color-primary)'
            }}>
                <LeafIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-bold text-white">SustainPortal</div>
            </div>
            <p className="text-sm text-gray-400">
              Comprehensive sustainability data and insights for informed
              decision-making.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/methodology" className="hover:text-white transition-colors">
                  Methodology
                </a>
              </li>
              <li>
                <a href="/data-sources" className="hover:text-white transition-colors">
                  Data Sources
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/reports" className="hover:text-white transition-colors">
                  Reports
                </a>
              </li>
              <li>
                <a href="/research" className="hover:text-white transition-colors">
                  Research
                </a>
              </li>
              <li>
                <a href="/api" className="hover:text-white transition-colors">
                  API Access
                </a>
              </li>
              <li>
                <a href="/downloads" className="hover:text-white transition-colors">
                  Downloads
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MailIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>info@sustainportal.org</span>
              </li>
              <li className="flex items-start space-x-2">
                <PhoneIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Green Street, Eco City, EC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
          <p>
            &copy; 2024 SustainPortal. All rights reserved. |{' '}
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>{' '}
            |{' '}
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>;
}