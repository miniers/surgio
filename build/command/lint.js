"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// istanbul ignore file
const common_bin_1 = __importDefault(require("common-bin"));
const linter_1 = require("../utils/linter");
class LintCommand extends common_bin_1.default {
    constructor(rawArgv) {
        super(rawArgv);
        this.usage = '使用方法: surgio lint [--fix]';
        this.options = {
            fix: {
                default: false,
                describe: '自动修复部分 Lint 错误',
                type: 'boolean',
            },
        };
    }
    // istanbul ignore next
    get description() {
        return '运行 JS 语法检查';
    }
    async run(ctx) {
        let result;
        if (ctx.argv.fix) {
            result = await (0, linter_1.checkAndFix)(ctx.cwd);
        }
        else {
            result = await (0, linter_1.check)(ctx.cwd);
        }
        if (!result) {
            console.warn('⚠️  JS 语法检查不通过，请根据提示修改文件（可添加参数 --fix 自动修复部分错误， 参考 http://url.royli.dev/SeB6m）');
            process.exit(1);
        }
        else {
            console.log('✅  JS 语法检查通过');
        }
    }
}
module.exports = LintCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21tYW5kL2xpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHVCQUF1QjtBQUN2Qiw0REFBaUM7QUFDakMsNENBQXFEO0FBRXJELE1BQU0sV0FBWSxTQUFRLG9CQUFPO0lBQy9CLFlBQVksT0FBa0I7UUFDNUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRywyQkFBMkIsQ0FBQztRQUN6QyxJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsR0FBRyxFQUFFO2dCQUNILE9BQU8sRUFBRSxLQUFLO2dCQUNkLFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLElBQUksRUFBRSxTQUFTO2FBQ2hCO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCx1QkFBdUI7SUFDdkIsSUFBVyxXQUFXO1FBQ3BCLE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFTSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUc7UUFDbEIsSUFBSSxNQUFNLENBQUM7UUFFWCxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2hCLE1BQU0sR0FBRyxNQUFNLElBQUEsb0JBQVcsRUFBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckM7YUFBTTtZQUNMLE1BQU0sR0FBRyxNQUFNLElBQUEsY0FBSyxFQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMvQjtRQUVELElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxPQUFPLENBQUMsSUFBSSxDQUNWLCtFQUErRSxDQUNoRixDQUFDO1lBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQjthQUFNO1lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUM3QjtJQUNILENBQUM7Q0FDRjtBQUVELGlCQUFTLFdBQVcsQ0FBQyJ9