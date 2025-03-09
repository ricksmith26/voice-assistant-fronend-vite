import "./outgoingCall.css"
import declineIcon from "../IncomingCall/decline.svg"


interface OutgoingCallProps {
    isOutgoing: boolean;
    hangupCall: Function;
}

export const OutgoingCall = ({ isOutgoing, hangupCall }: OutgoingCallProps) => {
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