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

    const handlerSubmit = () => {
        setModalOpen(false)
        console.log(name, date, active)
    }

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
                    <FormSettings name={name} date={date} active={active} expiredInDays={expiredDays} setName={setName} setDate={setDate} setActive={isActive} setExpiredDateInDays={setExpiredDays} />
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
    setExpiredDateInDays: (days: number) => void
}> = (props) => {
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDocumentTypes, setSelectedDocumentTypes] = useState<DocumentType[]>([]);
    useEffect(() => {
        GetDocumentType('manager', 'password').then(res => {
            setDocumentTypes(res);
            setLoading(false);
        })
    }, [])


    return <Form>
        <Form.Field>
            <label>First Name</label>
            <input placeholder='Nombre de la configuracion del proceso' value={props.name} onChange={(e) => props.setName(e.target.value)} />
        </Form.Field>
        <Form.Field>
            <label>Fecha</label>
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
            <h3>Tipos de Documentos  ({selectedDocumentTypes.length})</h3>
            <input placeholder='Search' />
            {loading ? <div>Loading...</div> : <List>
                {documentTypes.map((documentType) => <List.Item key={documentType.id}> <Checkbox label={documentType.name} /></List.Item>)}
            </List>}
        </section>
        {console.log(documentTypes)}
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

export default Settings