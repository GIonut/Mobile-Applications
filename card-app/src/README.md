#FlashCards app

-------

Ionic-React Application with a node.js serve that allows the following use-cases:
+ CRUD on `flashcards`
+ See all the `flashcards` in the Home page
+ Reviewing the `flashcards` one by one in the Review page
+ Automatic update of the `flashcards` set through websockets

FlashCard - is an entity of the following form

    "flash-card": {
        "id": 0; // numeric
        "title": "title"; // string
        "content": "content"; // string
        "last_reviewed": { "date": { "string_date": "12-12-2012 12:12" } } // date;
        "show": False; // boolean
    }
}

A CardComponent that holds a `flashcard` has 2 buttons:
+ `Show` that shows the content of the card for reviewing; it also updates the last_reviewed field with the current date
+ `Edit` that allows the user to edit the title and the content of the flashcard