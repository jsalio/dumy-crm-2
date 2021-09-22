import { useEffect, useState } from 'react';
import { firebase } from './firebase-config';

const db = firebase.database();

/**
 * Represents query's to apply on the database.
 * @template T
 */
export type DbQuery<T> = {
    /**
     * the data present in the table node
     *
     * @type {Array<T>}
     */
    dataSet: Array<T>;
    /**
     * insert a new row into the table node
     *
     */
    saveRow: (row: T) => void;
    /**
     * find a row in the table node
     *
     */
    findByKey: (key: string) => Promise<T>;
    /**
     * update a row in the table node
     *
     */
    edit: (refRow: any, row: T) => Promise<string>
}

/**
 * Represents a query to apply on the database.
 * 
 * @template T
 * @param {string} tableName represents the table name
 */
export const useQuery = <T extends {}>(table: string): DbQuery<T> => {
    const [dataSet, setDataSet] = useState<Array<T>>(new Array<T>());

    useEffect(() => {
        const ref = db.ref(table);
        ref.on('value', (snapshot) => {
            const dataset: Array<T> = [];
            let index = 0
            snapshot.forEach((row) => {
                dataset.push(row.val() as T)
                index++
                (dataset[index - 1] as any)._dbKey = row.key
            })
            setDataSet(dataset);
        });
        return () => {
            ref.off();
        };
    }, [table]);

    const saveRow = (row: T) => {
        const ref = db.ref(table);
        ref.push(row);
    }

    const findByKey = (key: string) => {
        const ref = db.ref(table).child(key);
        return new Promise<T>((resolve, reject) => {
            ref.once('value', (snapshot) => {
                resolve(snapshot.val() as T);
            });
        });
    }

    const edit = (refRow: any, row: T) => {
        const ref = db.ref(table).child(refRow.key);
        return ref.set(row);
    }

    return {
        dataSet,
        saveRow,
        findByKey,
        edit
    }
}