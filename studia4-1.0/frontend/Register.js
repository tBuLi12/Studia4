import React from 'react';
import { Button, SearchBar, usePopup, UserContext, verifyClose } from "./App";
import { classRegister, fetchClasses, fetchCourses, fetchCoursesRegister, fetchRatings, subjectRegister, useRemoteData } from "./Remote";
import { Schedule } from './Schedule';
import './Register.css';

export default function Register() {
    const allSubjects = useRemoteData(fetchCoursesRegister);
    const mySubjects = useRemoteData(fetchCourses);
    const schedule = useRemoteData(fetchClasses);
    const ratings = useRemoteData(fetchRatings);
    const [popup, show] = usePopup();
    const [currSubjects, setSubjects] = React.useState(null);
    const registeredSubjects = React.useMemo(() => sbjSet(mySubjects), [mySubjects]);
    if (allSubjects === null || registeredSubjects === null || ratings === null) {
        return <div>Loading subjects...</div>;
    }
    const fwd = {show, schedule, ratings};
    const subjects = currSubjects ?? allSubjects;
    return (
        <div className="content-box">
            <SearchBar onSearch={srch => setSubjects(allSubjects.filter(sub => sub.name.includes(srch)))}/>
            {currSubjects !== null && <Button onClick={() => setSubjects(null)}>Wyczyść</Button>}
            {subjects.map(sbj => <SubjectRegister sbj={sbj} alReg={registeredSubjects.has(sbj.id)} {...fwd}/>)}
            {popup}
        </div>
    );
}

function SubjectRegister({ sbj, ratings, alReg, show, schedule }) {
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
            {sbj.name}
            
            <span className='resched-buttons'>{alReg ? "Zarejestrowano" : <>
                {slots && <div className="indicator" style={{backgroundColor: getColor(evalSlots(sbj.slots, ratings))}}/>}  
                <Button onClick={function() {
                    if (slots) {
                        show(h => <Schedule
                            initSchedule={schedule}
                            initSelections={slots}
                            mode={"select"}
                            onSelect={h}
                        />).then(slot => classRegister(sbj.id, slot), verifyClose)
                    } else {
                        subjectRegister(sbj.id);
                    }
                }}>Zarejestruj</Button>
            </>}</span>
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

function getColor(val) {
    return `rgb(${Math.floor(Math.min(255, (1-val)*512))}, ${Math.floor(Math.min(255, val*512))}, 0)`;
}

function sbjSet(subjects) {
    if (subjects === null) {
        return null;
    }
    const retSet = new Set();
    subjects.forEach(sbj => retSet.add(sbj.id));
    return retSet;
}