import { useEffect, useRef, useState } from "react";
import { TextInput } from "../formComponents/TextInput/TextInput";
import Button from "../Button/Button";
import { IncomingCall } from "./IncomingCall/IncomingCall";
import './WebRTC.css'
import { Videos } from "./Videos/Videos";
import { OutgoingCall } from "./OutgoingCall/OutgoingCall";


interface WebRTCProps {
    socket: any;
    patientContacts: any;
    patientEmail: string;
}

export const WebRTC = ({ socket, patientEmail, patientContacts }: WebRTCProps) => {
    const [email, setEmail] = useState<string>(patientEmail);
    const [to, setTo] = useState<string>(patientContacts[0].telecom[1].value);
    const [incomingCall, setIncomingCall] = useState<boolean>(false);
    const [outgoingCall, setOutgoingCall] = useState<boolean>(false)
    const [caller, setCaller] = useState<string | null>();
    const [incomingCallerName, setInComingCallerName] = useState(`${patientContacts[0].name[0].given[0]} ${patientContacts[0].name[0].family}`)
    const [receivedOffer, setReceivedOffer] = useState<RTCSessionDescriptionInit | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [areVisible, setAreVisible] = useState<boolean>(false)

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        socket.on("incomingCall", ({ fromEmail }: any) => {
            setCaller(fromEmail);
            setIncomingCall(true);
        });

        socket.on("offer", async ({ from, offer }: any) => {
            console.log("Incoming WebRTC Offer", offer);
            setCaller(from);
            setReceivedOffer(offer);
            setIncomingCall(true);
        });

        socket.on("answer", async ({ answer }: any) => {
            console.log("Received Answer");
            setOutgoingCall(false)
            setAreVisible(true)
            if (peerConnection) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });
        socket.on("hangup", ({toEmail}: any) => {

            console.log("Call ended by the other user.");
            if (to !== toEmail) hangupCall();
        });
        
        socket.on("iceCandidate", ({ candidate }: any) => {
            if (peerConnection) {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        return () => {
            socket.off("incomingCall");
            socket.off("offer");
            socket.off("answer");
            socket.off("hangup");
            socket.off("iceCandidate");
        };
    }, [socket, peerConnection]);

    const addUser = () => {
        socket.emit("register", email);
    };

    const startCall = async () => {
        if (!to) return;
        setOutgoingCall(true)
        const pc = createPeerConnection(to);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("callUser", { toEmail: to, offer });
    };

    const acceptCall = async () => {
        if (!caller || !receivedOffer) return;

        setIncomingCall(false);

        const pc = createPeerConnection(caller);
        setPeerConnection(pc);

        // **Fix: Set Remote Description First**
        await pc.setRemoteDescription(new RTCSessionDescription(receivedOffer));

        // **Now, Create and Send an Answer**
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        setAreVisible(true)
        socket.emit("answer", { to: caller, answer });
    };

    const rejectCall = () => {
        console.log("Hanging up...");
    
        // Notify the other peer about the hangup

        if (to) {
            socket.emit("hangup", { toEmail: to });
        }
    
        // Close the peer connection
        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
        }
    
        // Stop all local media tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
    
        // Reset state
        setIncomingCall(false);
        setOutgoingCall(false);
        setCaller(null);
        setReceivedOffer(null);
        setAreVisible(false);
        
        console.log("Call ended.");
    };


    const hangupCall = () => {
        console.log("Hanging up...");
    
        // Notify the other peer about the hangup
        if (caller) {
            socket.emit("hangup", { toEmail: caller });
        }
    
        // Close the peer connection
        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
        }
    
        // Stop all local media tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
    
        // Reset state
        setIncomingCall(false);
        setOutgoingCall(false);
        setCaller(null);
        setReceivedOffer(null);
        setAreVisible(false);
        
        console.log("Call ended.");
    };

    const createPeerConnection = (peerEmail: string): RTCPeerConnection => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        localStreamRef.current?.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current!));

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("iceCandidate", { to: peerEmail, candidate: event.candidate });
            }
        };

        setPeerConnection(pc);
        return pc;
    };

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        });
        addUser()

    }, []);

    return (
        <div>
            <OutgoingCall isOutgoing={outgoingCall} hangupCall={rejectCall}/>
            <IncomingCall incomingCall={incomingCall} caller={incomingCallerName || ''} acceptCall={acceptCall} rejectCall={rejectCall} />
            <Videos areVisible={areVisible} localVideoRef={localVideoRef} remoteVideoRef={remoteVideoRef}/>
            {!areVisible && <Button onClick={startCall}>{`Call ${to}`}</Button>}
        </div >
    );
};