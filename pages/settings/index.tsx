import type { NextPage } from 'next'
import { Layout } from '../../components/Layout'
import { Button, List, Icon, Modal, Form, Checkbox } from 'semantic-ui-react'
import CRMDB from '../../db/crm-data.json';
import { CrmProcessConfig } from '../../models/Process';
import { useEffect, useState } from 'react';
import { GetDocumentType } from '../../utils/call-ProDoctivity-API';
import { DocumentType } from '../../models/documentType'

const Settings: NextPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [active, isActive] = useState(false);
    const [expiredDays, setExpiredDays] = useState(0);
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>(new Array<DocumentType>());
    const [selectedDocumentTypes, setSelectedDocumentTypes] = useState(new Array<any>())
    const handlerSubmit = () => {
        setModalOpen(false)
        console.log(name, date, active)
    }

    useEffect(() => {
        GetDocumentType('manager', 'password').then(res => {
            setDocumentTypes(res);
            setSelectedDocumentTypes(res.map((x) => {
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
                    <FormSettings selectedDocumentTypes={selectedDocumentTypes} listOfDocumentTypes={documentTypes} name={name} date={date} active={active} expiredInDays={expiredDays} setName={setName} setDate={setDate} setActive={isActive} setExpiredDateInDays={setExpiredDays} />
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
}> = (props) => {
    const [selectedDocumentTypes, setSelectedDocumentTypes] = useState(props.selectedDocumentTypes);
    const [name, setName] = useState(props.name);


    const handlerCheckbox = (id: number) => {
        const newSelectedDocumentTypes = selectedDocumentTypes.map((x) => {
            if (x.id === id) {
                x.isSelected = !x.isSelected;
            }
            return x;
        })
        setSelectedDocumentTypes(newSelectedDocumentTypes);
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
            <input placeholder='Tiempo de expiracion' />
        </Form.Field>
        <section>
            <h3>Tipos de Documentos  ({(selectedDocumentTypes.filter(x => x.selected) as Array<any>).length})</h3>
            <input placeholder='Search' value={name} onChange={(e) => setName(e.target.value)} />
            <List>
                {name === '' ? selectedDocumentTypes.map((documentType) =>
                    <List.Item key={documentType.id}>
                        <Checkbox checked={documentType.isSelected} onChange={() => handlerCheckbox(documentType.id)} label={documentType.name} />
                    </List.Item>) : Filter(selectedDocumentTypes, name).map((documentType) =>
                        <List.Item key={documentType.id}>
                            <Checkbox checked={documentType.isSelected} onChange={() => handlerCheckbox(documentType.id)} label={documentType.name} />
                        </List.Item>)}
            </List>
        </section>
    </Form>
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