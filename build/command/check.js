"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// istanbul ignore file
const assert_1 = __importDefault(require("assert"));
const common_bin_1 = __importDefault(require("common-bin"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const listr_1 = __importDefault(require("listr"));
const inquirer_1 = __importDefault(require("inquirer"));
const config_1 = require("../utils/config");
const provider_1 = require("../provider");
const error_helper_1 = require("../utils/error-helper");
class CheckCommand extends common_bin_1.default {
    constructor(rawArgv) {
        super(rawArgv);
        this.usage = '使用方法: surgio check [provider]';
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
    async run(ctx) {
        const tasks = this.getTasks();
        const tasksResult = await tasks.run({
            cmdCtx: ctx,
        });
        const { nodeList } = tasksResult;
        if (!process.stdin.isTTY) {
            console.log(JSON.stringify(nodeList, null, 2));
            return;
        }
        const answers = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'node',
                message: '请选择节点',
                choices: nodeList.map((node) => ({
                    name: `${node.nodeName} - ${node.hostname}:${node.port}`,
                    value: node,
                })),
            },
        ]);
        console.log(JSON.stringify(answers.node, null, 2));
    }
    get description() {
        return '查询 Provider';
    }
    // istanbul ignore next
    errorHandler(err) {
        error_helper_1.errorHandler.call(this, err);
    }
    getTasks() {
        return new listr_1.default([
            {
                title: '获取 Provider 信息',
                task: async (ctx) => {
                    const { cmdCtx } = ctx;
                    (0, assert_1.default)(cmdCtx.argv._[0], '没有指定 Provider');
                    const providerName = cmdCtx.argv._[0];
                    const config = (0, config_1.loadConfig)(cmdCtx.cwd, cmdCtx.argv.config);
                    const filePath = path_1.default.resolve(config.providerDir, `./${providerName}.js`);
                    const file = fs_1.default.existsSync(filePath)
                        ? require(filePath)
                        : new Error('找不到该 Provider');
                    if (file instanceof Error) {
                        throw file;
                    }
                    const provider = await (0, provider_1.getProvider)(providerName, file);
                    ctx.nodeList = await provider.getNodeList();
                },
            },
        ]);
    }
}
module.exports = CheckCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvY29tbWFuZC9jaGVjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsdUJBQXVCO0FBQ3ZCLG9EQUE0QjtBQUM1Qiw0REFBOEM7QUFDOUMsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUN4QixrREFBMEI7QUFDMUIsd0RBQWdDO0FBR2hDLDRDQUE2QztBQUM3QywwQ0FBMEM7QUFDMUMsd0RBQXFEO0FBRXJELE1BQU0sWUFBYSxTQUFRLG9CQUFPO0lBQ2hDLFlBQVksT0FBa0I7UUFDNUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRywrQkFBK0IsQ0FBQztRQUM3QyxJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsQ0FBQyxFQUFFO2dCQUNELEtBQUssRUFBRSxRQUFRO2dCQUNmLFlBQVksRUFBRSxLQUFLO2dCQUNuQixRQUFRLEVBQUUsYUFBYTtnQkFDdkIsT0FBTyxFQUFFLGtCQUFrQjtnQkFDM0IsSUFBSSxFQUFFLFFBQVE7YUFDZjtTQUNGLENBQUM7SUFDSixDQUFDO0lBRU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHO1FBQ2xCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QixNQUFNLFdBQVcsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDbEMsTUFBTSxFQUFFLEdBQUc7U0FDWixDQUFDLENBQUM7UUFDSCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsV0FBVyxDQUFDO1FBRWpDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9DLE9BQU87U0FDUjtRQUVELE1BQU0sT0FBTyxHQUFHLE1BQU0sa0JBQVEsQ0FBQyxNQUFNLENBQUM7WUFDcEM7Z0JBQ0UsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLE1BQU07Z0JBQ1osT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLE9BQU8sRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMvQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxNQUFNLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtvQkFDeEQsS0FBSyxFQUFFLElBQUk7aUJBQ1osQ0FBQyxDQUFDO2FBQ0o7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsSUFBVyxXQUFXO1FBQ3BCLE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCx1QkFBdUI7SUFDaEIsWUFBWSxDQUFDLEdBQUc7UUFDckIsMkJBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTyxRQUFRO1FBQ2QsT0FBTyxJQUFJLGVBQUssQ0FHYjtZQUNEO2dCQUNFLEtBQUssRUFBRSxnQkFBZ0I7Z0JBQ3ZCLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7b0JBQ2xCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUM7b0JBRXZCLElBQUEsZ0JBQU0sRUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztvQkFFMUMsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RDLE1BQU0sTUFBTSxHQUFHLElBQUEsbUJBQVUsRUFBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzFELE1BQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQzNCLE1BQU0sQ0FBQyxXQUFXLEVBQ2xCLEtBQUssWUFBWSxLQUFLLENBQ3ZCLENBQUM7b0JBQ0YsTUFBTSxJQUFJLEdBQWdCLFlBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO3dCQUMvQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQzt3QkFDbkIsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUUvQixJQUFJLElBQUksWUFBWSxLQUFLLEVBQUU7d0JBQ3pCLE1BQU0sSUFBSSxDQUFDO3FCQUNaO29CQUVELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSxzQkFBVyxFQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFFdkQsR0FBRyxDQUFDLFFBQVEsR0FBRyxNQUFNLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDOUMsQ0FBQzthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsaUJBQVMsWUFBWSxDQUFDIn0=