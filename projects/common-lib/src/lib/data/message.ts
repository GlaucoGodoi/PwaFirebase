import { Timestamp } from "@firebase/firestore";

export interface Message {    
    creation: Timestamp;
    text: string;
}