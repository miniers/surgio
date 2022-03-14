"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTmpFactory = exports.TmpFile = void 0;
const logger_1 = require("@surgio/logger");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const constant_1 = require("../constant");
const logger = (0, logger_1.createLogger)({ service: 'surgio:utils:tmp-helper' });
const tmpDir = path_1.default.join(os_1.default.tmpdir(), constant_1.TMP_FOLDER_NAME);
class TmpFile {
    constructor(filePath, maxAge) {
        this.filePath = filePath;
        this.maxAge = maxAge;
        this.filename = path_1.default.basename(filePath);
        this.extname = path_1.default.extname(filePath);
        fs_extra_1.default.accessSync(path_1.default.dirname(this.filePath), fs_extra_1.default.constants.W_OK);
    }
    async setContent(content) {
        await fs_extra_1.default.writeJson(this.filePath, {
            content,
            maxAge: this.maxAge,
            lastEditTime: new Date().getTime(),
        });
        return this;
    }
    async getContent() {
        const tmpContent = await this.validateContent();
        if (tmpContent) {
            return tmpContent.content;
        }
        return undefined;
    }
    async validateContent() {
        if (!fs_extra_1.default.existsSync(this.filePath)) {
            return undefined;
        }
        const tmpContent = await fs_extra_1.default.readJson(this.filePath);
        const now = Date.now();
        if (!tmpContent.maxAge) {
            return tmpContent;
        }
        else if (this.maxAge && now - tmpContent.lastEditTime < this.maxAge) {
            return tmpContent;
        }
        else if (!this.maxAge && tmpContent.maxAge) {
            this.maxAge = tmpContent.maxAge;
        }
        return undefined;
    }
}
exports.TmpFile = TmpFile;
const createTmpFactory = (baseDir) => {
    baseDir = path_1.default.join(tmpDir, baseDir);
    logger.debug('tmpDir: %s', baseDir);
    if (!fs_extra_1.default.existsSync(baseDir)) {
        fs_extra_1.default.mkdirpSync(baseDir);
    }
    return (filePath, maxAge) => new TmpFile(path_1.default.join(baseDir, filePath), maxAge);
};
exports.createTmpFactory = createTmpFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG1wLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi91dGlscy90bXAtaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJDQUE4QztBQUM5Qyw0Q0FBb0I7QUFDcEIsZ0RBQXdCO0FBQ3hCLHdEQUEwQjtBQUUxQiwwQ0FBOEM7QUFFOUMsTUFBTSxNQUFNLEdBQUcsSUFBQSxxQkFBWSxFQUFDLEVBQUUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLENBQUMsQ0FBQztBQUNwRSxNQUFNLE1BQU0sR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFlBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSwwQkFBZSxDQUFDLENBQUM7QUFFdkQsTUFBYSxPQUFPO0lBSWxCLFlBQW1CLFFBQWdCLEVBQVMsTUFBZTtRQUF4QyxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUN6RCxJQUFJLENBQUMsUUFBUSxHQUFHLGNBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRDLGtCQUFFLENBQUMsVUFBVSxDQUFDLGNBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGtCQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFTSxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQWU7UUFDckMsTUFBTSxrQkFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2hDLE9BQU87WUFDUCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsWUFBWSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFO1NBQ25DLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLEtBQUssQ0FBQyxVQUFVO1FBQ3JCLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ2hELElBQUksVUFBVSxFQUFFO1lBQ2QsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDO1NBQzNCO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVPLEtBQUssQ0FBQyxlQUFlO1FBQzNCLElBQUksQ0FBQyxrQkFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDakMsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxNQUFNLFVBQVUsR0FBZSxNQUFNLGtCQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDdEIsT0FBTyxVQUFVLENBQUM7U0FDbkI7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNyRSxPQUFPLFVBQVUsQ0FBQztTQUNuQjthQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDNUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztDQUNGO0FBL0NELDBCQStDQztBQVFNLE1BQU0sZ0JBQWdCLEdBQUcsQ0FDOUIsT0FBZSxFQUNtQyxFQUFFO0lBQ3BELE9BQU8sR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVyQyxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVwQyxJQUFJLENBQUMsa0JBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDM0Isa0JBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDeEI7SUFFRCxPQUFPLENBQUMsUUFBZ0IsRUFBRSxNQUFlLEVBQUUsRUFBRSxDQUMzQyxJQUFJLE9BQU8sQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN0RCxDQUFDLENBQUM7QUFiVyxRQUFBLGdCQUFnQixvQkFhM0IifQ==