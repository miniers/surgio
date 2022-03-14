"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pkg = exports.categories = exports.utils = exports.SurgioCommand = void 0;
require("source-map-support/register");
require("./utils/patch-proxy");
const global_agent_1 = require("global-agent");
const common_bin_1 = __importDefault(require("common-bin"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const env2_1 = __importDefault(require("env2"));
const path_1 = require("path");
const update_notifier_1 = __importDefault(require("update-notifier"));
const logger_1 = require("@surgio/logger");
const utils_1 = require("./utils");
const filter = __importStar(require("./utils/filter"));
const error_helper_1 = require("./utils/error-helper");
const constant_1 = require("./constant");
// istanbul ignore next
if (!(0, utils_1.isNow)() &&
    !(0, utils_1.isHeroku)() &&
    !(0, utils_1.isGitHubActions)() &&
    !(0, utils_1.isGitLabCI)() &&
    !(0, utils_1.isRailway)()) {
    // Global proxy
    (0, global_agent_1.bootstrap)();
}
const envPath = (0, path_1.resolve)(process.cwd(), './.env');
const pkg = fs_extra_1.default.readJSONSync((0, path_1.join)(__dirname, '../package.json'));
exports.pkg = pkg;
class SurgioCommand extends common_bin_1.default {
    constructor(rawArgv) {
        super(rawArgv);
        // istanbul ignore next
        if (fs_extra_1.default.existsSync(envPath)) {
            (0, env2_1.default)(envPath);
        }
        (0, update_notifier_1.default)({ pkg: require('../package.json') }).notify();
        this.usage = '使用方法: surgio <command> [options]';
        this.load((0, path_1.join)(__dirname, './command'));
        this.options = {
            V: {
                alias: 'verbose',
                demandOption: false,
                describe: '打印调试日志',
                type: 'boolean',
            },
        };
        // 禁用 yargs 内部生成的 help 信息，似乎和 common-bin 的 load 有冲突
        this.yargs.help(false);
        // istanbul ignore next
        if (this.yargs.argv.verbose) {
            logger_1.transports.console.level = 'debug';
        }
    }
    errorHandler(err) {
        error_helper_1.errorHandler.call(this, err);
    }
}
exports.SurgioCommand = SurgioCommand;
exports.utils = Object.assign(Object.assign({}, filter), { isHeroku: utils_1.isHeroku,
    isNow: utils_1.isNow,
    isGitHubActions: utils_1.isGitHubActions,
    isGitLabCI: utils_1.isGitLabCI });
exports.categories = Object.assign({}, constant_1.CATEGORIES);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFxQztBQUNyQywrQkFBNkI7QUFFN0IsK0NBQXlDO0FBQ3pDLDREQUFpQztBQUNqQyx3REFBMEI7QUFDMUIsZ0RBQXdCO0FBQ3hCLCtCQUFxQztBQUVyQyxzRUFBNkM7QUFDN0MsMkNBQTRDO0FBRTVDLG1DQU1pQjtBQUNqQix1REFBeUM7QUFDekMsdURBQW9EO0FBQ3BELHlDQUF3QztBQUV4Qyx1QkFBdUI7QUFDdkIsSUFDRSxDQUFDLElBQUEsYUFBSyxHQUFFO0lBQ1IsQ0FBQyxJQUFBLGdCQUFRLEdBQUU7SUFDWCxDQUFDLElBQUEsdUJBQWUsR0FBRTtJQUNsQixDQUFDLElBQUEsa0JBQVUsR0FBRTtJQUNiLENBQUMsSUFBQSxpQkFBUyxHQUFFLEVBQ1o7SUFDQSxlQUFlO0lBQ2YsSUFBQSx3QkFBUyxHQUFFLENBQUM7Q0FDYjtBQUVELE1BQU0sT0FBTyxHQUFHLElBQUEsY0FBTyxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNqRCxNQUFNLEdBQUcsR0FBRyxrQkFBRSxDQUFDLFlBQVksQ0FBQyxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBZ0IsQ0FBQztBQW1EdEUsa0JBQUc7QUFqRFosTUFBYSxhQUFjLFNBQVEsb0JBQU87SUFDeEMsWUFBWSxPQUFrQjtRQUM1QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFZix1QkFBdUI7UUFDdkIsSUFBSSxrQkFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMxQixJQUFBLGNBQUksRUFBQyxPQUFPLENBQUMsQ0FBQztTQUNmO1FBRUQsSUFBQSx5QkFBYyxFQUFDLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUU3RCxJQUFJLENBQUMsS0FBSyxHQUFHLGtDQUFrQyxDQUFDO1FBRWhELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNiLENBQUMsRUFBRTtnQkFDRCxLQUFLLEVBQUUsU0FBUztnQkFDaEIsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixJQUFJLEVBQUUsU0FBUzthQUNoQjtTQUNGLENBQUM7UUFDRixtREFBbUQ7UUFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdkIsdUJBQXVCO1FBQ3ZCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzNCLG1CQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBRU0sWUFBWSxDQUFDLEdBQUc7UUFDckIsMkJBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7Q0FDRjtBQW5DRCxzQ0FtQ0M7QUFFWSxRQUFBLEtBQUssbUNBQ2IsTUFBTSxLQUNULFFBQVEsRUFBUixnQkFBUTtJQUNSLEtBQUssRUFBTCxhQUFLO0lBQ0wsZUFBZSxFQUFmLHVCQUFlO0lBQ2YsVUFBVSxFQUFWLGtCQUFVLElBQ1Y7QUFFVyxRQUFBLFVBQVUscUJBQ2xCLHFCQUFVLEVBQ2IifQ==