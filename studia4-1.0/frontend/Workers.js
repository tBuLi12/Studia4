import React from "react"
import { Button, SearchBar } from "./App";
import { fetchWorkerInfo, fetchWorkers, useRemoteData } from "./Remote";

export default function Workers() {
    const workers = useRemoteData(fetchWorkers);
    const suggestions = React.useMemo(() => workers?.map(w => w.name), [workers]);
    const [searched, setSearched] = React.useState(null);
    const [worker, setWorker] = React.useState(null);
    if (workers === null) {
        return <div>Loading workers...</div>;
    }
    return (
        <div className="content-box">
            Pracownicy
            <SearchBar onSearch={function(str) {
                setWorker(null);
                setSearched(workers.filter(w => w.name.includes(str)));
            }} suggestions={suggestions}/>
            {worker?.text ?? searched?.map(w => <div key={w.id} className="content-row">{w.name}<Button onClick={function() {
                fetchWorkerInfo(w.id).then(setWorker);
            }}>Wybierz</Button></div>)}
        </div>
    )
}