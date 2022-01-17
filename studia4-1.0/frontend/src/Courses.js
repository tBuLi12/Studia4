import React from "react";
import { NavLink } from "./Nav";
import './Courses.css';
import { fetchCourses, useRemoteData } from "./Remote";
import { useHelp } from "./App";

const help = `Kliknij nazwę przedmiotu aby pokazać odnośniki do strony przedmiotuy oraz strony prowadzącego`;

function CourseInfo(props) {
    return (
        <div>
            <h2>{props.name}</h2>
            Informacje o przedmiocie
        </div>
    )
}

function MaitainerInfo(props) {
    return (
        <div>
            informacje o prowadzącym
        </div>
    )
}

function CoursesList() {
    useHelp(help);
    const [courses] = useRemoteData(fetchCourses);
    if (courses === undefined) {
        return <div>Loading content...</div>;
    }
    return (
        <div id="courses" className="content-box">
            Moje Przedmioty
            {courses.map(crs => <Course key={crs.id} name={crs.name}/>)}
        </div>
    )
}

function Course(props) {
    const [expanded, setExpanded] = React.useState(false);
    return (
        <>
            <div className="course" onClick={function() {
                setExpanded(prev => !prev);
            }}>{props.name}</div>
            <div className="course-menu" style={{maxHeight: expanded ? "3em" : "0"}}>
                <NavLink view={<CourseInfo/>}>Strona przedmiotu</NavLink>
                <NavLink view={<MaitainerInfo/>}>Strona prowadzącego</NavLink>
            </div>
        </>
    )
}

export default CoursesList;