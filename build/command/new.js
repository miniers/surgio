"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// istanbul ignore file
const logger_1 = require("@surgio/logger");
const path_1 = require("path");
const hygen_1 = require("@royli/hygen");
const logger_2 = __importDefault(require("@royli/hygen/lib/logger"));
const common_bin_1 = __importDefault(require("common-bin"));
const defaultTemplates = (0, path_1.join)(__dirname, '../../hygen-template');
const logger = (0, logger_1.createLogger)({ service: 'surgio:NewCommand' });
class NewCommand extends common_bin_1.default {
    constructor(rawArgv) {
        super(rawArgv);
        this.usage = '使用方法: surgio new [provider|template|artifact]';
        this.options = {
            c: {
                alias: 'config',
                demandOption: false,
                describe: 'Surgio 配置文件',
                default: './surgio.conf.js',
                type: 'string',
            },
        };
    }
    // istanbul ignore next
    get description() {
        return '新建文件助手';
    }
    async run(ctx) {
        if (!ctx.rawArgv.length) {
            logger.error('请指定新建类型\n');
            this.showHelp();
            return;
        }
        const args = [...ctx.rawArgv].concat('new'); // [type] new ...
        (0, hygen_1.runner)(args, {
            templates: defaultTemplates,
            cwd: process.cwd(),
            logger: new logger_2.default(console.log.bind(console)),
            createPrompter: () => require('inquirer'),
            exec: (action, body) => {
                const opts = body && body.length > 0 ? { input: body } : {};
                return require('execa').shell(action, opts);
            },
            debug: !!process.env.DEBUG,
        });
    }
}
module.exports = NewCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL2NvbW1hbmQvbmV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSx1QkFBdUI7QUFDdkIsMkNBQThDO0FBQzlDLCtCQUE0QjtBQUM1Qix3Q0FBc0M7QUFDdEMscUVBQTZDO0FBQzdDLDREQUE4QztBQUU5QyxNQUFNLGdCQUFnQixHQUFHLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBQ2pFLE1BQU0sTUFBTSxHQUFHLElBQUEscUJBQVksRUFBQyxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxDQUFDLENBQUM7QUFFOUQsTUFBTSxVQUFXLFNBQVEsb0JBQU87SUFDOUIsWUFBWSxPQUFrQjtRQUM1QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLCtDQUErQyxDQUFDO1FBQzdELElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDYixDQUFDLEVBQUU7Z0JBQ0QsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixPQUFPLEVBQUUsa0JBQWtCO2dCQUMzQixJQUFJLEVBQUUsUUFBUTthQUNmO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCx1QkFBdUI7SUFDdkIsSUFBVyxXQUFXO1FBQ3BCLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFTSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQVk7UUFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLE9BQU87U0FDUjtRQUVELE1BQU0sSUFBSSxHQUFhLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCO1FBRXhFLElBQUEsY0FBTSxFQUFDLElBQUksRUFBRTtZQUNYLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUU7WUFDbEIsTUFBTSxFQUFFLElBQUksZ0JBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QyxjQUFjLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztZQUN6QyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQ3JCLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDNUQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5QyxDQUFDO1lBQ0QsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUs7U0FDM0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsaUJBQVMsVUFBVSxDQUFDIn0=