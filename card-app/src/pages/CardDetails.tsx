import {
    IonButton, IonButtons,
    IonContent,
    IonHeader, IonInput,
    IonItem, IonLabel,
    IonList,
    IonPage, IonTextarea,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {RouteComponentProps} from "react-router";
import {useContext, useEffect, useState} from "react";
import {ItemContext} from "../components/CardProvider";
import {CardProps} from "../models/CardProps";

interface CardEditRoutePropsWithId extends  RouteComponentProps<{id?: string;}> {}

const CardDetails: React.FC<CardEditRoutePropsWithId> = ({history, match}) => {
    const { cards, saveCard} = useContext(ItemContext);

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [card, setCard] = useState<CardProps>()

    useEffect(() => {
        const routeId = match.params.id || '';
        if (cards) {
            const card = cards?.find(c => c.id === routeId);
            setCard(card);
            if (card) {
                setTitle(card.title);
                setContent(card.content);
            }
        }
    }, [match.params.id, cards]);

    const handleSave = () => {
        const editedCard = card? {...card, title, content}: {title, content};
        saveCard && saveCard(editedCard).then(() => history.goBack());
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
               <IonList>
                   <IonItem>
                       <IonLabel>Title</IonLabel>
                       <IonInput value={title} onIonChange={e => setTitle(e.detail.value || '')}/>
                   </IonItem>
                   <IonItem>
                       <IonLabel>Content</IonLabel>
                       <IonTextarea value={content} onIonChange={e => setContent(e.detail.value || '')}/>
                   </IonItem>
               </IonList>
            </IonContent>
        </IonPage>
    );
}

export default CardDetails;