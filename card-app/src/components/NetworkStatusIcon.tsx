import React, {useEffect, useState} from "react";

import {IonIcon} from "@ionic/react";
import {ellipse} from "ionicons/icons";
import {ConnectionStatus, Network} from "@capacitor/network";

const NetworkStatusIcon: React.FC<{slot: string}> = props => {
    const [networkState, setNetworkState] = useState({connected: false})
    const onColor = {color:"lawngreen"}
    const offColor = {color:"red"}

    useEffect(() => {
        function networkStatusChangedListener(status: ConnectionStatus){
            if(!canceled)
                setNetworkState(status);
        }

        const listener = Network.addListener('networkStatusChange',
            networkStatusChangedListener);


        Network.getStatus().then(networkStatusChangedListener);
        let canceled = false;
        return () => {
            canceled = true;
            listener.remove();
        }
    }, [])

    return (
        <IonIcon slot={props.slot} icon={ellipse} style={
            networkState.connected?onColor:offColor}/>
    )
}

export default NetworkStatusIcon;