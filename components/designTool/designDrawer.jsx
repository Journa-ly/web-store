'use client';
import 'public/styles/design_tool.css';
import DesignTool from "./designTool";
import { ModalProvider } from "./ModalContext";
import { WebSocketProvider } from './WebSocketContext';

export default function DesignDrawer() {
  return (
      <WebSocketProvider>
        <ModalProvider>
          <DesignTool />
        </ModalProvider>
      </WebSocketProvider>
  );
}
