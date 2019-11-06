import { IConfig } from './enviroment.config';
export declare class SpringConfigReader {
    /**
     * Settings readed after the first load.
     */
    private configReaded;
    private config;
    private configLocal;
    constructor(configDefault: IConfig);
    /**
     * Get the settings read after the first load.
     */
    getConfig(): IConfig;
    /**
     * Make the first configuration load, it must be called when starting the application.
     * Set the public configReaded object with the read settings.
     *
     * @returns IEnv settings object.
     */
    getInitialConfig(): Promise<IConfig | any>;
    /**
     * Start reading configurations from spring config or local.
     */
    private readConfig;
    /**
     * Parse the properties by searching for existing ones in environment.config and
     * replacing with environment or default variables
     *
     * @param propertySource properties node read from spring config.
     * @returns IEnv parsed object
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
