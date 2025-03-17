import "./outgoingCall.css"
import declineIcon from "../IncomingCall/decline.svg"
// import { useEffect } from "react";
// import outgoingCallSound from '../../../assets/sounds/phone-outgoing-call-72202.mp3';
// import useSound from "use-sound";


interface OutgoingCallProps {
    isOutgoing: boolean;
    hangupCall: Function;
}

export const OutgoingCall = ({ isOutgoing, hangupCall }: OutgoingCallProps) => {
    // const [play, {stop}] = useSound(outgoingCallSound)
    // if (isOutgoing) play()
    // const hangUpandStopSound = () => {
    //     hangupCall()
    //     stop()
    // }
    return (
        <>
            {isOutgoing
                &&
                <div className="outgoingCallBackground">
                    <h2 className="outgoingTitle">Calling Kevin</h2>
                    <div className="outgoingButtonContainer">
                        <img src={declineIcon} style={{ height: '75px', cursor: 'pointer' }} onClick={() => hangupCall()}/>
                    </div>
                </div>}
        </>

    )
}