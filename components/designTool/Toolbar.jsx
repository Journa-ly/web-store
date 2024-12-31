import ExitButton from './buttons/ExitButton';
import GenerateButton from './buttons/GenerateButton';
import ImageGridButton from './buttons/ImageGridButton';
import NewGenerationButton from './buttons/NewGenerationButton';
import ShareButton from './buttons/ShareButton';


const Toolbar = () => (
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
    <NewGenerationButton />
    <GenerateButton />
    <ShareButton />
    <ImageGridButton />
  </div>
);

export default Toolbar;
