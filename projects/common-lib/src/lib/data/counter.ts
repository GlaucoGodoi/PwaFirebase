import { Timestamp } from "@firebase/firestore";
import { Reading } from "./reading";

export interface Counter {
    ownerId: string,
    id: string;
    name: string;
    lastRead: Timestamp;
    lastValue: number;
    nextRead: Timestamp;
    frequency: number;

    readings: Reading[];
}