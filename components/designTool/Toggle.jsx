import { useState } from 'react';

const Switch = ({ label, name }) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  return (
    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <span style={{ marginRight: '10px', fontSize: '14px', color: '#333' }}>{label}</span>
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          width: '42px',
          height: '24px'
        }}
      >
        <input
          type="checkbox"
          name={name}
          checked={isOn}
          onChange={toggleSwitch}
          style={{
            opacity: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            cursor: 'pointer',
            zIndex: 2
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isOn ? '#3182ce' : '#cbd5e0',
            borderRadius: '12px',
            transition: 'background-color 0.2s',
            zIndex: 1
          }}
        ></span>
        <span
          style={{
            position: 'absolute',
            top: '2px',
            left: isOn ? '20px' : '2px',
            width: '20px',
            height: '20px',
            backgroundColor: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 2px rgba(0, 0, 0, 0.2)',
            transition: 'left 0.2s',
            zIndex: 3
          }}
        ></span>
      </div>
    </label>
  );
};

export default Switch;
