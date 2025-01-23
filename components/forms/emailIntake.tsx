"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "clients/api"; // <-- Import our shared Axios client
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { EmailSignupSchema, EmailSignupType } from "validations/emailSignupSchema";

const EmailIntake: React.FC = () => {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<EmailSignupType>({
    resolver: zodResolver(EmailSignupSchema),
  });

  const onSubmit = async (data: EmailSignupType) => {
    setServerError("");
    try {
      await apiClient.post("/shopify-create-customer", { email: data.email });
      reset();
    } catch (error: any) {
      const message =
        error?.response?.data?.error || 
        error.message || 
        "An unexpected error occurred.";
      setServerError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full max-w-sm space-y-3"
    >
      <label className="text-sm font-medium" htmlFor="email">
        Sign up for our newsletter
      </label>

      {/* Container for the input + icon */}
      <div className="relative">
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          className=" text-base-content input input-bordered w-full pr-10" 
          disabled={isSubmitting}
          {...register("email")}
        />

        {/* The icon button positioned at the right, centered vertically */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            absolute
            right-2
            top-1/2
            -translate-y-1/2
            text-gray-500
            hover:text-gray-700
            active:scale-95
            transition-transform
          "
          style={{ background: "none" }} // Ensures no background
        >
          {isSubmitting ? (
            /* Spinner icon while submitting */
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            /* Send (paper airplane) icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 4.5l16.5 7.5-16.5 7.5 3-7.5-3-7.5z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Validation error */}
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}

      {/* Success / Error messages */}
      {isSubmitSuccessful && !serverError && (
        <p className="text-green-500 text-sm">Thank you for subscribing!</p>
      )}
      {serverError && (
        <p className="text-red-500 text-sm">Error: {serverError}</p>
      )}
    </form>
  );
};

export default EmailIntake;