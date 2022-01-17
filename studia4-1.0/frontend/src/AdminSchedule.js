import React from 'react';
import { Button, DispatchContext, GroupSelector, useHelp } from "./App";
import { buildSchedule, fetchGroupSchedule, pushRescheduleRequest } from './Remote';
import { Schedule } from "./Schedule";

const help = `
    W polu tekstowym wpisz nazwę grupy, zajęć, bądź przedmiotu, następnie wciśnij dodaj.
    Pod spodem wyświetli się dodany element.
    Następnie kliknij wybierz aby wyświetlić plan wszysktkich tych studentów, którzy:
    - są zapisani na jedno z podanych zajęć
    - są zapisani na jeden z podanych przedmiotów
    - należą do jednej z podanych grup.

    Wyświetli się plan zajęć, w którzym możesz przeciągać kafelki aby zmieniać godziny zajęć.
    Na urządeniu mobilnym:
    kliknij kafelek, a następnie odpowiednie docelowe pole.
    Aby przemieszczać się między dniami dotknij obok kolumny zajęć, bądź przeciągij palcem poziomo.

    Gdy zakończysz, wciśnij "zapisz" pod planem zajęć

    Aby ułożyć nowy plan zajęć, wciśnij "Ułóż plan" na dole strony
`;

export default function AdminSchedule() {
    useHelp(help);
    const dispatch = React.useContext(DispatchContext);
    const [filteredClasses, setClasses] = React.useState(null);
    const [groups, setGroups] = React.useState(null);
    React.useEffect(() => groups === null || fetchGroupSchedule(groups).then(setClasses), [groups])
    return (
        <>
            <div className="content-box">
                <GroupSelector onSelect={setGroups}/>
            </div><br/>
            {filteredClasses && <Schedule 
                initSchedule={filteredClasses}
                permResched
                mode={"reschedule"}
                actions={[{
                    name: "Zmień",
                    cb: function(chng) {
                        setClasses(null);
                        pushRescheduleRequest(chng)
                            .then(() => fetchGroupSchedule(groups))
                            .then(setClasses, err => dispatch({action: "error", data: err}));
                    }
                }]}
            />}
            <Button onClick={buildSchedule}>Ułóż plan</Button>
        </>
    )
}