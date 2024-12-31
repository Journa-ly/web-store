import TrashcanIcon from '../icons/TrashcanIcon';
import IconButton from './IconButton';

const DeleteButton = () => {
  const handleDelete = () => {
    fetch('https://api.example.com/delete', {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        alert('Deleted successfully');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error deleting');
      });
  }
  return (
    <IconButton
      icon={<TrashcanIcon />}
      text="Exit"
      onClick={handleDelete}
    />
  );
};

export default DeleteButton;
