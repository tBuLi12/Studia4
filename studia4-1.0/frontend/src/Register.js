import React from 'react';
import { Button, DispatchContext, SearchBar, usePopup, verifyClose } from "./App";
import { classRegister, fetchClasses, fetchCourses, fetchCoursesRegister, fetchRatings, subjectRegister, useRemoteData } from "./Remote";
import { Schedule } from './Schedule';
import './Register.css';

export default function Register() {
    const [allSubjects] = useRemoteData(fetchCoursesRegister);
    const [mySubjects] = useRemoteData(fetchCourses);
    const [schedule] = useRemoteData(fetchClasses);
    const [ratings] = useRemoteData(fetchRatings);
    const [popup, show] = usePopup();
    const [currSubjects, setSubjects] = React.useState(null);
    const registeredSubjects = React.useMemo(() => sbjSet(mySubjects), [mySubjects]);
    if (allSubjects === undefined || registeredSubjects === undefined || ratings === undefined) {
        return <div>Loading subjects...</div>;
    }
    const fwd = {show, schedule, ratings};
    const subjects = currSubjects ?? allSubjects;
    return (<>
        <div className="content-box">
            Rejestracja
            <SearchBar onSearch={srch => setSubjects(allSubjects.filter(sub => sub.name.includes(srch)))}/>
            {currSubjects !== null && <Button onClick={() => setSubjects(null)}>Wyczyść</Button>}
            {subjects.map(sbj => <SubjectRegister sbj={sbj} alReg={registeredSubjects.has(sbj.id)} {...fwd}/>)}
        </div>
        {popup}
    </>);
}

function SubjectRegister({ sbj, ratings, alReg, show, schedule }) {
    const dispatch = React.useContext(DispatchContext);
    const slots = React.useMemo(function() {
        if (sbj.slots === undefined) {
            return undefined;
        }
        const slots = {};
        sbj.slots.forEach(slt => slots[slt] = true);
        return slots;
    }, [sbj])
    return (
        <div className="box-row">
            <div>{sbj.name}</div>
            {alReg ? <div className='resched-side-text'>Zarejestrowano</div> : <div>
                {slots && <div className="indicator" style={{backgroundColor: getColor(evalSlots(sbj.slots, ratings))}}/>}  
                <Button onClick={function() {
                    (slots ? show(h => <Schedule
                        title="Wybierz termin"
                        initSchedule={schedule}
                        initSelections={slots}
                        mode={"select"}
                        onSelect={h}
                    />).then(slot => classRegister(sbj.id, slot), verifyClose) : subjectRegister(sbj.id))
                        .catch(err => dispatch({action: "popupError", data: err}));
                }}>Zarejestruj</Button>
            </div>}
        </div>
    )
}

function evalSlots(slots, ratings) {
    const ratingVals = slots.map(s => ratings[s]).filter(r => r !== undefined).sort().reverse()
    return genWeights(0.8, 1, ratingVals.length).map((w, i) => w*ratingVals[i]).reduce((r1, r2) => r1+r2) / 6
}

function genWeights(prop, val, len) {
    if (len === 0) {
        return [];
    }
    return [val*prop, ...genWeights(prop, val*(1-prop), len - 1)] 
}

export function getColor(val) {
    return `rgb(${Math.floor(Math.min(255, (1-val)*512))}, ${Math.floor(Math.min(255, val*512))}, 0)`;
}

function sbjSet(subjects) {
    if (subjects === undefined) {
        return undefined;
    }
    const retSet = new Set();
    subjects.forEach(sbj => retSet.add(sbj.id));
    return retSet;
}