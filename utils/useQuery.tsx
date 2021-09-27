import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { CrmProcess, CrmProcessConfig } from '../models/Process';
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
    saveRow: (row: T) => any;
    /**
     * find a row in the table node
     *
     */
    findByKey: (key: string) => Promise<T>;
    /**
     * update a row in the table node
     *
     */
    edit: (refRow: any, row: T) => Promise<string>,

    saveCard: (key: string, processTable: string, settingTable: any, storeTable: any) => void;
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
        return ref.push(row).key;
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

    const saveCard = (key: string, processTable: string, settingTable: any, storeTable: any) => {
        const process = db.ref(`${processTable}/${key}`);
        const cardTable = db.ref(`${storeTable}`);
        process.on("value", async (snap) => {
            const data = snap.val() as CrmProcess;
            (data as any).key = snap.key;
            const settingsRef = db.ref(`${settingTable}/${data.configuration}`)
            settingsRef.on("value", async (settingsSnap) => {
                const settings = (settingsSnap.val() as CrmProcessConfig) || {};
                const card = {
                    processId: (data as any).key,
                    processName: data.name,
                    clientName: `Dummy client ${(data as any).key}`,
                    creatorName: 'Dummy Client api',
                    creatorEmail: 'dummy-crm-client@crmclient.com',
                    creatorPhone: '+1-123-456-7890',
                    creationDate: data.date,
                    expiryDate: dayjs(data.date).add(settings.configuration.expireDateInDays, 'day').toDate().toLocaleDateString(),
                    status: 'active',
                    processDocumentRequirement: settings.configuration.documentTypes.length,
                    currentDocumentInProcess: 0,
                    configuration: settings.configuration.documentTypes,

                }
                cardTable.push(card);
            })
        })
    }

    return {
        dataSet,
        saveRow,
        findByKey,
        edit,
        saveCard
    }
}