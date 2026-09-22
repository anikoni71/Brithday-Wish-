import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Images, 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  Clock, 
  Maximize2, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  X,
  Camera
} from 'lucide-react';
import { parseCSV } from '../services/sheetService';

export interface MemoryItem {
  id: string;
  photoUrl: string;
  rawPhotoUrl: string;
  note: string;
  rowNumber: number;
  dateAdded?: string;
}

// Google Drive URL to direct streamable image URL converter
export const formatDriveUrl = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return trimmed;
};

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTODUAg2mUYQUTN3P9SPB5Q41Ta_9SufI2gct0GBYDUbPSJX81O1mWHgBjElAIfNfobEbd7Mkii18lt/pub?output=csv';

// Seed memories displayed if sheet columns are initially awaiting entries
const SEED_MEMORIES: MemoryItem[] = [
  {
    id: 'seed-1',
    photoUrl: 'https://lh3.googleusercontent.com/d/1WooamzxkuanrAM-7wrp4hm3ogll6vbsI',
    rawPhotoUrl: 'https://drive.google.com/file/d/1WooamzxkuanrAM-7wrp4hm3ogll6vbsI/view',
    note: 'Danushka Boss Birthday Celebration & Leadership Milestone 🎂',
    rowNumber: 4,
    dateAdded: '6th May'
  },
  {
    id: 'seed-2',
    photoUrl: 'https://lh3.googleusercontent.com/d/1TGztacSMzBPNu1tTX6wo_jEp3t_6VYDN',
    rawPhotoUrl: 'https://drive.google.com/file/d/1TGztacSMzBPNu1tTX6wo_jEp3t_6VYDN/view',
    note: 'Zahid Ripon Birthday Joy & IE Central Team Gathering 🎉',
    rowNumber: 5,
    dateAdded: '21st Feb'
  },
  {
    id: 'seed-3',
    photoUrl: 'https://lh3.googleusercontent.com/d/12oCALoY649CD3fGa5hrE19k2yhmJK3xk',
    rawPhotoUrl: 'https://drive.google.com/file/d/12oCALoY649CD3fGa5hrE19k2yhmJK3xk/view',
    note: 'Khalid Hossain Celebration Moment with Central IE Peers 🌟',
    rowNumber: 6,
    dateAdded: '17th Apr'
  },
  {
    id: 'seed-4',
    photoUrl: 'https://lh3.googleusercontent.com/d/1x9pY5gY04zYfJTCWwScGl7c-qWHaqjhA',
    rawPhotoUrl: 'https://drive.google.com/file/d/1x9pY5gY04zYfJTCWwScGl7c-qWHaqjhA/view',
    note: 'Anik Barua Birthday Festivities & Project Kickoff Celebration 🚀',
    rowNumber: 7,
    dateAdded: '21st Feb'
  },
  {
    id: 'seed-5',
    photoUrl: 'https://lh3.googleusercontent.com/d/11Nao3LxNhjdv69fJQwQnkrP2g379pWO5',
    rawPhotoUrl: 'https://drive.google.com/file/d/11Nao3LxNhjdv69fJQwQnkrP2g379pWO5/view',
    note: 'Abdulla Al Mahmud Special Day Celebration with Team Sweets 🍰',
    rowNumber: 8,
    dateAdded: '31st May'
  },
  {
    id: 'seed-6',
    photoUrl: 'https://lh3.googleusercontent.com/d/1sZ1hMuK8i_--jTugcthyeFwglSLowYVW',
    rawPhotoUrl: 'https://drive.google.com/file/d/1sZ1hMuK8i_--jTugcthyeFwglSLowYVW/view',
    note: 'Rohan Sir Birthday Honor & Executive Mentorship Moment 👔',
    rowNumber: 9,
    dateAdded: '17th Feb'
  },
  {
    id: 'seed-7',
    photoUrl: 'https://lh3.googleusercontent.com/d/14CtdR96ZaRAuDy2pvX3ukytrxxK3KuOu',
    rawPhotoUrl: 'https://drive.google.com/file/d/14CtdR96ZaRAuDy2pvX3ukytrxxK3KuOu/view',
    note: 'Ranjith Sir Annual Celebration & IE Central Strategy Gala 🏆',
    rowNumber: 10,
    dateAdded: '21st Dec'
  },
  {
    id: 'seed-8',
    photoUrl: 'https://lh3.googleusercontent.com/d/1xYvwup9TtefhCmz04Vut2Or5_qn9keXP',
    rawPhotoUrl: 'https://drive.google.com/file/d/1xYvwup9TtefhCmz04Vut2Or5_qn9keXP/view',
    note: 'Farjana Faria Birthday Surprise & IE Ladies Team Smiles 🌸',
    rowNumber: 11,
    dateAdded: '13th Jul'
  },
  {
    id: 'seed-9',
    photoUrl: 'https://lh3.googleusercontent.com/d/1hrF6n4832pfTzLWQKcWkt6ZExfIOxkBz',
    rawPhotoUrl: 'https://drive.google.com/file/d/1hrF6n4832pfTzLWQKcWkt6ZExfIOxkBz/view',
    note: 'Bishnu Dhar Birthday Warmth & Engineering Unit Celebration ✨',
    rowNumber: 12,
    dateAdded: '13th Sep'
  },
  {
    id: 'seed-10',
    photoUrl: 'https://lh3.googleusercontent.com/d/1geVYxxK_CIr5GoL43pt2QdkQ5FFH-iB1',
    rawPhotoUrl: 'https://drive.google.com/file/d/1geVYxxK_CIr5GoL43pt2QdkQ5FFH-iB1/view',
    note: 'Sudipta Barua Leap Year Special Day Celebration 🎊',
    rowNumber: 13,
    dateAdded: '29th Feb'
  }
];

