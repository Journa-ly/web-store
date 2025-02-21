'use client';

import {
	appRouterSsrErrorHandler,
	AppRouterErrorProps,
} from '@highlight-run/next/ssr'
import { XCircleIcon } from '@heroicons/react/24/outline';

function Error({ reset, error }: AppRouterErrorProps) {
  console.error(error);
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="card w-full max-w-xl bg-base-100 shadow-xl border border-error/10">
        <div className="card-body items-center text-center">
          <div className="text-error mb-2">
            <XCircleIcon className="h-12 w-12 animate-pulse" />
          </div>
          <h2 className="card-title text-2xl font-bold">Oops! Something went wrong</h2>
          <p className="text-base-content/80 py-4">
            We encountered an unexpected issue. Don't worry - this is likely temporary.
            Please try your action again.
          </p>
          <div className="card-actions">
            <button
              onClick={() => reset()}
              className="btn btn-error btn-wide text-error-content hover:btn-error/90 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default appRouterSsrErrorHandler(Error);