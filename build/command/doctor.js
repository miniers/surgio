"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// istanbul ignore file
const common_bin_1 = __importDefault(require("common-bin"));
const check_node_version_1 = __importDefault(require("check-node-version"));
const util_1 = require("util");
const path_1 = require("path");
const utils_1 = require("../utils");
const error_helper_1 = require("../utils/error-helper");
class DoctorCommand extends common_bin_1.default {
    constructor(rawArgv) {
        super(rawArgv);
        this.usage = '使用方法: surgio doctor';
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
        const doctorInfo = await DoctorCommand.generateDoctorInfo(ctx.cwd);
        doctorInfo.forEach((item) => {
            console.log(item);
        });
    }
    // istanbul ignore next
    get description() {
        return '检查运行环境';
    }
    // istanbul ignore next
    errorHandler(err) {
        error_helper_1.errorHandler.call(this, err);
    }
    static async generateDoctorInfo(cwd) {
        const doctorInfo = [];
        const pkg = require('../../package.json');
        const checkInfo = (0, utils_1.isPkgBundle)()
            ? null
            : await (0, util_1.promisify)(check_node_version_1.default)();
        try {
            const gatewayPkg = require((0, path_1.join)(cwd, 'node_modules/@surgio/gateway/package.json'));
            doctorInfo.push(`@surgio/gateway: ${gatewayPkg.version}`);
        }
        catch (_) {
            // no catch
        }
        doctorInfo.push(`surgio: ${pkg.version} (${(0, path_1.join)(__dirname, '../..')})`);
        if (checkInfo) {
            Object.keys(checkInfo.versions).forEach((key) => {
                const version = checkInfo.versions[key].version;
                if (version) {
                    if (key === 'node') {
                        doctorInfo.push(`${key}: ${version} (${process.execPath})`);
                    }
                    else {
                        doctorInfo.push(`${key}: ${version}`);
                    }
                }
            });
        }
        return doctorInfo;
    }
}
module.exports = DoctorCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL2NvbW1hbmQvZG9jdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSx1QkFBdUI7QUFDdkIsNERBQWlDO0FBQ2pDLDRFQUF1QztBQUN2QywrQkFBaUM7QUFDakMsK0JBQTRCO0FBRTVCLG9DQUF1QztBQUN2Qyx3REFBcUQ7QUFLckQsTUFBTSxhQUFjLFNBQVEsb0JBQU87SUFDakMsWUFBWSxPQUFrQjtRQUM1QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLHFCQUFxQixDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDYixDQUFDLEVBQUU7Z0JBQ0QsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixPQUFPLEVBQUUsa0JBQWtCO2dCQUMzQixJQUFJLEVBQUUsUUFBUTthQUNmO1NBQ0YsQ0FBQztJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUc7UUFDbEIsTUFBTSxVQUFVLEdBQUcsTUFBTSxhQUFhLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRW5FLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHVCQUF1QjtJQUN2QixJQUFXLFdBQVc7UUFDcEIsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVELHVCQUF1QjtJQUNoQixZQUFZLENBQUMsR0FBRztRQUNyQiwyQkFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQ3BDLEdBQVc7UUFFWCxNQUFNLFVBQVUsR0FBYSxFQUFFLENBQUM7UUFDaEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDMUMsTUFBTSxTQUFTLEdBQUcsSUFBQSxtQkFBVyxHQUFFO1lBQzdCLENBQUMsQ0FBQyxJQUFJO1lBQ04sQ0FBQyxDQUFDLE1BQU0sSUFBQSxnQkFBUyxFQUFZLDRCQUFLLENBQUMsRUFBRSxDQUFDO1FBRXhDLElBQUk7WUFDRixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBQSxXQUFJLEVBQzdCLEdBQUcsRUFDSCwyQ0FBMkMsQ0FDNUMsQ0FBQyxDQUFDO1lBQ0gsVUFBVSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDM0Q7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLFdBQVc7U0FDWjtRQUVELFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsT0FBTyxLQUFLLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFeEUsSUFBSSxTQUFTLEVBQUU7WUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDOUMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ2hELElBQUksT0FBTyxFQUFFO29CQUNYLElBQUksR0FBRyxLQUFLLE1BQU0sRUFBRTt3QkFDbEIsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxPQUFPLEtBQUssT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7cUJBQzdEO3lCQUFNO3dCQUNMLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssT0FBTyxFQUFFLENBQUMsQ0FBQztxQkFDdkM7aUJBQ0Y7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztDQUNGO0FBRUQsaUJBQVMsYUFBYSxDQUFDIn0=