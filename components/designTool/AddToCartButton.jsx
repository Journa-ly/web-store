import ProductLinkButton from './ProductLinkButton';

const AddToCartButton = () => {
  const productForm = document.querySelector('form[action^="/cart/add"]');

  const handleCustomSubmit = (e) => {
    // Get the existing form element by its ID
    e.stopPropagation();

    if (productForm) {
      // Programmatically submit the form
      productForm.submit();
    } else {
      console.error('Product form not found.');
    }
  };

  if (!productForm) {
    return <ProductLinkButton />;
  }

  return (
    <button className="add-to-cart-btn" onClick={handleCustomSubmit}>
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
