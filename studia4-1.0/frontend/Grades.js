import React from 'react';
import { useRemoteData, fetchGrades } from "./Remote";

export default function Grades() {
    const courses = useRemoteData(fetchGrades);
    if (courses === null) {
        return <div>Loading grades...</div>;
    }
    return (
        <div className='content-box'>
            {courses.map(crs => <div className='box-row'>{crs.name}: {crs.grade}<br/></div>)}
        </div>
    );
}