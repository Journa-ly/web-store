import { useModal } from './ModalContext';

export default function SelectImageCarousel() {
  const { openModal } = useModal();
  return (
    <div>
      <div style={{ display: 'flex', alignItems: "center", paddingBottom: "12px" }}>
          <div style={{display: 'flex', justifyContent: "center", alignItems: "center", marginRight: '12px', width: "35px", borderRadius: "50%", height: "35px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)" }}>
            <span>
              1
            </span>
          </div>
          <span>Create your image.</span>
        </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="hover-grow" style={{borderRadius: "12px", cursor: "pointer", padding: "12px", color: "#757575", backgroundColor: "none", border: "solid 1px rgba(255, 255, 255, 0.2)", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)"}} onClick={openModal}>
          Start creating here
        </button>
      </div>
    </div>
  );
}