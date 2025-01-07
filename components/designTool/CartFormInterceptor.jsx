import { useEffect } from 'react';
import { useWebSocketData } from './WebSocketContext';

export default function CartFormField() {
  const { pipelineJobs } = useWebSocketData();
  const selectedPipleine =
    Array.isArray(pipelineJobs) && pipelineJobs.find((pipeline) => pipeline.selected);
  const selectedImage =
    selectedPipleine && selectedPipleine.product_images.find((image) => image.selected);

  useEffect(() => {
    const form = document.querySelector('form[action^="/cart/add"]');

    const handleAddToCart = (event) => {
      // Prevent the form from submitting
      event.preventDefault();

      // Create a FormData object from the form
      const formData = new FormData(form);
      const imageUUID = selectedImage ? selectedImage.uuid : null;

      formData.append(`properties[image_id]`, imageUUID);

      const formAction = form.action;
      const method = form.method;
      fetch(formAction, {
        method: method,
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Product added with custom properties', data);
          // Handle successful addition, like updating a cart UI
        })
        .catch((error) => {
          console.error('Error adding product with custom properties:', error);
          // Handle error
        });
    };

    if (form) {
      form.addEventListener('submit', handleAddToCart);
    }

    return () => {
      console.log('remove event listener');
      form && form.removeEventListener('submit', handleAddToCart);
    };
  }, []);

  return null;
}
