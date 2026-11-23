'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
  MessageCircle,
  ChevronDown,
  Search,
} from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [collectionsDropdown, setCollectionsDropdown] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [atelierDropdown, setAtelierDropdown] = useState(false);

  const collectionsTimeout = useRef<NodeJS.Timeout | null>(null);
  const servicesTimeout = useRef<NodeJS.Timeout | null>(null);
  const atelierTimeout = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const { fabrics, generateWhatsAppUrl } = useEnquiry();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
    setCollectionsDropdown(false);
    setServicesDropdown(false);
    setAtelierDropdown(false);
  }, [pathname]);

  const collectionCategories = [
    { label: 'Sherwani Fabrics', href: '/collections?category=sherwani', desc: 'Heavy zardozi, raw silk & brocades' },
    { label: 'Kurta Fabrics', href: '/collections?category=kurta', desc: 'Chanderi & tone-on-tone resham' },
    { label: 'Jodhpuri & Bandhgala', href: '/collections?category=jodhpuri', desc: 'Micro-velvet & structured suiting' },
    { label: 'Indo-Western & Designer', href: '/collections?category=indo-western', desc: 'Modern lattices & micro-sequins' },
    { label: 'Benarasi Tissue Brocade', href: '/collections?category=brocade', desc: 'Mughal crest & antique zari' },
  ];

  const serviceLinks = [
    { label: 'Custom Job-Work Bay', href: '/job-work', desc: 'CAD digitizing & custom multi-needle embroidery' },
    { label: 'Wholesale B2B Portal', href: '/wholesale-b2b', desc: 'Direct mill pricing & tier volume rates' },
    { label: 'Atelier Swatch Kit', href: '/wholesale-b2b#swatch-kit', desc: 'Physical cutting books dispatched across India' },
  ];

  const atelierLinks = [
    { label: 'About Khodal Fashion', href: '/about', desc: 'Surat textile heritage & craft values' },
    { label: 'Our Process & Quality', href: '/process-quality', desc: '6-step buyer journey & inspection' },
    { label: 'Photographic Gallery', href: '/gallery', desc: 'Macro stitches, workshop & styled looks' },
    { label: 'Commercial Buyer FAQ', href: '/faq', desc: 'MOQ, pricing, samples & logistics' },
  ];

  const filteredSearchResults = searchQuery.trim()
    ? fabrics.filter(
        (f) =>
          f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.embroideryTypeLabel.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-x-clip bg-[#FAF8F3] transition-all duration-300">
      {/* Top Editorial Bar */}
      <div className="bg-[#252321] text-[#C9BBA7] text-[10px] tracking-[0.18em] uppercase py-2 px-4 sm:px-6 lg:px-8 border-b border-[#30241F]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AD8A53] shrink-0" />
            <span className="font-sans font-medium text-[#FAF8F3]/90 text-[9.5px] sm:text-[10px] truncate">
              Surat Textile House • Men&apos;s Ethnic Embroidered Fabrics & Job-Work
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-5 text-[#FAF8F3] shrink-0 text-[10px]">
            <Link href="/faq" className="hover:text-[#AD8A53] transition-colors whitespace-nowrap">
              Buyer FAQ
            </Link>
            <span className="text-[#AD8A53]/30">•</span>
            <Link href="/admin" className="hover:text-[#AD8A53] transition-colors whitespace-nowrap">
              Admin Portal
            </Link>
            <span className="text-[#AD8A53]/30">•</span>
            <a
              href={generateWhatsAppUrl({ sourcePage: 'Top Navigation Bar' })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AD8A53] hover:text-[#C8A974] flex items-center gap-1.5 font-medium transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Responsive Header */}
      <nav
        className={`w-full border-b border-[#AD8A53]/20 transition-all duration-300 ${
          scrolled ? 'bg-[#FAF8F3]/98 backdrop-blur-md shadow-sm py-2.5 sm:py-3' : 'bg-[#FAF8F3] py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
            
            {/* 1. Brand Logo */}
            <div className="shrink-0 flex flex-col justify-center">
              <Link href="/" className="group inline-block">
                <span className="font-editorial text-xl sm:text-2xl xl:text-[26px] tracking-[0.06em] text-[#30241F] group-hover:text-[#713B43] transition-colors font-medium whitespace-nowrap block leading-tight">
                  KHODAL FASHION
                </span>
                <span className="block text-[8px] sm:text-[9px] tracking-[0.24em] uppercase text-[#AD8A53] font-sans font-medium mt-0.5 whitespace-nowrap">
                  The Art of Royal Textiles • Surat
                </span>
              </Link>
            </div>

            {/* 2. Desktop Navigation (Active on xl: 1280px+ for spacious perfection) */}
            <div className="hidden xl:flex items-center gap-5 2xl:gap-7 flex-grow justify-center min-w-0">
              
              {/* Collections Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => {
                  if (collectionsTimeout.current) clearTimeout(collectionsTimeout.current);
                  setCollectionsDropdown(true);
                }}
                onMouseLeave={() => {
                  collectionsTimeout.current = setTimeout(() => setCollectionsDropdown(false), 160);
                }}
              >
                <Link
                  href="/collections"
                  className={`text-[11px] uppercase tracking-[0.14em] font-sans font-medium transition-colors whitespace-nowrap inline-flex items-center gap-1 ${
                    pathname.startsWith('/collections')
                      ? 'text-[#713B43] font-semibold'
                      : 'text-[#30241F]/85 hover:text-[#AD8A53]'
                  }`}
                >
                  <span>Collections</span>
                  <ChevronDown className="w-3 h-3 text-[#AD8A53]/70" />
                </Link>

                {collectionsDropdown && (
                  <div className="absolute top-full left-0 w-72 bg-[#FAF8F3] border border-[#AD8A53]/35 shadow-xl p-3 animate-fadeIn z-50">
                    <div className="text-[9px] uppercase tracking-wider text-[#AD8A53] font-semibold pb-1.5 mb-2 border-b border-[#AD8A53]/20">
                      Fabric Classifications
                    </div>
                    <div className="space-y-1">
                      {collectionCategories.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          className="block p-1.5 hover:bg-[#F4EFE6] transition-colors rounded-sm"
                          onClick={() => setCollectionsDropdown(false)}
                        >
                          <p className="text-xs font-serif font-medium text-[#30241F]">{cat.label}</p>
                          <p className="text-[10px] text-[#C9BBA7] font-sans">{cat.desc}</p>
                        </Link>
                      ))}
                    </div>
                    <div className="pt-2 mt-2 border-t border-[#AD8A53]/20">
                      <Link
                        href="/collections"
                        className="text-[10px] uppercase tracking-wider font-semibold text-[#713B43] hover:underline flex items-center justify-between p-1"
                        onClick={() => setCollectionsDropdown(false)}
                      >
                        <span>View All 85+ Weaves</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Try-On */}
              <Link
                href="/ai-tryon"
                className={`text-[11px] uppercase tracking-[0.14em] font-sans font-medium transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                  pathname === '/ai-tryon'
                    ? 'text-[#713B43] font-semibold'
                    : 'text-[#30241F]/85 hover:text-[#AD8A53]'
                }`}
              >
                <span>AI Try-On</span>
                <span className="px-1.5 py-0.5 text-[8px] tracking-wider uppercase bg-[#AD8A53] text-[#FAF8F3] font-semibold rounded-sm inline-flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  Studio
                </span>
              </Link>

              {/* Craftsmanship */}
              <Link
                href="/craftsmanship"
                className={`text-[11px] uppercase tracking-[0.14em] font-sans font-medium transition-colors whitespace-nowrap ${
                  pathname === '/craftsmanship'
                    ? 'text-[#713B43] font-semibold'
                    : 'text-[#30241F]/85 hover:text-[#AD8A53]'
                }`}
              >
                Craftsmanship
              </Link>

              {/* Services Dropdown (Job-Work & Wholesale B2B) */}
              <div
                className="relative py-2"
                onMouseEnter={() => {
                  if (servicesTimeout.current) clearTimeout(servicesTimeout.current);
                  setServicesDropdown(true);
                }}
                onMouseLeave={() => {
                  servicesTimeout.current = setTimeout(() => setServicesDropdown(false), 160);
                }}
              >
                <button
                  type="button"
                  className={`text-[11px] uppercase tracking-[0.14em] font-sans font-medium transition-colors whitespace-nowrap inline-flex items-center gap-1 ${
                    pathname === '/job-work' || pathname === '/wholesale-b2b'
                      ? 'text-[#713B43] font-semibold'
                      : 'text-[#30241F]/85 hover:text-[#AD8A53]'
                  }`}
                >
                  <span>B2B Services</span>
                  <ChevronDown className="w-3 h-3 text-[#AD8A53]/70" />
                </button>

                {servicesDropdown && (
                  <div className="absolute top-full left-0 w-64 bg-[#FAF8F3] border border-[#AD8A53]/35 shadow-xl p-3 animate-fadeIn z-50">
                    <div className="text-[9px] uppercase tracking-wider text-[#AD8A53] font-semibold pb-1.5 mb-2 border-b border-[#AD8A53]/20">
                      Commercial & Job-Work
                    </div>
                    <div className="space-y-1">
                      {serviceLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block p-1.5 hover:bg-[#F4EFE6] transition-colors rounded-sm"
                          onClick={() => setServicesDropdown(false)}
                        >
                          <p className="text-xs font-serif font-medium text-[#30241F]">{item.label}</p>
                          <p className="text-[10px] text-[#C9BBA7] font-sans">{item.desc}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* The Atelier Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => {
                  if (atelierTimeout.current) clearTimeout(atelierTimeout.current);
                  setAtelierDropdown(true);
                }}
                onMouseLeave={() => {
                  atelierTimeout.current = setTimeout(() => setAtelierDropdown(false), 160);
                }}
              >
                <button
                  type="button"
                  className={`text-[11px] uppercase tracking-[0.14em] font-sans font-medium transition-colors whitespace-nowrap inline-flex items-center gap-1 ${
                    pathname === '/about' || pathname === '/process-quality' || pathname === '/gallery'
                      ? 'text-[#713B43] font-semibold'
                      : 'text-[#30241F]/85 hover:text-[#AD8A53]'
                  }`}
                >
                  <span>The Atelier</span>
                  <ChevronDown className="w-3 h-3 text-[#AD8A53]/70" />
                </button>

                {atelierDropdown && (
                  <div className="absolute top-full left-0 w-64 bg-[#FAF8F3] border border-[#AD8A53]/35 shadow-xl p-3 animate-fadeIn z-50">
                    <div className="text-[9px] uppercase tracking-wider text-[#AD8A53] font-semibold pb-1.5 mb-2 border-b border-[#AD8A53]/20">
                      House of Khodal Fashion
                    </div>
                    <div className="space-y-1">
                      {atelierLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block p-1.5 hover:bg-[#F4EFE6] transition-colors rounded-sm"
                          onClick={() => setAtelierDropdown(false)}
                        >
                          <p className="text-xs font-serif font-medium text-[#30241F]">{item.label}</p>
                          <p className="text-[10px] text-[#C9BBA7] font-sans">{item.desc}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact */}
              <Link
                href="/contact"
                className={`text-[11px] uppercase tracking-[0.14em] font-sans font-medium transition-colors whitespace-nowrap ${
                  pathname === '/contact'
                    ? 'text-[#713B43] font-semibold'
                    : 'text-[#30241F]/85 hover:text-[#AD8A53]'
                }`}
              >
                Contact
              </Link>
            </div>

            {/* 3. Right Action Buttons */}
            <div className="shrink-0 flex items-center space-x-2 sm:space-x-3">
              {/* Quick AI Studio Button for Tablets / Mid Screens */}
              <Link
                href="/ai-tryon"
                className="hidden md:inline-flex xl:hidden items-center gap-1 px-2.5 py-1 text-[9.5px] uppercase tracking-wider border border-[#AD8A53]/50 text-[#AD8A53] rounded-sm font-semibold"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Studio</span>
              </Link>

              {/* Search Toggle Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search Design Code"
                className="p-1.5 sm:p-2 text-[#30241F] hover:text-[#AD8A53] hover:bg-[#F4EFE6] transition-colors rounded-full"
                title="Search Design Code"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Enquire Now CTA (Always fits, never cuts off) */}
              <a
                href={generateWhatsAppUrl({ sourcePage: 'Main Header CTA' })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-[#AD8A53] bg-[#FAF8F3] hover:bg-[#AD8A53] text-[#30241F] hover:text-[#FAF8F3] px-2.5 sm:px-3.5 py-1.5 text-[9.5px] sm:text-[10.5px] tracking-[0.14em] uppercase transition-all duration-300 font-sans font-medium shadow-sm whitespace-nowrap shrink-0"
              >
                <span>Enquire Now</span>
                <ArrowUpRight className="w-3 h-3 text-[#AD8A53] group-hover:text-white" />
              </a>

              {/* Mobile / Tablet Menu Button (Visible on screens < 1280px) */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation menu"
                className="xl:hidden p-1.5 sm:p-2 text-[#30241F] hover:text-[#AD8A53] transition-colors flex items-center gap-1 border border-[#AD8A53]/25 px-2.5 py-1"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                <span className="text-[10px] uppercase tracking-wider font-semibold hidden sm:inline">
                  Menu
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-[#AD8A53]/20 bg-[#F4EFE6] px-4 py-3 sm:py-4 mt-2 animate-fadeIn">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Design Code (e.g. KF-ZAR-901), Fabric, or Embroidery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#AD8A53]/40 px-4 py-2 text-xs font-sans text-[#30241F] placeholder-[#C9BBA7] focus:outline-none focus:border-[#AD8A53]"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2 text-[#C9BBA7] hover:text-[#30241F]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {searchQuery && (
                <div className="mt-2 bg-[#FAF8F3] border border-[#AD8A53]/20 p-2 shadow-lg max-h-60 overflow-y-auto">
                  {filteredSearchResults.length > 0 ? (
                    <div className="divide-y divide-[#AD8A53]/10">
                      {filteredSearchResults.map((f) => (
                        <Link
                          key={f.id}
                          href={`/collections/${f.id}`}
                          className="flex items-center justify-between p-2 hover:bg-[#F4EFE6] transition-colors"
                          onClick={() => setSearchOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[11px] text-[#AD8A53] font-semibold bg-[#F4EFE6] px-2 py-0.5 border border-[#AD8A53]/30">
                              {f.code}
                            </span>
                            <div>
                              <p className="text-xs font-medium text-[#30241F]">{f.name}</p>
                              <p className="text-[10px] text-[#C9BBA7]">
                                {f.embroideryTypeLabel} • {f.categoryLabel}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] text-[#713B43] uppercase tracking-wider font-medium">
                            View Fabric →
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#C9BBA7] p-3 text-center">
                      No matching design code found for &ldquo;{searchQuery}&rdquo;. Contact us on WhatsApp for custom lookups.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile / Tablet Drawer Menu */}
      {isOpen && (
        <div className="xl:hidden fixed inset-0 top-[90px] z-50 bg-[#FAF8F3] border-t border-[#AD8A53]/20 overflow-y-auto pb-16 px-6 pt-5 animate-fadeIn shadow-2xl">
          <div className="flex flex-col space-y-4 max-w-lg mx-auto">
            <p className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold border-b border-[#AD8A53]/20 pb-2">
              Menu & Navigation
            </p>

            <Link
              href="/collections"
              className={`text-base font-serif tracking-wide flex items-center justify-between py-2 border-b border-[#AD8A53]/10 ${
                pathname === '/collections' ? 'text-[#713B43] font-semibold' : 'text-[#30241F]'
              }`}
            >
              <span>Fabric Collections (85+ Designs)</span>
              <ArrowUpRight className="w-4 h-4 text-[#AD8A53]/60" />
            </Link>

            <Link
              href="/ai-tryon"
              className={`text-base font-serif tracking-wide flex items-center justify-between py-2 border-b border-[#AD8A53]/10 ${
                pathname === '/ai-tryon' ? 'text-[#713B43] font-semibold' : 'text-[#30241F]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>AI Virtual Try-On Studio</span>
                <span className="px-1.5 py-0.5 text-[8px] bg-[#AD8A53] text-[#FAF8F3] uppercase tracking-wider rounded font-sans">
                  NEW
                </span>
              </div>
              <Sparkles className="w-4 h-4 text-[#AD8A53]" />
            </Link>

            <Link
              href="/craftsmanship"
              className={`text-base font-serif tracking-wide flex items-center justify-between py-2 border-b border-[#AD8A53]/10 ${
                pathname === '/craftsmanship' ? 'text-[#713B43] font-semibold' : 'text-[#30241F]'
              }`}
            >
              <span>Craftsmanship & Embroidery</span>
              <ArrowUpRight className="w-4 h-4 text-[#AD8A53]/60" />
            </Link>

            <Link
              href="/job-work"
              className={`text-base font-serif tracking-wide flex items-center justify-between py-2 border-b border-[#AD8A53]/10 ${
                pathname === '/job-work' ? 'text-[#713B43] font-semibold' : 'text-[#30241F]'
              }`}
            >
              <span>Custom Job-Work Bay</span>
              <ArrowUpRight className="w-4 h-4 text-[#AD8A53]/60" />
            </Link>

            <Link
              href="/wholesale-b2b"
              className={`text-base font-serif tracking-wide flex items-center justify-between py-2 border-b border-[#AD8A53]/10 ${
                pathname === '/wholesale-b2b' ? 'text-[#713B43] font-semibold' : 'text-[#30241F]'
              }`}
            >
              <span>Wholesale & B2B Portal</span>
              <ArrowUpRight className="w-4 h-4 text-[#AD8A53]/60" />
            </Link>

            <div className="pt-2">
              <p className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold mb-2">
                The Atelier
              </p>
              <div className="pl-3 border-l-2 border-[#AD8A53]/30 space-y-2.5">
                <Link
                  href="/about"
                  className="block text-sm font-serif text-[#30241F] hover:text-[#713B43]"
                >
                  About Khodal Fashion
                </Link>
                <Link
                  href="/process-quality"
                  className="block text-sm font-serif text-[#30241F] hover:text-[#713B43]"
                >
                  Our Process & Quality Standards
                </Link>
                <Link
                  href="/gallery"
                  className="block text-sm font-serif text-[#30241F] hover:text-[#713B43]"
                >
                  Photographic Archive & Lookbook
                </Link>
                <Link
                  href="/faq"
                  className="block text-sm font-serif text-[#30241F] hover:text-[#713B43]"
                >
                  Commercial Buyer FAQ
                </Link>
              </div>
            </div>

            <Link
              href="/contact"
              className={`text-base font-serif tracking-wide flex items-center justify-between py-2 border-b border-[#AD8A53]/10 ${
                pathname === '/contact' ? 'text-[#713B43] font-semibold' : 'text-[#30241F]'
              }`}
            >
              <span>Contact Headquarters (Surat)</span>
              <ArrowUpRight className="w-4 h-4 text-[#AD8A53]/60" />
            </Link>

            <div className="pt-5 space-y-3">
              <a
                href={generateWhatsAppUrl({ sourcePage: 'Mobile Menu' })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] text-center text-xs tracking-widest uppercase font-sans font-semibold flex items-center justify-center gap-2 shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Business Desk</span>
              </a>
              <Link
                href="/admin"
                className="block text-center text-xs text-[#AD8A53] underline tracking-wider"
              >
                Admin Operations Portal
              </Link>
            </div>

            <div className="pt-4 text-center">
              <p className="text-[11px] text-[#C9BBA7]">
                Ring Road Textile Zone, Surat, Gujarat • Men’s Ethnic Fabrics
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
