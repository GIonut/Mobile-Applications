import axios from 'axios';
import {CardProps} from "../models/CardProps";
import {authConfig, baseUrl} from "../core";

const cardUrl = `http://${baseUrl}/api/card`;

interface ResponseProps<T> {
    data: T;
}

function callService<T>(promise: Promise<ResponseProps<T>>): Promise<T> {
    return promise
        .then(res => {
            return Promise.resolve(res.data);
        })
        .catch(err => {
            return Promise.reject(err);
        });
}

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export const getCards: (token: string) => Promise<CardProps[]> = token =>  {
    return callService(axios.get(`${cardUrl}`, authConfig(token)));
}

export const createCard: (token: string, card:CardProps) => Promise<CardProps> = (token, card) => {
    return callService(axios.post(`${cardUrl}`, card, config));
}

export const updateCard: (token: string, card: CardProps) => Promise<CardProps> = (token, card) => {
    return callService(axios.put(`${cardUrl}/${card.id}`, card, config));
}

export const reviewCard: (id: string) => Promise<string> =
    (id) => {
        return callService(axios.put(`${cardUrl}/review/${id}`, config));
}

export const deleteCard: (token: string, id: string) => Promise<CardProps[]> = (token, id) => {
        return callService(axios.delete(`${baseUrl}/${id}`, config));
    }

interface MessageData {
    event: string;
    payload: {
        card: CardProps;
    };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://localhost:3000`)
    ws.onmessage = messageEvent => {
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}