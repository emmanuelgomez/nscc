export interface IConfig {
    /**
     * To achieve compatibility with configuration structure within
     * from spring cloud yml the following conventions must be followed:
     *
     * 1- To represent the levels within the yml file you must use double underscore '__'
     * Example: 'app.host.ig_db' -> 'APP__HOST__IG_DB'
     *
     * 2- Special characters in variable name only simple underscore '_' is allowed
     *    Not allowed '.' , '-' , etc
     *
     * 3- The variables 'ENVIRONMENT' and 'SPRING_CLOUD_HOST' are only used for loading from the spring cloud.
     * If 'ENVIRONMENT' == 'local' the configuration set in this file is loaded by default.
     **/
    SPRING_APPLICATION_NAME: string;
    SPRING_CLOUD_BRANCH: string;
    SPRING_PROFILES_ACTIVE: string;
    SPRING_CLOUD_CONFIG_URI: string;
    CONFIG_VARIABLES: any;
}
