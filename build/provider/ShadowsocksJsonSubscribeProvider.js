"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils");
const relayable_url_1 = __importDefault(require("../utils/relayable-url"));
const Provider_1 = __importDefault(require("./Provider"));
class ShadowsocksJsonSubscribeProvider extends Provider_1.default {
    constructor(name, config) {
        super(name, config);
        const schema = joi_1.default.object({
            url: joi_1.default.string()
                .uri({
                scheme: [/https?/],
            })
                .required(),
            udpRelay: joi_1.default.boolean().strict(),
        }).unknown();
        const { error } = schema.validate(config);
        // istanbul ignore next
        if (error) {
            throw error;
        }
        this._url = config.url;
        this.udpRelay = config.udpRelay;
    }
    // istanbul ignore next
    get url() {
        return (0, relayable_url_1.default)(this._url, this.relayUrl);
    }
    getNodeList() {
        return (0, utils_1.getShadowsocksJSONConfig)(this.url, this.udpRelay);
    }
}
exports.default = ShadowsocksJsonSubscribeProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhZG93c29ja3NKc29uU3Vic2NyaWJlUHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvcHJvdmlkZXIvU2hhZG93c29ja3NKc29uU3Vic2NyaWJlUHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBc0I7QUFFdEIsb0NBQW9EO0FBQ3BELDJFQUFrRDtBQUNsRCwwREFBa0M7QUFFbEMsTUFBcUIsZ0NBQWlDLFNBQVEsa0JBQVE7SUFJcEUsWUFBWSxJQUFZLEVBQUUsTUFBOEM7UUFDdEUsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVwQixNQUFNLE1BQU0sR0FBRyxhQUFHLENBQUMsTUFBTSxDQUFDO1lBQ3hCLEdBQUcsRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO2lCQUNkLEdBQUcsQ0FBQztnQkFDSCxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7YUFDbkIsQ0FBQztpQkFDRCxRQUFRLEVBQUU7WUFDYixRQUFRLEVBQUUsYUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRTtTQUNqQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFYixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUxQyx1QkFBdUI7UUFDdkIsSUFBSSxLQUFLLEVBQUU7WUFDVCxNQUFNLEtBQUssQ0FBQztTQUNiO1FBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNsQyxDQUFDO0lBRUQsdUJBQXVCO0lBQ3ZCLElBQVcsR0FBRztRQUNaLE9BQU8sSUFBQSx1QkFBWSxFQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFTSxXQUFXO1FBQ2hCLE9BQU8sSUFBQSxnQ0FBd0IsRUFBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzRCxDQUFDO0NBQ0Y7QUFuQ0QsbURBbUNDIn0=