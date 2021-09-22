import { useEffect, useState } from 'react';
// import { CrmProcessConfig } from '../models/Process';
import { firebase } from './firebase-config';

const db = firebase.database();


export type DbQuery<T> = {
    dataSet: Array<T>;
    saveRow: (row: T) => void;
    findByKey: (key: string) => Promise<T>;
    edit: (refRow: any, row: T) => Promise<string>
}

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


// export const useDbSettingsStorage = () => {
//     const [data, setData] = useState(new Array<CrmProcessConfig>())
//     const jTable = "crm-process-settings"
//     let index = 0;
//     useEffect(() => {
//         const ref = db.ref(jTable);
//         ref.on("value", (snap) => {
//             const dataset: Array<CrmProcessConfig> = [];
//             snap.forEach((row) => {
//                 dataset.push(row.val() as CrmProcessConfig)
//                 index++
//                 dataset[index - 1]._dbKey = row.key as any
//             })
//             setData(dataset)
//         })
//     }, [])
//     const save = (objectData: CrmProcessConfig) => {
//         const ref = db.ref(jTable);
//         const onPush = ref.push();
//         onPush.set(objectData);
//     }
//     const findByKey = (key: any) => {
//         return new Promise<any>((resolve) => {
//             const ref = db.ref(`${jTable}/${key}`);
//             return ref.on("value", (snap) => {
//                 resolve(snap.val() as CrmProcessConfig)

//             })
//         })
//     }

//     const edit = (keyref: any, object: any) => {
//         const jTable = "crm-process-settings"
//         const ref = db.ref(`${jTable}/${keyref}`)
//         return ref.update(object)
//     }
//     return {
//         findByKey,
//         save,
//         data,
//         edit
//     }
// }

