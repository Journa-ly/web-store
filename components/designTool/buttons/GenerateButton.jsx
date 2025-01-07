import GenerationIcon from '../icons/GenerationIcon';

const GenerateButton = () => (
  <button
    className="hover-grow"
    style={{
      backgroundColor: '#534E55',
      border: 'none',
      borderRadius: '8px',
      padding: '7px 10px 7px 7px',
      cursor: 'pointer'
    }}
    type="submit"
  >
    <div
      style={{
        height: '50px',
        width: '50px',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        color: '#fff'
      }}
    >
      <GenerationIcon />
      <div style={{ paddingTop: '8px' }}>Create</div>
    </div>
  </button>
);

export default GenerateButton;
