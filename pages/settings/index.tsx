import type { NextPage } from 'next'
import { Layout } from '../../components/Layout'
import { Button, List, Modal, Form, Checkbox } from 'semantic-ui-react'
import CRMDB from '../../db/crm-data.json';
import { CrmProcessConfig } from '../../models/Process';
import React, { useEffect, useState } from 'react';
import { GetDocumentType } from '../../utils/call-ProDoctivity-API';
import { DocumentType } from '../../models/documentType';

const Settings: NextPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [active, isActive] = useState(false);
    const [expiredDays, setExpiredDays] = useState(0);
    const [availableDocumentTypes, setAvailable] = useState(new Array<any>())
    const [selected, setSelected] = useState(new Array<any>())
    const handlerSubmit = () => {
        setModalOpen(false);
        const object: CrmProcessConfig = {
            id: CRMDB.length + 1,
            name: name,
            date: date.toLocaleDateString(),
            status: active,
            configuration: {
                expireDateInDays: expiredDays,
                documentTypes: selected.map((item) => ({
                    id: item.id,
                    name: item.name,
                    isTemplate: true,
                    status: "active",
                    isRequired: true
                }))
            }
        };
        (CRMDB as CrmProcessConfig[]).push(object);
        setName('');
        setDate(new Date());
        isActive(false);
        setExpiredDays(0);
    }

    useEffect(() => {
        GetDocumentType('manager', 'password').then(res => {
            setAvailable(res.map((x) => {
                return {
                    id: x.id,
                    name: x.name,
                    isSelected: false
                }
            }))
        })
    }, [])

    return (
        <Layout>
            <div>
                <h1>Configure</h1>
                <Button onClick={() => setModalOpen(true)}>Nuevo</Button>
            </div>
            <ListSettings />
            <Modal
                size={'tiny'}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <Modal.Header>Configurar nuevo proceso</Modal.Header>
                <Modal.Content>
                    <FormSettings emitSelected={(list) => setSelected(list)} selectedDocumentTypes={availableDocumentTypes} listOfDocumentTypes={[]} name={name} date={date} active={active} expiredInDays={expiredDays} setName={setName} setDate={setDate} setActive={isActive} setExpiredDateInDays={setExpiredDays} />
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={() => setModalOpen(false)}>
                        No
                    </Button>
                    <Button positive onClick={() => handlerSubmit()}>
                        Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        </Layout>
    )
}

const FormSettings: React.FC<{
    name: string,
    date: Date,
    active: boolean,
    expiredInDays: number,
    setName: (value: string) => void,
    setDate: (date: Date) => void,
    setActive: (active: boolean) => void
    setExpiredDateInDays: (days: number) => void,
    listOfDocumentTypes: DocumentType[],
    selectedDocumentTypes: any[]
    emitSelected: (selected: any[]) => void
}> = (props) => {
    const [selectedDocumentTypes, setSelectedDocumentTypes] = useState(props.selectedDocumentTypes);
    const [filterName, setFilterName] = useState('');
    const [selectedCounter, setSelectedCounter] = useState(0);


    const handlerCheckbox = (id: number) => {
        const newSelectedDocumentTypes = selectedDocumentTypes.map((x) => {
            if (x.id === id) {
                x.isSelected = !x.isSelected;
            }
            return x;
        })
        setSelectedCounter(newSelectedDocumentTypes.filter((x) => x.isSelected).length)
        setSelectedDocumentTypes(newSelectedDocumentTypes);
        props.emitSelected(newSelectedDocumentTypes.filter((x) => x.isSelected));
    }

    return <Form>
        <Form.Field>
            <label>First Name</label>
            <input placeholder='Nombre de la configuracion del proceso' value={props.name} onChange={(e) => props.setName(e.target.value)} />
        </Form.Field>
        <Form.Field>
            <label>Fecha</label>add
            <input placeholder='date' value={props.date.toLocaleDateString()} onChange={(e) => props.setDate(new Date(e.target.value))} />
        </Form.Field>
        <Form.Field>
            <Checkbox label='Marcar esta configuracion como activa' checked={props.active} onChange={(e) => props.setActive(!props.active)} />
        </Form.Field>
        <Form.Field>
            <label>Tiempo de expiracion</label>
            <input placeholder='Tiempo de expiracion' value={props.expiredInDays} onChange={(e) => props.setExpiredDateInDays(e.target.value === '' ? 0 : Number.parseInt(e.target.value))} />
        </Form.Field>
        <section>
            <h3>Tipos de Documentos  ({selectedCounter})</h3>
            <input placeholder='Search' value={filterName} onChange={(e) => setFilterName(e.target.value)} />
            <List id="form">
                {filterName === '' ? DocumentTypesAvailableList(selectedDocumentTypes, handlerCheckbox) : DocumentTypesAvailableList(Filter(selectedDocumentTypes, filterName), handlerCheckbox)}
            </List>
        </section>
    </Form>
}


const DocumentTypesAvailableList = (items: any[], handlerCheckBox: (id: number) => void) => {

    if (items.length === 0) {
        return <List.Item>No hay documentos disponibles</List.Item>
    }

    return items.map((documentType) => <List.Item key={documentType.id}>
        <Checkbox checked={documentType.isSelected} onChange={() => handlerCheckBox(documentType.id)} label={documentType.name} />
    </List.Item>)
}


const ListSettings = () => {
    const data = CRMDB as CrmProcessConfig[];
    return <List divided relaxed>
        {data.map((item, index) => (
            <List.Item key={index.toString()}>
                <List.Icon name='github' size='large' verticalAlign='middle' />
                <List.Content>
                    <List.Header as='a'>{item.name}</List.Header>
                    <List.Description as='a'>{item.name} {item.date} status :{item.status ? 'Active' : 'Inactive'}</List.Description>
                </List.Content>
            </List.Item>
        ))}
    </List>
}


/// in typescript 
// function that filter the list of document types
// the params for filter this list is a name of the document type
const Filter = (listOfDocumentTypes: any[], name: string) => {
    return listOfDocumentTypes.filter(x => x.name.toLowerCase().includes(name.toLowerCase()))
}

export default Settings