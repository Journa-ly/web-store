
export default function IconButton({ icon, text, onClick, type='button', disabled=false }) {
  return (
    <button 
      className="hover-grow"
      disabled={disabled}
      type={type}
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        color: '#757575',
        width: '45px'
      }}
      onClick={e => onClick(e)}
    >
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '4px' }}>
        {icon}
      </div>
      <span style={{ textAlign: 'center' }}>{text}</span>
    </button>
  );
} 
