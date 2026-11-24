'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Upload,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info,
  SlidersHorizontal,
  Key,
} from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import { useSiteImageResolver } from '@/context/SiteContentContext';
import { FabricItem } from '@/types';
import WhatsAppIcon from '@/components/WhatsAppIcon';

function AITryOnContent() {
  const { fabrics, generateWhatsAppUrl } = useEnquiry();
  const siteImage = useSiteImageResolver();
  const searchParams = useSearchParams();
  const initialFabricId = searchParams.get('fabric');

  const [selectedFabric, setSelectedFabric] = useState<FabricItem>(
    fabrics.find((f) => f.id === initialFabricId) || fabrics[0]
  );
  const [outfitStyle, setOutfitStyle] = useState<'sherwani' | 'kurta' | 'jodhpuri' | 'indo-western'>('sherwani');
  const [previewMode, setPreviewMode] = useState<'complete' | 'fabric-only'>('complete');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPresetModel, setSelectedPresetModel] = useState<string>('preset-groom');
  const [consentGiven, setConsentGiven] = useState<boolean>(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedPreviewUrl, setGeneratedPreviewUrl] = useState<string | null>(null);
  const [generationMeta, setGenerationMeta] = useState<{ provider?: string; isLive?: boolean; message?: string }>({});

  // Before / After slider state
  const [compareSplit, setCompareSplit] = useState<number>(50);
  const [showCompare, setShowCompare] = useState<boolean>(false);

  // Backend API status state
  const [apiStatus, setApiStatus] = useState<{ configured: boolean; provider: string } | null>(null);

  useEffect(() => {
    fetch('/api/ai-tryon')
      .then((res) => res.json())
      .then((data) => {
        setApiStatus({ configured: data.configured, provider: data.provider });
      })
      .catch(() => {
        setApiStatus({ configured: false, provider: 'Google Gemini' });
      });
  }, []);

  const presetModels = [
    {
      id: 'preset-groom',
      name: 'Royal Heritage Groom',
      image: siteImage('tryon.preset-groom'),
    },
    {
      id: 'preset-evening',
      name: 'Regal Jodhpuri Model',
      image: siteImage('tryon.preset-evening'),
    },
    {
      id: 'preset-modern',
      name: 'Modern Indo-Western Model',
      image: siteImage('tryon.preset-modern'),
    },
    {
      id: 'preset-festive',
      name: 'Festive Kurta Model',
      image: siteImage('tryon.preset-festive'),
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please upload a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setSelectedPresetModel('custom-upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const activeSourceImage =
    selectedPresetModel === 'custom-upload' && uploadedImage
      ? uploadedImage
      : presetModels.find((p) => p.id === selectedPresetModel)?.image || presetModels[0].image;

  // Real backend generation trigger
  const triggerGeneration = async () => {
    if (!consentGiven) {
      alert('Please accept the AI upload and visualization terms before proceeding.');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStep('Analyzing model pose & garment boundaries...');

    const stepTimer1 = setTimeout(() => {
      setGenerationProgress(45);
      setGenerationStep(`Conditioning ${selectedFabric.code} texture & Surat embroidery weave...`);
    }, 800);

    const stepTimer2 = setTimeout(() => {
      setGenerationProgress(75);
      setGenerationStep('Applying daylight illumination & realistic silk fold shadows...');
    }, 1800);

    try {
      const response = await fetch('/api/ai-tryon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Only the fabric ID is sent; the server looks up the fabric itself.
        // The uploaded photo never leaves the browser.
        body: JSON.stringify({
          outfitStyle,
          previewMode,
          fabricId: selectedFabric.id,
        }),
      });

      const data = await response.json().catch(() => ({}));

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok) {
        setIsGenerating(false);
        setGenerationProgress(0);
        alert(data.error || 'Could not generate a preview right now. Please try again later.');
        return;
      }

      setGenerationProgress(100);
      setGenerationStep('Finalizing royal drape render...');

      setTimeout(() => {
        setIsGenerating(false);
        if (data.imageUrl) {
          setGeneratedPreviewUrl(data.imageUrl);
          setGenerationMeta({
            provider: data.provider,
            isLive: data.isLive,
            message: data.message,
          });
        }
      }, 500);
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsGenerating(false);
      // Fallback
      setGeneratedPreviewUrl(selectedFabric.styledModelImage || selectedFabric.mainImage);
    }
  };

  const directWhatsAppLink = generateWhatsAppUrl({
    productCode: selectedFabric.code,
    productName: selectedFabric.name,
    customNote: `Generated via AI Try-On Preview Studio for ${outfitStyle.toUpperCase()} silhouette. Please share pricing and sampling availability.`,
    sourcePage: 'AI Virtual Try-On Studio',
  });

  return (
    <div className="bg-[#FAF8F3] min-h-screen text-[#30241F] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#AD8A53]/25 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Visualization Studio</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#30241F]">
            AI Virtual Try-On Preview
          </h1>
          <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans mt-2 max-w-2xl leading-relaxed">
            Experience our men&apos;s ethnic embroidered fabrics in realistic three-dimensional silhouette previews. Powered by Google Gemini &amp; Imagen 3 deep tailoring synthesis.
          </p>
        </div>

        {/* Live Backend Key Status Badge */}
        <div className="shrink-0">
          {apiStatus?.configured ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[13px] font-sans rounded shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google Gemini &amp; Imagen 3: <strong>Live AI Connected</strong></span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 text-[13px] font-sans rounded shadow-sm">
              <Key className="w-3.5 h-3.5 text-amber-700" />
              <span>Backend Ready • Add <strong>GEMINI_API_KEY</strong> in <code>.env.local</code></span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Interactive Configuration */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step 1: Model Silhouette */}
          <div className="bg-[#FAF8F3] border border-[#AD8A53]/30 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-[#AD8A53]/20 pb-2">
              <span className="text-[12px] uppercase tracking-widest text-[#AD8A53] font-semibold">
                Step 1: Model Silhouette
              </span>
              <span className="text-[12px] text-[#7A6A58] font-mono">Input Frame</span>
            </div>

            <label className="block text-xs font-medium text-[#30241F] mb-2">
              Select Preset Male Model or Upload Photo:
            </label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {presetModels.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPresetModel(preset.id);
                    setGeneratedPreviewUrl(null);
                  }}
                  className={`flex flex-col items-center p-1 border transition-all ${
                    selectedPresetModel === preset.id
                      ? 'border-[#713B43] bg-[#F4EFE6] ring-1 ring-[#713B43]'
                      : 'border-[#AD8A53]/20 hover:border-[#AD8A53]'
                  }`}
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-1">
                    <img src={preset.image} alt={preset.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-sans text-center text-[#30241F] line-clamp-1">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t border-[#AD8A53]/15 pt-3">
              <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-dashed border-[#AD8A53]/60 bg-[#F4EFE6]/60 hover:bg-[#F4EFE6] cursor-pointer text-xs font-sans text-[#30241F] transition-colors">
                <Upload className="w-4 h-4 text-[#AD8A53]" />
                <span>Upload Custom Client Photo (Max 5MB)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {uploadedImage && (
                <p className="text-[12px] text-emerald-700 mt-1 font-sans flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Custom client image loaded.
                </p>
              )}
            </div>
          </div>

          {/* Step 2: Garment Configuration */}
          <div className="bg-[#FAF8F3] border border-[#AD8A53]/30 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-[#AD8A53]/20 pb-2">
              <span className="text-[12px] uppercase tracking-widest text-[#AD8A53] font-semibold">
                Step 2: Garment Configuration
              </span>
              <span className="text-[12px] text-[#7A6A58] font-mono">Silhouette</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#30241F] mb-1.5">
                  Select Royal Silhouette:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sherwani', label: 'Ceremonial Sherwani' },
                    { id: 'jodhpuri', label: 'Jodhpuri Bandhgala' },
                    { id: 'kurta', label: 'Festive Kurta' },
                    { id: 'indo-western', label: 'Indo-Western Coat' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setOutfitStyle(style.id as any)}
                      className={`py-2 px-3 text-xs font-sans text-left transition-all border ${
                        outfitStyle === style.id
                          ? 'bg-[#30241F] text-[#FAF8F3] border-[#30241F] font-semibold'
                          : 'bg-[#F4EFE6] text-[#30241F] border-[#AD8A53]/30 hover:border-[#AD8A53]'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#30241F] mb-1.5">
                  Visualization Focus:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPreviewMode('complete')}
                    className={`py-1.5 px-3 text-xs font-sans border transition-all ${
                      previewMode === 'complete'
                        ? 'border-[#713B43] bg-[#713B43] text-white font-medium'
                        : 'border-[#AD8A53]/30 bg-[#FAF8F3]'
                    }`}
                  >
                    Complete Tailored Outfit
                  </button>
                  <button
                    onClick={() => setPreviewMode('fabric-only')}
                    className={`py-1.5 px-3 text-xs font-sans border transition-all ${
                      previewMode === 'fabric-only'
                        ? 'border-[#713B43] bg-[#713B43] text-white font-medium'
                        : 'border-[#AD8A53]/30 bg-[#FAF8F3]'
                    }`}
                  >
                    Fabric Panel Drape
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Select Fabric */}
          <div className="bg-[#FAF8F3] border border-[#AD8A53]/30 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-[#AD8A53]/20 pb-2">
              <span className="text-[12px] uppercase tracking-widest text-[#AD8A53] font-semibold">
                Step 3: Select Catalogue Fabric
              </span>
              <span className="font-mono text-xs text-[#AD8A53] font-semibold">
                {selectedFabric.code}
              </span>
            </div>

            <p className="text-xs text-[#30241F] font-medium mb-2">
              {selectedFabric.name} ({selectedFabric.embroideryTypeLabel})
            </p>

            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-[#F4EFE6] border border-[#AD8A53]/20">
              {fabrics.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFabric(f);
                    setGeneratedPreviewUrl(null);
                  }}
                  className={`flex flex-col items-center p-1 border transition-all ${
                    selectedFabric.id === f.id
                      ? 'border-[#AD8A53] bg-white ring-2 ring-[#AD8A53]'
                      : 'border-transparent hover:border-[#AD8A53]/40'
                  }`}
                >
                  <div className="aspect-square w-full overflow-hidden bg-gray-200">
                    <img src={f.mainImage} alt={f.code} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-mono mt-0.5 text-[#30241F] font-semibold">
                    {f.code}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="p-3 bg-[#F4EFE6] border border-[#AD8A53]/20 text-xs font-sans space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="accent-[#AD8A53] mt-0.5"
              />
              <span className="text-[13px] text-[#30241F]/80 leading-tight">
                I understand AI previews are conceptual visual aids and do not replace physical swatch approval. Any photo I upload stays in my browser and is not sent to Khodal Fashion’s servers.
              </span>
            </label>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={triggerGeneration}
            disabled={isGenerating}
            className={`w-full py-4 text-xs uppercase tracking-widest font-sans font-semibold transition-all shadow-md flex items-center justify-center gap-2 ${
              isGenerating
                ? 'bg-[#C9BBA7] text-[#FAF8F3] cursor-not-allowed'
                : 'bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3]'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Preview ({generationProgress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Realistic Preview</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Visual Preview Canvas */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative aspect-[3/4] max-h-[560px] bg-[#252321] border border-[#AD8A53]/40 overflow-hidden shadow-2xl flex items-center justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-2 border-[#AD8A53]/30 rounded-full" />
                  <div className="absolute inset-0 border-2 border-[#AD8A53] rounded-full border-t-transparent animate-spin" />
                  <Sparkles className="w-8 h-8 text-[#AD8A53] absolute inset-0 m-auto animate-pulse" />
                </div>
                <div>
                  <h3 className="font-editorial text-2xl text-[#FAF8F3]">
                    Synthesizing Royal Drape
                  </h3>
                  <p className="text-xs text-[#7A6A58] font-mono mt-1">{generationStep}</p>
                </div>
                <div className="w-48 h-1.5 bg-[#30241F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#AD8A53] transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </div>
            ) : generatedPreviewUrl ? (
              <div className="relative w-full h-full">
                {/* Compare Mode Toggle Bar */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#252321]/90 backdrop-blur-md px-2.5 py-1 border border-[#AD8A53]/40">
                  <button
                    onClick={() => setShowCompare(!showCompare)}
                    className="text-[12px] uppercase tracking-wider text-[#FAF8F3] hover:text-[#AD8A53] flex items-center gap-1 font-sans"
                  >
                    <SlidersHorizontal className="w-3 h-3 text-[#AD8A53]" />
                    <span>{showCompare ? 'Exit Compare' : 'Before / After'}</span>
                  </button>
                </div>

                {showCompare ? (
                  /* Interactive Before/After Split Comparison */
                  <div className="relative w-full h-full select-none overflow-hidden">
                    {/* After Image (AI Render) */}
                    <img
                      src={generatedPreviewUrl}
                      alt="AI Render"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Before Image (Original Source) clipped by compareSplit % */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${compareSplit}%` }}
                    >
                      <img
                        src={activeSourceImage}
                        alt="Original Silhouette"
                        className="absolute inset-0 w-full h-full object-cover max-w-none"
                        style={{ width: '100%', height: '100%' }}
                      />
                      <span className="absolute bottom-16 left-4 bg-black/70 text-white text-[11px] uppercase px-2 py-0.5 tracking-wider font-mono">
                        Original Model
                      </span>
                    </div>

                    <span className="absolute bottom-16 right-4 bg-[#713B43]/80 text-white text-[11px] uppercase px-2 py-0.5 tracking-wider font-mono">
                      AI Drape Preview
                    </span>

                    {/* Divider Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[#AD8A53] shadow-lg cursor-ew-resize"
                      style={{ left: `${compareSplit}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#FAF8F3] border-2 border-[#AD8A53] flex items-center justify-center shadow-md">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#30241F]" />
                      </div>
                    </div>

                    {/* Range input overlay for smooth touch/drag */}
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={compareSplit}
                      onChange={(e) => setCompareSplit(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                      aria-label="Drag to compare before and after"
                    />
                  </div>
                ) : (
                  /* Full Screen Output Render */
                  <img
                    src={generatedPreviewUrl}
                    alt="AI Try-On Final Render"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Overlay Metadata */}
                <div className="absolute top-4 left-4 bg-[#252321]/90 backdrop-blur-sm text-[#FAF8F3] p-2.5 border border-[#AD8A53]/40 max-w-xs text-xs z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-mono text-[12px] text-[#AD8A53] font-semibold uppercase">
                      {generationMeta.provider || 'AI RENDER COMPLETE'}
                    </span>
                  </div>
                  <p className="font-serif text-[17px] text-[#FAF8F3] mt-0.5">{selectedFabric.name}</p>
                  <p className="text-[12px] text-[#7A6A58]">
                    Mapped on {outfitStyle.toUpperCase()} • Tone-on-tone illumination
                  </p>
                </div>

                {/* Bottom Action Drawer */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#252321]/85 backdrop-blur-sm p-3 border border-[#AD8A53]/30 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
                  <span className="text-[#7A6A58] text-[13px] font-sans">
                    Illustrative render for commercial visualization only.
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={generatedPreviewUrl}
                      download={`khodal-${selectedFabric.code}-ai-preview.jpg`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#F4EFE6] text-[#30241F] text-[12px] uppercase tracking-wider font-semibold flex items-center gap-1 shadow"
                    >
                      <Download className="w-3 h-3" />
                      Save Image
                    </a>
                    <a
                      href={directWhatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] text-[12px] uppercase tracking-wider font-semibold flex items-center gap-1 shadow"
                    >
                      <WhatsAppIcon className="w-3 h-3" />
                      Enquire on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={activeSourceImage}
                  alt="Model Source Standby"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-[#252321]/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-[#FAF8F3] p-4 border border-[#AD8A53] max-w-sm shadow-xl">
                    <Sparkles className="w-8 h-8 text-[#AD8A53] mx-auto mb-2" />
                    <h3 className="font-editorial text-xl text-[#30241F]">Ready to Preview</h3>
                    <p className="text-xs text-[#30241F]/80 font-sans mt-1 mb-4">
                      Target Fabric:{' '}
                      <strong className="text-[#713B43]">{selectedFabric.code}</strong> on{' '}
                      <strong>{outfitStyle.toUpperCase()}</strong>.
                    </p>
                    <button
                      onClick={triggerGeneration}
                      className="w-full py-2 bg-[#30241F] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold"
                    >
                      Generate AI Preview Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#F4EFE6] border border-[#AD8A53]/20 flex items-start gap-3 text-xs text-[#30241F]/80 font-sans">
            <Info className="w-4 h-4 text-[#AD8A53] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>B2B Notice:</strong> AI virtual try-on is an illustrative design tool developed to assist menswear retailers and designers with silhouette communication. Physical fabric drape, exact weight (GSM), and thread luster should always be verified using physical swatch cuttings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AITryOnPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-serif text-lg text-[#AD8A53]">
          Initializing AI Virtual Try-On Studio...
        </div>
      }
    >
      <AITryOnContent />
    </Suspense>
  );
}
