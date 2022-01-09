import React from 'react';
import './Schedule.css';
import { Button, UserContext } from "./App";
import { fetchAndSetClasses, pushRescheduleRequest, pushRatings, fetchAndSetRatings } from "./Remote";
 
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
        case "reschedule":
            const newSched = JSON.parse(JSON.stringify(state.schedule));
            (newSched[data.to] ?? (newSched[data.to] = [])).push(newSched[data.from].splice(data.i, 1)[0]);
            if (newSched[data.from].length === 0) {
                delete newSched[data.from];
            }
            return {...state, schedule: newSched};
        case "drag":
            return {...state, dragged: data};
        case "endDrag":
            return {...state, dragged: null};
        default:
            return state;
    }
}

function Schedule({ initSchedule, initRatings, toSelect, selectSingle, permResched, mode, actions }) {
    const dropSlots = React.useRef({});
    const changes = React.useRef({});
    const draggedFromSlot = React.useRef(null);
    const ratings = React.useRef(initRatings);
    const selectedSlots = React.useRef(new Set());
    const [{ schedule, dragged }, dispatchToReducer] = React.useReducer(schedStateReducer, {
        schedule: initSchedule,
        dragged: null,
    });

    const dispatch = React.useCallback(function({ action, data }) {
        switch(action) {
            case "drag":
                draggedFromSlot.current = {slot: data.slot, i: data.i};
                dispatchToReducer({action, data});
                break;
            case "endDrag":
                // const x = data.x + window.scrollX;
                // const y = data.y + window.scrollY;
                const { x, y, id } = data;
                for (const [slot, clb] of Object.entries(dropSlots.current)) {
                    if (clb(x, y)) {
                        changes.current[id] = slot;
                        initSchedule[slot]?.forEach(cls => cls.id === id && (delete changes.current[id]));
                        dispatchToReducer({
                            action: "reschedule",
                            data: {
                                from: draggedFromSlot.current.slot,
                                i: draggedFromSlot.current.i,
                                to: slot
                            }
                        })
                        break;
                    }
                }
                dispatchToReducer({action});
                break;
            case "toggleSelect":
                selectedSlots.current.delete(data) || selectedSlots.current.add(data);
                break;
            case "rerate":
                ratings.current[data.slot] = data.rating;
                break;
            default:
                dispatchToReducer({action, data});
        }
    }, [])

    const fwd = {mode, dispatch, dropSlots};
    const hours = ["8:15", "10:15", "12:15", "14:15", "16:15", "18:15"];
    const days = ["poniedzialek", "wtorek", "sroda", "czwartek", "piatek"];
    const cbData = {
        "reschedule": changes.current,
        "select": selectedSlots.current,
        "rate": ratings.current
    }[mode];

    // React.useEffect(function() {
    //     fetchAndSetClasses(user, sched => dispatch({action: "setSchedule", data: sched}));
    // }, [user, dispatch]);

    // React.useEffect(function() {
    //     if (mode === "rate") {
    //         fetchAndSetRatings(user, rts => dispatch({action: "setRatings", data: rts}));
    //     }
    // }, [user, dispatch, mode]);
    return (
        <div id="schedule">
            Plan zajęć
            <div id="scheduleborder">
                <ul id="daylist">
                    <li><HourLegend/></li>
                    {days.map(function(day) {
                        return (
                            <li key={day}><ul className="daycolumn">
                                {day}
                                {hours.map(hour => (
                                    <ClassBox
                                        key={day+hour} 
                                        slot={day+hour} 
                                        cls={schedule[day+hour]}
                                        actionData={{
                                            "reschedule": dragged?.drops.includes(day+hour),
                                            "select": toSelect?.has(day+hour),
                                            "rate": initRatings?.[day+hour] 
                                        }[mode]}
                                        {...fwd}
                                    />
                                ))}
                            </ul></li>
                        );
                    })}
                    <li><HourLegend/></li>
                </ul>
            </div>
            {dragged?.elem}
            {actions.map((act, i) => <Button key={i} onClick={() => act.cb(cbData)}>{act.name}</Button>)}
        </div>
    );
}

