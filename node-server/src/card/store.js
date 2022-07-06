import dataStore from 'nedb-promise';

export class CardStore {
    constructor({ filename, autoload }) {
        this.store = dataStore({ filename, autoload });
    }

    async find(props) {
        return this.store.find(props);
    }

    async findOne(props) {
        return this.store.findOne(props);
    }

    async insert(card) {
        let title = card.title;
        let content = card.content;
        if (!title || !content) { // validation
            throw new Error('Missing title or content')
        }
        return this.store.insert(card);
    };

    async update(props, card) {
        return this.store.update(props, card);
    }

    async remove(props) {
        return this.store.remove(props);
    }
}

export default new CardStore({ filename: './db/cards.json', autoload: true });
