"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const common_bin_1 = __importDefault(require("common-bin"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../utils/config");
const generate_1 = __importDefault(require("../generate"));
const error_helper_1 = require("../utils/error-helper");
const linter_1 = require("../utils/linter");
class GenerateCommand extends common_bin_1.default {
    constructor(rawArgv) {
        super(rawArgv);
        this.usage = '使用方法: surgio generate';
        this.options = {
            o: {
                type: 'string',
                alias: 'output',
                description: '生成规则的目录',
            },
            c: {
                alias: 'config',
                default: './surgio.conf.js',
            },
            'cache-snippet': {
                type: 'boolean',
                default: false,
                description: '缓存远程片段',
            },
            'skip-fail': {
                type: 'boolean',
                default: false,
                description: '跳过生成失败的 Artifact',
            },
            'skip-lint': {
                type: 'boolean',
                default: false,
                description: '跳过代码检查',
            },
        };
    }
    async run(ctx) {
        if (!ctx.argv.skipLint) {
            const result = await (0, linter_1.checkAndFix)(ctx.cwd);
            if (!result) {
                throw new Error('JS 语法检查不通过，请根据提示修改文件（参考 http://url.royli.dev/SeB6m）');
            }
        }
        const config = (0, config_1.loadConfig)(ctx.cwd, ctx.argv.config, Object.assign({}, (ctx.argv.output
            ? {
                output: path_1.default.resolve(ctx.cwd, ctx.argv.output),
            }
            : null)));
        await (0, generate_1.default)(config, ctx.argv.skipFail, ctx.argv.cacheSnippet);
    }
    // istanbul ignore next
    get description() {
        return '生成规则';
    }
    // istanbul ignore next
    errorHandler(err) {
        error_helper_1.errorHandler.call(this, err);
    }
}
module.exports = GenerateCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvY29tbWFuZC9nZW5lcmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsNERBQWlDO0FBQ2pDLGdEQUF3QjtBQUV4Qiw0Q0FBNkM7QUFDN0MsMkRBQW1DO0FBQ25DLHdEQUFxRDtBQUNyRCw0Q0FBOEM7QUFFOUMsTUFBTSxlQUFnQixTQUFRLG9CQUFPO0lBQ25DLFlBQVksT0FBa0I7UUFDNUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztRQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsQ0FBQyxFQUFFO2dCQUNELElBQUksRUFBRSxRQUFRO2dCQUNkLEtBQUssRUFBRSxRQUFRO2dCQUNmLFdBQVcsRUFBRSxTQUFTO2FBQ3ZCO1lBQ0QsQ0FBQyxFQUFFO2dCQUNELEtBQUssRUFBRSxRQUFRO2dCQUNmLE9BQU8sRUFBRSxrQkFBa0I7YUFDNUI7WUFDRCxlQUFlLEVBQUU7Z0JBQ2YsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsV0FBVyxFQUFFLFFBQVE7YUFDdEI7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsV0FBVyxFQUFFLGtCQUFrQjthQUNoQztZQUNELFdBQVcsRUFBRTtnQkFDWCxJQUFJLEVBQUUsU0FBUztnQkFDZixPQUFPLEVBQUUsS0FBSztnQkFDZCxXQUFXLEVBQUUsUUFBUTthQUN0QjtTQUNGLENBQUM7SUFDSixDQUFDO0lBRU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHO1FBQ2xCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUN0QixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEsb0JBQVcsRUFBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFMUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDWCxNQUFNLElBQUksS0FBSyxDQUNiLHFEQUFxRCxDQUN0RCxDQUFDO2FBQ0g7U0FDRjtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUEsbUJBQVUsRUFBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxvQkFFN0MsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU07WUFDakIsQ0FBQyxDQUFDO2dCQUNFLE1BQU0sRUFBRSxjQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDL0M7WUFDSCxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQ1QsQ0FBQztRQUVILE1BQU0sSUFBQSxrQkFBUSxFQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCx1QkFBdUI7SUFDdkIsSUFBVyxXQUFXO1FBQ3BCLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCx1QkFBdUI7SUFDaEIsWUFBWSxDQUFDLEdBQUc7UUFDckIsMkJBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDRjtBQUVELGlCQUFTLGVBQWUsQ0FBQyJ9