import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle, IonItem, IonToolbar
} from "@ionic/react";
import {CardProps} from "../models/CardProps";
import {useContext} from "react";
import {ItemContext} from "./CardProvider";

interface CardPropsWithFn extends CardProps {
    onEdit: (id?: string) => void;
}

const CardComponent : React.FC<CardPropsWithFn> = props => {
    const { flipCard , removeCard } = useContext(ItemContext);

    const handleShow = () => {
        props.id && flipCard && flipCard(props.id);
    }

    const handleRemove = () => {
        props.id && removeCard && removeCard(props.id);
    }

    const formatDate = () => {
        if(props.last_reviewed){
            const date = new Date(props.last_reviewed.toString());
            return " " + date.getDate() + "." +
                date.getUTCMonth() + "." + date.getFullYear()  + " " + date.getHours() +
            ":" + date.getMinutes();
        }
    }

    return (
        <IonCard>
            <IonCardHeader>
                <IonItem>
                    <IonCardTitle>
                        {props.title}
                    </IonCardTitle>
                    <IonButton size={"small"} shape={"round"} slot={"end"}
                                onClick={() => handleRemove()}>X</IonButton>
                </IonItem>
            </IonCardHeader>
            <IonCardContent>
            {props.show && (<IonItem lines={"none"}>
                    {props.content}
            </IonItem>)}
                <IonToolbar>
                    <IonButton slot="start" onClick={handleShow}>Show</IonButton>
                    <IonButton slot="end" onClick={() => props.onEdit(props.id)}>Edit</IonButton>
                </IonToolbar>
                <div >last reviewed:
                    {props.last_reviewed? formatDate() : "-"}
                </div>
            </IonCardContent>
        </IonCard>
    );
}

export default CardComponent;