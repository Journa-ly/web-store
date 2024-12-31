import { ModalProvider } from "./ModalContext";
import Preview from "./Preview";
import { WebSocketProvider } from './WebSocketContext';


export default function DesignDrawer() {
  return (
      <WebSocketProvider>
        <ModalProvider>
          <Preview />
        </ModalProvider>
      </WebSocketProvider>
  );
}
