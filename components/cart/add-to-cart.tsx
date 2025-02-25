'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useActionState } from 'react';
import { useCart } from './cart-context';
import { Design } from '@/types/design';
import { useDesign } from '../designs/design-context';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  selectedDesign,
  selectedDesignRequired = false
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  selectedDesignRequired: boolean;
  selectedDesign: Design | null;
}) {
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-accent p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedDesign || (selectedDesign.product_image?.image === null && selectedDesignRequired)) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an image"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        'hover:opacity-90': true
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({
  product,
  selectedDesignRequired = false
}: {
  product: Product;
  selectedDesignRequired: boolean;
}) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const { selectedDesign } = useDesign();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every((option) => option.value === state[option.name.toLowerCase()])
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;

  const cartAttributes = selectedDesign
    ? [
        { key: 'designId', value: selectedDesign.uuid },
        { key: 'designUrl', value: selectedDesign.product_image?.image || '' }
      ]
    : [];

  const actionWithVariant = formAction.bind(null, {
    variantId: selectedVariantId,
    attributes: cartAttributes
  });

  const finalVariant = variants.find((variant) => variant.id === selectedVariantId)!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product, cartAttributes);
        await actionWithVariant();
      }}
    >
      <SubmitButton
        selectedDesignRequired={selectedDesignRequired}
        selectedDesign={selectedDesign}
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
