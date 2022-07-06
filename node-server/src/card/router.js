import Router from 'koa-router';
import cardStore from './store';
import { broadcast } from "../utils";

export const router = new Router();

router.get('/', async (ctx) => {
    const response = ctx.response;
    const userId = ctx.state.user._id;
    response.body = await cardStore.find({ userId });
    response.status = 200; // ok
});

router.get('/:id', async (ctx, next) => {
    const userId = ctx.state.user._id;
    const note = await cardStore.findOne({ _id: ctx.params.id });
    const response = ctx.response;
    if (note) {
        if (note.userId === userId) {
            response.body = note;
            response.status = 200; // ok
        } else {
            response.status = 403; // forbidden
        }
    } else {
        response.status = 404; // not found
    }
});

const createCard = async (ctx, card, response) => {
    try {
        const userId = ctx.state.user._id;
        card.userId = userId;
        response.body = await cardStore.insert(card);
        response.status = 201; // created
        broadcast(userId, { type: 'created', payload: card });
    } catch (err) {
        response.body = { message: err.message };
        response.status = 400; // bad request
    }
};

router.post('/', async (ctx) => {
    await createCard(ctx, ctx.request.body, ctx.response);
});

router.put('/:id', async (ctx) => {
    const card = ctx.request.body;
    const id = ctx.params.id;
    const cardId = card._id;
    const response = ctx.response;
    if (cardId && cardId !== id) {
        response.body = { message: 'Param id and body _id should be the same' };
        response.status = 400; // bad request
        return;
    }
    if (!cardId) {
        await createCard(ctx, card, response);
    } else {
        const userId = ctx.state.user._id;
        cardId.userId = userId;
        const updatedCount = await cardStore.update({ _id: id }, card);
        if (updatedCount === 1) {
            response.body = card;
            response.status = 200; // ok
            broadcast(userId, { type: 'updated', payload: card });
        } else {
            response.body = { message: 'Resource no longer exists' };
            response.status = 405; // method not allowed
        }
    }
});
//
// router.put('/review/:id', async (ctx) => {
//     const cardId = ctx.params.id;
//     console.log(cardId);
//     if (!cardId) {
//         return;
//     }
//     const index = cards.findIndex(card => card.id === cardId);
//     const card = cards[index];
//     card.last_reviewed = new Date();
//     cards[index] = card;
//     ctx.response.body = card;
//     ctx.response.status = 200; // OK
// });

router.del('/:id', async ctx => {
    const userId = ctx.state.user._id;
    const card = await cardStore.findOne({ _id: ctx.params.id });
    if (card && userId !== card.userId) {
        ctx.response.status = 403; // forbidden
    } else {
        await cardStore.remove({ _id: ctx.params.id });
        ctx.response.status = 204; // no content
    }
});
