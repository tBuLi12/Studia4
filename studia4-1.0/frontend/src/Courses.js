import React from "react";
import { NavLink } from "./Nav";
import './Courses.css';
import { fetchCourses, useRemoteData } from "./Remote";

function getCourseText(name) {
    return `blablabla info o ${name}`;
}

function CourseInfo(props) {
    const [info, setInfo] = React.useState("");
    React.useEffect(function() {
        setInfo(getCourseText(props.name));
    }, [props.name]);
    return (
        <div>
            <h2>{props.name}</h2>
            {info}
        </div>
    )
}

function MaitainerInfo(props) {
    const [info, setInfo] = React.useState("");
    React.useEffect(function() {
        setInfo(getCourseText(props.name));
    }, [props.name]);
    return (
        <div>
            {info}
        </div>
    )
}

function CoursesList() {
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
                <NavLink view={<CourseInfo name={props.name}/>}>Strona przedmiotu</NavLink>
                <NavLink view={<MaitainerInfo name={props.maitainerName}/>}>Strona prowadzącego</NavLink>
            </div>
        </>
    )
}

export default CoursesList;