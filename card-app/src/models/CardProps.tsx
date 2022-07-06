export interface CardProps {
    id?: string;
    title: string;
    content: string;
    last_reviewed?: Date;
    show?: boolean;
}

/*
{
    "card": {


        "id": 0; // numeric
        "title": "title"; // string
        "content": "content"; // string
        "last_reviewed": { "date": { "string_date": "12-12-2012 12:12" } } // date;
        "show": False; // boolean
    }
}
 */