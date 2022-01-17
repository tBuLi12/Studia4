import React from 'react';
import { Button, DispatchContext } from './App';
import { fetchRequests, useRemoteData, approveRequest, declineRequest } from "./Remote";
import './ReschedRequests.css';
import { getSlotName } from './Schedule';

export default function ReschedRequests() {
    const [requests, _, setRequests] = useRemoteData(fetchRequests);
    const delRequest = React.useCallback(function(id) {
        setRequests(reqs => reqs.filter(r => r.id !== id));
    }, [setRequests])
    if (requests === undefined) {
        return <div>Loading requests...</div>;
    }
    return (
        <div className="content-box">
            Prośby o zmiany grup
            {requests.map(req => <RRequest key={req.id} {...req} del={delRequest}/>)}
        </div>
    );
}

function RRequest({ id, stud, clsName, clsType, to, del }) {
    const [pending, setPending] = React.useState(false);
    const dispatch = React.useContext(DispatchContext);
    return (
        <div className="box-row">
            <div className='request-text'>
                {clsName} {clsType},<br/>
                {stud},<br/>
                na {getSlotName(to)}
            </div>
            <div className='request-buttons'>
                {pending ? <div className='request-text'>przetwarzanie...</div> : (<><Button onClick={function() {
                    setPending(true);
                    approveRequest(id).then(() => del(id), function(err) {
                        setPending(false);
                        dispatch({action: "popupError", data: err});
                    });
                }}>Zaakceptuj</Button>
                <Button onClick={function() {
                    setPending(true);
                    declineRequest(id).then(() => del(id), function(err) {
                        setPending(false);
                        dispatch({action: "popupError", data: err});
                    });
                }}>Odrzuć</Button></>)}
            </div>
        </div>
    )
}