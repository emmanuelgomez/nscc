import { IConfig } from './enviroment.config';
export declare class SpringConfigReader {
    /**
     * Configuraciones leidas, luego de la primera carga
     */
    private configReaded;
    private config;
    private configLocal;
    constructor(configDefault: IConfig);
    /**
     * Obtiene las configuraciones leidas luego de la primera carga.
     */
    getConfig(): IConfig;
    /**
     * Realiza la primera carga de configuraciones, se debe llamar al iniciar la aplicación.
     * Setea el objeto public configReaded con las configuraciones leidas.
     *
     * @returns IEnv objeto de configuraciones
     */
    getInitialConfig(): Promise<IConfig | any>;
    /**
     * Inicia la lectura de configuraciones desde spring config o local
     */
    private readConfig;
    /**
     * Parsea las propiedades buscando las existentes en environment.config y
     * reemplazando con variables de entorno o default
     *
     * @param propertySource nodo de las propiedades leidas desde spring config
     * @returns IEnv objeto parseado
     */
    private parseResponse;
    private applyRegex;
}
export interface SpringConfigDto {
    name: string;
    profiles: [];
    label?: string;
    version: string;
    state?: string;
    propertySources: PropertySource[];
}
export interface PropertySource {
    name: string;
    source: any;
}
