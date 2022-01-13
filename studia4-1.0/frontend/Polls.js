import React from 'react';
import { Button, GroupSelector, SearchBar, usePopup, UserContext, verifyClose } from "./App";
import { fetchPolls, useRemoteData, removePoll, resolvePoll, votePoll, fetchPollSlots, fetchGroups, fetchIntersect, addPoll } from "./Remote";
import { expandSelection, Schedule } from './Schedule';

export default function Polls() {
    const user = React.useContext(UserContext);
    const stud = user.position === "ROLE_STUDENT";
    const polls = useRemoteData(fetchPolls);
    const [popup, show] = usePopup();
    if (polls === null) {
        return <div>Loading polls...</div>;
    }
    console.log(polls);
    function resolve(id) {
        resolvePoll(id).then(function(res) {
            const best = Object.entries(res).reduce((s1, s2) => s1[1] > s2[1] ? s1 : s2)[0]
            show(() => <Schedule
                initRatings={res}
                initSelections={{[best]: true}}
                mode="view"
            />).catch(verifyClose);
        })
    }
    function vote(id) {
        fetchPollSlots(id).then(slots => show(handleData => <Schedule
            initRatings={slots}
            mode="rate"
            actions={[{
                name: "Głosuj",
                cb: handleData
            }]}/>
        )).then(rtngs => votePoll(id, rtngs), verifyClose);
    }
    function add() {
        show(h => <GroupSelector onSelect={h}/>)
            .then(grps => fetchIntersect(grps))
            .then(slots => show(h => <SlotSelector onSelect={h} initSlots={slots}/>))
            .then(({name, slots}) => addPoll(name, slots))
            .catch(verifyClose);
    }
    return (
        <>
            <div className="content-box">
                Ankiety
                {polls.map(poll => <Poll key={poll.id} {...poll} resolve={resolve} vote={stud ? vote : null}/>)}
            </div>
            {stud || <div><Button onClick={add}>Dodaj</Button></div>}
            {popup}
        </>
    );
}

function Poll({ id, name, voted, resolve, vote }) {
    return (
        <div className="box-row">
            {name}
            <span className='resched-buttons'>
                {vote ? <>{voted && "Zagłosowano"}<Button onClick={() => vote(id)}>Głosuj</Button></> :
                <><Button onClick={() => resolve(id)}>Wynik</Button>
                <Button onClick={() => removePoll(id)}>Zakończ</Button></>}
            </span>
        </div>
    )
}

function SlotSelector({ onSelect, initSlots }) {
    const [name, setName] = React.useState("");
    return (
        <>  
            <div style={{marginBottom: "0.5em"}}>
                <form className="search-bar">
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
            <Schedule
            initSelections={expandSelection(initSlots)}
            mode="select"
            actions={[{name: "Utwórz", cb: newSlots => onSelect({name, slots: newSlots})}]}
            />
        </>
    );
}