import './Home.css';

import {
    IonPage,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList, IonLoading, IonFabButton, IonIcon, IonFab, IonButton, IonButtons,
} from '@ionic/react';

import CardComponent from "../components/CardComponent";
import {ItemContext} from "../components/CardProvider";
import AlertComponent from "../components/alertComponent";
import {add} from "ionicons/icons";
import {RouteComponentProps} from "react-router";
import {useContext} from "react";
import NetworkStatusIcon from "../components/NetworkStatusIcon";

const Home: React.FC<RouteComponentProps> = ({ history}) => {
    const { cards, fetching, fetchingError, error } = useContext(ItemContext)
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <NetworkStatusIcon slot="start"/>
                    <IonTitle>Flash Cards</IonTitle>
                    <IonIcon slot="start"/>
                    <IonButtons slot="end">
                        <IonButton onClick={() => history.push("/review")}>
                            Review
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching items" />
                {cards && (
                    <IonList>
                        {cards.map(({id,
                                    title,
                                    content,
                                    last_reviewed,
                                    show}) => (
                            <div>
                                <CardComponent id={id}
                                               title={title}
                                               content={content}
                                               last_reviewed={last_reviewed}
                                               show={show}
                                               onEdit={id => history.push(`card/${id}`)}
                                />
                            </div>))}
                    </IonList>
                )}
                {fetchingError && (
                    <AlertComponent isError={fetchingError} message={error? error.message:"Unable to fetch cards!"}/>
                )}
                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton onClick={() => history.push("/card")}>
                        <IonIcon icon={add}/>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
  );
};

export default Home;
