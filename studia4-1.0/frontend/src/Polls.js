import React from 'react';
import { Button, DispatchContext, GroupSelector, useHelp, usePopup, verifyClose } from "./App";
import { fetchPolls, useRemoteData, removePoll, resolvePoll, votePoll, fetchPollSlots, fetchIntersect, addPoll } from "./Remote";
import { expandSelection, Schedule } from './Schedule';

const studHelp = `Wybierz "głosuj" aby wziąć udział w ankiecie

Następnie na wyświetlonym planie pojawią się liczniki w terminach dostępnych w wybranej ankiecie
Oceń od 0 do 6 dogodność przedstawionych terminów, a następnie zatwierdź przyciskiem pod planem`;

const workerHelp = `Wynik - podgląd aktualnego wyniku ankiety
Zakończ - usuwa ankietę
Dodaj - dodawanie ankiety:
Wyświetli się pole tekstowe, w którym wyszukać można wyszukać nazwę grupy, zajęć, bądź przedmiotu
Po wciśnięciu "wyberz" wyświetli się plan zajęć z oznaczonymi wspólnymi wolnymi terminami dla studentów z tych grup
Klikając w pola można zmieniać oznaczenie pól. Po wpisaniu nazwy można utworzyć ankietę, w której do wyboru będą oznaczone uprzednio pola`;

export default function Polls({ user }) {
    const dispatch = React.useContext(DispatchContext);
    const stud = user.position === "ROLE_STUDENT";
    useHelp(stud ? studHelp : workerHelp);
    const [polls, _, setPolls] = useRemoteData(fetchPolls);
    const [popup, show] = usePopup();
    const resolve = React.useCallback(function resolve(id) {
        resolvePoll(id).then(function(res) {
            const best = Object.entries(res).reduce((s1, s2) => s1[1] > s2[1] ? s1 : s2)[0]
            return show(() => <Schedule
                title="Wynik ankiety"
                initRatings={res}
                initSelections={{[best]: true}}
                mode="view"
            />)
        }).catch(verifyClose).catch(err => dispatch({action: "popupError", data: err}));
    }, [show, dispatch]);
    const vote = React.useCallback(function(id) {
        fetchPollSlots(id).then(slots => show(handleData => <Schedule
            initRatings={slots}
            mode="rate"
            actions={[{
                name: "Głosuj",
                cb: handleData
            }]}/>
        )).then(rtngs => votePoll(id, rtngs), verifyClose)
            .catch(err => dispatch({action: "popupError", data: err}));
    }, [show, dispatch]);
    const add = React.useCallback(function() {
        show(h => <GroupSelector onSelect={h}/>)
            .then(async function(grps) {
                const slots = await fetchIntersect(grps);
                const { name, slots: newSlots } = await show(h => <SlotSelector onSelect={h} initSlots={slots}/>).catch(verifyClose);
                return await addPoll(name, newSlots, grps);
            })
            .then(newPoll => setPolls(pls => [...pls, newPoll]), err => dispatch({action: "popupError", data: err}));
    }, [show, setPolls, dispatch]);
    const remove = React.useCallback(function(id) {
        removePoll(id).then(() => setPolls(pls => pls.filter(p => p.id !== id)), err => dispatch({action: "popupError", data: err}));
    }, [setPolls, dispatch]);
    if (polls === undefined) {
        return <div>Loading polls...</div>;
    }
    return (
        <>
            <div className="content-box">
                Ankiety
                {polls.map(poll => <Poll key={poll.id} {...poll} resolve={resolve} remove={remove} vote={stud ? vote : null}/>)}
            </div>
            {stud || <div><Button onClick={add}>Dodaj</Button></div>}
            {popup}
        </>
    );
}

function Poll({ id, name, voted, resolve, remove, vote }) {
    return (
        <div className="box-row">
            <div>{name}</div>
            <div>
                {vote ? <>{voted && "Zagłosowano"}<Button onClick={() => vote(id)}>Głosuj</Button></> :
                <><Button onClick={() => resolve(id)}>Wynik</Button>
                <Button onClick={() => remove(id)}>Zakończ</Button></>}
            </div>
        </div>
    )
}

function SlotSelector({ onSelect, initSlots }) {
    const crtBtRef = React.useRef();
    const [expandedSlots, disabled] = React.useMemo(function() {
        const expSelect = expandSelection(initSlots);
        const disabled = new Set();
        Object.keys(expSelect).forEach(slot => slot in initSlots || disabled.add(slot));
        return [expSelect, disabled];
    }, [initSlots]);
    const schedDataGetter = React.useRef(null);
    const [name, setName] = React.useState("");
    return (
        <>  
            <div style={{marginBottom: "0.5em"}}>
                <form id="slot-selector-form" className="search-bar" onSubmit={function(event) {
                    event.preventDefault();
                    onSelect({name, slots: schedDataGetter.current()});
                }}>
                    <div>
                        <input 
                            type="text"
                            value={name}
                            onChange={event => setName(event.target.value)}
                            required
                            placeholder="Wpisz nazwę"
                        />
                    </div>
                </form>
            </div>
            <div onClick={() => crtBtRef.current?.focus({preventScroll: true})}>
                <Schedule
                    initSelections={expandedSlots}
                    disabledSlots={disabled}
                    mode="select"
                    setDataPusher={getter => () => schedDataGetter.current = getter}
                />
            </div>
            <div>
                <Button ref={crtBtRef} form="slot-selector-form" submit>Utwórz</Button>
            </div>
        </>
    );
}