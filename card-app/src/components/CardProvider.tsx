import {CardProps} from "../models/CardProps";
import React, {useCallback, useContext, useEffect} from "react";
import {createCard, getCards, newWebSocket, reviewCard, updateCard, deleteCard} from "./CardApi";
import PropTypes from "prop-types";
import {AuthContext} from "../auth/AuthProvider";

type SaveCardFn = (card: CardProps) => Promise<any>
type IdCardFn = (id: string) => void;

export interface CardsState {
    cards?: CardProps[],
    fetching: boolean,
    fetchingError: boolean,
    error?: Error,
    saveCard?: SaveCardFn,
    flipCard?: IdCardFn;
    removeCard?: IdCardFn;
}

const initialState: CardsState = {
    cards: [],
    fetching: false,
    fetchingError: false,
    error: undefined,
}

export const ItemContext = React.createContext<CardsState>(initialState);

interface CardProviderProps {
    children: PropTypes.ReactNodeLike,
}

interface ActionProps {
    type: string,
    payload?: any,
}

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const DELETE_ITEM_SUCCEEDED = 'DELETE_ITEM_SUCCEEDED';
const FLIP_CARD = "FLIP_CARD";

const reducer: (state: CardsState, action: ActionProps) => CardsState =
    (state, { type, payload }) => {
        switch (type) {
            case FETCH_ITEMS_STARTED:
                return { ...state, fetching: true, fetchingError: false };
            case FETCH_ITEMS_SUCCEEDED:
                return { ...state, cards: payload.cards, fetching: false };
            case FETCH_ITEMS_FAILED:
                return { ...state, fetchingError: true, fetching: false, error: payload.error };
            case SAVE_ITEM_SUCCEEDED: {
                const cards = [...(state.cards || [])];
                const card = payload.card;
                const index = cards.findIndex(c => c.id === card.id);
                if (index === -1) {
                    cards.splice(0, 0, card);
                } else {
                    cards[index] = card;
                }
                return {...state, cards};
            }
            case FLIP_CARD: {
                let cards = [...(state.cards || [])];
                const cardIndex = cards.findIndex(c => c.id === payload.id);
                const card = cards[cardIndex];
                cards[cardIndex] = {...card,
                    show: !card.show,
                    last_reviewed: new Date() }
                return {...state, cards: cards};
            }
            case DELETE_ITEM_SUCCEEDED: {
                const cards = [...(state.cards || [])];
                const cardId = payload.id;
                const actualCards = cards.filter(c => c.id !== cardId );
                return {...state, cards: actualCards};
            }
            default:
                return state;
        }
}


export const CardProvider: React.FC<CardProviderProps> = ({children}) => {
    console.log("CardProvider");
    const { token } = useContext(AuthContext);

    const [state, dispatch] = React.useReducer(reducer, {fetching: false,
        fetchingError: false,});

    const { cards, fetching, fetchingError, error, } = state;

    useEffect(getCardsEffect, []);
    const saveCard = useCallback<SaveCardFn>(saveCardCallback, []);
    // useEffect(wsEffect, []);
    const flipCard = useCallback<IdCardFn>(flipCardCallback, []);
    const removeCard = useCallback<IdCardFn>(removeCardCallback, []);
    const value = {cards, fetching, fetchingError, error, saveCard, flipCard, removeCard};

    return(
        <ItemContext.Provider value={value}>
            {children}
        </ItemContext.Provider>
    );

    function getCardsEffect() {
        let canceled = false;
        fetchCards();
        return () => {
            canceled = true;
        }

        async function fetchCards() {
            try {
                dispatch({ type: FETCH_ITEMS_STARTED });
                const cards = await getCards(token);
                if (!canceled) {
                    dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { cards } });
                }
            } catch (error) {
                if (error instanceof Error)
                    dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
            }
        }
    }

    function wsEffect() {
        let canceled = false;
        const closeWebSocket = newWebSocket(message => {
            if (canceled) {
                return;
            }
            const { event, payload: { card }} = message;
            if (event === 'created' || event === 'updated') {
                dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { card: card }});
            }
            if (event === 'deleted') {
                dispatch({ type: DELETE_ITEM_SUCCEEDED, payload: { id: card.id }});
            }
        });
        return () => {
            canceled = true;
            closeWebSocket();
        }
    }

    async function saveCardCallback(card: CardProps) {
        try {
            const savedCard: CardProps = await (card.id? updateCard(token, card): createCard(token, card));
            dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { card: savedCard } });
        }
        catch(error) {
            console.log(error);
        }
    }

    async function flipCardCallback(id: string) {
        try {
            await reviewCard(id);
            dispatch({ type: FLIP_CARD, payload: { id }});
        }
        catch(error) {
            console.log(error);
        }
    }

    async function removeCardCallback(id: string) {
        try {
            await deleteCard(token, id);
            dispatch({ type: DELETE_ITEM_SUCCEEDED, payload: { id }});
        }
        catch(error) {
            console.log(error);
        }
    }

}