import React from 'react';
import { Link } from '@tanstack/react-router';
import { HelpCircle } from 'lucide-react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export function Footer() {
  const getHelpLinks = [
    { name: 'Help Center', path: '/faq' },
    { name: 'Shipping', path: '/faq' },
    { name: 'Returns & Exchanges', path: '/faq' },
    { name: 'Group Orders', path: '/contact' },
    { name: 'Sign up for Texts', path: '/contact' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const companyLinks = [
    { name: 'Our Story', path: '/about' },
    { name: 'Find a Store', path: '/about' },
    { name: 'Recycle Your Scrubs', path: '/about' },
    { name: 'Healthcare Advisory Board', path: '/about' },
    { name: 'Our Impact', path: '/about' },
    { name: 'Newsroom', path: '/about' },
    { name: 'Investors', path: '/about' },
    { name: 'Careers', path: '/about' },
    { name: 'Mobile App', path: '/about' },
  ];

  const infoLinks = [
    { name: 'Student Discount', path: '/about' },
    { name: 'Military Discount', path: '/about' },
    { name: 'Refer a Friend', path: '/about' },
    { name: 'Gift Cards', path: '/collections/all' },
  ];

  const legalLinks = [
    { name: 'Flairvigo Promo Terms & Conditions', path: '/terms' },
    { name: 'Accessibility Statement', path: '/terms' },
    { name: 'Privacy Notice', path: '/privacy' },
    { name: 'Transparency Act', path: '/terms' },
    { name: 'Employee & Applicant Privacy Policy', path: '/privacy' },
    { name: 'Intellectual Property', path: '/terms' },
    { name: 'Vendor Code of Conduct', path: '/terms' },
  ];

  const guidesLinks = [
    { name: 'Size Charts', path: '/fit-finder' },
    { name: 'Care Instructions', path: '/faq' },
    { name: 'Fabric Technology', path: '/about' },
    { name: 'Personalize Your Scrubs', path: '/collections/all' },
  ];

  return (
    <footer className="bg-ivory text-charcoal pt-16 sm:pt-24 pb-8 font-sans border-t border-neutral-200 mt-16 sm:mt-24 lg:mt-32">
      <div className="container-premium px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 xl:gap-16 mb-20">
          
          {/* Logo & Newsletter Section */}
          <div className="lg:w-[35%] flex flex-col gap-6">
            <Link to="/" className="inline-block w-48 mb-2">
              <img src="/images/logo.png" alt="Flairvigo" className="w-full h-auto object-contain" />
            </Link>
            <p className="font-heading font-bold text-lg tracking-[0.15em] uppercase text-neutral-600 mb-2">
              #WEARFLAIRVIGO
            </p>
            
            {/* Newsletter */}
            <div className="mt-4 mb-8">
              <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4 text-charcoal">
                SIGN UP FOR 15% OFF
              </h4>
              <form className="flex w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-transparent border border-neutral-300 text-charcoal px-4 py-3 text-[13px] w-full focus:outline-none focus:border-charcoal transition-colors placeholder:text-neutral-400"
                />
                <button type="submit" className="bg-charcoal text-ivory px-6 py-3 text-[12px] font-bold tracking-wider uppercase hover:bg-neutral-800 transition-colors">
                  Join
                </button>
              </form>
            </div>

            <div className="flex gap-5">
              <a href="#" className="text-neutral-500 hover:text-charcoal transition-colors">
                <FaInstagram size={22} />
              </a>
              <a href="#" className="text-neutral-500 hover:text-charcoal transition-colors">
                <FaTwitter size={22} />
              </a>
              <a href="#" className="text-neutral-500 hover:text-charcoal transition-colors">
                <FaYoutube size={22} />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:w-[65%] grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* GET HELP Column */}
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4 text-charcoal">
                  GET HELP
                </h4>
                <ul className="flex flex-col gap-3">
                  {getHelpLinks.map((link) => (
                    <li key={link.name}>
                      <Link to={link.path} className="text-[12px] text-neutral-600 hover:text-charcoal transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <p className="text-[12px] text-neutral-600 mb-1">424-500-8209</p>
                <p className="text-[10px] text-neutral-500 leading-tight mb-4">
                  Call or Text<br />
                  5am to 8pm PST<br />
                  Monday to Friday
                </p>
                
                <p className="text-[12px] text-neutral-600 mb-1">+1-888-462-1901</p>
                <p className="text-[10px] text-neutral-500 leading-tight mb-4">
                  Call us Toll Free<br />
                  5am to 8pm PST<br />
                  Monday to Friday
                </p>
                
                <p className="text-[12px] text-neutral-600 mb-1">Chat with Us</p>
                <p className="text-[10px] text-neutral-500 leading-tight">
                  5am to 8pm PST<br />
                  Monday to Friday
                </p>
              </div>
            </div>

            {/* OUR COMPANY & GUIDES Column */}
            <div className="flex flex-col gap-8">
              <div>
                <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4 text-charcoal">
                  OUR COMPANY
                </h4>
                <ul className="flex flex-col gap-3">
                  {companyLinks.map((link) => (
                    <li key={link.name}>
                      <Link to={link.path} className="text-[12px] text-neutral-600 hover:text-charcoal transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4 text-charcoal">
                  GUIDES
                </h4>
                <ul className="flex flex-col gap-3">
                  {guidesLinks.map((link) => (
                    <li key={link.name}>
                      <Link to={link.path} className="text-[12px] text-neutral-600 hover:text-charcoal transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* MORE INFO Column */}
            <div>
              <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4 text-charcoal">
                MORE INFO
              </h4>
              <ul className="flex flex-col gap-3">
                {infoLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-[12px] text-neutral-600 hover:text-charcoal transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* LEGAL Column */}
            <div>
              <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4 text-charcoal">
                LEGAL
              </h4>
              <ul className="flex flex-col gap-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-[12px] text-neutral-600 hover:text-charcoal transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/privacy" className="text-[12px] text-neutral-600 hover:text-charcoal transition-colors flex items-center gap-1.5">
                    Your Privacy Choices 
                    <span className="inline-flex items-center justify-center w-6 h-3 bg-blue-500 rounded-full">
                      <span className="w-2.5 h-2.5 bg-white rounded-full ml-auto mr-px"></span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200 pt-6 mt-12 relative">
        <div className="container-premium px-4 sm:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-neutral-500 tracking-[0.1em] uppercase font-bold">
              &copy; {new Date().getFullYear()} FLAIRVIGO, INC. ALL RIGHTS RESERVED
            </p>
            <div className="flex gap-2 text-[10px] text-neutral-500">
              <Link to="/terms" className="hover:text-charcoal transition-colors">Terms of Use</Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-charcoal transition-colors">Privacy Policy</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <img src="https://flagcdn.com/w40/us.png" alt="US Flag" className="w-5 h-5 object-cover rounded-full border border-white/20" />
            <span className="text-[11px] text-neutral-600 font-bold tracking-wider uppercase">
              UNITED STATES | ENGLISH
            </span>
          </div>
        </div>

        {/* Floating Help Button */}
        <button className="fixed bottom-6 right-6 z-50 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-colors border border-white/10">
          <HelpCircle size={18} />
          <span className="text-sm font-bold tracking-wide">Help</span>
        </button>
      </div>
    </footer>
  );
}
