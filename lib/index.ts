import axios from 'axios'
import { of } from 'rxjs';
import { IConfig } from './enviroment.config';


export class SpringConfigReader {

    /**
     * Settings readed after the first load.
     */
    private configReaded!: IConfig;

    private config: Promise<IConfig> | IConfig;
    private configLocal: IConfig;
    constructor(configDefault: IConfig) {
        this.configLocal = configDefault;
        this.config = this.readConfig();
    }

    /**
     * Get the settings read after the first load.
     */
    public getConfig(): IConfig {
        return this.configReaded;
    }

    /**
     * Make the first configuration load, it must be called when starting the application.
     * Set the public configReaded object with the read settings.
     * 
     * @returns IEnv settings object.
     */
    public async getInitialConfig(): Promise<IConfig | any> {
        try {
            this.config = await this.config;
            this.configReaded = this.config;
            CustomLogger.info(`Configuration readed -> ${JSON.stringify(this.config.CONFIG_VARIABLES)}`);
        }
        catch (error) {
            throw new Error(`[ERROR] Configuration not found`);
        }
        return this.config;
    }

    /**
     * Start reading configurations from spring config or local.
     */
    private readConfig(): Promise<IConfig | any> {
        if (this.configLocal.SPRING_PROFILES_ACTIVE == 'local') return new Promise(_ => { return this.configLocal });
        let branchAux: string = process.env.SPRING_CLOUD_BRANCH || this.configLocal.SPRING_CLOUD_BRANCH;
        branchAux = branchAux.replace(/\//g, '(_)');
        let uri = `${process.env.SPRING_CLOUD_CONFIG_URI || this.configLocal.SPRING_CLOUD_CONFIG_URI}/${process.env.SPRING_APPLICATION_NAME || this.configLocal.SPRING_APPLICATION_NAME}
                    /${process.env.SPRING_PROFILES_ACTIVE || this.configLocal.SPRING_PROFILES_ACTIVE}/${process.env.SPRING_CLOUD_BRANCH || branchAux}`;

        CustomLogger.info(`Reading configuration from -> ${uri}`)
        return axios.get(uri)
            .then((config: any) => {
                const { data } = config;
                return this.parseResponse(data.propertySources[0]);
            }).catch(error => {
                CustomLogger.error(error.message);
                return of(this.configLocal);
            })
            ;
    }

    /**
     * Parse the properties by searching for existing ones in environment.config and
     * replacing with environment or default variables
     * 
     * @param propertySource properties node read from spring config.
     * @returns IEnv parsed object
     */
    private parseResponse(propertySource: PropertySource): IConfig {
        Object.keys(this.configLocal.CONFIG_VARIABLES).map((key) => {
            let springKey = key.toLowerCase().replace(/__/g, '.');
            let currentPropertie = propertySource.source[springKey];
            if (!currentPropertie) {
                CustomLogger.error(`Error reading configuration -> [${key}]`);
                return;
            }
            if (Number.isInteger(currentPropertie)) {
                this.configLocal.CONFIG_VARIABLES[key] = currentPropertie;
                return;
            }
            this.configLocal.CONFIG_VARIABLES[key] = this.applyRegex(currentPropertie);
        });
        return this.configLocal;
    }

    private applyRegex(value: string): string {
        var regex = new RegExp(/\${(\w+):(\S+)}/, 'gm')
        return value.replace(regex, (match, systemVariable, defaultValue) => {
            if (!process.env[systemVariable]) {
                CustomLogger.warn(`Environment variable not found -> [${systemVariable}]  -> is set by default ->  [${defaultValue}]`);
            }
            return process.env[systemVariable] || defaultValue;
        })
    }
}

export interface SpringConfigDto {
    name: string;
    profiles: [];
    label?: string;
    version: string;
    state?: string;
    propertySources: PropertySource[]
}

export interface PropertySource {
    name: string;
    source: any;
}

class CustomLogger {
    static startMessage = '[NSCC] -> ';

    static info(message: string) {
        console.log('\x1b[32m%s\x1b[0m', this.startMessage + message);
    }

    static warn(message: string) {
        console.log('\x1b[33m%s\x1b[0m', this.startMessage + message);
    }

    static error(message: string) {
        console.log('\x1b[31m%s\x1b[0m', this.startMessage + ' [ERROR] ' + message);
    }
}