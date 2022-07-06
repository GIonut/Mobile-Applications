import {IonAlert} from "@ionic/react";

const AlertComponent: React.FC<{isError: boolean, message: string}> = (props) => {
    return (
        <IonAlert
            isOpen={props.isError}
            onDidDismiss={() => !props.isError}
            header={'Alert'}
            message={props.message}
            buttons={['OK']}
        />
    );
}

export default AlertComponent;