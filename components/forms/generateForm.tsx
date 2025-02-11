'use client';

import { PaintBrushIcon } from '@heroicons/react/24/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import NewGenerationButton from 'components/buttons/newGenerationButton';
import { useForm } from 'react-hook-form';
import { createDesign, usePaginatedMyDesigns } from 'requests/designs';
import { z } from 'zod';
import { CreateDesignRequest } from 'types/design';
import MyDesignsButton from 'components/buttons/MyDesignsButton';

// Define the form schema
const formSchema = z.object({
  prompt: z.string().min(8, 'Description must be at least 8 characters'),
  imageText: z.string().max(15, 'Text must be at most 15 characters').optional(),
  style: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const DesignForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  });

  const { mutate } = usePaginatedMyDesigns();

  const onSubmit = async (data: FormValues) => {
    try {
      const designData: CreateDesignRequest = {
        prompt: data.prompt,
        quote_prompt: data.imageText || undefined
      };

      const createdDesigns = await createDesign(designData);

      // Trigger a revalidation of the my designs data
      await mutate();

      // Reset the form on success
      reset();
    } catch (error) {
      console.error('Error creating design:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4 p-6">
      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-base-content">Describe your design</label>
        <textarea
          {...register('prompt')}
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
        <div className="flex items-center gap-2">
          <NewGenerationButton onClick={() => reset()} />
          <MyDesignsButton />
        </div>

        <button type="submit" className="btn btn-secondary flex items-center gap-2 text-white">
          <PaintBrushIcon width={24} height={24} />
          Generate
        </button>
      </div>
    </form>
  );
};

export default DesignForm;
