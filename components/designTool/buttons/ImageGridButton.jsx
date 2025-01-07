import ImageGridIcon from '../icons/ImageGridIcon';
import ImageGrid from '../ImageGrid';
import { useModal } from '../ModalContext';
import SlideOutModal from '../SlideModal';
import IconButton from './IconButton';

const ImageGridButton = () => {
  const { isGridModalOpen, openGridModal, closeGridModal } = useModal();

  return (
    <>
      <IconButton icon={<ImageGridIcon />} text="Images" onClick={openGridModal} />
      <SlideOutModal isOpen={isGridModalOpen} onClose={closeGridModal}>
        <div style={{ overflow: 'scroll', height: '100%' }}>
          <ImageGrid handleClose={closeGridModal} />
        </div>
      </SlideOutModal>
    </>
  );
};

export default ImageGridButton;
