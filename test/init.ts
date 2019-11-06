import {SpringConfigReader} from '../spring.config.reader'
import {IConfig} from '../lib/enviroment.config';

class devCon implements IConfig{
    SPRING_CLOUD_BRANCH: string = 'master';
    SPRING_APPLICATION_NAME: string = 'application'; 
    SPRING_PROFILES_ACTIVE: string = 'local';
    SPRING_CLOUD_CONFIG_URI: string = 'http://localhost:8888';
    CONFIG_VARIABLES: ConfigVariables = new ConfigVariables();
}

class ConfigVariables {
    SAMPLE__PROPERTY: string = 'sampppppp';
}

let spConf: SpringConfigReader = new SpringConfigReader(new devCon());
spConf.getInitialConfig().then((conf: devCon) =>{
    console.log(conf.CONFIG_VARIABLES.SAMPLE__PROPERTY);
})