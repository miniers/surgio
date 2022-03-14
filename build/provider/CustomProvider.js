"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const types_1 = require("../types");
const Provider_1 = __importDefault(require("./Provider"));
class CustomProvider extends Provider_1.default {
    constructor(name, config) {
        super(name, config);
        const nodeSchema = joi_1.default.object({
            type: joi_1.default.string()
                .valid(...Object.values(types_1.NodeTypeEnum))
                .required(),
            nodeName: joi_1.default.string().required(),
            enable: joi_1.default.boolean().strict(),
            tfo: joi_1.default.boolean().strict(),
            mptcp: joi_1.default.boolean().strict(),
            binPath: joi_1.default.string(),
            localPort: joi_1.default.number(),
            underlyingProxy: joi_1.default.string(),
        }).unknown();
        const schema = joi_1.default.object({
            nodeList: joi_1.default.array().items(nodeSchema).required(),
        }).unknown();
        const { error } = schema.validate(config);
        // istanbul ignore next
        if (error) {
            throw error;
        }
        this.nodeList = config.nodeList;
    }
    async getNodeList() {
        const checkSchema = joi_1.default.object({
            'udp-relay': joi_1.default.bool().strict(),
        }).unknown();
        return this.nodeList.map((item) => {
            const { error } = checkSchema.validate(item);
            // istanbul ignore next
            if (error) {
                throw error;
            }
            return item;
        });
    }
}
exports.default = CustomProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3VzdG9tUHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvcHJvdmlkZXIvQ3VzdG9tUHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBc0I7QUFDdEIsb0NBSWtCO0FBQ2xCLDBEQUFrQztBQUVsQyxNQUFxQixjQUFlLFNBQVEsa0JBQVE7SUFHbEQsWUFBWSxJQUFZLEVBQUUsTUFBNEI7UUFDcEQsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVwQixNQUFNLFVBQVUsR0FBRyxhQUFHLENBQUMsTUFBTSxDQUFDO1lBQzVCLElBQUksRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO2lCQUNmLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQVMsb0JBQVksQ0FBQyxDQUFDO2lCQUM3QyxRQUFRLEVBQUU7WUFDYixRQUFRLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtZQUNqQyxNQUFNLEVBQUUsYUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRTtZQUM5QixHQUFHLEVBQUUsYUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRTtZQUMzQixLQUFLLEVBQUUsYUFBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRTtZQUM3QixPQUFPLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTtZQUNyQixTQUFTLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTtZQUN2QixlQUFlLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRTtTQUM5QixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixNQUFNLE1BQU0sR0FBRyxhQUFHLENBQUMsTUFBTSxDQUFDO1lBQ3hCLFFBQVEsRUFBRSxhQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtTQUNuRCxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFYixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUxQyx1QkFBdUI7UUFDdkIsSUFBSSxLQUFLLEVBQUU7WUFDVCxNQUFNLEtBQUssQ0FBQztTQUNiO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xDLENBQUM7SUFFTSxLQUFLLENBQUMsV0FBVztRQUN0QixNQUFNLFdBQVcsR0FBRyxhQUFHLENBQUMsTUFBTSxDQUFDO1lBQzdCLFdBQVcsRUFBRSxhQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFO1NBQ2pDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUViLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNoQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUU3Qyx1QkFBdUI7WUFDdkIsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsTUFBTSxLQUFLLENBQUM7YUFDYjtZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFoREQsaUNBZ0RDIn0=