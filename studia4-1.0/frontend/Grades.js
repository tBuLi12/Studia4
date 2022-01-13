import React from 'react';
import { useRemoteData, fetchGrades } from "./Remote";
import './Grades.css';

export default function Grades() {
    const courses = useRemoteData(fetchGrades);
    if (courses === null) {
        return <div>Loading grades...</div>;
    }
    return (
        <div className='content-box'>
            Moje oceny
            {courses.map(crs => <div className='box-row'>{crs.name}:<span className='grade'>{crs.grade}</span></div>)}
        </div>
    );
}