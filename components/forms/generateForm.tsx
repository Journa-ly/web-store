'use client';

import { SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createDesign, usePaginatedMyDesigns } from 'requests/designs';
import { z } from 'zod';
import { CreateDesignRequest } from 'types/design';
import { useDesign } from 'components/designs/design-context';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useAuth } from 'requests/users';
import AuthModal from 'components/modals/AuthModal';
import { LiveStream } from '@/requests/livestreams';
import { serverClient } from '@/clients/server';
import MyDesignsButton from '../buttons/MyDesignsButton';
import ImageGridIcon from 'icons/ImageGrid';
import MyDesignsModal from 'components/modals/MyDesignsModal';

// Define the form schema
const formSchema = z.object({
  prompt: z.string().min(8, 'Description must be at least 8 characters'),
  imageText: z.string().max(15, 'Text must be at most 15 characters').optional(),
  style: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const DesignForm = ({ livestream = null }: { livestream?: LiveStream | null }) => {
  const { selectedDesign, setSelectedDesign, setPreviewImage } = useDesign();
  const { isAuthenticated } = useAuth();
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const textareaContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTitle, setAuthModalTitle] = useState('Sign in to create designs');
  const [pendingDesignData, setPendingDesignData] = useState<FormValues | null>(null);
  const [remainingDesigns, setRemainingDesigns] = useState<number | null>(null);
  const [isPillLoading, setIsPillLoading] = useState<string | null>(null);
  const [showMyDesignsModal, setShowMyDesignsModal] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange' // Enable validation on change
  });

  // Watch prompt field value for real-time validation
  const promptValue = watch('prompt');
  
  // Check if form is valid (prompt has enough characters)
  useEffect(() => {
    if (promptValue && promptValue.length >= 8 && !isSubmitting && !isSubmitDisabled && !isAnimating) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [promptValue, isSubmitting, isSubmitDisabled, isAnimating]);

  const { mutate, myDesigns } = usePaginatedMyDesigns();

  // Function to adjust textarea height
  const adjustTextareaHeight = () => {
    if (promptRef.current) {
      // Reset height to get the right scrollHeight
      promptRef.current.style.height = 'auto';
      
      // Calculate required height with bottom padding for buttons
      const buttonAreaHeight = 8;
      
      // Set new height based on scroll height
      const newHeight = Math.max(100, promptRef.current.scrollHeight + buttonAreaHeight);
      promptRef.current.style.height = `${newHeight}px`;
    }
  };

  // Clean DOM-based animation on component unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  // Handle DOM-based typing animation without React state updates
  const animateTyping = (fullText: string) => {
    if (!promptRef.current) return;
    
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Mark as animating
    setIsAnimating(true);
    
    // Set initial empty value directly on the DOM element
    promptRef.current.value = '';
    
    // Store for form state
    setGeneratedPrompt(fullText);
    
    let currentIndex = 0;
    
    // Animation function using requestAnimationFrame
    const step = () => {
      if (!promptRef.current) return;
      
      // Type 3 characters per frame for speed
      for (let i = 0; i < 1 && currentIndex < fullText.length; i++) {
        currentIndex++;
        // Update value directly on DOM element
        promptRef.current.value = fullText.substring(0, currentIndex);
      }
      
      // Adjust height on each update
      adjustTextareaHeight();
      
      // Continue animation if not complete
      if (currentIndex < fullText.length) {
        animationRef.current = requestAnimationFrame(step);
      } else {
        // Animation complete - update React's form state once at the end
        setValue('prompt', fullText);
        setIsAnimating(false);
        promptRef.current.focus();
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(step);
  };

  // Adjust height when content changes
  useEffect(() => {
    const textarea = promptRef.current;
    if (!textarea) return;

    // Initial adjustment
    adjustTextareaHeight();

    // Add event listener for input events
    const handleInput = () => adjustTextareaHeight();
    textarea.addEventListener('input', handleInput);

    return () => {
      textarea.removeEventListener('input', handleInput);
    };
  }, []);

  // Readjust when selected design changes
  useEffect(() => {
    if (selectedDesign) {
      setValue('prompt', selectedDesign.prompt || '');
      setValue('imageText', selectedDesign.quote_prompt || '');
      
      // Ensure height adjustment after value change
      setTimeout(adjustTextareaHeight, 0);
    }
  }, [selectedDesign, setValue]);

  // Check remaining designs for anonymous users
  useEffect(() => {
    if (!isAuthenticated && myDesigns) {
      // Use the same limit as the backend (ANON_MAX_DESIGNS = 3)
      const maxDesigns = 3;
      const designCount = myDesigns.length;
      setRemainingDesigns(Math.max(0, maxDesigns - designCount));
    } else {
      setRemainingDesigns(null);
    }
  }, [isAuthenticated, myDesigns]);

  const onSubmit = async (data: FormValues) => {
    if (isSubmitDisabled) return;

    // Allow anonymous users to generate designs directly
    // (up to their limit) without forcing sign in first
    await submitDesign(data);
  };

  const submitDesign = async (data: FormValues) => {
    setIsSubmitDisabled(true);
    setErrorMessage(null);

    try {
      const designData: CreateDesignRequest = {
        prompt: data.prompt,
        quote_prompt: data.imageText || undefined,
        livestream_uuid: livestream?.uuid || undefined
      };

      // Create the design
      const createdDesign = await createDesign(designData);
      
      // Refresh the designs list
      await mutate();
      
      // Update remaining designs count after successful creation
      if (!isAuthenticated && remainingDesigns !== null) {
        setRemainingDesigns(Math.max(0, remainingDesigns - 1));
      }
      
      // Use the directly returned design from the createDesign function
      if (createdDesign) {
        // The API might return a single design or the full list
        const newDesign = Array.isArray(createdDesign) ? createdDesign[0] : createdDesign;
        
        if (newDesign) {
          setSelectedDesign(newDesign);
          
          // If the design has a preview image, set it
          if (newDesign.product_image?.image) {
            setPreviewImage(newDesign.product_image.image);
          }
        }
      }
      
    } catch (error: any) {
      console.error('Error creating design:', error);

      // Check if this is a 403 error indicating the user hit their design limit
      if (error?.response?.status === 403 && !isAuthenticated) {
        // Show auth modal with a special message about limit reached
        setAuthModalTitle('Design limit reached');
        setPendingDesignData(data);
        setShowAuthModal(true);
        return;
      }

      // Handle rate limit exceeded (429) error
      if (error?.response?.status === 429) {
        setErrorMessage(
          error.response.data.detail ||
            "You've reached the rate limit for design creation. Please wait a few minutes before trying again."
        );
        return;
      }

      // Handle other types of errors
      if (error?.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (typeof error === 'string') {
        setErrorMessage(error);
      } else {
        setErrorMessage(
          'An unexpected error occurred while creating your design. Please try again.'
        );
      }
    } finally {
      setTimeout(() => {
        setIsSubmitDisabled(false);
      }, 3000);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingDesignData) {
      submitDesign(pendingDesignData);
      setPendingDesignData(null);
    }
  };

  const handleNewGeneration = () => {
    reset({
      prompt: '',
      imageText: '',
      style: ''
    });
    
    // Ensure the textarea height is reset
    setTimeout(() => {
      if (promptRef.current) {
        // Reset to auto first
        promptRef.current.style.height = 'auto';
        // Then adjust to proper minimum height
        adjustTextareaHeight();
        // Focus the prompt textarea after reset
        promptRef.current.focus();
      }
    }, 0);
  };

  // Handle style click with animation
  const handleStyleClick = async (style: string) => {
    try {
      setIsPillLoading(style);
      setErrorMessage(null);

      // Call the generate_prompt API with the style theme and create_design=true
      const response = await serverClient.get(
        `/designs/generate_prompt?theme=${style.toLowerCase()}&create_design=true`
      );

      // Extract the prompt from the response
      let promptText;
      let isDesignCreating = false;

      if (typeof response.data === 'string') {
        promptText = response.data;
      } else if (response.data && typeof response.data === 'object') {
        promptText = response.data.prompt || '';
        isDesignCreating = !!response.data.design_creating;
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format');
      }

      // Animate the typing effect using DOM-based approach
      animateTyping(promptText);
      
    } catch (error: any) {
      console.error('Error generating prompt:', error);

      // Special handling for design limit errors
      if (error?.response?.status === 403 && !isAuthenticated) {
        setAuthModalTitle('Design limit reached');
        setShowAuthModal(true);
      } else {
        setErrorMessage('Failed to generate prompt. Please try again.');
      }
    } finally {
      setIsPillLoading(null);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {/* Description Field with Overlaid Buttons */}
          <div className="relative" ref={textareaContainerRef}>
            <div className="mb-2 text-lg font-semibold text-secondary/60">
              Make me something...
              <div
                className="scrollbar-hide flex flex-nowrap overflow-x-auto py-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {['Funny', 'Artsy', 'Nostalgic', 'Chaotic', 'Trendy', 'Random', 'Mother\'s Day', 'Bachelorette Party', 'Birthday', 'Graduation', 'Father\'s Day', 'Anniversary', 'Valentine\'s Day', 'Easter', 'Mothers Day', 'Fathers Day', 'Halloween', 'Thanksgiving', 'Christmas', 'New Year', 'Memorial Day', 'Labor Day', 'Independence Day', 'Cinco de Mayo', 'St. Patrick\'s Day'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleStyleClick(style)}
                    disabled={isPillLoading !== null || isSubmitDisabled || isAnimating}
                    className="mr-2 inline-flex flex-shrink-0 items-center whitespace-nowrap rounded-full bg-neutral-200 px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPillLoading === style && (
                      <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-neutral-700 border-t-transparent" />
                    )}
                    {style}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Unified textarea */}
            <textarea
              {...register('prompt')}
              ref={(e) => {
                register('prompt').ref(e);
                promptRef.current = e;
              }}
              className="textarea w-full bg-neutral-100 text-[16px] font-extralight leading-[1.3] resize-none overflow-hidden"
              placeholder='A colorful, grafiti-style design that says "I love you"'
              style={{ 
                minHeight: '100px',
                paddingBottom: '68px'
              }}
              onChange={() => adjustTextareaHeight()}
            />

            {/* Button Controls - Bottom Left */}
            <div className="absolute bottom-4 left-3 z-10 flex items-center space-x-3">
              <button
                type="button"
                onClick={handleNewGeneration}
                disabled={isAnimating}
                className="flex transform items-center justify-center rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="New generation"
              >
                <ArrowPathIcon className="h-5 w-5 text-gray-600" />
              </button>
              
              {/* Custom My Designs Button with same styling as New Generation button */}
              <button
                type="button"
                onClick={() => setShowMyDesignsModal(true)}
                className="flex transform items-center justify-center rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-md active:scale-95"
                aria-label="My Designs"
              >
                <div className="h-5 w-5 flex items-center justify-center">
                  <ImageGridIcon />
                </div>
              </button>
            </div>

            {/* Generate Button - Bottom Right */}
            <div className="absolute bottom-4 right-3 z-10">
              <button
                type="submit"
                disabled={
                  isSubmitting || isSubmitDisabled || (!isAuthenticated && remainingDesigns === 0) || isAnimating
                }
                className={clsx(
                  'flex transform items-center justify-center rounded-full bg-secondary p-3 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95',
                  isFormValid && 'pulse-animation shadow-xl ring-2 ring-secondary/30',
                  (isSubmitting ||
                    isSubmitDisabled ||
                    (!isAuthenticated && remainingDesigns === 0) ||
                    isAnimating) &&
                    'cursor-not-allowed opacity-50'
                )}
                onClick={() => {
                  // If it's disabled due to no remaining designs, show auth modal instead
                  if (!isAuthenticated && remainingDesigns === 0) {
                    setAuthModalTitle('Design limit reached');
                    setShowAuthModal(true);
                    return false; // Prevent form submission
                  }
                }}
                aria-label={isSubmitting ? 'Generating design...' : 'Generate design'}
              >
                {isSubmitting ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <SparklesIcon className="h-6 w-6 text-white" />
                )}

                {/* Tooltip for when button is disabled due to no remaining designs */}
                {!isAuthenticated && remainingDesigns === 0 && (
                  <div className="absolute -top-10 left-1/2 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                    Sign in to create more designs
                  </div>
                )}
              </button>
            </div>

            {errors.prompt && <p className="mt-1 text-sm text-red-500">{errors.prompt.message}</p>}
          </div>

          {/* Remaining designs for anonymous users */}
          {!isAuthenticated && remainingDesigns !== null && (
            <div
              className={clsx(
                'rounded-md p-3',
                remainingDesigns > 0 ? 'bg-blue-50' : 'bg-amber-50'
              )}
            >
              <div className="flex">
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  {remainingDesigns > 0 ? (
                    <p className="text-sm text-blue-700">
                      You have {remainingDesigns} design{remainingDesigns !== 1 ? 's' : ''}{' '}
                      remaining.
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setAuthModalTitle('Sign in for unlimited designs');
                          setShowAuthModal(true);
                        }}
                        className="ml-2 font-medium underline"
                      >
                        Sign in for unlimited designs.
                      </a>
                    </p>
                  ) : (
                    <p className="text-sm text-amber-700">
                      You've used all your guest designs.
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setAuthModalTitle('Sign in for unlimited designs');
                          setShowAuthModal(true);
                        }}
                        className="ml-2 font-medium underline"
                      >
                        Sign in to continue designing.
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errorMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingDesignData(null);
        }}
        onSuccess={handleAuthSuccess}
        title={authModalTitle}
        description={
          authModalTitle === 'Design limit reached'
            ? "You've reached the maximum number of designs for anonymous users. Sign in or create an account to continue designing."
            : undefined
        }
      />
      
      {/* My Designs Modal */}
      <MyDesignsModal
        open={showMyDesignsModal}
        onClose={() => setShowMyDesignsModal(false)}
        onSelectDesign={(design) => {
          setSelectedDesign(design);
          if (design.product_image?.image) {
            setPreviewImage(design.product_image?.image);
          }
          setShowMyDesignsModal(false);
        }}
      />
    </>
  );
};

export default DesignForm;
