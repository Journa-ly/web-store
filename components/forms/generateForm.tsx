"use client";

import { PaintBrushIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import NewGenerationButton from "components/buttons/newGenerationButton";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  text: z.string().max(15, "Text must be at most 15 characters").optional(),
  style: z.string().optional(),
});


type FormValues = z.infer<typeof formSchema>;

const DesignForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg p-6">
      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-base-content">Describe your design</label>
        <textarea
          {...register("description")}
          className="textarea textarea-bordered w-full mt-1 bg-neutral-100"
          placeholder="Enter your design description..."
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      {/* Text Field (Optional) */}
      <div>
        <label className="block text-sm font-medium text-base-content">Image Text (Optional)</label>
        <input
          {...register("text")}
          type="text"
          className="input input-bordered w-full mt-1 bg-neutral-100"
          placeholder="Image Text"
        />
      </div>

      {/* Style Dropdown (Optional) */}
      <div>
        <label className="block text-sm font-medium text-base-content ">Style (Optional)</label>
        <select {...register("style")} className="select select-bordered w-full mt-1 bg-neutral-100">
          <option value="">Select a style</option>
          <option value="modern">Modern</option>
          <option value="vintage">Vintage</option>
          <option value="minimalist">Minimalist</option>
        </select>
      </div>
      <div className="flex items-center justify-between gap-4">
        <NewGenerationButton onClick={() => reset()} />
        <button type="submit" className="btn btn-secondary flex items-center gap-2 text-white">
          <PaintBrushIcon width={24} height={24}  />
          Generate
        </button>
      </div>
    </form>
  );
};

export default DesignForm;
