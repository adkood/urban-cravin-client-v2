"use client";
import { NAV_ITEMS as navItems } from '@/lib/constants';
import { nunitoSans } from '@/lib/fonts';
import { useUserStore } from '@/providers/user-store-provider';
import { Search, User, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import UserAvatar from '../cards/user-profile';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <header className="w-full bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            <button
              className="lg:hidden hover:opacity-70 transition-opacity"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <Link href={"/"}>
              <div className="flex-shrink-0">
              <h1 className={`${nunitoSans.className} text-[30px]`}>
                URBAN 
                <span
                  className='text-[#9b1e22] mx-1'
                >
                  CRAVIN'
                </span>
                </h1>
            </div>
            </Link>

            <div className="hidden md:flex flex-1 max-w-[600px]">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="SEARCH FOR PRODUCTS"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md text-sm font-medium tracking-wide placeholder:text-gray-500 placeholder:text-xs placeholder:font-semibold focus:outline-none focus:border-gray-400"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <button
                className="md:hidden hover:opacity-70 transition-opacity"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button className="hidden sm:block hover:opacity-70 transition-opacity">
                <UserAvatar/>
              </button>
              <button className="hidden sm:block hover:opacity-70 transition-opacity">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <Link href="/cart" className="relative hover:opacity-70 transition-opacity">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -top-2 -right-2 bg-[#9b1e22] text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                  0
                </span>
              </Link>
            </div>
          </div>

          {isSearchOpen && (
            <div className="md:hidden mt-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="SEARCH FOR PRODUCTS"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md text-sm font-medium tracking-wide placeholder:text-gray-500 placeholder:text-xs placeholder:font-semibold focus:outline-none focus:border-gray-400"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        <Nav />
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-200 border-t border-gray-300">
          <div className="px-4 py-3">
            <ul className="space-y-3">
              {navItems.map((item, index) => (
                <li key={index}>
                  <button className="flex items-center justify-between w-full text-left text-sm font-bold tracking-wide uppercase hover:opacity-70 transition-opacity py-2">
                    <span className="relative">
                      {item.label}
                      {item.badge && (
                        <span
                          className={`ml-2 ${
                            item.badge === 'HOT' ? 'bg-[#9b1e22]' : 'bg-[#9b1e22]'
                          } text-white text-[7.5px] font-bold px-1.5 py-[0.2rem] rounded-full`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-5 mt-4 pt-4 border-t border-gray-300">
              <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <User className="w-5 h-5" />
                <span className="text-sm font-semibold">Account</span>
              </button>
              <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-semibold">Wishlist</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Nav() {
  return (
    <nav className="bg-gray-200">
      <div className="flex justify-center items-center mx-auto">
        <ul className="flex gap-4 xl:gap-8 py-4 overflow-x-auto px-4">
          {navItems.map((item, index) => (
            <li key={index} className="relative flex-shrink-0">
              <button className="flex items-center gap-1 text-xs xl:text-sm font-bold tracking-wide uppercase hover:opacity-70 transition-opacity whitespace-nowrap">
                {item.label}
                {item.badge && (
                  <span
                    className={`absolute -top-[0.8rem] -right-4.5 ${
                      item.badge === 'HOT' ? 'bg-[#9b1e22]' : 'bg-[#9b1e22]'
                    } text-white text-[7.5px] font-bold px-1.5 py-[0.2rem] rounded-full`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}