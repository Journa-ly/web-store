import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useWebSocketData } from './WebSocketContext';

export default function CartFormField() {
  const [forms, setForms] = useState([]);
  const { generationsGroups } = useWebSocketData();

  const selectedGenerationGroup =
    Array.isArray(generationsGroups) && generationsGroups.find((group) => group.selected);
  const selectedImage =
    selectedGenerationGroup &&
    selectedGenerationGroup.generation_group_images.find((image) => image.selected);

  useEffect(() => {
    const formElements = document.querySelectorAll('form[action^="/cart/add"]');
    setForms([...formElements]);
    // Set initial disabled state
    formElements.forEach((form) => {
      form.querySelectorAll('button, input[type="submit"]').forEach((button) => {
        button.disabled = !selectedImage;
      });
    });
  }, []);

  useEffect(() => {
    // Update disabled state when selectedImage changes
    forms.forEach((form) => {
      form.querySelectorAll('button, input[type="submit"]').forEach((button) => {
        button.disabled = selectedImage && !selectedImage.image;
      });
    });
  }, [selectedImage]);

  if (selectedImage && !selectedImage.image) {
    return null;
  }

  return forms.map((form) =>
    createPortal(
      <>
        <input
          id="image-id"
          type="hidden"
          name="properties[image_id]"
          value={selectedImage ? selectedImage.image.uuid : ''}
        />
        <input
          id="image-id"
          type="hidden"
          name="properties[image_url]"
          value={selectedImage ? selectedImage.image.image : ''}
        />
      </>,
      form
    )
  );
}
