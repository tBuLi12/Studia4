import React from 'react';
import './Schedule.css';
import { Button, DispatchContext, WidthContext } from "./App";
import { fetchClasses, pushRescheduleRequest, pushRatings, fetchRatings, useRemoteData } from "./Remote";
import { getColor } from './Register';
const hours = ["8:15", "10:15", "12:15", "14:15", "16:15", "18:15"];
const days = ["poniedzialek", "wtorek", "sroda", "czwartek", "piatek"];

function getSlotId(day, hour) {
    return (1 + hours.indexOf(hour) + days.indexOf(day)*6).toString();
}

export function getSlotName(id) {
    return days[Math.floor((id-1) / 6)] + " " + hours[(id-1) % 6];
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
            let pNewSched = null;
            for (const [slot, clb] of Object.entries(state.dropSlots.current)) {
                if (clb(x, y)) {
                    pNewSched = JSON.parse(JSON.stringify(state.schedule));
                    pNewSched[id].resched = slot;
                    if (pNewSched[id].slot === slot) {
                        delete pNewSched[id].resched;
                    }
                    break;
                }
            }
            return {...state, dragged: null, schedule: pNewSched ?? state.schedule};
        case "resched":
            if (!(state.permResched || state.dragged?.drops.includes(data))) {
                return {...state, dragged: null};
            }
            const newSched = JSON.parse(JSON.stringify(state.schedule));
            newSched[state.dragged.id].resched = data;
            if (newSched[state.dragged.id].slot === data) {
                delete newSched[state.dragged.id].resched;
            }
            return {...state, dragged: null, schedule: newSched};
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
        case "shift":
            return {...state, shitf: Math.min(Math.max(state.shitf + data, 0), 4)}
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
            id !== disId && (sbs[cls.resched ?? cls.slot] ?? (sbs[cls.resched ?? cls.slot] = [])).push(cls);
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

function scheduleDiff(inital, current, permResched) {
    const changes = {};
    for (const [id, cls] of Object.entries(current)) {
        if ((cls.resched ?? cls.slot) !== (inital[id].resched ?? inital[id].slot)) {
            const toSlot = cls.resched ?? cls.slot;
            if(permResched) {
                changes[id] = toSlot;
            } else {
                for (const { clsId, id: toSlotId } of cls.alts) {
                    if (toSlot === toSlotId) {
                        changes[id] = clsId;
                        break;
                    }
                }
            }
        }
    }
    return changes;
}

export function Schedule({ initSchedule, initRatings, initSelections, onSelect, disabledSlots, mode, actions, permResched, setDataPusher, title }) {
    const dropSlots = React.useRef({});
    const swipeX = React.useRef(null);
    const windWith = React.useContext(WidthContext);
    const registerDropSlot = React.useCallback((slot, cb, unsub) => unsub ? (delete dropSlots.current[slot]) : (dropSlots.current[slot] = cb), []);
    const borderRef = React.useRef();
    const [{ schedule, selections, ratings, dragged, shitf: shift }, dispatch] = React.useReducer(schedStateReducer, {
        schedule: initSchedule,
        selections: initSelections,
        ratings: initRatings,
        dragged: null,
        shitf: 0,
        dropSlots,
        permResched
    });
    React.useEffect(() => dispatch({action: "setSchedule", data: initSchedule}), [initSchedule]);
    React.useEffect(() => dispatch({action: "setSelections", data: initSelections}), [initSelections]);
    React.useEffect(() => dispatch({action: "setRatings", data: initRatings}), [initRatings]);
    const schedBySlot = React.useMemo(() => transformSchedule(schedule, permResched, dragged?.disId), [schedule, permResched, dragged]);

    const fwd = {mode, dispatch, registerDropSlot, onSelect, borderRef};
    const getCbData = {
        reschedule: () => scheduleDiff(initSchedule, schedule, permResched),
        select: () => reduceSelections(selections),
        rate: () => ratings
    }[mode];
    React.useEffect(() => setDataPusher?.(getCbData));
    if (windWith < 700) {
        if (fwd.mode === "reschedule") {
            fwd.mode = "reschedule-select";
            if (dragged) {
                fwd.onSelect = function(slot) {
                    dispatch({action: "resched", data: slot})
                }
            }
        }
        return (
            <div id="schedule" className="content-box" style={{overflow: "hidden", minWidth: 0}}> 
                {title}
                <div id="scheduleborder" ref={borderRef} onPointerDown={event => swipeX.current = event.clientX} onPointerCancel={() => swipeX.current = null} onPointerUp={function(event) {
                    if (swipeX.current) {
                        const len = event.clientX - swipeX.current;
                        if (len*6 > windWith) {
                            dispatch({action: "shift", data: -1});
                        } else if (len*(-6) > windWith) {
                            dispatch({action: "shift", data: 1});
                        }
                        swipeX.current = null;
                    }
                }}>
                    <HourLegend opacity={shift === 0 ? "0" : "1"}/>
                    <div id="daylist-box-grad">
                    <div className='slide-button' onClick={() => dispatch({action: "shift", data: -1})} style={{opacity: shift === 0 ? "0" : "1"}}>&lt;</div>
                    <div id="daylist-box" style={{transform: `translateX(-${100*shift}%)`}}>
                        <ul id="daylist">
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
                                                selected={mode === "reschedule" ? (dragged?.drops?.includes(slot) ?? false) : selections?.[slot]}
                                                rating={ratings?.[slot]}
                                                droppable={permResched ? "all" : dragged?.drops.includes(slot)}
                                                disabled={disabledSlots?.has(slot)}
                                                {...fwd}
                                            />
                                        })}
                                    </ul></li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className='slide-button' onClick={() => dispatch({action: "shift", data: 1})} style={{opacity: shift === 4 ? "0" : "1"}}>&gt;</div>
                    </div>
                    <HourLegend opacity={shift === 4 ? "0" : "1"}/>
                </div>
                {dragged?.elem}
                {actions?.map((act, i) => <Button key={i} {...(act.btProps ?? {})} onClick={() => act.cb(getCbData())}>{act.name}</Button>)}
            </div>
        );
    }
    return (
        <div id="schedule" className="content-box">
            {title}
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
                                        disabled={disabledSlots?.has(slot)}
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
            {actions?.map((act, i) => <Button key={i} {...(act.btProps ?? {})} onClick={() => act.cb(getCbData())}>{act.name}</Button>)}
        </div>
    );
}

