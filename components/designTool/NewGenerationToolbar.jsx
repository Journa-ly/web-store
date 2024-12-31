import ExitButton from './buttons/ExitButton';
import GenerateButton from './buttons/GenerateButton';
import ImageGridButton from './buttons/ImageGridButton';

const NewGenerationToolbar = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: 'transparent',
      padding: '0 20px',
      marginTop: '18px',
    }}
  >
    <ExitButton />
    <GenerateButton />
    <ImageGridButton />
  </div>
);

export default NewGenerationToolbar;
