"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var rxjs_1 = require("rxjs");
var SpringConfigReader = /** @class */ (function () {
    function SpringConfigReader(configDefault) {
        this.configLocal = configDefault;
        this.config = this.readConfig();
    }
    /**
     * Obtiene las configuraciones leidas luego de la primera carga.
     */
    SpringConfigReader.prototype.getConfig = function () {
        return this.configReaded;
    };
    /**
     * Realiza la primera carga de configuraciones, se debe llamar al iniciar la aplicación.
     * Setea el objeto public configReaded con las configuraciones leidas.
     *
     * @returns IEnv objeto de configuraciones
     */
    SpringConfigReader.prototype.getInitialConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, this.config];
                    case 1:
                        _a.config = _b.sent();
                        this.configReaded = this.config;
                        CustomLogger.info("Configuracion leida -> " + JSON.stringify(this.config.CONFIG_VARIABLES));
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        throw new Error("[ERROR] Configuracion no encontrada");
                    case 3: return [2 /*return*/, this.config];
                }
            });
        });
    };
    /**
     * Inicia la lectura de configuraciones desde spring config o local
     */
    SpringConfigReader.prototype.readConfig = function () {
        var _this = this;
        if (this.configLocal.SPRING_PROFILES_ACTIVE == 'local')
            return new Promise(function (_) { return _this.configLocal; });
        var branchAux = process.env.SPRING_CLOUD_BRANCH || this.configLocal.SPRING_CLOUD_BRANCH;
        branchAux = branchAux.replace(/\//g, '(_)');
        var uri = (process.env.SPRING_CLOUD_CONFIG_URI || this.configLocal.SPRING_CLOUD_CONFIG_URI) + "/" + (process.env.SPRING_APPLICATION_NAME || this.configLocal.SPRING_APPLICATION_NAME) + "\n                    /" + (process.env.SPRING_PROFILES_ACTIVE || this.configLocal.SPRING_PROFILES_ACTIVE) + "/" + (process.env.SPRING_CLOUD_BRANCH || branchAux);
        CustomLogger.info("Leyendo configuracion desde -> " + uri);
        return axios_1.default.get(uri)
            .then(function (config) {
            var data = config.data;
            return _this.parseResponse(data.propertySources[0]);
        }).catch(function (error) {
            CustomLogger.error(error.message);
            return rxjs_1.of(_this.configLocal);
        });
    };
    /**
     * Parsea las propiedades buscando las existentes en environment.config y
     * reemplazando con variables de entorno o default
     *
     * @param propertySource nodo de las propiedades leidas desde spring config
     * @returns IEnv objeto parseado
     */
    SpringConfigReader.prototype.parseResponse = function (propertySource) {
        var _this = this;
        Object.keys(this.configLocal.CONFIG_VARIABLES).map(function (key) {
            // if (key == 'SPRING_PROFILES_ACTIVE' || key == 'SPRING_CLOUD_CONFIG_URI' || key == 'APPLICATION_NAME' ) return;
            var springKey = key.toLowerCase().replace(/__/g, '.');
            var currentPropertie = propertySource.source[springKey];
            if (!currentPropertie) {
                CustomLogger.error("Error leyendo configuracion -> [" + key + "]");
                return;
            }
            if (Number.isInteger(currentPropertie)) {
                _this.configLocal.CONFIG_VARIABLES[key] = currentPropertie;
                return;
            }
            _this.configLocal.CONFIG_VARIABLES[key] = _this.applyRegex(currentPropertie);
        });
        return this.configLocal;
    };
    SpringConfigReader.prototype.applyRegex = function (value) {
        var regex = new RegExp(/\${(\w+):(\S+)}/, 'gm');
        return value.replace(regex, function (match, systemVariable, defaultValue) {
            if (!process.env[systemVariable]) {
                CustomLogger.warn("Variable de entorno no encontrada -> [" + systemVariable + "]  -> se establece por defecto ->  [" + defaultValue + "]");
            }
            return process.env[systemVariable] || defaultValue;
        });
    };
    return SpringConfigReader;
}());
exports.SpringConfigReader = SpringConfigReader;
var CustomLogger = /** @class */ (function () {
    function CustomLogger() {
    }
    CustomLogger.info = function (message) {
        console.log('\x1b[32m%s\x1b[0m', this.startMessage + message);
    };
    CustomLogger.warn = function (message) {
        console.log('\x1b[33m%s\x1b[0m', this.startMessage + message);
    };
    CustomLogger.error = function (message) {
        console.log('\x1b[31m%s\x1b[0m', this.startMessage + ' [ERROR] ' + message);
    };
    CustomLogger.startMessage = '[SpringConfigReader] -> ';
    return CustomLogger;
}());
