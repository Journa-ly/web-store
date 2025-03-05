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

// Define the form schema
const formSchema = z.object({
  prompt: z.string().min(8, 'Description must be at least 8 characters'),
  imageText: z.string().max(15, 'Text must be at most 15 characters').optional(),
  style: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const DesignForm = () => {
  const { selectedDesign } = useDesign();
  const { isAuthenticated } = useAuth();
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingDesignData, setPendingDesignData] = useState<FormValues | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  });

  const { mutate } = usePaginatedMyDesigns();

  // Update form when selected design changes
  useEffect(() => {
    if (selectedDesign) {
      setValue('prompt', selectedDesign.prompt || '');
      setValue('imageText', selectedDesign.quote_prompt || '');
    }
  }, [selectedDesign, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (isSubmitDisabled) return;

    // Check authentication before proceeding
    if (!isAuthenticated) {
      setPendingDesignData(data);
      setShowAuthModal(true);
      return;
    }

    await submitDesign(data);
  };

  const submitDesign = async (data: FormValues) => {
    setIsSubmitDisabled(true);
    setErrorMessage(null);

    try {
      const designData: CreateDesignRequest = {
        prompt: data.prompt,
        quote_prompt: data.imageText || undefined
      };

      const createdDesigns = await createDesign(designData);
      await mutate();
    } catch (error) {
      console.error('Error creating design:', error);
      if (error instanceof Error) {
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
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4 py-6">
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
            disabled={isSubmitting || isSubmitDisabled}
            className={clsx(
              'btn btn-secondary flex items-center gap-2 text-white',
              (isSubmitting || isSubmitDisabled) && 'cursor-not-allowed opacity-50'
            )}
          >
            <PaintBrushIcon width={24} height={24} />
            {isSubmitting ? 'Generating...' : 'Generate'}
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
        title="Sign in to create designs"
      />
    </>
  );
};

export default DesignForm;
