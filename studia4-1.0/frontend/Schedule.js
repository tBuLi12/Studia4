import React from 'react';
import './Schedule.css';
import { Button, UserContext } from "./App";
import { fetchClasses, pushRescheduleRequest, pushRatings, fetchRatings } from "./Remote";
const hours = ["8:15", "10:15", "12:15", "14:15", "16:15", "18:15"];
const days = ["poniedzialek", "wtorek", "sroda", "czwartek", "piatek"];

function getSlotId(day, hour) {
    return (hours.indexOf(hour) + days.indexOf(day)*6).toString();
}

function useMousePos(inital) {
    const [pos, setPos] = React.useState(inital);
    React.useEffect(function() {
        function handleMove(event) {
            setPos({
                x: event.pageX,
                y: event.pageY
            });
        }
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);
    return pos;
}

function schedStateReducer(state, { action, data }) {
    switch (action) {
        case "drag":
            return {...state, dragged: data};
        case "endDrag":
            const { x, y, id } = data;
            let newSched = null;
            for (const [slot, clb] of Object.entries(state.dropSlots.current)) {
                if (clb(x, y)) {
                    newSched = JSON.parse(JSON.stringify(state.schedule));
                    newSched[id].resched = slot;
                    if (newSched[id].slot === slot) {
                        delete newSched[id].resched;
                    }
                    break;
                }
            }
            return {...state, dragged: null, schedule: newSched ?? state.schedule};
        case "toggleSelect":
            return {...state, selections: {...state.selections, [data]: !state.selections[data]}};
        case "rerate":
            return {...state, ratings: {...state.ratings, [data.slot]: data.rating}};
        case "setSchedule":
            return {...state, schedule: data};
        case "setSelections":
            return {...state, selections: data};
        case "setRatings":
            return {...state, ratings: data};
        default:
            return state;
    }
}

function transformSchedule(schedule, perm, disId) {
    if (schedule === undefined) {
        return {};
    }
    const sbs = {};
    for (const [id, cls] of Object.entries(schedule)) {
        if (perm) {
            id != disId && (sbs[cls.resched ?? cls.slot] ?? (sbs[cls.resched ?? cls.slot] = [])).push(cls);
        } else {
            (sbs[cls.slot] ?? (sbs[cls.slot] = [])).push(cls);
            if (cls.resched) {
                (sbs[cls.resched] ?? (sbs[cls.resched] = [])).push({...cls, pend: true});
            }
        }
    }
    return sbs;
}

function reduceSelections(selections) {
    const sel = new Set();
    for (const [slot, selected] of Object.entries(selections)) {
        selected && sel.add(slot);
    }
    return sel;
}

function scheduleDiff(inital, current) {
    const changes = {};
    for (const [id, cls] of Object.entries(current)) {
        if ((cls.resched ?? cls.slot) !== (inital[id].resched ?? inital[id].slot)) {
            changes[id] = cls.resched ?? cls.slot;
        }
    }
    return changes;
}

export function Schedule({ initSchedule, initRatings, initSelections, onSelect, mode, actions, permResched }) {
    const dropSlots = React.useRef({});
    const borderRef = React.useRef();
    const [{ schedule, selections, ratings, dragged }, dispatch] = React.useReducer(schedStateReducer, {
        schedule: initSchedule,
        selections: initSelections,
        ratings: initRatings,
        dragged: null,
        dropSlots
    });
    React.useEffect(() => dispatch({action: "setSchedule", data: initSchedule}), [initSchedule]);
    React.useEffect(() => dispatch({action: "setSelections", data: initSelections}), [initSelections]);
    React.useEffect(() => dispatch({action: "setRatings", data: initRatings}), [initRatings]);
    const schedBySlot = React.useMemo(() => transformSchedule(schedule, permResched, dragged?.disId), [schedule, permResched, dragged]);

    const fwd = {mode, dispatch, dropSlots, onSelect, borderRef};

    const getCbData = {
        reschedule: () => scheduleDiff(initSchedule, schedule),
        select: () => reduceSelections(selections),
        rate: () => ratings
    }[mode];

    return (
        <div id="schedule" className="content-box">
            Plan zajęć
            <div id="scheduleborder" ref={borderRef}>
                <ul id="daylist">
                    <li><HourLegend/></li>
                    {days.map(function(day) {
                        return (
                            <li key={day}><ul className="daycolumn">
                                {day}
                                {hours.map(function(hour) {
                                    const slot = getSlotId(day, hour);
                                    return <ClassBox
                                        key={slot} 
                                        slot={slot} 
                                        cls={schedBySlot[slot]}
                                        selected={selections?.[slot]}
                                        rating={ratings?.[slot]}
                                        droppable={permResched ? "all" : dragged?.drops.includes(slot)}
                                        {...fwd}
                                    />
                                })}
                            </ul></li>
                        );
                    })}
                    <li><HourLegend/></li>
                </ul>
            </div>
            {dragged?.elem}
            {actions?.map((act, i) => <Button key={i} onClick={() => act.cb(getCbData())}>{act.name}</Button>)}
        </div>
    );
}

function ScheduleView() {
    const user = React.useContext(UserContext);
    const [schedule, setSchedule] = React.useState(null);
    const [ratings, setRatings] = React.useState(null);
    const [mode, setMode] = React.useState("view");
    React.useEffect(() => fetchClasses(user).then(setSchedule), [user]);
    React.useEffect(() => mode === "rate" && fetchRatings(user).then(setRatings), [user, mode]);
    if (schedule === null || (mode === "rate" && ratings === null)) {
        return <div>Loading content...</div>;
    }
    const actions = [];
    const schedProps = {actions, mode};
    if (mode === "reschedule") {
        actions.push({
            name: "Zaporoponuj zmiany",
            cb: function(chng) {
                setSchedule(null);
                pushRescheduleRequest(chng).then(() => fetchClasses().then(setSchedule));
            }
        });
    } else if (mode === "rate") {
        actions.push({
            name: "Zapisz",
            cb: function(rtings) {
                setRatings(null);
                pushRatings(rtings).then(() => fetchRatings().then(setRatings).then(() => setMode("view")));
            }
        });
        schedProps.initRatings = ratings;
    }
    return (
        <>
            <Schedule initSchedule={schedule} {...schedProps}/>
            <div>
                <Button onClick={() => setMode("view")}>Plan</Button>
                <Button onClick={() => setMode("reschedule")}>Zmiana Grup</Button>
                <Button onClick={() => setMode("rate")}>Dogodność Godzin</Button>
            </div>
        </>
    )
}

function HourLegend() {
    return (
        <ul className="hourlegend">
            &nbsp;
            {[8, 10, 12, 14, 16, 18].map(hour => <li key={hour}>{hour.toString() + ":15"}</li>)}
        </ul>
    );
}

function ClassBox({ cls, slot, mode, dispatch, dropSlots, selected, onSelect, rating, droppable, borderRef }) {
    const ref = React.useRef();
    const fwd = {mode, dispatch, rating, borderRef};
    React.useEffect(function() {
        if (droppable) {
            dropSlots.current[slot] = function(x, y) {
                const rect = ref.current.getBoundingClientRect();
                return (y > rect.top && y < rect.bottom && x > rect.left && x < rect.right);
            }
            return () => delete dropSlots.current[slot];
        }
    }, [slot, dropSlots, droppable]);
    let cont = null;
    if (cls !== undefined && cls.length !== 0) {
        cont = cls.length === 1 ? <Class {...fwd} cls={cls[0]}/> : <Collision {...fwd} cls={cls}/>;
    }
    const handlers = {};
    if (mode === "select" && selected !== undefined) {
        handlers.onClick = function() {
            dispatch({action: "toggleSelect", data: slot});
            onSelect?.(slot);
        }
    }
    if (rating !== undefined) {
        cont = <>{cont}<Rater {...fwd} slot={slot}/></>;
    }
    return <li className={"class-box" + (droppable === true || selected ? " highlight" : "")} {...handlers} ref={ref}>{cont}</li>;
}

function Class(props) {
    const typeNames = {
        "lecture": "Wykład",
        "exercise": "Ćwiczenia",
        "lab": "Lab"
    }
    const width = props.width ?? 100;
    const [{ text, prevW }, setText] = React.useState({prevW: 100});
    React.useLayoutEffect(function() {
        let newText;
        if (width >= 65) {
            newText = (<>
                {props.cls.name}<br/>
                {typeNames[props.cls.type]}<br/>
                Sala: {props.cls.room}
            </>);
        } else if (width > 18) {
            newText = <>{props.cls.name.split('').map(l => <>{l}<br/></>)}</>;
        } else {
            newText = <>I</>;
        }
        if (width > prevW) {
            const tId = setTimeout(() => setText({text: newText, prevW: width}), 100);
            return () => clearTimeout(tId);
        }
        setText({text: newText, prevW: width});
    }, [width])
    let handlers = {};
    if (props.mode === "reschedule") {
        handlers.onMouseDown = function(event) {
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            const offset = {
                x: rect.x + window.scrollX - event.pageX,
                y: rect.y + window.scrollY - event.pageY
            }
            props.dispatch?.({action: "drag", data: {
                elem: <DraggedClass cls={props.cls} initPos={{x: event.pageX, y: event.pageY}} offset={offset} dispatch={props.dispatch} borderRef={props.borderRef}/>,
                drops: props.cls.alts,
                disId: props.cls.id
            }});
        }
    }
    const style = props.cls.pend ? {opacity: 0.5} : {};
    return (<div className={props.cls.type} {...handlers} style={style}>{text}</div>);
}

function DraggedClass({ initPos, cls, offset: {x: ox, y: oy}, dispatch, borderRef }) {
    const ref = React.useRef();
    const { x, y } = useMousePos(initPos);
    const { width, height } = ref.current?.getBoundingClientRect() ?? {width: 0, height: 0};
    const { top: borderTop, left: borderLeft, bottom: borderBottom, right: borderRight } = borderRef.current.getBoundingClientRect();
    const leftPos = Math.min(Math.max(x + ox, borderLeft + window.scrollX), borderRight + window.scrollX - width);
    const topPos = Math.min(Math.max(y + oy, borderTop + window.scrollY), borderBottom + window.scrollY - height);
    return (<div className="class-box" style={{
        position: "absolute",
        left: leftPos,
        top: topPos
    }} ref={ref} onMouseUp={function() {
        const {top, bottom, left, right} = ref.current.getBoundingClientRect();
        dispatch({action: "endDrag", data: {y: (top + bottom) / 2, x: (left + right) / 2, id: cls.id}})
    }}>
        <Class cls={cls}/>
    </div>);
}

function Collision({ cls: clss, mode, dispatch, borderRef }) {
    const eqWidth = 100/clss.length;
    const fWidth = 65;
    const ufWidth = 35/(clss.length - 1);
    const [focused, setFocused] = React.useState(null);
    return (
        <div onMouseLeave={() => setFocused(null)} style={{height: "100%"}}>
            {clss.map(function(cls, i) {
                const width = focused === null ? eqWidth : (i === focused ? fWidth : ufWidth);
                const fwd = {cls, width, mode, dispatch, borderRef};
                return (
                    <div key={i} className="shrunk-box" onMouseEnter={() => setFocused(i)} style={{maxWidth: `${width}%`}}>
                        <Class {...fwd}/>
                    </div>
                );
            })}
        </div>
    );
}

function Rater({ dispatch, slot, rating, mode }) {
    let cont = rating;
    mode === "rate" && (cont = (
        <>
            <Button onClick={() => dispatch({action: "rerate", data: {slot, rating: rating - 1}})}>-</Button>
            {cont}
            <Button onClick={() => dispatch({action: "rerate", data: {slot, rating: rating + 1}})}>+</Button>
        </>
    ));
    return <div className='rater'>{cont}</div>;
}

export function expandSelection(sel) {
    const fullSel = {};
    
    Array.from(Array(30).keys()).forEach(i => {fullSel[i] = false});
    console.log(Array(10));
    console.log(sel);
    console.log(fullSel);
    return {...fullSel, ...sel};
}

// export function PopupSchedule({ schedProps, onClose, topRender}) {
//     return (
//         <div className="pop-up">
//             {topRender}
//             <div><Button onClick={onClose}>X</Button></div>
//             <Schedule {...schedProps}/>
//         </div>
//     );
// }

export default ScheduleView;