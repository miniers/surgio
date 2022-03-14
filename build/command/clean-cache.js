"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// istanbul ignore file
const common_bin_1 = __importDefault(require("common-bin"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const logger_1 = require("@surgio/logger");
const constant_1 = require("../constant");
const error_helper_1 = require("../utils/error-helper");
class CleanCacheCommand extends common_bin_1.default {
    constructor(rawArgv) {
        super(rawArgv);
        this.usage = '使用方法: surgio clean-cache';
    }
    // istanbul ignore next
    get description() {
        return '清除缓存';
    }
    async run() {
        const tmpDir = path_1.default.join(os_1.default.tmpdir(), constant_1.TMP_FOLDER_NAME);
        if (fs_extra_1.default.existsSync(tmpDir)) {
            await fs_extra_1.default.remove(tmpDir);
        }
        logger_1.logger.info('清除成功');
    }
    // istanbul ignore next
    errorHandler(err) {
        error_helper_1.errorHandler.call(this, err);
    }
}
module.exports = CleanCacheCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW4tY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvY29tbWFuZC9jbGVhbi1jYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsdUJBQXVCO0FBQ3ZCLDREQUFpQztBQUNqQyw0Q0FBb0I7QUFDcEIsZ0RBQXdCO0FBQ3hCLHdEQUEwQjtBQUMxQiwyQ0FBd0M7QUFFeEMsMENBQThDO0FBQzlDLHdEQUFxRDtBQUVyRCxNQUFNLGlCQUFrQixTQUFRLG9CQUFPO0lBQ3JDLFlBQVksT0FBa0I7UUFDNUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRywwQkFBMEIsQ0FBQztJQUMxQyxDQUFDO0lBRUQsdUJBQXVCO0lBQ3ZCLElBQVcsV0FBVztRQUNwQixPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU0sS0FBSyxDQUFDLEdBQUc7UUFDZCxNQUFNLE1BQU0sR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFlBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSwwQkFBZSxDQUFDLENBQUM7UUFFdkQsSUFBSSxrQkFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN6QixNQUFNLGtCQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsZUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsdUJBQXVCO0lBQ2hCLFlBQVksQ0FBQyxHQUFHO1FBQ3JCLDJCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0NBQ0Y7QUFFRCxpQkFBUyxpQkFBaUIsQ0FBQyJ9