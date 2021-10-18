import { Injectable } from "@angular/core";
import { collection, deleteDoc, doc, DocumentData, DocumentReference, getDoc, getDocs, getFirestore, limit, query, Query, QueryConstraint, setDoc, WriteBatch, writeBatch } from "@firebase/firestore";
import { GenericResponse } from "../dto/generic-response";

@Injectable({
    providedIn: 'root'
})
export class BaseDataService<T> {

    private readonly afs = getFirestore();
    private path = "";

    public set pathToData(value: string) {
        this.path = value;
    }

    public async getSingleRecord(id: string, pathToUse?: string | null): Promise<T | null> {

        this.handlePath(pathToUse);

        const docRef = doc(this.afs, this.path, id);
        const snap = await getDoc(docRef);
        let ret: T | null = null;

        if (snap.exists()) {
            ret = snap.data() as T;
        }

        return ret;
    }

    public async getMultipleRecords(        
        numberOfRecords?: number | null,
        constraints?: QueryConstraint[] | null,
        pathToUse?: string | null): Promise<T[] | null> {

        this.handlePath(pathToUse);
        numberOfRecords = numberOfRecords || 10;

        const docsRef = collection(this.afs, this.path);
        let qry!: Query<DocumentData>;

        if (constraints) {
            qry = query(docsRef, ...constraints, limit(numberOfRecords));
        } else {
            qry = query(docsRef, limit(numberOfRecords));
        }
        const snap = await getDocs(qry)
        if (snap.empty) {
            return null;
        }

        const ret = snap.docs.map(doc => doc.data() as T);
        return ret;
    }

    public async saveRecord(record: T, id?: string | null, pathToUse?: string | null): Promise<GenericResponse<null>> {
        this.handlePath(pathToUse);

        let recordRef: DocumentReference;

        if (id) {
            recordRef = doc(this.afs, this.path, id);
        }
        else {
            recordRef = doc(collection(this.afs, this.path));
            id = recordRef.id;
        }

        if ('id' in record) {
            (record as any).id = id;
        }

        const ret = {} as GenericResponse<null>;

        try {
            await setDoc(recordRef, record,{merge: true});
            ret.success = true;
            ret.message = "Record saved";
            ret.data = null;

        } catch (error) {
            console.log(error);
            ret.success = false;
            ret.message = 'There was an error. Please try again later.';
        }

        return ret;
    }

    public async deleteRecord(id: string, pathToUse?: string | null): Promise<GenericResponse<null>> {
        this.handlePath(pathToUse);

        const docRef = doc(this.afs, this.path, id);
        const ret = {} as GenericResponse<null>;

        try {
            await deleteDoc(docRef);
            ret.success = true;
            ret.message = "Record deleted";
            ret.data = null;
        } catch (error) {
            console.log(error);
            ret.success = false;
            ret.message = 'There was an error. Please try again later.';
        }

        return ret;
    }


    public saveToABatch<Z>(batch: WriteBatch, pathToThisOperation: string, record: Z, id?: string | null): string {

        const recordRef: DocumentReference = this.handleIdAssignment<Z>(pathToThisOperation, record, id);        
        try {
            batch.set(recordRef, record,{merge: true});
            return recordRef.id;
        } catch (error) {
            debugger
            console.log(error);
            throw error;
        }
        
    }

    public getABatch(): WriteBatch {
        const ret = writeBatch(this.afs);

        return ret;
    }


    private handlePath(pathToUse: string | null = null) {
        if (pathToUse) {
            this.path = pathToUse;
        }
    }

    private handleIdAssignment<Z>(pathToUse: string, record: Z, id?: string | null): DocumentReference {
        let recordRef: DocumentReference;

        if ('id' in record) {
            if (id) {
                recordRef = doc(this.afs, pathToUse, id || (record as any).id);
            }
            else {
                recordRef = doc(collection(this.afs, pathToUse));
                id = recordRef.id;
            }
            (record as any).id = id;
        } else {
            recordRef = doc(collection(this.afs, pathToUse));         
        }

        return recordRef;
    }

}