'use client';

import { PaintBrushIcon } from '@heroicons/react/24/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import NewGenerationButton from 'components/buttons/newGenerationButton';
import { useForm } from 'react-hook-form';
import { createDesign, usePaginatedMyDesigns } from 'requests/designs';
import { z } from 'zod';
import { CreateDesignRequest } from 'types/design';
import MyDesignsButton from 'components/buttons/MyDesignsButton';
import ShareButton from 'components/buttons/ShareButton';
import { useDesign } from 'components/designs/design-context';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useAuth } from 'requests/users';
import AuthModal from 'components/modals/AuthModal';
import { LiveStream } from '@/requests/livestreams';

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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4 py-4">
        {/* Description Field */}
        <div>
          <textarea
            {...register('prompt')}
            ref={(e) => {
              register('prompt').ref(e);
              promptRef.current = e;
            }}
            className="textarea mt-1 w-full bg-neutral-100"
            placeholder="Enter your design description..."
          />
          {errors.prompt && <p className="text-sm text-red-500">{errors.prompt.message}</p>}
        </div>

        {/* Text Field (Optional) */}
        <div>
          <label className="block text-sm font-medium text-base-content">
            Image Text (Optional)
          </label>
          <input
            {...register('imageText')}
            type="text"
            className="input mt-1 w-full bg-neutral-100"
            placeholder="Image Text"
          />
          {errors.imageText && <p className="text-sm text-red-500">{errors.imageText.message}</p>}
        </div>

        {/* Remaining designs for anonymous users */}
        {!isAuthenticated && remainingDesigns !== null && (
          <div
            className={clsx('rounded-md p-3', remainingDesigns > 0 ? 'bg-blue-50' : 'bg-amber-50')}
          >
            <div className="flex">
              <div className="ml-3 flex-1 md:flex md:justify-between">
                {remainingDesigns > 0 ? (
                  <p className="text-sm text-blue-700">
                    You have {remainingDesigns} design{remainingDesigns !== 1 ? 's' : ''} remaining.
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

        {/* Style Field (Optional) */}
        {/* Uncomment or adjust the style field as needed */}
        {/* <div>
          <label className="block text-sm font-medium text-base-content">
            Style (Optional)
          </label>
          <select {...register("style")} className="select select-bordered w-full mt-1 bg-neutral-100">
            <option value="">Select a style</option>
            <option value="modern">Modern</option>
            <option value="vintage">Vintage</option>
            <option value="minimalist">Minimalist</option>
          </select>
        </div> */}

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

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <NewGenerationButton onClick={handleNewGeneration} />
            <MyDesignsButton />
            <ShareButton />
          </div>

          <button
            type="submit"
            disabled={
              isSubmitting || isSubmitDisabled || (!isAuthenticated && remainingDesigns === 0)
            }
            className={clsx(
              'group btn btn-secondary relative flex items-center gap-2 text-white',
              (isSubmitting || isSubmitDisabled || (!isAuthenticated && remainingDesigns === 0)) &&
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
          >
            <PaintBrushIcon width={24} height={24} />
            {isSubmitting ? 'Generating...' : 'Generate'}

            {/* Tooltip for when button is disabled due to no remaining designs */}
            {!isAuthenticated && remainingDesigns === 0 && (
              <div className="absolute -top-10 left-1/2 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                Sign in to create more designs
              </div>
            )}
          </button>
        </div>
      </form>

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
