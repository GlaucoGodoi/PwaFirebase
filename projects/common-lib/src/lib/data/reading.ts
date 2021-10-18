import { Timestamp } from "@firebase/firestore";
export interface Reading {
    readingDate: Timestamp;
    value: number;
    image: string;
}