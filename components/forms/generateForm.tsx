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

// Define the form schema
const formSchema = z.object({
  prompt: z.string().min(8, 'Description must be at least 8 characters'),
  imageText: z.string().max(15, 'Text must be at most 15 characters').optional(),
  style: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const DesignForm = ({ livestream = null }: { livestream?: LiveStream | null }) => {
  const { selectedDesign } = useDesign();
  const { isAuthenticated } = useAuth();
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTitle, setAuthModalTitle] = useState('Sign in to create designs');
  const [pendingDesignData, setPendingDesignData] = useState<FormValues | null>(null);
  const [remainingDesigns, setRemainingDesigns] = useState<number | null>(null);
  const [isPillLoading, setIsPillLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  });

  const { mutate, myDesigns } = usePaginatedMyDesigns();

  // Update form when selected design changes
  useEffect(() => {
    if (selectedDesign) {
      setValue('prompt', selectedDesign.prompt || '');
      setValue('imageText', selectedDesign.quote_prompt || '');
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

      await createDesign(designData);
      await mutate();

      // Update remaining designs count after successful creation
      if (!isAuthenticated && remainingDesigns !== null) {
        setRemainingDesigns(Math.max(0, remainingDesigns - 1));
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
    // Focus the prompt textarea after reset
    promptRef.current?.focus();
  };

  const handleStyleClick = async (style: string) => {
    try {
      setIsPillLoading(style);
      setErrorMessage(null);

      // Call the generate_prompt API with the style theme and create_design=true
      const response = await serverClient.get(
        `/designs/generate_prompt?theme=${style.toLowerCase()}&create_design=true`
      );

      // Extract the prompt from the response
      let generatedPrompt;
      let isDesignCreating = false;

      if (typeof response.data === 'string') {
        generatedPrompt = response.data;
      } else if (response.data && typeof response.data === 'object') {
        generatedPrompt = response.data.prompt || '';
        isDesignCreating = !!response.data.design_creating;
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format');
      }

      // Update the form with the generated prompt
      setValue('prompt', generatedPrompt);

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
        {/* My Designs Button - Top Right */}
        {/* <div className="flex justify-end mb-2">
          <MyDesignsButton />
        </div> */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {/* Description Field with Overlaid Buttons */}
          <div className="relative">
            <div className="mb-2 ml-2 block text-xs text-base-content/60">
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
                    disabled={isPillLoading !== null || isSubmitDisabled}
                    className="mr-2 inline-flex flex-shrink-0 items-center whitespace-nowrap rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-700 transition-colors hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPillLoading === style && (
                      <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-neutral-700 border-t-transparent" />
                    )}
                    {style}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              {...register('prompt')}
              ref={(e) => {
                register('prompt').ref(e);
                promptRef.current = e;
              }}
              className="textarea min-h-[150px] w-full overflow-y-auto bg-neutral-100 pb-20 text-[16px] font-extralight leading-[1.3]"
              placeholder='A colorful, grafiti-style design that says "I love you"'
            />

            {/* New Generation Button - Bottom Left */}
            <button
              type="button"
              onClick={handleNewGeneration}
              className="absolute bottom-4 left-3 flex transform items-center justify-center rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-md active:scale-95"
              aria-label="New generation"
            >
              <ArrowPathIcon className="h-4 w-4 text-gray-600" />
            </button>

            {/* Generate Button - Bottom Right */}
            <button
              type="submit"
              disabled={
                isSubmitting || isSubmitDisabled || (!isAuthenticated && remainingDesigns === 0)
              }
              className={clsx(
                'absolute bottom-4 right-3 flex transform items-center justify-center rounded-full bg-secondary p-2 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95',
                (isSubmitting ||
                  isSubmitDisabled ||
                  (!isAuthenticated && remainingDesigns === 0)) &&
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
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <SparklesIcon className="h-5 w-5 text-white" />
              )}

              {/* Tooltip for when button is disabled due to no remaining designs */}
              {!isAuthenticated && remainingDesigns === 0 && (
                <div className="absolute -top-10 left-1/2 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                  Sign in to create more designs
                </div>
              )}
            </button>

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
    </>
  );
};

export default DesignForm;
