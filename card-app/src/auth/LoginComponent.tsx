import React, {useContext, useState} from "react";
import {
    IonButton,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon, IonInput,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import NetworkStatusIcon from "../components/NetworkStatusIcon";
import {RouteComponentProps} from "react-router";
import {AuthContext} from "./AuthProvider";
import AlertComponent from "../components/alertComponent";
import {Redirect} from "react-router-dom";

const LoginComponent: React.FC<RouteComponentProps> = ({history}) => {
    console.log("LoginComponent");
    const {login, isAuthenticated, authenticationError} = useContext(AuthContext);
    const [state, setState] = useState<{ username?:string, password?:string }>({});
    const {username, password} = state;

    const handleLogin = () => {
        login?.(username, password);
        if(isAuthenticated) {
            console.log("redirect to /");
            return <Redirect to={{ pathname: '/' }} />
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <NetworkStatusIcon slot="start"/>
                    <IonTitle>Flash Cards</IonTitle>
                    <IonIcon slot="start"/>
                </IonToolbar>
            </IonHeader>
            <IonContent>
               <IonCard>
                   <IonCardHeader color="tertiary">
                       <IonCardTitle>Login</IonCardTitle>
                   </IonCardHeader>
                   <IonCardContent>
                        <IonInput type="text" placeholder="Username" value={username}
                        onIonChange={e => setState({...state, username: e.detail.value || ""})}/>
                        <IonInput type="password" placeholder="Password" value={password}
                                  onIonChange={e => setState({...state, password: e.detail.value || ""})}/>
                        <IonButton onClick={handleLogin}>Log In</IonButton>
                   </IonCardContent>
               </IonCard>
                <AlertComponent isError={!!authenticationError} message="Unable to authenticate!"/>
            </IonContent>
        </IonPage>
    );
}

export default LoginComponent;