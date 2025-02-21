'use client';

import { XCircleIcon } from '@heroicons/react/24/outline';

function Error({ reset, error }: { reset: () => void; error: Error }) {
  console.error(error);
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="card w-full max-w-xl border border-error/10 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <div className="mb-2 text-error">
            <XCircleIcon className="h-12 w-12 animate-pulse" />
          </div>
          <h2 className="card-title text-2xl font-bold">Oops! Something went wrong</h2>
          <p className="py-4 text-base-content/80">
            We encountered an unexpected issue. Don't worry - this is likely temporary. Please try
            your action again.
          </p>
          <div className="card-actions">
            <button
              onClick={() => reset()}
              className="hover:btn-error/90 btn btn-error btn-wide text-error-content transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error;
