import React from 'react';
import { DispatchContext, GroupSelector } from "./App";
import { fetchGroupSchedule, pushRescheduleRequest } from './Remote';
import { Schedule } from "./Schedule";

export default function AdminSchedule() {
    const dispatch = React.useContext(DispatchContext);
    const [filteredClasses, setClasses] = React.useState(null);
    const [groups, setGroups] = React.useState(null);
    React.useEffect(() => groups === null || fetchGroupSchedule(groups).then(setClasses), [groups])
    return (
        <>
            <div className="content-box">
                <GroupSelector onSelect={setGroups}/>
            </div><br/>
            {filteredClasses && <Schedule 
                initSchedule={filteredClasses}
                permResched
                mode={"reschedule"}
                actions={[{
                    name: "Zmień",
                    cb: function(chng) {
                        setClasses(null);
                        pushRescheduleRequest(chng)
                            .then(() => fetchGroupSchedule(groups))
                            .then(setClasses, err => dispatch({action: "error", data: err}));
                    }
                }]}
            />}
        </>
    )
}