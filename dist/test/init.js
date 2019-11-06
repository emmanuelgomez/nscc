"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spring_config_reader_1 = require("../spring.config.reader");
var devCon = /** @class */ (function () {
    function devCon() {
        this.SPRING_CLOUD_BRANCH = 'master';
        this.SPRING_APPLICATION_NAME = 'application';
        this.SPRING_PROFILES_ACTIVE = 'local';
        this.SPRING_CLOUD_CONFIG_URI = 'http://localhost:8888';
        this.CONFIG_VARIABLES = new ConfigVariables();
    }
    return devCon;
}());
var ConfigVariables = /** @class */ (function () {
    function ConfigVariables() {
        this.SAMPLE__PROPERTY = 'sampppppp';
    }
    return ConfigVariables;
}());
var spConf = new spring_config_reader_1.SpringConfigReader(new devCon());
spConf.getInitialConfig().then(function (conf) {
    console.log(conf.CONFIG_VARIABLES.SAMPLE__PROPERTY);
});