function ScheduleView() {
    console.log("sched view rerenders");
    const dispatch = React.useContext(DispatchContext);
    const [mode, setMode] = React.useState("view");
    const [{ schedule, hasAlts}, setSchedule] = React.useState({schedule: undefined, hasAlts: false});
    const [ratings, refreshRts, setRatings] = useRemoteData(fetchRatings, mode === "rate");
    React.useEffect(function() {
        if (mode === "reschedule") {
            (schedule === undefined || !hasAlts) && fetchClasses(true).then(function(sched) {
                setSchedule({schedule: sched, hasAlts: true});
            }, err => dispatch({action: "error", data: err}));
        } else {
            (schedule === undefined) && fetchClasses().then(sched => setSchedule({schedule: sched, hasAlts: false}), err => dispatch({action: "error", data: err}));
        }
    }, [schedule, hasAlts, mode, dispatch]);
    if (!schedule || (mode === "rate" && ratings === undefined) || (mode === "reschedule" && !hasAlts)) {
        return <div>Loading content...</div>;
    }
    const actions = [];
    const schedProps = {actions, mode, title: "Plan Zajęć"};
    if (mode === "reschedule") {
        actions.push({
            name: "Zaporoponuj zmiany",
            cb: function(chng) {
                setMode("view");
                setSchedule({schedule: null, hasAlts: false});
                pushRescheduleRequest(chng).then(() => fetchClasses()).then(sched => setSchedule({schedule: sched, hasAlts: false}), err => dispatch({action: "error", data: err}));
            }
        });
    } else if (mode === "rate") {
        actions.push({
            name: "Zapisz",
            cb: function(rtings) {
                setMode("view");
                setRatings(undefined);
                pushRatings(rtings).then(refreshRts, err => dispatch({action: "popupError", data: err}));
            }
        });
        schedProps.initRatings = ratings;
    }
    return (
        <>
            <Schedule initSchedule={schedule} {...schedProps}/>
            <div className='buttons-below-sched'>
                <Button onClick={() => setMode("view")}>Plan</Button>
                <Button onClick={() => setMode("reschedule")}>Zmiana Grup</Button>
                <Button onClick={() => setMode("rate")}>Dogodność Godzin</Button>
            </div>
        </>
    )
}

function HourLegend({ opacity }) {
    const style = {};
    opacity && (style.opacity = opacity);
    return (
        <ul className="hourlegend" style={style}>
            &nbsp;
            {[8, 10, 12, 14, 16, 18].map(hour => <li key={hour}>{hour + ":15"}</li>)}
        </ul>
    );
}

