import React from 'react';
import { DispatchContext } from './App';
const dummyData = true;
const pageAt = "http://" + document.location.host;

class ServerError extends Error {
    constructor(response) {
        super("An error on the server prevented fetching resources");
        this.name = "ServerError";
        this.response = response;
    }
}

class ClientError extends Error {
    constructor(response) {
        super("A problem with the page's request prevented fetching resources");
        this.name = "ClientError";
        this.response = response;
    }
}

class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthenticationError";
    }
}

function verifyResponse(response) {
    if (response.status < 400) {
        return null;
    }
    if (response.status === 401) {
        throw new AuthenticationError("Not logged in");
    }
    if (response.status < 500) {
        throw new ClientError(response);
    }
    throw new ServerError(response)
}

export function useRemoteData(fetcher, required) {
    const dispatch = React.useContext(DispatchContext);
    const [data, setData] = React.useState(undefined);
    const refresh = React.useCallback(function() {
        setData(undefined);
        fetcher().then(setData, err => dispatch({action: "error", data: err}));
    }, [fetcher, dispatch])
    React.useEffect(() => (required ?? true) && data === undefined && refresh(), [refresh, required, data]);
    return [data, refresh, setData];
}

// there are two different login requests here because we did not
// manage to alter the default behaviour of SpringSecurity responses
export async function login(username, passowrd) {
    const loginData = new FormData();
    loginData.append("username", username);
    loginData.append("password", passowrd);
    await fetch(pageAt + "/login", {method: 'POST', body: loginData});
    return null;
}

export async function fetchUser() {
    if (dummyData) {
        return new Promise(r => setTimeout(() => r({username: "default", security: "ROLE_ADMIN", position: "ROLE_STUDENT"}), 500));
    }
    const res = await fetch(pageAt + "/logged");
    if (res.status === 401) {
        return false;
    }
    verifyResponse(res);
    return await res.json();
}

export async function fetchCourses() {
    if (dummyData) {
        return [
            {
                name: "WSI",
                id: "0"
            },
            {
                name: "pap",
                id: "1"
            }
        ]
    }
    const res = await fetch(pageAt + "/courses");
    verifyResponse(res);
    return await res.json();
}

export async function fetchClasses(alts) {
    if (dummyData) {
        return {
            0: {
                name: "WSI",
                slot: "2",
                room: "98",
                id: "0",
                type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
                alts: [{id: "2", clsId: "0"}, {id: "29", clsId: "8"}]
            },
            1: {
                name: "SI",
                slot: "2",
                room: "98",
                id: "1",
                type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
                alts: []
            },
            2: {
                name: "Wsi",
                slot: "2",
                room: "11",
                id: "2",
                type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
                alts: []
            },
            3: {
                name: "nji",
                slot: "26",
                room: "98",
                id: "3",
                type: "Laboratorium",
                alts: []
            }
        };
    }
    const url = new URL(pageAt + "/classes");
    alts && url.searchParams.append("flag", "alts");
    const res = await fetch(url);
    verifyResponse(res);
    const classes = await res.json();
    const schedObj = {};
    classes.forEach(({ name, id, roomNumber, class_type, timeSlotID, requestedTimeSlotID }) => schedObj[id] = {
        name,
        id,
        room: roomNumber,
        type: class_type,
        slot: timeSlotID.toString(),
        resched: requestedTimeSlotID
    });
    if (alts) {
        classes.forEach(({ id, alternatives }) => schedObj[id].alts = alternatives.map(({ timeSlotID, classID }) => ({id: timeSlotID, clsId: classID})));
    }
    return schedObj;
}

export async function fetchRatings() {
    if (dummyData) {
        return ({
            "2": 0,
            "26": 2,
            "1": 2,
        });
    }
    const res = await fetch(pageAt + "/ratings");
    verifyResponse(res);
    const ratingsObj = {};
    (await res.json()).forEach(({ timeSlotID, rating }) => {ratingsObj[timeSlotID] = rating})
    return ratingsObj;
}

export async function pushRescheduleRequest(changes) {
    if (dummyData) {
        console.log(changes);
        return true;
    }
    const data = new FormData();
    const froms = [];
    const tos = []
    for (const [from, to] of Object.entries(changes)) {
        froms.push(from);
        tos.push(to);
    }
    data.append("froms", froms);
    data.append("tos", tos);
    const res = await fetch(pageAt + "/add-reschedule", {method: 'POST', body: data});
    verifyResponse(res);
    return true;
}

export async function pushRatings(ratingsObj) {
    if (dummyData) {
        return true;
    }
    const data = new FormData();
    const slots = [];
    const ratings = []
    for (const [slot, rating] of Object.entries(ratingsObj)) {
        slots.push(slot);
        ratings.push(rating);
    }
    data.append("slotIDs", slots);
    data.append("ratings", ratings);
    const res = await fetch(pageAt + "/add-ratings", {method: 'POST', body: data});
    verifyResponse(res);
    return true;
}

export async function approveRequest(id) {
    console.log(id);
    return new Promise(resolve => setTimeout(() => resolve(true), 2000));
}

