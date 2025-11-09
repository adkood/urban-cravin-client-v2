"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Mail,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const shopLinks = [
    { label: "Baggy Vests", href: "/collection/baggy-vests" },
    { label: "Oversized Tees", href: "/collection/oversized-tees" },
    { label: "Sweatpants", href: "/collection/sweatpants" },
    { label: "DHH Collection", href: "/collection/dhh" },
  ];

  const brandLinks = [
    { label: "About Us", href: "/about" },
    { label : "" ,href : ""}
  ];

  const contactLinks = [
    { label: "My Account", href: "/account" },
    { label: "Order Tracking", href: "/account" },
    { label: "Returns & Exchanges", href: "/return-policies" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Shipping Policies", href: "/policies" },
  ];

  const MobileAccordion = ({
    title,
    links,
  }: {
    title: string;
    links: typeof shopLinks;
  }) => {
    const isOpen = openSection === title;

    return (
      <div className="border-b border-[#ffe6d2]/50">
        <button
          onClick={() => toggleSection(title)}
          className="flex w-full items-center justify-between py-5 text-left"
          aria-expanded={isOpen}
        >
          <h3 className="text-sm font-semibold">{title}</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="space-y-2.5">
            {links.map((link, idx) => (
              <li key={idx}>
                <a href={link.href} className="text-sm hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <footer className="bg-[#9b1e22] text-[#ffe6d2] px-5 py-14 md:px-14">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-col items-center">
          {/* Links Section - Mobile Accordion */}
          <div className="w-full md:hidden border-t border-[#ffe6d2]/50">
            <MobileAccordion title="Shop" links={shopLinks} />
            <MobileAccordion title="#madethecut" links={brandLinks} />
            <MobileAccordion title="Contact" links={contactLinks} />
          </div>

          {/* Links Section - Desktop */}
          <div className="hidden md:grid md:grid-cols-3 gap-x-12 gap-y-11 mb-12">
            <div className="text-center">
              <h3 className="text-sm font-semibold opacity-70 mb-5">Shop</h3>
              <ul className="space-y-2.5">
                {shopLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="text-sm hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <h3 className="text-sm font-semibold opacity-70 mb-5">
                #madethecut
              </h3>
              <ul className="space-y-2.5">
                {brandLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="text-sm hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <h3 className="text-sm font-semibold opacity-70 mb-5">Contact</h3>
              <ul className="space-y-2.5">
                {contactLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="text-sm hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reach Us Section - Desktop */}
          <div className="hidden md:block text-center mb-12">
            <h3 className="text-sm font-semibold opacity-70 mb-4">
              Reach Us At
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a
                  href="mailto:support@urbancravin.com"
                  className="text-sm hover:underline"
                >
                  support@urbancravin.com
                </a>
              </div>
              <div className="flex items-center justify-center gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">
                  Dashrathpuri, Dwarka, Delhi - 110045
                </p>
              </div>
            </div>
          </div>

          {/* Reach Us Section - Mobile */}
          <div className="md:hidden w-full text-center mb-8 border-t border-[#ffe6d2]/50 pt-6">
            <h3 className="text-sm font-semibold opacity-70 mb-4">
              Reach Us At
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a
                  href="mailto:support@urbancravin.com"
                  className="text-sm hover:underline"
                >
                  support@urbancravin.com
                </a>
              </div>
              <div className="flex items-center justify-center gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">
                  Dashrathpuri, Dwarka, Delhi - 110045
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="w-full flex flex-col items-center gap-6 border-t border-[#ffe6d2]/50 pt-6">
            <a href="/" className="text-[#ffe6d2]">
              <div className="w-12 h-12 flex items-center justify-center font-bold text-2xl border-2 border-[#ffe6d2] rounded">
                C
              </div>
            </a>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 bg-[#ffe6d2]/20 px-6 h-12 rounded-full">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <div className="w-6 h-6 flex items-center justify-center font-bold">
                  T
                </div>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <Youtube className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-center">
              <a href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </a>
              <span className="px-1">•</span>
              <a href="/terms" className="hover:underline">
                Terms & Conditions
              </a>
              <span className="px-1">•</span>
              <span>© 2025 All Rights Reserved Urban Cravin Clothing®</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
