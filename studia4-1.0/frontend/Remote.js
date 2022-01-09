const dummyData = true;

export function fetchAndSetCourses(user, setter) {
    if (dummyData) {
        setter([
            {
                name: "WSI",
                id: 0
            },
            {
                name: "pap",
                id: 1
            }
        ])
        return;
    }
    const url = new URL("http://papz22.tplinkdns.com:2137/courses");
    url.searchParams.append("name", user);
    fetch(url).then(res => res.json()).then(data => setter(data));
}

export function fetchAndSetClasses(user, setter) {
    if (dummyData) {
        setter({
            "poniedzialek10:15": [{
                name: "WSI",
                room: "98",
                id: 0,
                type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
                alts: ["poniedzialek10:15", "piatek18:15"]
            },
            {
                name: "SI",
                room: "98",
                id: 1,
                type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
                alts: []
            },
            {
                name: "Wsi",
                room: "11",
                id: 2,
                type: ["lab", "exercise", "lecture"][Math.floor(Math.random()*3)],
                alts: []
            }],
            "piatek12:15": [{
                name: "nji",
                room: "98",
                id: 3,
                type: "lab",
                alts: []
            }]
        })
        return;
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
        setter(classes);
    });
}

export function fetchAndSetRatings(user, setter) {
    setter({
        "poniedzialek10:15": 0,
        "poniedzialek16:15": 3,
        "czwartek10:15": 76,
    });
}

export function pushRescheduleRequest(user, changes) {
    console.log(changes);
}

export function pushRatings(user, ratings) {
    console.log(ratings);

}