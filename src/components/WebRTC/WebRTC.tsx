import { useEffect, useRef, useState } from "react";
import { TextInput } from "../formComponents/TextInput/TextInput";
import Button from "../Button/Button";

interface WebRTCProps {
    socket: any;
}

export const WebRTC = ({ socket }: WebRTCProps) => {
    const [email, setEmail] = useState<string>("");
    const [to, setTo] = useState<string>("");
    const [incomingCall, setIncomingCall] = useState<string | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        socket.on("incomingCall", ({ fromEmail }: {fromEmail: string} ) => {
            setIncomingCall(fromEmail);
        });

        socket.on("offer", async ({ from, offer }: { from: string, offer: any }) => {
            console.log("Received Offer:", offer);
            const pc = createPeerConnection(from);
            await pc.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit("answer", { to: from, answer });
        });

        socket.on("answer", async ({ answer }: any) => {
            console.log("Received Answer:", answer);
            if (peerConnection) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            }
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
            socket.off("iceCandidate");
        };
    }, [socket, peerConnection]);

    const addUser = () => {
        socket.emit("register", email);
    };

    const startCall = async () => {
        if (!to) return;

        const pc = createPeerConnection(email);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("callUser", { toEmail: to, offer });
    };

    const acceptCall = async () => {
        setIncomingCall(null);
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
    }, []);

    return (
        <div>
            <TextInput placeholder="Your Email" onChange={(e) => setEmail(e.target.value)} />
            <TextInput placeholder="Send to" onChange={(e) => setTo(e.target.value)} />

            <Button onClick={addUser}>Add</Button>
            <Button onClick={startCall}>Call</Button>

            {incomingCall && (
                <div>
                    <p>Incoming call from {incomingCall}</p>
                    <Button onClick={acceptCall}>Accept</Button>
                    <Button onClick={() => setIncomingCall(null)}>Decline</Button>
                </div>
            )}

            <div>
                <h3>Local Video</h3>
                <video ref={localVideoRef} autoPlay playsInline></video>
            </div>
            <div>
                <h3>Remote Video</h3>
                <video ref={remoteVideoRef} autoPlay playsInline></video>
            </div>
        </div>
    );
};