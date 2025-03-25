'use client';

import { formatDistanceToNow, format } from 'date-fns';
import { LiveStream } from '../../requests/livestreams';
import { useLiveStreamDesigns } from '../../requests/livestreams';
import LoadingSpinner from '../ui/LoadingSpinner';
import { TrendingDesign } from '../../types/design';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import DesignCard from '../designs/DesignCard';
import { useState } from 'react';

// Dynamically import DesignStudioContent to prevent SSR issues
const StreamDesignStudio = dynamic(() => import('../designStudio/StreamDesignStudio'), {
  ssr: false,
  loading: () => <div className="flex justify-center py-12"><LoadingSpinner /></div>
});

// Simplified version of DesignGrid for livestream designs
function LivestreamDesignGrid({ designs }: { designs: TrendingDesign[] }) {
  if (!designs || designs.length === 0) {
    return <div className="text-center py-8 text-base-content/70">No designs to display</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
      {designs.map((design) => (
        <div key={design.uuid} className="aspect-square">
          <DesignCard design={design} />
        </div>
      ))}
    </div>
  );
}

interface LiveStreamCardProps {
  livestream: LiveStream;
  isActive?: boolean;
}

export default function LiveStreamCard({ livestream, isActive = false }: LiveStreamCardProps) {
  // State for accordion expansion
  const [isExpanded, setIsExpanded] = useState(false);
  // Only fetch designs when active or when expanded for previous streams
  const shouldFetchDesigns = isActive || (isExpanded && !isActive);
  const { designs, isLoading, mutate } = useLiveStreamDesigns(shouldFetchDesigns ? livestream.uuid : '');

  // Format dates for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not available';
    
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getBadgeColor = () => {
    if (isActive) return 'badge-error';
    
    switch (livestream.status) {
      case 'ACTIVE':
        return 'badge-error';
      case 'ENDED':
        return 'badge-ghost';
      case 'UPCOMING':
        return 'badge-info';
      default:
        return 'badge-warning';
    }
  };

  // Calculate time until the stream starts if it's upcoming
  const calculateStartsIn = (): string | null => {
    if (isActive || !livestream.active_at) return null;
    
    const streamDate = new Date(livestream.active_at);
    const now = new Date();
    
    if (streamDate > now) {
      const diffMs = streamDate.getTime() - now.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
      } else {
        const hours = Math.floor(diffMins / 60);
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
      }
    }
    
    return null;
  };

  const startsIn = calculateStartsIn();

  const toggleExpand = () => {
    if (!isActive) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <div 
        className={clsx(
          "card overflow-hidden border border-base-300", 
          isActive ? "bg-gradient-to-br from-base-200 to-base-100 shadow-lg mb-12" : "bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-300",
        )}
      >
        {/* Card top section */}
        <div 
          className={clsx(
            "card-body", 
            !isActive && "cursor-pointer",
            !isActive && !isExpanded ? "py-4 px-6 flex justify-start items-center" : "p-6"
          )}
          onClick={toggleExpand}
        >
          <div className={clsx(
            "w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3", 
            // Remove bottom margin when not expanded to avoid uneven spacing
            !(isActive || isExpanded) ? "mb-0" : "mb-3"
          )}>
            <div className="flex items-center gap-3">
              {isActive ? (
                <div className="flex items-center">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                  </span>
                  <span className="text-error font-medium">Live</span>
                </div>
              ) : (
                <span className={clsx(
                  "badge",
                  "badge-secondary opacity-80"
                )}>
                  {livestream.status}
                </span>
              )}
              <time className="text-sm text-base-content/70 font-medium">
                {formatDate(livestream.active_at || '')}
              </time>
            </div>
            
            <div className="flex items-center gap-2">
              {!isActive && (
                <div className="text-base-content/70">
                  <span className="text-sm mr-2">{livestream.designs_count} designs</span>
                  {isExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card content section */}
        <div className="card-content p-0">
          {isLoading && !isActive ? (
            <div className="flex justify-center py-12 bg-base-100/50">
              <LoadingSpinner />
            </div>
          ) : isActive ? (
            // For active streams, render both DesignStudioContent and the designs grid
            <div className="space-y-12">
              {/* Design Studio Section */}
              <div>
                <div className="bg-base-100 p-6 shadow-sm">
                  <StreamDesignStudio livestream={livestream} />
                </div>
              </div>
              
              {/* Elegant divider */}
              <div className="flex items-center justify-center gap-4">
                <div className="h-px bg-base-300 flex-1 max-w-xs"></div>
                <div className="text-xl font-semibold text-base-content/80">Stream Designs</div>
                <div className="h-px bg-base-300 flex-1 max-w-xs"></div>
              </div>
              
              {/* Designs Grid */}
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : designs.length > 0 ? (
                <div className="px-2 md:px-4 pb-6">
                  <LivestreamDesignGrid designs={designs} />
                </div>
              ) : (
                <div className="py-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-300/50 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-base-content/70 italic">No designs available for this livestream yet</p>
                </div>
              )}
            </div>
          ) : isExpanded ? (
            // For non-active streams, show loading state or designs when expanded
            <div className="p-4 sm:p-6 bg-base-100 border-t border-base-300">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : designs && designs.length > 0 ? (
                <div>
                  <LivestreamDesignGrid designs={designs} />
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-300/50 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-base-content/70">No designs available for this livestream</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 