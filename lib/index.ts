import axios from 'axios'
import { of } from 'rxjs';
import { IConfig } from './enviroment.config';


export class SpringConfigReader {

    /**
     * Configuraciones leidas, luego de la primera carga
     */
    private configReaded!: IConfig;

    private config: Promise<IConfig> | IConfig;
    private configLocal: IConfig;
    constructor(configDefault: IConfig) {
        this.configLocal = configDefault;
        this.config = this.readConfig();
    }

    /**
     * Obtiene las configuraciones leidas luego de la primera carga. 
     */
    public getConfig(): IConfig {
        return this.configReaded;
    }

    /**
     * Realiza la primera carga de configuraciones, se debe llamar al iniciar la aplicación.
     * Setea el objeto public configReaded con las configuraciones leidas.
     * 
     * @returns IEnv objeto de configuraciones
     */
    public async getInitialConfig(): Promise<IConfig | any> {
        try {
            this.config = await this.config;
            this.configReaded = this.config;
            CustomLogger.info(`Configuracion leida -> ${JSON.stringify(this.config.CONFIG_VARIABLES)}`);
        }
        catch (error) {
            throw new Error(`[ERROR] Configuracion no encontrada`);
        }
        return this.config;
    }

    /**
     * Inicia la lectura de configuraciones desde spring config o local
     */
    private readConfig(): Promise<IConfig | any> {
        if (this.configLocal.SPRING_PROFILES_ACTIVE == 'local') return new Promise(_ => { return this.configLocal });
        let branchAux: string = process.env.SPRING_CLOUD_BRANCH || this.configLocal.SPRING_CLOUD_BRANCH;
        branchAux = branchAux.replace(/\//g, '(_)');
        let uri = `${process.env.SPRING_CLOUD_CONFIG_URI || this.configLocal.SPRING_CLOUD_CONFIG_URI}/${process.env.SPRING_APPLICATION_NAME || this.configLocal.SPRING_APPLICATION_NAME}/${process.env.SPRING_PROFILES_ACTIVE || this.configLocal.SPRING_PROFILES_ACTIVE}/${process.env.SPRING_CLOUD_BRANCH || branchAux}`;
        CustomLogger.info(`Leyendo configuracion desde -> ${uri}`)
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
     * Parsea las propiedades buscando las existentes en environment.config y
     * reemplazando con variables de entorno o default
     * 
     * @param propertySource nodo de las propiedades leidas desde spring config
     * @returns IEnv objeto parseado 
     */
    private parseResponse(propertySource: PropertySource): IConfig {
        Object.keys(this.configLocal.CONFIG_VARIABLES).map((key) => {
            // if (key == 'SPRING_PROFILES_ACTIVE' || key == 'SPRING_CLOUD_CONFIG_URI' || key == 'APPLICATION_NAME' ) return;
            let springKey = key.toLowerCase().replace(/__/g, '.');
            let currentPropertie = propertySource.source[springKey];
            if (!currentPropertie) {
                CustomLogger.error(`Error leyendo configuracion -> [${key}]`);
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
                CustomLogger.warn(`Variable de entorno no encontrada -> [${systemVariable}]  -> se establece por defecto ->  [${defaultValue}]`);
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
    static startMessage = '[SpringConfigReader] -> ';

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