function ScheduleView() {
    const user = React.useContext(UserContext);
    const [schedule, setSchedule] = React.useState(null);
    const [ratings, setRatings] = React.useState(null);
    const [mode, setMode] = React.useState("view");
    React.useEffect(() => schedule === null && fetchAndSetClasses(user, setSchedule), [user]);
    React.useEffect(() => mode === "rate" && ratings === null && fetchAndSetRatings(user, setRatings), [user, mode]);
    if (schedule === null || (mode === "rate" && ratings === null)) {
        return <div>Loading content...</div>;
    }
    const actions = [];
    const schedProps = {actions, mode};
    if (mode === "reschedule") {
        actions.push({
            name: "Zaporoponuj zmiany",
            cb: function(chng) {
                pushRescheduleRequest(user, chng);
                setMode("view");
            }
        });
    } else if (mode === "rate") {
        actions.push({
            name: "Zapisz",
            cb: function(rtings) {
                pushRatings(user, rtings);
                setMode("view");
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

function ClassBox({ cls, slot, mode, dispatch, dropSlots, actionData }) {
    const ref = React.useRef();
    const [selected, setSelected] = React.useState(false);
    const fwd = {slot, mode, dispatch};
    React.useEffect(function() {
        if (mode === "reschedule" && actionData) {
            dropSlots.current[slot] = function(x, y) {
                const rect = ref.current.getBoundingClientRect();
                return (y > rect.top && y < rect.bottom && x > rect.left && x < rect.right);
            }
            return () => delete dropSlots.current[slot];
        }
    }, [slot, dropSlots, mode, actionData]);
    let cont = null;
    if (cls !== undefined && cls.length !== 0) {
        cont = cls.length === 1 ? <Class {...fwd} i={0} cls={cls[0]}/> : <Collision {...fwd} cls={cls}/>;
    }
    const handlers = {};
    if (mode === "select" && actionData) {
        handlers.onClick = function() {
            dispatch({action: "toggleSelect", data: slot});
            setSelected(sel => !sel);
        }
    }
    if (mode === "rate" && actionData !== undefined) {
        cont = <>{cont}<Rater initRating={actionData} {...fwd}/></>
    }
    return <li className={"class-box" + ((mode === "reschedule" && actionData) || selected ? " highlight" : "")} {...handlers} ref={ref}>{cont}</li>;
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
                elem: <DraggedClass cls={props.cls} initPos={{x: event.pageX, y: event.pageY}} offset={offset} dispatch={props.dispatch}/>,
                slot: props.slot,
                i: props.i,
                drops: props.cls.alts,
            }});
        }
    }
    return (<div className={props.cls.type} {...handlers}>{text}</div>);
}

function DraggedClass({ initPos, cls, offset: {x: ox, y: oy}, dispatch }) {
    const ref = React.useRef();
    const { x, y } = useMousePos(initPos);
    return (<div className="class-box" style={{
        position: "absolute",
        left: x + ox,
        top: y + oy
    }} ref={ref} onMouseUp={function() {
        const {top, bottom, left, right} = ref.current.getBoundingClientRect();
        dispatch({action: "endDrag", data: {y: (top + bottom) / 2, x: (left + right) / 2, id: cls.id}})
    }}>
        <Class cls={cls}/>
    </div>);
}

function Collision({ cls: clss, slot, mode, dispatch }) {
    const eqWidth = 100/clss.length;
    const fWidth = 65;
    const ufWidth = 35/(clss.length - 1);
    const [focused, setFocused] = React.useState(null);
    return (
        <div onMouseLeave={() => setFocused(null)} style={{height: "100%"}}>
            {clss.map(function(cls, i) {
                const width = focused === null ? eqWidth : (i === focused ? fWidth : ufWidth);
                const fwd = {cls, i, width, mode, dispatch, slot};
                return (
                    <div key={i} className="shrunk-box" onMouseEnter={() => setFocused(i)} style={{maxWidth: `${width}%`}}>
                        <Class {...fwd}/>
                    </div>
                );
            })}
        </div>
    );
}

function Rater({ initRating, dispatch, slot }) {
    const [rating, setRating] = React.useState(initRating);
    React.useEffect(() => dispatch({action: "rerate", data: {slot, rating}}));
    return (
        <div className='rater'>
            <Button onClick={() => setRating(prev => prev - 1)}>-</Button>
            {rating}
            <Button onClick={() => setRating(prev => prev + 1)}>+</Button>
        </div>
    );
}

export default ScheduleView;