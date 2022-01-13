import React from 'react';
const dummyData = false;

export function useRemoteData(fetcher) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => fetcher().then(setData).catch(alert), [fetcher]);
    return data;
}

export async function login(username, passowrd) {
    console.log("entered async");
    if (dummyData) {
        return "me";
    }
    const loginData = new FormData();
    loginData.append("username", username);
    loginData.append("password", passowrd);
    console.log("created logging from");
    const loginRes = await fetch("http://" + document.location.host + "/login", {method: 'POST', body: loginData});
    if (loginRes.status === 404) {
        throw "Login failed";
    }
    return await fetch("http://" + document.location.host + "/logged")
        .then(res => res.json()).catch(alert);
}

export async function fetchCourses() {
    if (dummyData) {
        return [
            {
                name: "WSI",
                id: 0
            },
            {
                name: "pap",
                id: 1
            }
        ]
    }
    return await fetch("http://" + document.location.host + "/classes").then(res => res.json());
}

export async function fetchClasses() {
    if (dummyData) {
        return {
            0: {
                name: "WSI",
                slot: "2",
                room: "98",
                id: 0,
                type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
                alts: ["2", "29"]
            },
            1: {
                name: "SI",
                slot: "2",
                room: "98",
                id: 1,
                type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
                alts: []
            },
            2: {
                name: "Wsi",
                slot: "2",
                room: "11",
                id: 2,
                type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
                alts: []
            },
            3: {
                name: "nji",
                slot: "26",
                room: "98",
                id: 3,
                type: "Laboratorium",
                alts: []
            }
        };
    }
    const url = new URL("http://" + document.location.host + "/classes");
    url.searchParams.append("flag", "1");
    console.log("schedule requested");
    const classes = await fetch(url).then(res => res.json());
    console.log("Classes obtained");
    console.log(classes);
    const schedObj = {};
    classes.forEach(({ name, id, roomNumber, class_type, timeSlotID }) => schedObj[id] = {
        name,
        id,
        room: roomNumber,
        type: class_type,
        slot: timeSlotID
    });
    console.log("transformed schedule:");
    console.log(schedObj);
    return schedObj;
}

export async function fetchRatings() {

    // [[1, 2], [1, 2]]
    // {1: 2, 1: 2}
    return ({
        "2": 0,
        "5": 2,
        "1": 2,
    });
}

export async function pushRescheduleRequest(changes) {
    console.log(changes);
    return true;
}

export async function pushRatings(ratings) {
    console.log(ratings);
    return true;
}

export async function approveRequest(id) {
    console.log(id);
    return new Promise(resolve => setTimeout(() => resolve(true), 2000));
}

export async function declineRequest(id) {
    console.log(id);
    return new Promise((resolve, reject) => setTimeout(() => reject("dupa"), 2000));
}

export async function removePoll(id) {
    if (dummyData) {
        return true;
    }
    const data = new FormData();
    data.append("pollID", id);
    const res = await fetch("http://" + document.location.host + "/delete-poll", {method: 'POST', body: data});
    console.log(res.status);
    return res.status;
}

export async function addPoll(name, slots) {
    if (dummyData) {
        return true;
    }
    const data = new FormData();
    data.append("name", name);
    data.append("slots", Array.from(slots));
    const res = await fetch("http://" + document.location.host + "/add-poll", {method: 'POST', body: data});
    console.log(res.status);
    return true;
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
        id: 0,
    },
    {
        name: "SOI",
        id: 2,
        slots: [1, 2, 5]
    },
    {
        name: "PAP",
        id: 3,
    },
    {
        name: "PROB",
        id: 4,
    }];
}

export async function resolvePoll(id) {
    if (dummyData) {
        return {
            "2": 13,
            "15": 10,
        }
    }
    const url = new URL("http://" + document.location.host + "/poll-result");
    url.searchParams.append("pollID", id);
    const res = await fetch(url);
    const slotRts = await res.json();
    const rObj = {};
    slotRts.forEach(s => rObj[s.slotId] = s.rating);
    return slotRts;
}

export async function votePoll(id, rts) {
    if (dummyData) {
        return true;
    }
    const data = new FormData();
    data.append("pollId", id);
    data.append("slotIds", Object.keys(rts));
    data.append("ratings", Object.values(rts));
    const res = await fetch("http://" + document.location.host + "/vote-poll", {method: 'POST', body: data});
    console.log(res.status);
    return res.status;
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
        id: 0,
        cls: {
            name: "WSI",
            type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
        },
        stud: "Jeremi S",
        to: "3"
    },
    {
        id: 1,
        cls: {
            name: "SOI",
            type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
        },
        stud: "Karol O",
        to: "25"
    }
    ])
}

export async function fetchPolls() {
    if (dummyData) {
        return ([{
            name: "dupa",
            id: 0
        },
        {
            name: "yyyy",
            id: 1
        }
        ])
    }
    const res = await fetch("http://" + document.location.host + "/polls");
    const polls = await res.json();
    console.log(polls);
    return polls.map(({ pollName, pollID }) => ({name: pollName, id: pollID}));
}

export async function fetchGroups(user) {
    return ([{
        name: "WSI",
        id: 0,
        type: "Przedmiot"
    },
    {
        name: "SOI - lab",
        id: 1,
        type: "Zajecia"
    },
    {
        name: "Grupa I2",
        id: 0,
        type: "Grupa"
    }
    ])
}

export async function fetchIntersect(groups) {
    return ({
        "8": true,
        "12": true,
    })
}

export async function fetchGroupSchedule(groups) {
    return {
        0: {
            name: "WSI",
            slot: "2",
            room: "98",
            id: 0,
            type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
        },
        1: {
            name: "SI",
            slot: "2",
            room: "98",
            id: 1,
            type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
        },
        2: {
            name: "Wsi",
            slot: "2",
            room: "11",
            id: 2,
            type: ["Laboratorium", "Cwiczenia", "Wyklad"][Math.floor(Math.random()*3)],
        },
        3: {
            name: "nji",
            slot: "10",
            room: "98",
            id: 3,
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
            title: "DUPA",
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
            id: 0
        },
        {
            name: "Peter Gawkuu",
            id: 1
        }
    ];
}

export async function fetchWorkerInfo(id) {
    return {
        text: "Jakieś info o panu pracowniku"
    };
}