import { useState, useRef, useEffect, DragEvent } from 'react';
import { Camera, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { ScannedItem } from '../types';

interface ImageCaptureProps {
  onNewScan: (item: ScannedItem) => void;
}

export default function ImageCapture({ onNewScan }: ImageCaptureProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMsg("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setErrorMsg(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && !errorMsg) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreviewImage(dataUrl);
        setAnalysisResult(null);
        stopCamera();
      }
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
       setErrorMsg("Please upload an image file.");
       return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewImage(event.target.result as string);
        setAnalysisResult(null);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const analyzeImage = async () => {
    if (!previewImage) return;
    setIsAnalyzing(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64: previewImage }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image');
      }
      
      const solutionText = data.solution || '';
      const titleText = data.title || 'Scanned Material';
      const subjectText = data.subject || 'Other';
      
      setAnalysisResult(solutionText);

      // Auto-log to History
      const newScanItem: ScannedItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        title: titleText,
        subject: subjectText,
        solution: solutionText,
        imageBase64: previewImage,
      };
      
      onNewScan(newScanItem);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm col-span-1 md:col-span-2 lg:col-span-3 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Scan & Solve</h2>
      </div>

      {errorMsg && !isCameraOpen && !previewImage && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${
          isDragging 
            ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-950/40' 
            : 'border-yellow-200 dark:border-slate-700 hover:border-yellow-400 dark:hover:border-yellow-500 bg-yellow-50/50 dark:bg-slate-800/40'
        }`}
      >
        <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-4 border border-yellow-100 dark:border-slate-700">
          <ImageIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        <p className="text-gray-800 dark:text-slate-100 font-semibold mb-1">Upload a problem to solve</p>
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">Drag and drop, or choose an option below</p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium shadow-sm cursor-pointer"
          >
            <Upload className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span>Upload Image</span>
          </button>
          <button
            onClick={startCamera}
            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-900 dark:bg-indigo-600 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-indigo-500 transition-colors font-medium shadow-sm cursor-pointer"
          >
            <Camera className="w-5 h-5 text-yellow-400" />
            <span>Scan with Camera</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl overflow-hidden max-w-lg w-full border border-gray-800 shadow-2xl">
            <div className="p-4 flex justify-between items-center border-b border-gray-800 bg-gray-900">
              <h3 className="text-lg font-semibold text-white">Camera Scanner</h3>
              <button onClick={stopCamera} className="p-1.5 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="relative bg-black aspect-[4/3] flex items-center justify-center overflow-hidden">
              {errorMsg ? (
                 <div className="text-red-400 p-6 text-center">
                   <p>{errorMsg}</p>
                 </div>
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            <div className="p-6 bg-gray-900 flex justify-center border-t border-gray-800">
              <button 
                onClick={capturePhoto}
                disabled={!!errorMsg}
                className="w-16 h-16 bg-white rounded-full border-4 border-gray-400 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                aria-label="Take photo"
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Preview & Analysis Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh]">
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {analysisResult ? 'Solution & Insights' : 'Review Image'}
              </h3>
              <button 
                onClick={() => {
                  setPreviewImage(null);
                  setAnalysisResult(null);
                }} 
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-500 dark:text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className={`p-4 bg-gray-50 dark:bg-slate-950 flex-1 overflow-auto flex ${analysisResult ? 'flex-col md:flex-row gap-6' : 'flex-col justify-center items-center'} min-h-[300px]`}>
              <div className={`flex flex-col items-center ${analysisResult ? 'md:w-1/3' : 'w-full'}`}>
                <img 
                  src={previewImage} 
                  alt="Captured content" 
                  className="max-h-[50vh] max-w-full object-contain rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
                
                {errorMsg && !analysisResult && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg text-sm font-medium w-full text-center">
                    {errorMsg}
                  </div>
                )}
              </div>
              
              {analysisResult && (
                <div className="md:w-2/3 bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-y-auto">
                  <div className="prose prose-blue dark:prose-invert max-w-none prose-sm sm:prose-base markdown-body text-slate-800 dark:text-slate-200">
                    <Markdown>{analysisResult}</Markdown>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end space-x-3 mt-auto">
              {!analysisResult && (
                <>
                  <button 
                    onClick={() => setPreviewImage(null)}
                    className="px-5 py-2.5 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium cursor-pointer"
                    disabled={isAnalyzing}
                  >
                    Discard
                  </button>
                  <button 
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="flex items-center justify-center min-w-[140px] px-5 py-2.5 bg-blue-600 dark:bg-indigo-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-indigo-500 transition-colors font-medium shadow-sm disabled:opacity-70 cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Solve Problem'
                    )}
                  </button>
                </>
              )}
              {analysisResult && (
                <button 
                  onClick={() => {
                    setPreviewImage(null);
                    setAnalysisResult(null);
                  }}
                  className="px-5 py-2.5 bg-blue-600 dark:bg-indigo-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-indigo-500 transition-colors font-medium shadow-sm cursor-pointer"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
