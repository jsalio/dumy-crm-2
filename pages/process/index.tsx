import { NextPage } from "next"
import React, { useState } from 'react';
import { List } from "semantic-ui-react";
import { Layout } from "../../components/Layout"
import { CrmProcess, CrmProcessConfig, CrmProcesses } from "../../models/Process";
import { useQuery } from "../../utils/useQuery";

const jTable = "crm-process"
const jTable2 = "crm-process-settings";

const Process: NextPage = () => {
    const { saveRow, dataSet } = useQuery<CrmProcess>(jTable)
    const saveProcess = async (process: CrmProcess) => {
        saveRow(process)
    }

    return <Layout>
        <div>
            <h1>Process</h1>
        </div>
        <MyForm emitProcess={(e) => saveProcess(e)} />
        <div>
            <h3>Listado de procesos</h3>
        </div>
        <ProcessList dataSet={dataSet} />
    </Layout>
}


const MyForm: React.FC<{ emitProcess: (data: CrmProcess) => void }> = (props) => {
    const [processName, setProcessName] = useState('')
    const [configuration, setConfiguration] = useState('')
    const settings = useQuery<CrmProcessConfig>(jTable2)
    return <form onSubmit={(e) => {
        e.preventDefault();
        console.log(e)
        props.emitProcess({
            id: guid(),
            name: processName,
            date: new Date().toString(),
            configuration: configuration,
        })
        setProcessName('');
        setConfiguration('');
    }}>
        <div>
            <label>Name</label>
            <input name='name' value={processName} onChange={(e) => setProcessName(e.target.value)} />
        </div>
        <div>
            <label htmlFor="process">Tipo de proceso</label>
            <select name="process" value={configuration} onChange={(e) => {
                console.log(e.target.value)
                setConfiguration(e.target.value)
            }}>
                {settings.dataSet?.filter(x => x.status).map((x) => <option key={x._dbKey} value={x._dbKey}>{x.name}</option>)}
            </select>
        </div>
        <button type="submit">Save</button>
    </form>
}

const ProcessList: React.FC<{ dataSet: Array<CrmProcess> }> = (props) => {

    // const { dataSet } = useQuery<CrmProcess>(jTable)
    return <List divided relaxed>
        {props.dataSet.map((item, index) => (
            <List.Item key={index.toString()}>
                <List.Icon name='github' size='large' verticalAlign='middle' />
                <List.Content>
                    <List.Header as='a'>{item.name} </List.Header>
                    <List.Description as='a'>{item.name} {item.date} </List.Description>
                </List.Content>
            </List.Item>
        ))}
    </List>

}


// In typescript
// function for generate short GUID definition
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

export default Process