'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Eye,
  Sliders,
  Sparkles,
  Search,
  RotateCcw,
  Shield,
  Save,
  Upload,
  Image as ImageIcon,
  Star,
  X,
  Palette,
} from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import { FabricItem, CustomerEnquiry } from '@/types';

// Palette presets for Indian ethnic fabrics
const PRESET_COLORS = [
  { name: 'Sandstone Ivory', hex: '#F4EFE6' },
  { name: 'Antique Gold', hex: '#AD8A53' },
  { name: 'Imperial Burgundy', hex: '#713B43' },
  { name: 'Midnight Navy', hex: '#1C2541' },
  { name: 'Royal Emerald', hex: '#1C3B2B' },
  { name: 'Charcoal Noir', hex: '#252321' },
  { name: 'Dusty Rose', hex: '#C49A9A' },
  { name: 'Pearl Off-White', hex: '#FAF8F3' },
];

export default function AdminPage() {
  const {
    fabrics,
    enquiries,
    addProduct,
    updateProduct,
    deleteProduct,
    updateEnquiryStatus,
    generateWhatsAppUrl,
  } = useEnquiry();

  const [activeTab, setActiveTab] = useState<'products' | 'enquiries' | 'settings'>('products');
  const [enquiryFilter, setEnquiryFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');

  // Add Product Modal Form State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<FabricItem['category']>('sherwani');
  const [newEmbroideryType, setNewEmbroideryType] = useState<FabricItem['embroideryType']>('zari');
  const [newBaseFabric, setNewBaseFabric] = useState('Pure Silk Organza');
  const [newWidth, setNewWidth] = useState('44 Inches');
  const [newMoq, setNewMoq] = useState('25 Metres');
  const [newReadyStock, setNewReadyStock] = useState(true);
  const [newDescription, setNewDescription] = useState('');
  
  // Real multi-image upload state
  const [newImages, setNewImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Available colors state
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([
    PRESET_COLORS[0],
    PRESET_COLORS[1],
  ]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#713B43');

  // Client-side lightweight image compressor for crisp rendering and fast persistence
  const processAndCompressFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new (window as any).Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(readerEvent.target?.result as string);
          }
        };
        img.onerror = () => resolve(readerEvent.target?.result as string);
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const fileArray = Array.from(files);
      const validImages = fileArray.filter((f) => f.type.startsWith('image/'));
      if (validImages.length === 0) {
        setUploadError('Please select valid image files (JPG, PNG, WEBP).');
        setIsUploading(false);
        return;
      }

      const compressed = await Promise.all(validImages.map((file) => processAndCompressFile(file)));
      const filtered = compressed.filter(Boolean);
      setNewImages((prev) => [...prev, ...filtered]);
    } catch {
      setUploadError('Failed to process image files.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetCoverImage = (index: number) => {
    setNewImages((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
  };

  const togglePresetColor = (preset: { name: string; hex: string }) => {
    setSelectedColors((prev) => {
      const exists = prev.some((c) => c.name === preset.name);
      if (exists) {
        return prev.filter((c) => c.name !== preset.name);
      }
      return [...prev, preset];
    });
  };

  const addCustomColor = () => {
    if (!customColorName.trim()) return;
    setSelectedColors((prev) => [...prev, { name: customColorName.trim(), hex: customColorHex }]);
    setCustomColorName('');
  };

  const removeColor = (name: string) => {
    setSelectedColors((prev) => prev.filter((c) => c.name !== name));
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const fallbackCover = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85';
    const primaryImg = newImages.length > 0 ? newImages[0] : fallbackCover;
    const allImages = newImages.length > 0 ? newImages : [fallbackCover];

    const newFabric: FabricItem = {
      id: `kf-${Date.now().toString().slice(-4)}`,
      name: newName || 'Royal Embroidered Yardage',
      code: newCode.toUpperCase() || `KF-NEW-${Math.floor(Math.random() * 900 + 100)}`,
      category: newCategory,
      categoryLabel:
        newCategory === 'sherwani'
          ? 'Sherwani Fabrics'
          : newCategory === 'kurta'
          ? 'Kurta Fabrics'
          : newCategory === 'jodhpuri'
          ? 'Jodhpuri Fabrics'
          : newCategory === 'indo-western'
          ? 'Indo-Western Fabrics'
          : newCategory === 'brocade'
          ? 'Premium Brocade'
          : 'Designer Ethnic Fabrics',
      embroideryType: newEmbroideryType,
      embroideryTypeLabel:
        newEmbroideryType === 'zari'
          ? 'Antique Zari & Dabka'
          : newEmbroideryType === 'bead'
          ? 'Cutdana & Micro-Beads'
          : newEmbroideryType === 'thread'
          ? 'Resham Silk Thread'
          : 'Sequin & Multi-Craft',
      baseFabric: newBaseFabric,
      color: selectedColors[0]?.name || 'Sandstone Ivory',
      colorFamily: 'ivory',
      width: newWidth,
      suitableFor: ['Ceremonial Sherwani', 'Heritage Bandhgala'],
      moq: newMoq,
      readyStock: newReadyStock,
      featured: true,
      description: newDescription || 'Exclusive Surat atelier men’s ethnic fabric development.',
      artisanStory: 'Engineered with balanced tension for formal menswear tailoring.',
      images: allImages,
      mainImage: primaryImg,
      closeUpImage: allImages[1] || primaryImg,
      macroImage: allImages[2] || primaryImg,
      backsideImage: allImages[3] || 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1000&q=85',
      styledModelImage: allImages[4] || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=85',
      availableColors: selectedColors.length > 0 ? selectedColors : [{ name: 'Sandstone Ivory', hex: '#F4EFE6' }],
    };

    addProduct(newFabric);
    setShowAddModal(false);
    // Reset form
    setNewCode('');
    setNewName('');
    setNewDescription('');
    setNewImages([]);
    setSelectedColors([PRESET_COLORS[0], PRESET_COLORS[1]]);
  };

  const filteredEnquiries =
    enquiryFilter === 'all'
      ? enquiries
      : enquiries.filter((e) => e.status === enquiryFilter);

  const filteredFabrics = fabrics.filter(
    (f) =>
      f.code.toLowerCase().includes(productSearch.toLowerCase()) ||
      f.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="bg-[#FAF8F3] min-h-screen text-[#30241F] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#AD8A53]/30 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold">
              Khodal Fashion • Surat Atelier Panel
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#30241F] mt-1">
            Private Admin Operations Dashboard
          </h1>
          <p className="text-xs text-[#30241F]/70 font-sans mt-0.5">
            Manage fabric design codes, inventory readiness, customer commercial inquiries, and AI settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 border border-[#AD8A53] text-[#30241F] text-xs uppercase tracking-widest font-semibold hover:bg-[#F4EFE6]"
          >
            Live Site
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Fabric</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-xs">
        <div className="bg-[#F4EFE6] border border-[#AD8A53]/30 p-4">
          <span className="text-[10px] uppercase tracking-widest text-[#AD8A53] block">
            Catalogue Fabrics
          </span>
          <span className="font-editorial text-3xl text-[#30241F] block mt-1">
            {fabrics.length}
          </span>
          <span className="text-[10px] text-[#30241F]/60">Active in catalogue</span>
        </div>

        <div className="bg-[#F4EFE6] border border-[#AD8A53]/30 p-4">
          <span className="text-[10px] uppercase tracking-widest text-[#AD8A53] block">
            Ready Stock Available
          </span>
          <span className="font-editorial text-3xl text-emerald-700 block mt-1">
            {fabrics.filter((f) => f.readyStock).length}
          </span>
          <span className="text-[10px] text-[#30241F]/60">Surat warehouse rolls</span>
        </div>

        <div className="bg-[#F4EFE6] border border-[#AD8A53]/30 p-4">
          <span className="text-[10px] uppercase tracking-widest text-[#AD8A53] block">
            Customer Inquiries
          </span>
          <span className="font-editorial text-3xl text-[#713B43] block mt-1">
            {enquiries.length}
          </span>
          <span className="text-[10px] text-[#30241F]/60">
            {enquiries.filter((e) => e.status === 'new').length} New / Unquoted
          </span>
        </div>

        <div className="bg-[#F4EFE6] border border-[#AD8A53]/30 p-4">
          <span className="text-[10px] uppercase tracking-widest text-[#AD8A53] block">
            AI Try-On Studio
          </span>
          <span className="font-editorial text-3xl text-[#30241F] block mt-1">
            Online
          </span>
          <span className="text-[10px] text-[#30241F]/60">Secure session routing</span>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex border-b border-[#AD8A53]/25 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-2 px-4 text-xs uppercase tracking-widest font-semibold transition-all border-b-2 ${
            activeTab === 'products'
              ? 'border-[#713B43] text-[#713B43]'
              : 'border-transparent text-[#30241F]/60 hover:text-[#30241F]'
          }`}
        >
          Product & Inventory Manager ({fabrics.length})
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`py-2 px-4 text-xs uppercase tracking-widest font-semibold transition-all border-b-2 ${
            activeTab === 'enquiries'
              ? 'border-[#713B43] text-[#713B43]'
              : 'border-transparent text-[#30241F]/60 hover:text-[#30241F]'
          }`}
        >
          Commercial Inquiries ({enquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2 px-4 text-xs uppercase tracking-widest font-semibold transition-all border-b-2 ${
            activeTab === 'settings'
              ? 'border-[#713B43] text-[#713B43]'
              : 'border-transparent text-[#30241F]/60 hover:text-[#30241F]'
          }`}
        >
          Business & AI Settings
        </button>
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 text-[#AD8A53] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search products by code, name, category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#AD8A53]/30 pl-9 pr-4 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#30241F] text-[#FAF8F3] text-xs uppercase tracking-wider font-semibold hover:bg-[#252321]"
            >
              + Add Fabric
            </button>
          </div>

          <div className="border border-[#AD8A53]/30 bg-[#FAF8F3] overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F4EFE6] border-b border-[#AD8A53]/20 text-[10px] uppercase tracking-wider text-[#AD8A53]">
                <tr>
                  <th className="p-3">Design Code</th>
                  <th className="p-3">Fabric Image & Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Embroidery Craft</th>
                  <th className="p-3">Base & Width</th>
                  <th className="p-3">Stock Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#AD8A53]/15">
                {filteredFabrics.map((fabric) => (
                  <tr key={fabric.id} className="hover:bg-[#F4EFE6]/50 transition-colors">
                    <td className="p-3 font-mono font-semibold text-[#AD8A53]">
                      {fabric.code}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={fabric.mainImage}
                          alt={fabric.name}
                          className="w-10 h-10 object-cover border border-[#AD8A53]/30"
                        />
                        <div>
                          <p className="font-medium text-[#30241F]">{fabric.name}</p>
                          <p className="text-[10px] text-[#C9BBA7]">{fabric.moq}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#30241F]/80">{fabric.categoryLabel}</td>
                    <td className="p-3 text-[#713B43] font-medium">
                      {fabric.embroideryTypeLabel}
                    </td>
                    <td className="p-3 text-[#30241F]/80">
                      {fabric.baseFabric} • {fabric.width}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          updateProduct({
                            ...fabric,
                            readyStock: !fabric.readyStock,
                          })
                        }
                        className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded ${
                          fabric.readyStock
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {fabric.readyStock ? 'Ready Stock' : 'Made to Order'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/collections/${fabric.id}`}
                          className="p-1 text-[#30241F] hover:text-[#AD8A53]"
                          title="View on site"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Delete fabric ${fabric.code}?`)) {
                              deleteProduct(fabric.id);
                            }
                          }}
                          className="p-1 text-red-700 hover:text-red-900"
                          title="Delete fabric"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: COMMERCIAL INQUIRIES MANAGEMENT */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#30241F] font-semibold">Filter Status:</span>
              {['all', 'new', 'quoted', 'sample-sent', 'closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setEnquiryFilter(st)}
                  className={`px-3 py-1 text-xs uppercase tracking-wider transition-all border ${
                    enquiryFilter === st
                      ? 'bg-[#30241F] text-[#FAF8F3] border-[#30241F] font-semibold'
                      : 'bg-[#FAF8F3] text-[#30241F] border-[#AD8A53]/30 hover:border-[#AD8A53]'
                  }`}
                >
                  {st.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-[#AD8A53]/30 bg-[#FAF8F3] overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F4EFE6] border-b border-[#AD8A53]/20 text-[10px] uppercase tracking-wider text-[#AD8A53]">
                <tr>
                  <th className="p-3">Time & ID</th>
                  <th className="p-3">Business & Buyer</th>
                  <th className="p-3">Contact WhatsApp / Phone</th>
                  <th className="p-3">Target Design & Qty</th>
                  <th className="p-3">Buyer Notes</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Direct Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#AD8A53]/15">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#F4EFE6]/50 transition-colors">
                    <td className="p-3">
                      <span className="font-mono text-[10px] text-[#AD8A53] block">
                        {enq.id}
                      </span>
                      <span className="text-[10px] text-[#C9BBA7]">{enq.timestamp}</span>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-[#30241F]">{enq.businessName}</p>
                      <p className="text-[11px] text-[#713B43]">{enq.contactPerson}</p>
                    </td>
                    <td className="p-3 font-mono text-[#30241F]">
                      {enq.phone}
                      {enq.email && (
                        <span className="block text-[10px] font-sans text-[#C9BBA7]">
                          {enq.email}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="font-mono font-semibold text-[#AD8A53] block">
                        {enq.productCode}
                      </span>
                      <span className="text-[10px] text-[#30241F]/80 block">
                        {enq.productName}
                      </span>
                      <span className="text-[10px] text-[#713B43] font-medium">
                        Qty: {enq.quantity || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs text-[#30241F]/80 text-[11px]">
                      {enq.notes || 'No extra notes provided.'}
                    </td>
                    <td className="p-3">
                      <select
                        value={enq.status}
                        onChange={(e) =>
                          updateEnquiryStatus(enq.id, e.target.value as any)
                        }
                        className={`px-2 py-1 text-[10px] font-semibold border rounded ${
                          enq.status === 'new'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : enq.status === 'quoted'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : enq.status === 'sample-sent'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        <option value="new">NEW INQUIRY</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="quoted">QUOTED</option>
                        <option value="sample-sent">SAMPLE SENT</option>
                        <option value="closed">CLOSED</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${enq.contactPerson}, this is Khodal Fashion Surat regarding your inquiry for ${enq.productCode}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#25D366] text-white text-[10px] uppercase tracking-wider font-semibold rounded shadow-sm hover:bg-[#20b858]"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Reply WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BUSINESS & AI SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-[#F4EFE6] border border-[#AD8A53]/30 p-6 space-y-6">
          <h2 className="font-editorial text-2xl text-[#30241F] border-b border-[#AD8A53]/20 pb-3">
            Atelier Business Configuration
          </h2>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#30241F] mb-1">
                Official Business Name:
              </label>
              <input
                type="text"
                disabled
                value="KHODAL FASHION"
                className="w-full bg-[#FAF8F3] border border-[#AD8A53]/30 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#30241F] mb-1">
                Official Surat WhatsApp Dispatch Line:
              </label>
              <input
                type="text"
                disabled
                value="+91 98251 23456"
                className="w-full bg-[#FAF8F3] border border-[#AD8A53]/30 px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#30241F] mb-1">
                AI Virtual Try-On Module Status:
              </label>
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">
                  Active & Enabled • Privacy Mode: 24-hr Auto Purge
                </span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[11px] text-[#C9BBA7]">
                Surat Mill Coordinates: Ring Road Textile Market Zone, Surat, Gujarat 395002.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252321]/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-[#FAF8F3] border border-[#AD8A53] shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="font-editorial text-2xl text-[#30241F] border-b border-[#AD8A53]/20 pb-3 mb-4">
              Add New Fabric to Catalogue
            </h2>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Design Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KF-ZAR-909"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Fabric Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Imperial Floral Bullion"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs"
                  >
                    <option value="sherwani">Sherwani Fabrics</option>
                    <option value="kurta">Kurta Fabrics</option>
                    <option value="jodhpuri">Jodhpuri Fabrics</option>
                    <option value="indo-western">Indo-Western Fabrics</option>
                    <option value="brocade">Premium Brocade</option>
                    <option value="designer">Designer Ethnic</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Embroidery Craft</label>
                  <select
                    value={newEmbroideryType}
                    onChange={(e) => setNewEmbroideryType(e.target.value as any)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs"
                  >
                    <option value="zari">Antique Zari & Dabka</option>
                    <option value="bead">Cutdana & Beadwork</option>
                    <option value="thread">Resham Silk Thread</option>
                    <option value="sequin">Micro-Sequin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Base Fabric Type *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pure Silk Organza"
                    value={newBaseFabric}
                    onChange={(e) => setNewBaseFabric(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Fabric Width *</label>
                  <select
                    value={newWidth}
                    onChange={(e) => setNewWidth(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs"
                  >
                    <option value="44 Inches">44 Inches (Standard Ethnic)</option>
                    <option value="48 Inches">48 Inches (Royal Sherwani)</option>
                    <option value="54 Inches">54 Inches (Jodhpuri Yardage)</option>
                    <option value="58 Inches">58 Inches (Broad Loom)</option>
                    <option value="60 Inches">60 Inches (Double Width)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Wholesale MOQ *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 25 Metres"
                    value={newMoq}
                    onChange={(e) => setNewMoq(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* REAL MULTI-IMAGE UPLOADER (NO IMAGE URL NEEDED) */}
              <div className="border border-[#AD8A53]/40 bg-[#F4EFE6]/50 p-4 rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#AD8A53]" />
                    <label className="block font-semibold text-xs text-[#30241F]">
                      Upload Fabric Images (Multi-Image Support) *
                    </label>
                  </div>
                  {newImages.length > 0 && (
                    <span className="text-[10px] font-mono bg-[#AD8A53] text-white px-2 py-0.5 rounded">
                      {newImages.length} Image{newImages.length > 1 ? 's' : ''} Uploaded
                    </span>
                  )}
                </div>

                {/* Dropzone / Click to Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFilesSelected(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-[#AD8A53]/50 hover:border-[#AD8A53] hover:bg-[#FAF8F3] transition-colors p-5 text-center cursor-pointer flex flex-col items-center justify-center bg-[#FAF8F3]/60 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFilesSelected(e.target.files)}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-[#F4EFE6] border border-[#AD8A53]/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-5 h-5 text-[#AD8A53]" />
                  </div>
                  <p className="font-semibold text-xs text-[#30241F]">
                    Click here to browse or drag & drop fabric photos
                  </p>
                  <p className="text-[10px] text-[#C9BBA7] mt-0.5">
                    Select multiple files (Face swatch, close-up stitches, macro embroidery, backside weave)
                  </p>
                  {isUploading && (
                    <p className="text-[10px] text-[#AD8A53] font-semibold mt-2 animate-pulse">
                      Processing and optimizing high-res textile imagery...
                    </p>
                  )}
                  {uploadError && (
                    <p className="text-[10px] text-red-600 font-semibold mt-1">
                      {uploadError}
                    </p>
                  )}
                </div>

                {/* Uploaded Thumbnails Grid with Primary Cover & Removal */}
                {newImages.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-[10px] text-[#30241F]/70 font-sans italic">
                      The first photo is the <strong className="text-[#AD8A53]">Primary Cover</strong>. Click &apos;Set as Cover&apos; to reorder.
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {newImages.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative group aspect-square border overflow-hidden bg-white shadow-sm transition-all ${
                            idx === 0
                              ? 'border-[#713B43] ring-2 ring-[#713B43]'
                              : 'border-[#AD8A53]/30 hover:border-[#AD8A53]'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Primary Badge */}
                          {idx === 0 ? (
                            <span className="absolute top-1 left-1 bg-[#713B43] text-white text-[8px] font-mono uppercase px-1.5 py-0.5 shadow font-bold flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-white" />
                              Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetCoverImage(idx);
                              }}
                              className="absolute top-1 left-1 bg-[#30241F]/80 hover:bg-[#30241F] text-white text-[8px] uppercase tracking-wider px-1.5 py-0.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Set as Main Cover Photo"
                            >
                              Set Cover
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            className="absolute top-1 right-1 bg-red-700 hover:bg-red-900 text-white p-1 rounded shadow opacity-90 group-hover:opacity-100 transition-opacity"
                            title="Remove this image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AVAILABLE COLORS PICKER */}
              <div className="border border-[#AD8A53]/30 bg-[#FAF8F3] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#AD8A53]" />
                    <label className="block font-semibold text-xs text-[#30241F]">
                      Available Color Swatches *
                    </label>
                  </div>
                  <span className="text-[10px] text-[#C9BBA7]">
                    Click preset to toggle on/off
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COLORS.map((preset) => {
                    const isSelected = selectedColors.some((c) => c.name === preset.name);
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => togglePresetColor(preset)}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10.5px] border transition-all ${
                          isSelected
                            ? 'border-[#AD8A53] bg-[#F4EFE6] ring-1 ring-[#AD8A53] font-semibold text-[#30241F]'
                            : 'border-[#AD8A53]/25 bg-white opacity-60 hover:opacity-100'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span>{preset.name}</span>
                        {isSelected && <span className="text-[#AD8A53] font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#AD8A53]/20">
                  <input
                    type="color"
                    value={customColorHex}
                    onChange={(e) => setCustomColorHex(e.target.value)}
                    className="w-7 h-7 cursor-pointer border border-[#AD8A53]/40 p-0.5 bg-white"
                    title="Pick custom color"
                  />
                  <input
                    type="text"
                    placeholder="Custom shade name (e.g. Royal Rani Pink)"
                    value={customColorName}
                    onChange={(e) => setCustomColorName(e.target.value)}
                    className="flex-grow bg-[#F4EFE6] border border-[#AD8A53]/40 px-2 py-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={addCustomColor}
                    className="px-3 py-1 bg-[#30241F] text-[#FAF8F3] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#252321]"
                  >
                    + Add Shade
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Fabric Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Artisanal description of the embroidery and drape..."
                  className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newReadyStock}
                  onChange={(e) => setNewReadyStock(e.target.checked)}
                  className="accent-[#AD8A53]"
                />
                <span className="font-semibold text-xs">Ready Stock Available in Surat</span>
              </label>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#30241F] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold"
                >
                  Save & Publish to Catalogue
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 border border-[#30241F] text-xs uppercase tracking-widest font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