function ClassBox({ cls, slot, mode, dispatch, registerDropSlot, selected, onSelect, rating, droppable, disabled, borderRef }) {
    const ref = React.useRef();
    const fwd = {mode, dispatch, rating, borderRef};
    React.useEffect(function() {
        if (droppable) {
            registerDropSlot(slot, function(x, y) {
                const rect = ref.current.getBoundingClientRect();
                return (y > rect.top && y < rect.bottom && x > rect.left && x < rect.right);
            }, false);
            return () => registerDropSlot(slot, null, true);
        }
    }, [slot, registerDropSlot, droppable]);
    let cont = null;
    if (rating !== undefined) {
        cont = <Rater {...fwd} slot={slot} cls={cls}/>;
    } else if (cls !== undefined && cls.length !== 0) {
        cont = cls.length === 1 ? <Class {...fwd} cls={cls[0]}/> : <Collision {...fwd} cls={cls}/>;
    }
    const handlers = {};
    if ((mode === "select" || mode === "reschedule-select") && selected !== undefined) {
        handlers.onClick = function() {
            mode === "select" && dispatch({action: "toggleSelect", data: slot});
            onSelect?.(slot);
        }
    }
    let clsName = "class-box";
    if (droppable === true || selected) {
        clsName = clsName.concat(disabled ? " selected-disabled" : " highlight");
    } else if (disabled) {
        clsName = clsName.concat(" disabled-slot");
    }
    return <li className={clsName} {...handlers} ref={ref}>{cont}</li>;
}

function Class(props) {
    const width = props.width ?? 100;
    const [{ text, prevW }, setText] = React.useState({prevW: 100});
    React.useLayoutEffect(function() {
        let newText;
        if (width >= 65) {
            newText = (<>
                {props.cls.name}<br/>
                {props.cls.type}<br/>
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
    }, [width, prevW, props.cls.name, props.cls.type, props.cls.room])
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
                drops: props.cls.alts?.map(alt => alt.id),
                disId: props.cls.id
            }});
        }
    } else if (props.mode === "reschedule-select") {
        handlers.onClick = function() {
            props.dispatch?.({action: "drag", data: {
                drops: props.cls.alts?.map(alt => alt.id),
                id: props.cls.id
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
    return (<div className="class-box dragged-class" style={{
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
    const ref = React.useRef();
    const [focused, setFocused] = React.useState(null);
    
    // onMouseLeave has issues with draggables, so onMouseMove must be used
    // onMouseLeave is still used, to handle the overflow case in "rate" mode
    React.useEffect(function() {
        function onMove(event) {
            const { clientX: mx, clientY: my} = event;
            const {top, bottom, left, right} = ref.current.getBoundingClientRect();
            if (my < top || my > bottom || mx < left || mx > right) {
                setFocused(null);
            }
        }
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, [])

    return (
        <div ref={ref} style={{height: "100%"}} onMouseLeave={() => setFocused(null)}>
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

function Rater({ dispatch, slot, rating, mode, cls, borderRef }) {
    const [clsExpanded, setExpanded] = React.useState(false);
    let cont = null;
    if (mode !== "rate") {
        cont = <div className='rating' style={{textShadow: `0 0 0.3em ${getColor(rating / 6)}`, width: "100%"}}>{rating}</div>;
    } else {
        cont = (
            <>
                <div className='rating' style={{textShadow: `0 0 0.3em ${getColor(rating / 6)}`}}>{rating}</div>
                <div className='rater-button-box'>
                    <div className='rater-button' onClick={() => dispatch({action: "rerate", data: {slot, rating: Math.min(6, rating + 1)}})}>+</div>
                    <div className='rater-button' onClick={() => dispatch({action: "rerate", data: {slot, rating: Math.max(0, rating - 1)}})}>-</div>
                </div>
            </>
        )
    }
    if (cls) {
        const fwd = {mode, borderRef, dispatch};
        const clsElem = cls.length === 1 ? <Class {...fwd} cls={cls[0]}/> : <Collision {...fwd} cls={cls}/>;
        return (<>
            <div className='rater' style={{maxHeight: clsExpanded ? "0" : "62%"}}>
                {cont}
            </div>
            <div style={{height: "100%"}} onClick={() => setExpanded(e => !e)} onMouseLeave={() => setExpanded(false)}>
                {clsElem}
            </div>
        </>);
    }
    return <div className='rater'>{cont}</div>;
}

export function expandSelection(sel) {
    const fullSel = {};
    Array.from(Array(30).keys()).forEach(i => {fullSel[i+1] = false});
    return {...fullSel, ...sel};
}

export default ScheduleView;