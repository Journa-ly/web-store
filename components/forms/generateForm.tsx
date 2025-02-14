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

// Define the form schema
const formSchema = z.object({
  prompt: z.string().min(8, 'Description must be at least 8 characters'),
  imageText: z.string().max(15, 'Text must be at most 15 characters').optional(),
  style: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const DesignForm = () => {
  const { selectedDesign } = useDesign();
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
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

    setIsSubmitDisabled(true);
    try {
      const designData: CreateDesignRequest = {
        prompt: data.prompt,
        quote_prompt: data.imageText || undefined
      };

      const createdDesigns = await createDesign(designData);

      // Trigger a revalidation of the my designs data
      await mutate();
    } catch (error) {
      console.error('Error creating design:', error);
      // Optionally, display an error message to the user
    } finally {
      // Enable the submit button after 3 seconds
      setTimeout(() => {
        setIsSubmitDisabled(false);
      }, 3000);
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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4 p-6">
      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-base-content">Describe your design</label>
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
        <label className="block text-sm font-medium text-base-content">Image Text (Optional)</label>
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
  );
};

export default DesignForm;
