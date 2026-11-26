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
  Info,
  SlidersHorizontal,
} from 'lucide-react';

// Shrinks an uploaded photo in the browser so it uploads fast and stays under the server limit.
function resizePhoto(file: File, maxSide = 1280): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('canvas'));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('load'));
    };
    img.src = url;
  });
}

const PROGRESS_STEPS = [
  'Reading the model photo…',
  'Studying the fabric’s embroidery and colours…',
  'Tailoring the garment from the fabric…',
  'Adding drape, folds and lighting…',
  'Almost there…',
];
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Before / After slider state
  const [compareSplit, setCompareSplit] = useState<number>(50);
  const [showCompare, setShowCompare] = useState<boolean>(false);

  // Whether the try-on service is switched on (server has an API key)
  const [available, setAvailable] = useState<boolean | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    fetch('/api/ai-tryon')
      .then((res) => res.json())
      .then((data) => {
        setAvailable(Boolean(data.available) && !data.limitReached);
        setLimitReached(Boolean(data.limitReached));
      })
      .catch(() => setAvailable(false));
  }, []);

  // Progress messages while the image is being made (real generation takes ~10–30 s).
  useEffect(() => {
    if (!isGenerating) return;
    const started = Date.now();
    const t = setInterval(() => {
      const s = (Date.now() - started) / 1000;
      setGenerationProgress(Math.min(92, Math.round(100 * (1 - Math.exp(-s / 8)))));
      setGenerationStep(PROGRESS_STEPS[Math.min(PROGRESS_STEPS.length - 1, Math.floor(s / 3))]);
    }, 400);
    return () => clearInterval(t);
  }, [isGenerating]);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErrorMessage(null);
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('That photo is too large. Please choose one under 15 MB.');
      return;
    }
    try {
      setUploadedImage(await resizePhoto(file));
      setSelectedPresetModel('custom-upload');
      setGeneratedPreviewUrl(null);
    } catch {
      setErrorMessage('We could not read that photo. Please try a JPG, PNG or WebP image.');
    }
  };

  const activeSourceImage =
    selectedPresetModel === 'custom-upload' && uploadedImage
      ? uploadedImage
      : presetModels.find((p) => p.id === selectedPresetModel)?.image || presetModels[0].image;

  // Real backend generation trigger
  const triggerGeneration = async () => {
    if (!consentGiven) {
      setErrorMessage('Please tick the box above to accept the AI preview terms first.');
      return;
    }

    setErrorMessage(null);
    setShowCompare(false);
    setGenerationProgress(3);
    setGenerationStep(PROGRESS_STEPS[0]);
    setIsGenerating(true);

    const usingUpload = selectedPresetModel === 'custom-upload' && uploadedImage;

    try {
      // The server looks up the fabric photo and preset model photo itself;
      // only an uploaded client photo is sent from the browser.
      const response = await fetch('/api/ai-tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outfitStyle,
          previewMode,
          fabricId: selectedFabric.id,
          ...(usingUpload ? { uploadedImage } : { presetId: selectedPresetModel }),
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.imageUrl) {
        setErrorMessage(data.error || 'The preview could not be generated right now. Please try again.');
        return;
      }
      setGenerationProgress(100);
      setGeneratedPreviewUrl(data.imageUrl);
    } catch {
      setErrorMessage('Connection problem — please check your internet and try again.');
    } finally {
      setIsGenerating(false);
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
            Pick a model or upload a photo, choose a garment and one of our fabrics — the AI tailors that exact fabric onto the person so you can see the embroidery as it would be worn.
          </p>
        </div>

        {available === false && (
          <div className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 text-[13px] font-sans rounded shadow-sm">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>
              {limitReached
                ? 'Today’s AI previews are used up — back tomorrow morning. Contact us on WhatsApp for styled previews.'
                : 'Try-On is temporarily unavailable — contact us on WhatsApp for styled previews.'}
            </span>
          </div>
        )}
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
                <span>Upload Client Photo (clear, full-length, one person)</span>
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
                I understand AI previews are conceptual visual aids and do not replace physical swatch approval. I have the right to use any photo I upload; it is sent to an open-source AI model run by Cloudflare only to create this preview and is not stored by Khodal Fashion.
              </span>
            </label>
          </div>

          {errorMessage && (
            <p role="alert" className="flex items-start gap-2 text-xs text-[#713B43] bg-rose-50 border border-[#713B43]/30 px-3 py-2 font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
              <span>{errorMessage}</span>
            </p>
          )}

          {/* Primary Action Button */}
          <button
            onClick={triggerGeneration}
            disabled={isGenerating || available === false}
            className={`w-full py-4 text-xs uppercase tracking-widest font-sans font-semibold transition-all shadow-md flex items-center justify-center gap-2 ${
              isGenerating || available === false
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
                    Tailoring {selectedFabric.code}
                  </h3>
                  <p className="text-xs text-[#C9BBA7] font-sans mt-1">{generationStep}</p>
                  <p className="text-[12px] text-[#7A6A58] font-sans mt-1">Usually takes 5–20 seconds</p>
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
                      AI Try-On Preview
                    </span>
                  </div>
                  <p className="font-serif text-[17px] text-[#FAF8F3] mt-0.5">{selectedFabric.name}</p>
                  <p className="text-[12px] text-[#C9BBA7]">
                    {selectedFabric.code} • {previewMode === 'fabric-only' ? 'Fabric drape' : outfitStyle.replace('-', ' ')}
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
                      download={`khodal-${selectedFabric.code}-ai-preview`}
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
                      disabled={available === false}
                      className="w-full py-2 bg-[#30241F] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold disabled:opacity-50"
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
