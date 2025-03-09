import Button from "../../Button/Button";
import './incomingCall.css'
import answer from "./answer.svg"
import decline from "./decline.svg"

interface IncomingCallProps {
    incomingCall: boolean;
    caller: string;
    acceptCall: Function;
    rejectCall: Function;
}

export const IncomingCall = ({ incomingCall, caller, acceptCall, rejectCall }: IncomingCallProps) => {
    return (
        <>
            {incomingCall && (
                <div className="incomingBackGround">
                    <div className="incomingTitle">
                        <h2>Incoming call from</h2>
                    </div>
                    <div className="incomingTitle">
                        <h2>{caller}</h2>
                    </div>
                    <div className="callButtons">
                        <img src={answer} style={{ height: '75px' }} onClick={() => acceptCall()}/>
                        <img src={decline} style={{ height: '75px' }} onClick={() => rejectCall()}/>
                    </div>
                </div>
            )}
        </>
    )
}