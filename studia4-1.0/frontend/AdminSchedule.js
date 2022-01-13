import React from 'react';
import { GroupSelector } from "./App";
import { fetchGroupSchedule, pushRescheduleRequest } from './Remote';
import { Schedule } from "./Schedule";

export default function AdminSchedule() {
    const [filteredClasses, setClasses] = React.useState(null);
    const [groups, setGroups] = React.useState(null);
    React.useEffect(() => groups === null || fetchGroupSchedule(groups).then(setClasses), [groups])
    return (
        <div className="content-box">
            <GroupSelector onSelect={setGroups}/>
            {filteredClasses && <Schedule 
                initSchedule={filteredClasses}
                permResched
                mode={"reschedule"}
                actions={[{
                    name: "Zmień",
                    cb: function(chng) {
                        setClasses(null);
                        pushRescheduleRequest(chng)
                            .then(() => fetchGroupSchedule(groups)
                            .then(setClasses));
                    }
                }]}
            />}
        </div>
    )
}