export async function declineRequest(id) {
    console.log(id);
    return new Promise((resolve, reject) => setTimeout(() => reject(new ServerError(null)), 2000));
}

export async function removePoll(id) {
    if (dummyData) {
        return true;
    }
    const data = new FormData();
    data.append("pollID", id);
    const res = await fetch(pageAt + "/delete-poll", {method: 'POST', body: data});
    verifyResponse(res);
    return true;
}

export async function addPoll(name, slots, groups) {
    if (dummyData) {
        return {
            id: (new Date()).getTime(),
            name
        };
    }
    const data = new FormData();
    data.append("name", name);
    data.append("slots", Array.from(slots));
    data.append("classIDs", groups.map(gr => gr.id));
    const res = await fetch(pageAt + "/add-poll", {method: 'POST', body: data});
    verifyResponse(res);
    const poll = await res.json();
    return {id: poll.pollID, name: poll.pollName};
}

export async function subjectRegister(id) {
    return true;
}

export async function classRegister(sbjId, slot) {
    return true;
}

export async function fetchCoursesRegister() {
    return [{
        name: "WSI",
        id: "0",
    },
    {
        name: "SOI",
        id: "2",
        slots: [1, 2, 5]
    },
    {
        name: "PAP",
        id: "3",
    },
    {
        name: "PROB",
        id: "4",
    }];
}

export async function resolvePoll(id) {
    if (dummyData) {
        return {
            "2": 13,
            "15": 10,
        }
    }
    const url = new URL(pageAt + "/poll-result");
    url.searchParams.append("pollID", id);
    const res = await fetch(url);
    verifyResponse(res);
    const slotRts = await res.json();
    const rObj = {};
    slotRts.forEach(s => rObj[s.slotId] = s.rating);
    return rObj;
}

export async function votePoll(id, rts) {
    if (dummyData) {
        return true;
    }
    const data = new FormData();
    data.append("pollId", id);
    data.append("slotIds", Object.keys(rts));
    data.append("ratings", Object.values(rts));
    const res = await fetch(pageAt + "/vote-poll", {method: 'POST', body: data});
    verifyResponse(res);
    return true;
}

export async function fetchGrades(user) {
    return ([{
        name: "WSI",
        grade: 3
    },
    {
        name: "SOI",
        grade: -10
    }
    ])
}

export async function fetchRequests(user) {
    return ([{
        id: "0",
        cls: {
            name: "WSI",
            type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
        },
        stud: "Jeremi Sobierski",
        to: "3"
    },
    {
        id: "1",
        cls: {
            name: "SOI",
            type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
        },
        stud: "Karol Orzechowski",
        to: "25"
    }
    ])
}

export async function fetchPolls() {
    if (dummyData) {
        return ([{
            name: "ankk",
            id: "0"
        },
        {
            name: "yyyy",
            id: "1"
        }
        ])
    }
    const res = await fetch(pageAt + "/polls");
    verifyResponse(res);
    const polls = await res.json();
    return polls.map(({ pollName, pollID }) => ({name: pollName, id: pollID}));
}

export async function fetchGroups() {
    if (dummyData) {
        return ([{
            name: "WSI",
            id: "0",
        },
        {
            name: "SOI - lab",
            id: "1",
        },
        {
            name: "Grupa I2",
            id: "0",
        }
        ]);
    }
    const url = new URL(pageAt + "/classes")
    url.searchParams.append("flag", "all");
    const res = await fetch(url);
    verifyResponse(res);
    return (await res.json()).map(({ name, id, class_type }) => ({name: (name + " " + class_type), id}));
}

export async function fetchIntersect(groups) {
    if (dummyData) {
        return ({
            "8": true,
            "12": true,
        });
    }
    const data = new FormData();
    data.append("classIDs", groups.map(grp => grp.id));
    const res = await fetch(pageAt + "/intersect", {method: 'POST', body: data});
    verifyResponse(res);
    const slots = {};
    (await res.json()).forEach(slt => slots[slt] = true);
    return slots;
}

export async function fetchGroupSchedule(groups) {
    return {
        0: {
            name: "WSI",
            slot: "2",
            room: "98",
            id: "0",
            type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
        },
        1: {
            name: "SI",
            slot: "2",
            room: "98",
            id: "1",
            type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
        },
        2: {
            name: "Wsi",
            slot: "2",
            room: "11",
            id: "2",
            type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
        },
        3: {
            name: "nji",
            slot: "10",
            room: "98",
            id: "3",
            type: "Laboratorium",
        }
    };
}

export async function fetchPollSlots(id) {
    return {"0": 3, "22": 4};
}

export async function fetchNews() {
    return [
        {
            title: "Som news",
            text: "yyyyyyysapidfj aijsd 0iasj d0asdjo asj"
        },
        {
            title: "Hee",
            text: "0aijsdiwef0u82hgfy23h8irj1jkfi0owshdfsgbfhidb"
        }
    ]
}

export async function fetchWorkers() {
    return [
        {
            name: "Ewa S.",
            id: "0"
        },
        {
            name: "Peter Gawkuu",
            id: "1"
        }
    ];
}

export async function fetchWorkerInfo(id) {
    return {
        text: "Jakieś info o panu pracowniku"
    };
}