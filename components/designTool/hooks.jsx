import { useMemo } from 'react';
import { useWebSocketData } from './WebSocketContext';

export function useSelectedGenerationGroup() {
  const { generationsGroups } = useWebSocketData();

  const selectedGroup = useMemo(() => {
    return generationsGroups.find(group => group.selected) || null;
  }, [generationsGroups]);

  return selectedGroup;
}


export function useSelectedImage() {
  
  const { generationsGroups } = useWebSocketData();
  const selectedGroup = generationsGroups.find(group => group.selected);
  if (selectedGroup) {
    const selectedImage = selectedGroup.generation_group_images.find(image => image.selected);
    return selectedImage;
  }
  return null;
}

export function useAllGenerationGroupImages() {
  const { generationsGroups } = useWebSocketData();

  const allImages = useMemo(() => {
    return generationsGroups.reduce((accumulator, group) => {
      if (group.generation_group_images && group.generation_group_images.length > 0) {
        return accumulator.concat(group.generation_group_images);
      }
      return accumulator;
    }, []);
  }, [generationsGroups]);

  return allImages;
}

