"use client";

import { NAV_ITEMS as navItems } from "@/lib/constants";
import { nunitoSans } from "@/lib/fonts";
import { Search, User, Heart, ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import UserAvatar from "../cards/user-profile";
import { filterProductsAction, type Product } from "@/data/product";
import { BASE_URL } from "@/lib/urls";
import CartInitializer from "@/hooks/cartInitailizer";
import CartIcon from "../cart-icon";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        const data = await filterProductsAction({
          search: searchQuery.trim(),
          size: 5,
        });
        setResults(data.products || []);
        setShowResults(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 400); 

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  return (
    <header className="w-full bg-white relative">
      <CartInitializer/>
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
                  <span className="text-[#9b1e22] mx-1">CRAVIN'</span>
                </h1>
              </div>
            </Link>

            <div className="hidden md:flex flex-1 max-w-[600px] relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH FOR PRODUCTS"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md text-sm font-medium tracking-wide placeholder:text-gray-500 placeholder:text-xs placeholder:font-semibold focus:outline-none focus:border-gray-400 disabled:opacity-50"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

              {showResults && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white shadow-lg border border-gray-200 rounded-md max-h-80 overflow-y-auto z-50">
                  {isLoading ? (
                    <p className="p-4 text-sm text-gray-500">Searching...</p>
                  ) : results.length > 0 ? (
                    results.map((p) => (
                      <Link
                        href={`/product/${p.id}`}
                        key={p.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowResults(false)}
                      >
                        <img
                          src={
                            BASE_URL + (p.images.find((img) => img.primaryImage)?.url ||
                            p.images[0]?.url)
                          }
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{p.name}</span>
                          <span className="text-xs text-gray-500">
                            ₹{p.price.toFixed(2)}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-gray-500">
                      No results found
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <button
                className="md:hidden hover:opacity-70 transition-opacity"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button className="hidden sm:block hover:opacity-70 transition-opacity">
                <UserAvatar />
              </button>
              <button className="hidden sm:block hover:opacity-70 transition-opacity">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <CartIcon/>
            </div>
          </div>

          {isSearchOpen && (
            <div className="md:hidden mt-3 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH FOR PRODUCTS"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md text-sm font-medium tracking-wide placeholder:text-gray-500 placeholder:text-xs placeholder:font-semibold focus:outline-none focus:border-gray-400 disabled:opacity-50"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

              {showResults && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white shadow-lg border border-gray-200 rounded-md max-h-80 overflow-y-auto z-50">
                  {isLoading ? (
                    <p className="p-4 text-sm text-gray-500">Searching...</p>
                  ) : results.length > 0 ? (
                    results.map((p) => (
                      <Link
                        href={`/product/${p.id}`}
                        key={p.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowResults(false)}
                      >
                        <img
                          src={
                            BASE_URL+(p.images.find((img) => img.primaryImage)?.url ||
                            p.images[0]?.url)
                          }
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{p.name}</span>
                          <span className="text-xs text-gray-500">
                            ₹{p.price.toFixed(2)}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-gray-500">
                      No results found
                    </p>
                  )}
                </div>
              )}
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
                  <Link href={item.HREF} className="flex items-center justify-between w-full text-left text-sm font-bold tracking-wide uppercase hover:opacity-70 transition-opacity py-2">
                    <span className="relative">
                      {item.label}
                      {item.badge && (
                        <span
                          className={`ml-2 ${
                            item.badge === "HOT"
                              ? "bg-[#9b1e22]"
                              : "bg-[#9b1e22]"
                          } text-white text-[7.5px] font-bold px-1.5 py-[0.2rem] rounded-full`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
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
              <Link href={item.HREF} className="flex items-center gap-1 text-xs xl:text-sm font-bold tracking-wide uppercase hover:opacity-70 transition-opacity whitespace-nowrap">
                {item.label}
                {item.badge && (
                  <span
                    className={`absolute -top-[0.8rem] -right-4.5 ${
                      item.badge === "HOT"
                        ? "bg-[#9b1e22]"
                        : "bg-[#9b1e22]"
                    } text-white text-[7.5px] font-bold px-1.5 py-[0.2rem] rounded-full`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