export const MemoryGallery: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isLiveFromSheet, setIsLiveFromSheet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('');
  const [syncCount, setSyncCount] = useState<number>(0);
  const [activeModalMemory, setActiveModalMemory] = useState<MemoryItem | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const isMountedRef = useRef<boolean>(true);

  // Extract memory items from parsed CSV rows
  const extractMemoriesFromRows = (rows: string[][]): MemoryItem[] => {
    if (!rows || rows.length < 3) return [];

    // Detect Header Row:
    // Header is on Row 3 (index 2), but search top 5 rows dynamically for safety
    let headerRowIdx = 2; // Default row 3
    let photoColIdx = 16; // Default Column Q (0-indexed 16)
    let noteColIdx = 17;  // Default Column R (0-indexed 17)

    for (let r = 0; r < Math.min(rows.length, 6); r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        const val = row[c].toLowerCase().trim();
        if (val.includes('memory photo') || (val.includes('photo') && val.includes('url') && c >= 10)) {
          photoColIdx = c;
          headerRowIdx = r;
        }
        if (val.includes('memory note') || (val.includes('memory') && val.includes('note'))) {
          noteColIdx = c;
          headerRowIdx = r;
        }
      }
    }

    const items: MemoryItem[] = [];
    const startRow = headerRowIdx + 1;

    for (let r = startRow; r < rows.length; r++) {
      const row = rows[r];
      const rawPhotoUrl = (row[photoColIdx] || '').trim();
      const rawNote = (row[noteColIdx] || '').trim();

      // Only include if there is a photo URL or a note
      if (rawPhotoUrl || rawNote) {
        const formattedUrl = formatDriveUrl(rawPhotoUrl);
        items.push({
          id: `mem-row-${r + 1}-${Date.now()}-${items.length}`,
          photoUrl: formattedUrl,
          rawPhotoUrl,
          note: rawNote || `Central IE Team Memory Celebration (Row ${r + 1})`,
          rowNumber: r + 1
        });
      }
    }

    return items;
  };

  // Primary Data Fetch Function with Cache-Busting
  const fetchGalleryData = useCallback(async (isManualTrigger = false) => {
    if (isManualTrigger) {
      setIsRefreshing(true);
    }

    try {
      // Append cache-busting timestamp parameter to force fresh data from Google Sheet
      const cacheBustUrl = `${GOOGLE_SHEET_CSV_URL}&_cache=${Date.now()}`;
      
      const response = await fetch(cacheBustUrl, {
        headers: {
          Accept: 'text/csv, application/json, text/plain, */*'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to retrieve sheet`);
      }

      const csvText = await response.text();
      
      // Guard against HTML redirection / sign-in response
      if (csvText.trim().startsWith('<!DOCTYPE html') || csvText.includes('Sign in to your Google Account')) {
        throw new Error('Received HTML response instead of CSV');
      }

      const rows = parseCSV(csvText);
      const parsedItems = extractMemoriesFromRows(rows);

      if (isMountedRef.current) {
        if (parsedItems.length > 0) {
          setMemories(parsedItems);
          setIsLiveFromSheet(true);
        } else {
          // If sheet currently has headers but rows 4+ are awaiting user entries, show seed memories
          setMemories((prev) => (prev.length > 0 && isLiveFromSheet ? prev : SEED_MEMORIES));
          setIsLiveFromSheet(false);
        }
        setLastSyncedTime(new Date().toLocaleTimeString());
        setSyncCount((prev) => prev + 1);
        setFetchError(null);
      }
    } catch (err: any) {
      console.warn('Memory gallery sheet fetch notice:', err?.message || err);
      if (isMountedRef.current) {
        // Fall back to seed memories if no memories have loaded yet
        setMemories((prev) => (prev.length > 0 ? prev : SEED_MEMORIES));
        setFetchError(err?.message || 'Connecting to live sheet...');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [isLiveFromSheet]);

  // Set up auto-polling interval (every 12 seconds) with proper cleanup
  useEffect(() => {
    isMountedRef.current = true;
    
    // Initial fetch
    fetchGalleryData(false);

    // Real-time polling loop every 12 seconds
    const intervalId = setInterval(() => {
      fetchGalleryData(false);
    }, 12000);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [fetchGalleryData]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header & Real-Time Sync Status Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                <Images className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Memory Gallery
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    Real-Time Sync
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Live photo memories and celebratory moments synchronized directly from Google Sheet Central IE List
                </p>
              </div>
            </div>
          </div>

          {/* Sync status & Refresh Button */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Last polled: <strong className="font-semibold text-slate-800">{lastSyncedTime || 'Connecting...'}</strong></span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500">Every 12s</span>
            </div>

            <button
              onClick={() => fetchGalleryData(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-60 cursor-pointer shadow-xs"
              title="Force fetch latest photos from Google Sheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>

        {/* Source mapping metadata badge */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 font-medium text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Data Source: Central IE List (Row 3 Headers)
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span>Column Q: <strong>Memory Photo URL</strong></span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span>Column R: <strong>Memory Note</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {isLiveFromSheet ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {memories.length} Live Items Synced
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                Awaiting Column Q/R Rows in Sheet • Showing {memories.length} Showcase Memories
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time Auto-Updating Grid Layout (Strict Reference Specifications):
          - Desktop: 5 columns (grid-cols-5)
          - Tablet: 3 columns (md:grid-cols-3)
          - Mobile: 2 columns (grid-cols-2)
          - Stacked: image on top, text directly below
          - Portrait aspect ratio in subtle light-gray container
          - Center-aligned text with tight, pale yellow background highlight
      */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center animate-pulse">
              <div className="w-full aspect-[3/4] bg-gray-100 rounded-xl mb-3 border border-slate-200" />
              <div className="w-3/4 h-4 bg-yellow-100 rounded mb-1" />
            </div>
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3">
            <Camera className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Memory Photos Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Add Google Drive photo links to Column Q and celebration notes to Column R on row 4+ of the "Central IE List" Google Sheet tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {memories.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => setActiveModalMemory(item)}
            >
              {/* Image Container:
                  - Portrait aspect ratio (taller than wide: aspect-[3/4])
                  - Subtle light-gray background (bg-gray-100)
                  - Image centered, object-cover or object-contain to prevent distortion
                  - Clean border and rounded container
              */}
              <div className="w-full aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden border border-slate-200/80 shadow-xs relative flex items-center justify-center group-hover:shadow-md transition duration-200">
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.note || 'Memory Photo'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback icon if image fails to load
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.classList.add('bg-gray-50');
                      }
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                    <Images className="w-8 h-8 mb-1.5 opacity-60" />
                    <span className="text-[10px] font-medium">No Image URL</span>
                  </div>
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur-xs">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>

                {/* Optional row badge */}
                {item.rowNumber && (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-slate-900/70 text-white backdrop-blur-xs">
                    #{item.rowNumber}
                  </span>
                )}
              </div>

              {/* Text Beneath Image:
                  - Center-aligned (text-center)
                  - Primary text styled with tight, pale yellow background highlight (bg-yellow-200)
              */}
              <div className="mt-2.5 text-center w-full px-1">
                <span className="bg-yellow-200 text-yellow-950 px-1.5 py-0.5 inline-block text-xs sm:text-sm font-medium leading-tight rounded-xs shadow-2xs">
                  {item.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Modal for Full-Size Photo Inspection */}
      {activeModalMemory && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setActiveModalMemory(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Images className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Memory Preview</h4>
                  <p className="text-[11px] text-slate-500">Sheet Row #{activeModalMemory.rowNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalMemory(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="bg-gray-100 max-h-[70vh] flex items-center justify-center p-2 overflow-hidden">
              <img
                src={activeModalMemory.photoUrl}
                alt={activeModalMemory.note}
                className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Modal Footer with Highlighted Note */}
            <div className="p-4 text-center bg-white border-t border-slate-100">
              <div className="inline-block">
                <span className="bg-yellow-200 text-yellow-950 px-2.5 py-1 inline-block text-sm sm:text-base font-semibold rounded-xs shadow-2xs">
                  {activeModalMemory.note}
                </span>
              </div>
              {activeModalMemory.rawPhotoUrl && (
                <div className="mt-3 flex items-center justify-center gap-3">
                  <a
                    href={activeModalMemory.rawPhotoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Original Drive Image
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGallery;
