import React, {useEffect, useState} from "react";
import ListItem from "./ListItem";
import {getHumansData} from "../../api/humans/GetHumansData";
import {deleteHumanByUserName} from "../../api/humans/DeleteHumanByUserName";

/**
 * HumanList list ListItems and provides private remove function to ListItem for
 * removing human from database
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function HumanList(props) {
    let humanstype = props.type;
    const [update, setUpdate] = useState(false);
    const [humans, setHumans] = useState(props.humans);
    /**
     * Updates when update switches state and gets humans from database
     */
    useEffect(() => {
        getHumansData(props.type)
            .then((data) => {
                setHumans(data);
            })
    },[update])

    /**
     * Removes human based of username from database. Uses deleteHumanByUserName() function from
     * DeleteHumanByUserName.js and sets Update to true when deletion is completed
     * @param username which human to be deleted
     */
    function removeHuman(username){
        deleteHumanByUserName(props.type, username).then(()=> {
            setUpdate(true);
        });
    }

    return (
        <div >{
            humans?.map((human, index) => (
            <div key={index}>
                <ListItem key={index} type={humanstype} removeHuman={removeHuman} human={human} />
            </div>
        ))
        }
        </div>
    );
}

export default HumanList;