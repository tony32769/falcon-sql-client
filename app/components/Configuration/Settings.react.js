import React, {Component, PropTypes} from 'react';
import styles from './Settings.css';
import classnames from 'classnames';
import DatabaseDropdown from './DatabaseDropdown.react';
import ConnectButton from './ConnectButton.react';

const DB_CREDENTIALS = [
    'username',
    'password',
    'portNumber'
];

const ENGINES = {
    MYSQL: 'mysql',
    SQLITE: 'sqlite',
    POSTGRES: 'postgres',
    MARIADB: 'mariadb',
    MSSQL: 'mssql'
};

const LOGOS = {
    POSTGRES: './images/postgresqlLogo.png',
    MYSQL: './images/mysqlLogo.png',
    MARIADB: './images/mariadbLogo.png',
    MSSQL: './images/mssqlLogo.png',
    SQLITE: './images/sqliteLogo.png'
};

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDB: null
        };
    }

    render() {
        const {configuration, configActions, ipc, ipcActions} = this.props;
        const {setValue} = configActions;

        let messageChooseEngine;
        if (this.state.selectedDB === null) {
            messageChooseEngine =
            <h5>Please select a database engine</h5>;
        } else {
            messageChooseEngine = <h5></h5>;
        }

        const logos = Object.keys(ENGINES).map(DB => (
            <div className={classnames(
                    styles.logo, {
                        [styles.logoSelected]: this.state.selectedDB === ENGINES[DB]
                    }
                )}
                onClick={() => {
                    this.setState({selectedDB: ENGINES[DB]});
                    setValue({
                        key: 'engine',
                        value: ENGINES[DB]
                    });
                }}
            >
                <img
                    className={styles.logoImage}
                    src={LOGOS[DB]}
                />
            </div>
        ));

        let inputs;
        if (this.state.selectedDB === ENGINES.SQLITE) {
            inputs =
                <input
                    placeholder="path to database"
                    type="text"
                    onChange={e => (
                        setValue({key: 'databasePath', value: e.target.value})
                    )}
                />;
        } else {
            inputs = DB_CREDENTIALS.map(credential => (
                <input
                    placeholder={credential}
                    type={credential === 'password' ? 'password' : 'text'}
                    onChange={e => (
                        setValue({key: credential, value: e.target.value})
                    )}
                />
            ));
        }

        return (
            <div style={{width: '100%'}}>
                <h2>Configuration</h2>

                <div>
                    <div>
                        {messageChooseEngine}
                        {logos}
                    </div>
                </div>

                <div className={styles.inputContainer}>
                    {inputs}
                </div>

                <ConnectButton
                    configuration={configuration}
                    ipc={ipc}
                    ipcActions={ipcActions}
                />

                <DatabaseDropdown
                    configuration={configuration}
                    setValue={setValue}
                    ipcActions={ipcActions}
                    ipc={ipc}
                />

                <hr/>
                log
                <pre>
                    {JSON.stringify(this.props.configuration.toJS())}
                </pre>
                tables
                <pre>
                    {JSON.stringify(this.props.ipc.toJS().tables, null, 2)}
                </pre>
                rows
                <pre>
                    {JSON.stringify(this.props.ipc.toJS().rows, null, 2)}
                </pre>

            </div>
        );
    }
}
