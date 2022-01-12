import React from 'react';
import { Button, SearchBar, UserContext } from "./App";
import { fetchCoursesRegister, subjectRegister, useRemoteData } from "./Remote";

export default function Register() {
    const user = React.useContext(UserContext);
    const sbjData = useRemoteData(fetchCoursesRegister);
    const [currSubjects, setSubjects] = React.useState(null);
    if (sbjData === null) {
        return <div>Loading subjects...</div>;
    }
    const [allSubjects, registeredSubjects] = sbjData;
    const subjects = currSubjects ?? allSubjects;
    return (
        <div className="content-box">
            <SearchBar onSearch={srch => setSubjects(allSubjects.filter(sub => sub.name.includes(srch)))}/>
            {currSubjects !== null && <Button onClick={() => setSubjects(null)}>Wyczyść</Button>}
            {subjects.map(sbj => <SubjectRegister sbj={sbj} user={user} alReg={registeredSubjects.has(sbj.id)}/>)}
        </div>
    );
}

function SubjectRegister({ sbj, user, slots, ratings, alReg }) {
    return (
        <div className="box-row">
            {sbj.name}
            {slots && <div className="indicator" style={{backgroundColor: getColor(evalSlots(slots, ratings))}}/>}
            {alReg ? "Zarejestrowano" : <Button onClick={() => subjectRegister(user, sbj.id)}>Zarejestruj</Button>}
        </div>
    )
}

function evalSlots(slots, ratings) {
    const ratingVals = slots.map(s => ratings[s]).filter(r => r !== undefined).sort()
    return genWeights(0.7, 1, ratingVals.length).map((w, i) => w*ratingVals[i]).reduce((r1, r2) => r1+r2) / 6
}

function genWeights(prop, val, len) {
    if (len === 0) {
        return [];
    }
    return [val*prop, ...genWeights(prop, val*(1-prop), len - 1)] 
}

function getColor(val) {
    return `rgb(0, 0, ${Math.floor(val*256)})`;
}