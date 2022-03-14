"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// istanbul ignore file
const ali_oss_1 = __importDefault(require("ali-oss"));
const common_bin_1 = __importDefault(require("common-bin"));
const fs_1 = __importDefault(require("fs"));
const node_dir_1 = __importDefault(require("node-dir"));
const ora_1 = __importDefault(require("ora"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../utils/config");
const error_helper_1 = require("../utils/error-helper");
class GenerateCommand extends common_bin_1.default {
    constructor(rawArgv) {
        super(rawArgv);
        this.usage = '使用方法: surgio upload';
        this.spinner = (0, ora_1.default)();
        this.options = {
            o: {
                type: 'string',
                alias: 'output',
                description: '生成规则的目录',
            },
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
        var _a, _b, _c, _d, _e, _f;
        const config = (0, config_1.loadConfig)(ctx.cwd, ctx.argv.config, Object.assign({}, (ctx.argv.output
            ? {
                output: path_1.default.resolve(ctx.cwd, ctx.argv.output),
            }
            : null)));
        const ossConfig = {
            region: (_a = config === null || config === void 0 ? void 0 : config.upload) === null || _a === void 0 ? void 0 : _a.region,
            bucket: (_b = config === null || config === void 0 ? void 0 : config.upload) === null || _b === void 0 ? void 0 : _b.bucket,
            endpoint: (_c = config === null || config === void 0 ? void 0 : config.upload) === null || _c === void 0 ? void 0 : _c.endpoint,
            accessKeyId: ctx.env.OSS_ACCESS_KEY_ID || ((_d = config === null || config === void 0 ? void 0 : config.upload) === null || _d === void 0 ? void 0 : _d.accessKeyId),
            accessKeySecret: ctx.env.OSS_ACCESS_KEY_SECRET || ((_e = config === null || config === void 0 ? void 0 : config.upload) === null || _e === void 0 ? void 0 : _e.accessKeySecret),
        };
        const client = new ali_oss_1.default(Object.assign({ secure: true }, ossConfig));
        const prefix = ((_f = config === null || config === void 0 ? void 0 : config.upload) === null || _f === void 0 ? void 0 : _f.prefix) || '/';
        const fileList = await node_dir_1.default.promiseFiles(config.output);
        const files = fileList.map((filePath) => ({
            fileName: path_1.default.basename(filePath),
            filePath,
        }));
        const fileNameList = files.map((file) => file.fileName);
        const upload = () => {
            return Promise.all(files.map((file) => {
                const { fileName, filePath } = file;
                const objectName = `${prefix}${fileName}`;
                const readStream = fs_1.default.createReadStream(filePath);
                return client.put(objectName, readStream, {
                    mime: 'text/plain; charset=utf-8',
                    headers: {
                        'Cache-Control': 'private, no-cache, no-store',
                    },
                });
            }));
        };
        const deleteUnwanted = async () => {
            const list = await client.list({
                prefix,
                delimiter: '/',
            });
            const deleteList = [];
            for (const key in list.objects) {
                if (list.objects.hasOwnProperty(key)) {
                    const object = list.objects[key];
                    const objectName = object.name.replace(prefix, '');
                    const isExist = fileNameList.indexOf(objectName) > -1;
                    if (objectName && !isExist) {
                        deleteList.push(object.name);
                    }
                }
            }
            if (deleteList.length) {
                await client.deleteMulti(deleteList);
            }
        };
        this.spinner.start('开始上传到阿里云 OSS');
        await upload();
        await deleteUnwanted();
        this.spinner.succeed();
    }
    // istanbul ignore next
    get description() {
        return '上传规则到阿里云 OSS';
    }
    // istanbul ignore next
    errorHandler(err) {
        this.spinner.fail();
        error_helper_1.errorHandler.call(this, err);
    }
}
module.exports = GenerateCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL2NvbW1hbmQvdXBsb2FkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSx1QkFBdUI7QUFDdkIsc0RBQTBCO0FBQzFCLDREQUFpQztBQUNqQyw0Q0FBb0I7QUFDcEIsd0RBQTJCO0FBQzNCLDhDQUErQjtBQUMvQixnREFBd0I7QUFFeEIsNENBQTZDO0FBQzdDLHdEQUFxRDtBQUVyRCxNQUFNLGVBQWdCLFNBQVEsb0JBQU87SUFHbkMsWUFBWSxPQUFrQjtRQUM1QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLHFCQUFxQixDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBQSxhQUFHLEdBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsQ0FBQyxFQUFFO2dCQUNELElBQUksRUFBRSxRQUFRO2dCQUNkLEtBQUssRUFBRSxRQUFRO2dCQUNmLFdBQVcsRUFBRSxTQUFTO2FBQ3ZCO1lBQ0QsQ0FBQyxFQUFFO2dCQUNELEtBQUssRUFBRSxRQUFRO2dCQUNmLFlBQVksRUFBRSxLQUFLO2dCQUNuQixRQUFRLEVBQUUsYUFBYTtnQkFDdkIsT0FBTyxFQUFFLGtCQUFrQjtnQkFDM0IsSUFBSSxFQUFFLFFBQVE7YUFDZjtTQUNGLENBQUM7SUFDSixDQUFDO0lBRU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHOztRQUNsQixNQUFNLE1BQU0sR0FBRyxJQUFBLG1CQUFVLEVBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sb0JBQzdDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQ2pCLENBQUMsQ0FBQztnQkFDRSxNQUFNLEVBQUUsY0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxD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