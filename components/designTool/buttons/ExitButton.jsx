import ExitIcon from '../icons/ExitIcon';
import { useModal } from '../ModalContext';
import IconButton from './IconButton';

const ExitButton = () => {
  const { closeModal } = useModal();

  return (
    <IconButton
      icon={<ExitIcon />}
      text="Exit"
      onClick={closeModal}
    />
  );
};

export default ExitButton;
