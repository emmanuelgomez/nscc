export interface IConfig {
    /**
     * Para lograr compatibilidad con estructura de configuracion dentro
     * de yml de spring cloud se deben seguir las siguientes convenciones:
     *
     * 1- Para representar los niveles dentro del archivo yml se debe utilizar doble underscore '__'
     *    Ejemplo: 'app.host.ig_db'  ->  'APP__HOST__IG_DB'
     *
     * 2- Caracteres especiales en nombre de variable solo se permite simple underscore '_'
     *    No se permite '.' , '-' , etc
     *
     * 3- Las variables 'ENVIRONMENT' y 'SPRING_CLOUD_HOST' solo se utilizan para la carga desde spring cloud.
     *    Si 'ENVIRONMENT' == 'local' se carga por defecto la configuracion establecida en este fichero.
     */
    /**
     * Para lograr compatibilidad con estructura de configuracion dentro
     * de yml de spring cloud se deben seguir las siguientes convenciones:
     *
     * 1- Para representar los niveles dentro del archivo yml se debe utilizar doble underscore '__'
     *    Ejemplo: 'app.host.ig_db'  ->  'APP__HOST__IG_DB'
     *
     * 2- Caracteres especiales en nombre de variable solo se permite simple underscore '_'
     *    No se permite '.' , '-' , etc
     *
     * 3- Las variables 'ENVIRONMENT' , 'SPRING_CLOUD_HOST' y 'SPRING_BRANCH_LABEL' solo se utilizan para la carga desde spring cloud.
     *    Si 'ENVIRONMENT' == 'local' se carga por defecto la configuracion establecida en este fichero.
     *
     */
    SPRING_APPLICATION_NAME: string;
    SPRING_CLOUD_BRANCH: string;
    SPRING_PROFILES_ACTIVE: string;
    SPRING_CLOUD_CONFIG_URI: string;
    CONFIG_VARIABLES: any;
}
