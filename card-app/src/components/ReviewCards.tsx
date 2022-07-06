import {RouteComponentProps} from "react-router";
import {
    IonButton, IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader, IonIcon,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import CardComponent from "./CardComponent";
import AlertComponent from "./alertComponent";
import {add, chevronBackOutline, chevronForwardOutline} from "ionicons/icons";
import {useContext, useEffect, useState} from "react";
import {ItemContext} from "./CardProvider";
import {CardProps} from "../models/CardProps";

const ReviewCards: React.FC<RouteComponentProps> = ({history}) => {
    const {cards, fetching, fetchingError, error} = useContext(ItemContext);
    const [index, setIndex] = useState(0);
    const [card, setCard] = useState<CardProps>();

    const changeCard = (index: number) => {
        if(cards) {
            if (index < cards.length){
                const card = cards[index];
                setCard(card);
                setIndex(index);
            }
        }
    }

    useEffect(() => {
        changeCard(index);
    }, [cards, index])

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Review Session</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => history.goBack()}>
                            Home
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching items" />
                {card && (
                    <div>
                        <CardComponent id={card.id}
                           title={card.title}
                           content={card.content}
                           last_reviewed={card.last_reviewed}
                           show={card.show}
                           onEdit={id => history.push(`card/${id}`)}
                                />
                    </div>)}
                {fetchingError && (
                    <AlertComponent isError={fetchingError} message={error? error.message:"Unable to fetch cards!"}/>
                )}
                {index > 0 &&
                (<IonFab vertical="center" horizontal="start" slot="fixed">
                    <IonFabButton onClick={() => changeCard(index-1)}>
                        <IonIcon icon={chevronBackOutline}/>
                    </IonFabButton>
                </IonFab>)}
                {cards && (index < cards.length-1) &&
                (<IonFab vertical="center" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => changeCard(index + 1)}>
                        <IonIcon icon={chevronForwardOutline}/>
                    </IonFabButton>
                </IonFab>)}
                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton onClick={() => history.push("/card")}>
                        <IonIcon icon={add}/>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    )
}

export default ReviewCards;