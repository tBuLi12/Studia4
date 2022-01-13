import React from 'react';
import { UserContext } from './App';
const dummyData = false;

export function useRemoteData(fetcher) {
    const user = React.useContext(UserContext);
    const [data, setData] = React.useState(null);
    React.useEffect(() => fetcher(user).then(setData), [user, fetcher]);
    return data;
}

export async function fetchCourses(user) {
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
                type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
                alts: ["2", "29"]
            },
            1: {
                name: "SI",
                slot: "2",
                room: "98",
                id: 1,
                type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
                alts: []
            },
            2: {
                name: "Wsi",
                slot: "2",
                room: "11",
                id: 2,
                type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
                alts: []
            },
            3: {
                name: "nji",
                slot: "26",
                room: "98",
                id: 3,
                type: "lab",
                alts: []
            }
        };
    }
    const url = new URL("http://" + document.location.host + "/classes");
    url.searchParams.append("flag", "1");
    const classes = await fetch(url).then(res => res.json());
    const schedObj = {};
    classes.forEach(cls => schedObj[cls.id] = cls);
    return schedObj;
}

export async function fetchRatings() {

    // [[1, 2], [1, 2]]
    // {1: 2, 1: 2}
    return ({
        "2": 0,
        "5": 2,
        "0": 2,
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
    console.log(id);
    return true;
}

export async function addPoll(name, slots) {
    console.log(name);
    console.log(slots);
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
        slots: [0, 2, 5]
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
    return {
        "2": 13,
        "15": 10,
    }
}

export async function votePoll(id, rts) {
    console.log(rts);
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
        id: 0,
        cls: {
            name: "WSI",
            type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
        },
        stud: "Jeremi S",
        to: "3"
    },
    {
        id: 1,
        cls: {
            name: "SOI",
            type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
        },
        stud: "Karol O",
        to: "25"
    }
    ])
}

export async function fetchPolls(user) {
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
            type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
        },
        1: {
            name: "SI",
            slot: "2",
            room: "98",
            id: 1,
            type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
        },
        2: {
            name: "Wsi",
            slot: "2",
            room: "11",
            id: 2,
            type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
        },
        3: {
            name: "nji",
            slot: "10",
            room: "98",
            id: 3,
            type: "lab",
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