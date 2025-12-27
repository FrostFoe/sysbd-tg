"use client";

import CallScreen from "./modals/CallScreen";
import StoryViewer from "./modals/StoryViewer";
import QRCodeModal from "./modals/QRCodeModal";
import DrawingModal from "./modals/DrawingModal";
import FolderLockModal from "./modals/FolderLockModal";
import ForwardModal from "./modals/ForwardModal";
import NewFolderModal from "./modals/NewFolderModal";

export default function GlobalModals() {
  return (
    <>
      <CallScreen />
      <StoryViewer />
      <QRCodeModal />
      <DrawingModal />
      <FolderLockModal />
      <ForwardModal />
      <NewFolderModal />
    </>
  );
}