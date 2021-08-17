import { Reading } from "./reading";

export interface Counter {
    name: string;
    lastRead: Date;
    lastValue: number;
    nextRead: Date;

    readings: Reading[];
}