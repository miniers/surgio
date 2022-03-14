'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const ora_1 = __importDefault(require("ora"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("@surgio/logger");
const artifact_1 = require("./generator/artifact");
const template_1 = require("./generator/template");
const remote_snippet_1 = require("./utils/remote-snippet");
const spinner = (0, ora_1.default)();
async function run(config, skipFail, cacheSnippet) {
    const artifactList = config.artifacts;
    const distPath = config.output;
    const remoteSnippetsConfig = config.remoteSnippets || [];
    const remoteSnippetList = await (0, remote_snippet_1.loadRemoteSnippetList)(remoteSnippetsConfig, cacheSnippet);
    const templateEngine = (0, template_1.getEngine)(config.templateDir);
    await fs_extra_1.default.mkdirp(distPath);
    for (const artifact of artifactList) {
        spinner.start(`正在生成规则 ${artifact.name}`);
        try {
            const artifactInstance = new artifact_1.Artifact(config, artifact, {
                remoteSnippetList,
            });
            artifactInstance.once('initProvider:end', () => {
                spinner.text = `已处理 Provider ${artifactInstance.initProgress}/${artifactInstance.providerNameList.length}...`;
            });
            await artifactInstance.init();
            const result = artifactInstance.render(templateEngine);
            const destFilePath = path_1.default.join(config.output, artifact.name);
            if (artifact.destDir) {
                fs_extra_1.default.accessSync(artifact.destDir, fs_extra_1.default.constants.W_OK);
                await fs_extra_1.default.writeFile(path_1.default.join(artifact.destDir, artifact.name), result);
            }
            else {
                await fs_extra_1.default.writeFile(destFilePath, result);
            }
            spinner.succeed(`规则 ${artifact.name} 生成成功`);
        }
        catch (err) {
            spinner.fail(`规则 ${artifact.name} 生成失败`);
            // istanbul ignore next
            if (skipFail) {
                console.error(err.stack || err);
            }
            else {
                throw err;
            }
        }
    }
}
async function generate(config, artifact, remoteSnippetList, templateEngine) {
    const artifactInstance = new artifact_1.Artifact(config, artifact, {
        remoteSnippetList,
    });
    await artifactInstance.init();
    return artifactInstance.render(templateEngine);
}
exports.generate = generate;
async function default_1(config, skipFail, cacheSnippet) {
    logger_1.logger.info('开始生成规则');
    await run(config, skipFail, cacheSnippet).catch((err) => {
        // istanbul ignore next
        if (spinner.isSpinning) {
            spinner.fail();
        }
        throw err;
    });
    logger_1.logger.info('规则生成成功');
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvZ2VuZXJhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7QUFFYix3REFBMEI7QUFFMUIsOENBQXNCO0FBQ3RCLGdEQUF3QjtBQUN4QiwyQ0FBd0M7QUFDeEMsbURBQWdEO0FBRWhELG1EQUFpRDtBQUVqRCwyREFBK0Q7QUFFL0QsTUFBTSxPQUFPLEdBQUcsSUFBQSxhQUFHLEdBQUUsQ0FBQztBQUV0QixLQUFLLFVBQVUsR0FBRyxDQUNoQixNQUFxQixFQUNyQixRQUFrQixFQUNsQixZQUFzQjtJQUV0QixNQUFNLFlBQVksR0FBa0MsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNyRSxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQy9CLE1BQU0sb0JBQW9CLEdBQUcsTUFBTSxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUM7SUFDekQsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLElBQUEsc0NBQXFCLEVBQ25ELG9CQUFvQixFQUNwQixZQUFZLENBQ2IsQ0FBQztJQUNGLE1BQU0sY0FBYyxHQUFHLElBQUEsb0JBQVMsRUFBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFckQsTUFBTSxrQkFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUUxQixLQUFLLE1BQU0sUUFBUSxJQUFJLFlBQVksRUFBRTtRQUNuQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFFekMsSUFBSTtZQUNGLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxtQkFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7Z0JBQ3RELGlCQUFpQjthQUNsQixDQUFDLENBQUM7WUFFSCxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO2dCQUM3QyxPQUFPLENBQUMsSUFBSSxH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