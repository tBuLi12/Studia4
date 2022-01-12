import React from 'react';
import { UserContext } from './App';
const dummyData = true;

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
    const url = new URL("http://papz22.tplinkdns.com:2137/courses");
    url.searchParams.append("name", user);
    return await fetch(url).then(res => res.json());
}

export async function fetchClasses(user) {
    if (dummyData) {
        // setter({
        //     "poniedzialek10:15": [{
        //         name: "WSI",
        //         room: "98",
        //         id: 0,
        //         type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
        //         alts: ["poniedzialek10:15", "piatek18:15"]
        //     },
        //     {
        //         name: "SI",
        //         room: "98",
        //         id: 1,
        //         type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
        //         alts: []
        //     },
        //     {
        //         name: "Wsi",
        //         room: "11",
        //         id: 2,
        //         type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
        //         alts: []
        //     }],
        //     "piatek12:15": [{
        //         name: "nji",
        //         room: "98",
        //         id: 3,
        //         type: "lab",
        //         alts: []
        //     }]
        // })
        return {
            0: {
                name: "WSI",
                slot: "poniedzialek10:15",
                room: "98",
                id: 0,
                type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
                alts: ["poniedzialek10:15", "piatek18:15"]
            },
            1: {
                name: "SI",
                slot: "poniedzialek10:15",
                room: "98",
                id: 1,
                type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
                alts: []
            },
            2: {
                name: "Wsi",
                slot: "poniedzialek10:15",
                room: "11",
                id: 2,
                type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
                alts: []
            },
            3: {
                name: "nji",
                slot: "piatek12:15",
                room: "98",
                id: 3,
                type: "lab",
                alts: []
            }
        };
    }
    const url = new URL("http://" + document.location.host + "/classes");
    url.searchParams.append("name", user);
    fetch(url).then(res => res.json()).then(function(data) {
        const classes = {};
        data.forEach(cls => {
            const slot = cls.week_day + cls.starting_time;
            (classes[slot] ?? (classes[slot] = [])).push({
                name: cls.name,
                room: cls.classroom_id,
                type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)]
            });
        });
    });
}

export async function fetchRatings() {
    return ({
        "poniedzialek10:15": 0,
        "poniedzialek16:15": 3,
        "czwartek10:15": 76,
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

export async function classRegister(id) {
    return true;
}

export async function fetchCoursesRegister(filter) {
    return [[{
        name: "WSI",
        id: 0,
    },
    {
        name: "SOI",
        id: 2,
    },
    {
        name: "PAP",
        id: 3,
    },
    {
        name: "PROB",
        id: 4,
    }], new Set([0, 3])];
}

export async function resolvePoll(id) {
    return {
        "poniedzialek10:15": 13,
        "piatek16:15": 10,
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
        to: "poniedziałek10:15"
    },
    {
        id: 1,
        cls: {
            name: "SOI",
            type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
        },
        stud: "Karol O",
        to: "piatek10:15"
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
        "wtorek14:15": true,
        "czwartek14:15": true,
    })
}

export async function fetchGroupSchedule(groups) {
    return {
        0: {
            name: "WSI",
            slot: "poniedzialek10:15",
            room: "98",
            id: 0,
            type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
        },
        1: {
            name: "SI",
            slot: "poniedzialek10:15",
            room: "98",
            id: 1,
            type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
        },
        2: {
            name: "Wsi",
            slot: "poniedzialek10:15",
            room: "11",
            id: 2,
            type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
        },
        3: {
            name: "nji",
            slot: "piatek12:15",
            room: "98",
            id: 3,
            type: "lab",
        }
    };
}

export async function fetchPollSlots(id) {
    return {"poniedzialek8:15": 3, "czwartek16:15": 4};
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