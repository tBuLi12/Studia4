import React from 'react';
import { Button } from './App';
import { fetchRequests, useRemoteData, approveRequest, declineRequest } from "./Remote";
import './ReschedRequests.css';

export default function ReschedRequests() {
    const initRequests = useRemoteData(fetchRequests);
    const [requests, setRequests] = React.useState([]);
    React.useEffect(() => setRequests(initRequests), [initRequests]);
    if (requests === null) {
        return <div>Loading requests...</div>;
    }
    function delRequest(id) {
        setRequests(reqs => reqs.filter(r => r.id !== id));
    }
    return (
        <div className="content-box">
            Prośby o zmiany grup
            {requests.map(req => <RRequest key={req.id} {...req} del={delRequest}/>)}
        </div>
    );
}

function RRequest({ id, stud, cls, to, del }) {
    const [pending, setPending] = React.useState(false);
    return (
        <div className="box-row">
            {cls.name} {cls.type}, {stud}, na {to}
            <span className='resched-buttons'>{pending ? "przetwarzanie..." : (<><Button onClick={function() {
                setPending(true);
                approveRequest(id).then(() => del(id)).catch(() => setPending(false));
            }}>Zaakceptuj</Button>
            <Button onClick={function() {
                setPending(true);
                declineRequest(id).then(() => del(id)).catch(() => setPending(false));
            }}>Odrzuć</Button></>)}</span>
        </div>
    )
}