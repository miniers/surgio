"use strict";
// istanbul ignore file
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = exports.checkAndFix = exports.createCli = void 0;
const eslint_1 = require("eslint");
const lodash_1 = __importDefault(require("lodash"));
const createCli = (cliConfig) => {
    const linterConfig = {
        // 在测试情况下 fixture 目录不包含 eslintrc，避免 eslint 读取根目录的 eslintrc
        useEslintrc: process.env.NODE_ENV !== 'test',
        extensions: ['.js'],
        baseConfig: {
            extends: ['@surgio/eslint-config-surgio'].map(
            // @ts-ignore
            require.resolve),
        },
    };
    return new eslint_1.ESLint(Object.assign(Object.assign({}, linterConfig), cliConfig));
};
exports.createCli = createCli;
const checkAndFix = async (cwd) => {
    const cli = (0, exports.createCli)({ fix: true, cwd });
    const results = await cli.lintFiles(['.']);
    const errorCount = lodash_1.default.sumBy(results, (curr) => curr.errorCount);
    const fixableErrorCount = lodash_1.default.sumBy(results, (curr) => curr.fixableErrorCount);
    await eslint_1.ESLint.outputFixes(results);
    const formatter = await cli.loadFormatter('stylish');
    const resultText = formatter.format(results);
    console.log(resultText);
    return errorCount - fixableErrorCount === 0;
};
exports.checkAndFix = checkAndFix;
const check = async (cwd) => {
    const cli = (0, exports.createCli)({ cwd });
    const results = await cli.lintFiles(['.']);
    const errorCount = lodash_1.default.sumBy(results, (curr) => curr.errorCount);
    const formatter = await cli.loadFormatter('stylish');
    const resultText = formatter.format(results);
    console.log(resultText);
    return errorCount === 0;
};
exports.check = check;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGludGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL2xpbnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUJBQXVCOzs7Ozs7QUFFdkIsbUNBQWdDO0FBQ2hDLG9EQUF1QjtBQUVoQixNQUFNLFNBQVMsR0FBRyxDQUFDLFNBQTBCLEVBQVUsRUFBRTtJQUM5RCxNQUFNLFlBQVksR0FBRztRQUNuQiwwREFBMEQ7UUFDMUQsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLE1BQU07UUFDNUMsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ25CLFVBQVUsRUFBRTtZQUNWLE9BQU8sRUFBRSxDQUFDLDhCQUE4QixDQUFDLENBQUMsR0FBRztZQUMzQyxhQUFhO1lBQ2IsT0FBTyxDQUFDLE9BQU8sQ0FDaEI7U0FDRjtLQUNGLENBQUM7SUFFRixPQUFPLElBQUksZUFBTSxpQ0FDWixZQUFZLEdBQ1osU0FBUyxFQUNaLENBQUM7QUFDTCxDQUFDLENBQUM7QUFqQlcsUUFBQSxTQUFTLGFBaUJwQjtBQUVLLE1BQU0sV0FBVyxHQUFHLEtBQUssRUFBRSxHQUFXLEVBQW9CLEVBQUU7SUFDakUsTUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBUyxFQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sT0FBTyxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0MsTUFBTSxVQUFVLEdBQUcsZ0JBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDL0QsTUFBTSxpQkFBaUIsR0FBRyxnQkFBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBRTdFLE1BQU0sZUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVsQyxNQUFNLFNBQVMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckQsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUU3QyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXhCLE9BQU8sVUFBVSxHQUFHLGlCQUFpQixLQUFLLENBQUMsQ0FBQztBQUM5QyxDQUFDLENBQUM7QUFkVyxRQUFBLFdBQVcsZUFjdEI7QUFFSyxNQUFNLEtBQUssR0FBRyxLQUFLLEVBQUUsR0FBVyxFQUFvQixFQUFFO0lBQzNELE1BQU0sR0FBRyxHQUFHLElBQUEsaUJBQVMsRUFBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0IsTUFBTSxPQUFPLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMzQyxNQUFNLFVBQVUsR0FBRyxnQkFBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvRCxNQUFNLFNBQVMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckQsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUU3QyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXhCLE9BQU8sVUFBVSxLQUFLLENBQUMsQ0FBQztBQUMxQixDQUFDLENBQUM7QUFWVyxRQUFBLEtBQUssU0FVaEIifQ==