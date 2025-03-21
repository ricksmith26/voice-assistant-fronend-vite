import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  AgentState,
} from "@livekit/components-react";
import { useCallback, useEffect, useState } from "react";
import { MediaDeviceFailure} from "livekit-client";
// import { useRoomContext } from "@livekit/components-react";
import { NoAgentNotification } from "../components/NoAgentNotification";
// import { CloseIcon } from "../components/CloseIcon";
// import { useKrispNoiseFilter } from "@livekit/components-react/krisp";

import "@livekit/components-styles";

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export default function Winston({ mode, email }: any) {
  const [connectionDetails, updateConnectionDetails] = useState<
    ConnectionDetails | undefined
  >(undefined);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");

  const onConnectButtonClicked = useCallback(async () => {
    try {
      const url = new URL(
        import.meta.env.VITE_NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
        window.location.origin
      );

      const response = await fetch(`${url}/${email}`);
      if (!response.ok) throw new Error("Failed to fetch connection details");

      const connectionDetailsData = await response.json();
      updateConnectionDetails(connectionDetailsData);
    } catch (error) {
      console.error("Error fetching connection details:", error);
      alert("Failed to connect to LiveKit. Please try again.");
    }
  }, []);


  useEffect(() => {
    if (mode === 'winston') {
      onConnectButtonClicked()
    } else {

    }
  }, [mode])

  return (
    <div className="h-full grid content-center bg-[var(--lk-bg)]">
    <LiveKitRoom
      token={connectionDetails?.participantToken}
      serverUrl={connectionDetails?.serverUrl}
      connect={!!connectionDetails}
      audio={true}
      video={{ facingMode: "user" }}
      onMediaDeviceFailure={onDeviceFailure}
      onDisconnected={() => updateConnectionDetails(undefined)}
      className="grid grid-rows-[2fr_1fr] items-center"
    >
      <SimpleVoiceAssistant onStateChange={setAgentState} />
      {/* <ControlBar
        onConnectButtonClicked={onConnectButtonClicked}
        agentState={agentState}
      /> */}
      <RoomAudioRenderer />
      <NoAgentNotification state={agentState} />
    </LiveKitRoom>
    </div>
  );
}

function SimpleVoiceAssistant({ onStateChange }: { onStateChange: (state: AgentState) => void }) {
  const { state, audioTrack } = useVoiceAssistant();

  useEffect(() => {
    onStateChange(state);
  }, [onStateChange, state]);

  return (
    <div className="h-[300px] max-w-[90vw] mx-auto">
      <BarVisualizer
        state={state}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}

// function ControlBar({ onConnectButtonClicked, agentState }: any) {
//   const krisp = useKrispNoiseFilter();
//   const [krispEnabled, setKrispEnabled] = useState(false);

//   useEffect(() => {
//     if (krispEnabled) {
//       try {
//         krisp.setNoiseFilterEnabled(true);
//       } catch (error) {
//         console.warn("Krisp Noise Filter could not be enabled:", error);
//       }
//     }
//   }, [krispEnabled]); // ✅ Only enable Krisp when krispEnabled is true

//   return (
//     <div className="winstonContainer">
//       <div className="relative h-[100px]">
//       <AnimatePresence>
//         {agentState === "disconnected" && (
//           <motion.button
//             initial={{ opacity: 0, top: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0, top: "-10px" }}
//             transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
//             className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
//             onClick={() => {
//               onConnectButtonClicked();
//               setKrispEnabled(true); // ✅ Enable Krisp only after button click
//             }}
//           >
//             Start a conversation
//           </motion.button>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {agentState !== "disconnected" && agentState !== "connecting" && (
//           <motion.div
//             initial={{ opacity: 0, top: "10px" }}
//             animate={{ opacity: 1, top: 0 }}
//             exit={{ opacity: 0, top: "-10px" }}
//             transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
//             className="flex h-8 absolute left-1/2 -translate-x-1/2  justify-center"
//           >
//             <VoiceAssistantControlBar controls={{ leave: false }} />
//             <DisconnectButton>
//               <CloseIcon />
//             </DisconnectButton>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//     </div>
    
//   );
// }

function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please ensure you grant the necessary permissions in your browser and reload the page."
  );
}