'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, {
  createContext,
  useContext,
  useMemo,
  useOptimistic,
  useReducer,
  ReactNode,
  useState,
  useEffect
} from 'react';
import { ProductVariant } from 'lib/shopify/types';

interface State {
  image: string | null;
  variant: string | null;
  [key: string]: string | null;
}

type Action =
  | { type: 'UPDATE_IMAGE'; payload: string }
  | { type: 'UPDATE_VARIANT'; payload: string };

const initialState: State = {
  image: null,
  variant: null
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_IMAGE':
      return { ...state, image: action.payload };
    case 'UPDATE_VARIANT':
      return { ...state, variant: action.payload };
    default:
      return state;
  }
}

interface ProductContextType {
  selectedVariant: ProductVariant | null;
  setSelectedVariant: (variant: ProductVariant | null) => void;
  state: State;
  updateImage: (image: string) => State;
  updateVariant: (variant: string) => State;
  updateOption: (name: string, value: string) => State;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Initialize state from URL params
    const params: State = { ...initialState };
    for (const [key, value] of searchParams.entries()) {
      if (key === 'image') {
        params.image = value;
      } else if (key === 'variant') {
        params.variant = value;
      }
    }
    dispatch({ type: 'UPDATE_IMAGE', payload: params.image || '' });
    dispatch({ type: 'UPDATE_VARIANT', payload: params.variant || '' });
  }, [searchParams]);

  const value = useMemo(
    () => ({
      selectedVariant,
      setSelectedVariant,
      state,
      updateImage: (image: string) => {
        dispatch({ type: 'UPDATE_IMAGE', payload: image });
        return { ...state, image };
      },
      updateVariant: (variant: string) => {
        dispatch({ type: 'UPDATE_VARIANT', payload: variant });
        return { ...state, variant };
      },
      updateOption: (name: string, value: string) => {
        dispatch({ type: 'UPDATE_VARIANT', payload: value });
        return { ...state, [name]: value };
      }
    }),
    [selectedVariant, state]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}

export function useUpdateURL() {
  const router = useRouter();

  return (state: State) => {
    const newParams = new URLSearchParams(window.location.search);
    Object.entries(state).forEach(([key, value]) => {
      newParams.set(key, String(value));
    });
    router.push(`?${newParams.toString()}`, { scroll: false });
  };
}
