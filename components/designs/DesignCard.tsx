import { Design } from 'types/design';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, FireIcon, FaceSmileIcon, PlusIcon } from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  FireIcon as FireIconSolid,
  FaceSmileIcon as FaceSmileIconSolid
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { toggleInteraction } from 'requests/designs';
import { useState, useCallback, useEffect, useRef } from 'react';
import { ClipLoader } from 'react-spinners';
import { useAuth } from 'requests/users';
import { isMobile } from 'react-device-detect';
import dynamic from 'next/dynamic';

// Dynamically import AuthModal to avoid SSR issues
const AuthModal = dynamic(() => import('components/modals/AuthModal'), {
  ssr: false
});

interface DesignCardProps {
  design: Design;
}

type ReactionCounts = {
  heart_count: number;
  laugh_count: number;
  fire_count: number;
};

const reactionToCountKey: Record<string, keyof ReactionCounts> = {
  HEART: 'heart_count',
  LAUGH: 'laugh_count',
  FIRE: 'fire_count'
};

export default function DesignCard({ design }: DesignCardProps) {
  const [reactions, setReactions] = useState<string[]>(design.user_reactions || []);
  const [counts, setCounts] = useState<ReactionCounts>({
    heart_count: design.heart_count || 0,
    laugh_count: design.laugh_count || 0,
    fire_count: design.fire_count || 0
  });
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [showOverlay, setShowOverlay] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingReaction, setPendingReaction] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [authModalTitle, setAuthModalTitle] = useState<string>('');

  // Create share URL once when component mounts
  const returnUrl = '/designs/studio';
  const shareUrl = `/share?design=${design.uuid}&return=${encodeURIComponent(returnUrl)}`;

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showOverlay && isMobile) {
        const target = event.target as HTMLElement;
        const isOverlayContent = target.closest('.overlay-content');
        const isReactionBar = target.closest('.reaction-bar');

        // Close if click is not on overlay content or reaction bar
        if (!isOverlayContent && !isReactionBar) {
          setShowOverlay(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showOverlay]);

  const handleReaction = async (reactionType: string) => {
    if (!user) {
      setPendingReaction(reactionType);
      setAuthModalTitle('Sign in to interact with designs');
      setShowAuthModal(true);
      return;
    }

    await processReaction(reactionType);
  };

  const processReaction = async (reactionType: string) => {
    const countKey = reactionToCountKey[reactionType];
    const isAdding = !reactions.includes(reactionType);

    // Optimistically update UI
    setReactions((prev) =>
      isAdding ? [...prev, reactionType] : prev.filter((r) => r !== reactionType)
    );
    if (countKey) {
      setCounts((prev) => ({
        ...prev,
        [countKey]: prev[countKey] + (isAdding ? 1 : -1)
      }));
    }

    setIsLoading((prev) => ({ ...prev, [reactionType]: true }));

    try {
      await toggleInteraction(design.uuid, reactionType);
    } catch (error) {
      console.error('Failed to toggle reaction:', error);
      // Revert optimistic updates on failure
      setReactions((prev) =>
        isAdding ? prev.filter((r) => r !== reactionType) : [...prev, reactionType]
      );
      if (countKey) {
        setCounts((prev) => ({
          ...prev,
          [countKey]: prev[countKey] + (isAdding ? -1 : 1)
        }));
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, [reactionType]: false }));
    }
  };

  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    if (pendingReaction) {
      await processReaction(pendingReaction);
      setPendingReaction(null);
    }
  };

  const toggleOverlay = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    setShowOverlay((prev) => !prev);
  }, []);

  const handleAddToMyDesigns = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setAuthModalTitle('Sign in to add designs to your collection');
      setShowAuthModal(true);
      return;
    }
    // ... rest of add to designs logic ...
  };

  return (
    <>
      <div
        className="design-card group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg"
        onClick={toggleOverlay}
        role="button"
        tabIndex={0}
      >
        {/* Info Overlay - Appears on Hover/Tap */}
        <div
          ref={overlayRef}
          className={clsx(
            'absolute inset-0 z-10 bg-black/60 p-4 transition-all duration-300',
            isMobile
              ? {
                  'pointer-events-auto opacity-100': showOverlay,
                  'pointer-events-none opacity-0': !showOverlay
                }
              : 'opacity-0 group-hover:opacity-100'
          )}
        >
          <div className="overlay-content flex h-full flex-col">
            {/* Top Section with Add Button */}
            <div className="mb-4">
              <Link
                href={shareUrl}
                className="inline-flex items-center rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-black backdrop-blur-sm transition-colors hover:bg-white active:bg-white"
                onClick={handleAddToMyDesigns}
              >
                <PlusIcon className="mr-2 h-5 w-5" />
                Add to My Designs
              </Link>
            </div>

            {/* Middle Section with Prompts */}
            <div className="scrollbar-hide flex-grow space-y-3 overflow-y-auto pb-16">
              {design.prompt && (
                <div>
                  <h3 className="font-medium text-white/90">Prompt</h3>
                  <p className="text-sm text-white/75">{design.prompt}</p>
                </div>
              )}
              {design.quote_prompt && (
                <div>
                  <h3 className="font-medium text-white/90">Quote</h3>
                  <p className="text-sm text-white/75">{design.quote_prompt}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="block aspect-square overflow-hidden">
          <Image
            src={design.product_image?.image || ''}
            alt={design.name || 'Design'}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Always visible reactions bar */}
        <div className="reaction-bar absolute bottom-0 left-0 right-0 z-20 flex items-center justify-start space-x-6 bg-black/40 p-3 backdrop-blur-sm transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleReaction('HEART');
            }}
            disabled={isLoading['HEART']}
            className={clsx(
              'flex items-center space-x-1 transition-colors hover:scale-110 active:scale-110',
              reactions.includes('HEART') ? 'text-red-500' : 'text-white'
            )}
          >
            {reactions.includes('HEART') ? (
              <HeartIconSolid className="h-6 w-6 drop-shadow-lg" />
            ) : (
              <HeartIcon className="h-6 w-6 drop-shadow-lg" />
            )}
            <span className="drop-shadow-lg">{counts.heart_count}</span>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleReaction('LAUGH');
            }}
            disabled={isLoading['LAUGH']}
            className={clsx(
              'flex items-center space-x-1 transition-colors hover:scale-110 active:scale-110',
              reactions.includes('LAUGH') ? 'text-yellow-500' : 'text-white'
            )}
          >
            {reactions.includes('LAUGH') ? (
              <FaceSmileIconSolid className="h-6 w-6 drop-shadow-lg" />
            ) : (
              <FaceSmileIcon className="h-6 w-6 drop-shadow-lg" />
            )}
            <span className="drop-shadow-lg">{counts.laugh_count}</span>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleReaction('FIRE');
            }}
            disabled={isLoading['FIRE']}
            className={clsx(
              'flex items-center space-x-1 transition-colors hover:scale-110 active:scale-110',
              reactions.includes('FIRE') ? 'text-orange-500' : 'text-white'
            )}
          >
            {reactions.includes('FIRE') ? (
              <FireIconSolid className="h-6 w-6 drop-shadow-lg" />
            ) : (
              <FireIcon className="h-6 w-6 drop-shadow-lg" />
            )}
            <span className="drop-shadow-lg">{counts.fire_count}</span>
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingReaction(null);
          setAuthModalTitle('');
        }}
        onSuccess={handleAuthSuccess}
        title={authModalTitle}
      />
    </>
  );
}
