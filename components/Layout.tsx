import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Menu,
    Message
} from "semantic-ui-react";
import Link from 'next/link'

export const Layout: React.FC = ({ children }) => {
    return <div className="App">
        <Container>
            <Menu borderless size="massive">
                <Menu.Item header>Dummy CRM</Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item active><Link href='/'>Home</Link></Menu.Item>
                    <Menu.Item><Link href='/settings'>Configurar</Link></Menu.Item>
                    <Menu.Item><Link href='/process'>Crear Proceso</Link></Menu.Item>
                </Menu.Menu>
            </Menu>
            <div>
                {children}
            </div>
            <Divider hidden />
            <Divider hidden />
            <Divider />
            <footer>&copy; 2017 Company, Inc.</footer>
        </Container>
    </div>
}