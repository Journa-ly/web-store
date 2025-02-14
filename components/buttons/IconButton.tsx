interface IconButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function IconButton({ icon, text, onClick, type = 'button', disabled = false }: IconButtonProps) {
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
      onClick={(e) => onClick(e)}
    >
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '4px' }}>{icon}</div>
      <span style={{ textAlign: 'center' }}>{text}</span>
    </button>
  );
}
