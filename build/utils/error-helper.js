"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const chalk_1 = __importDefault(require("chalk"));
const doctor_1 = __importDefault(require("../command/doctor"));
const errorHandler = function (err) {
    doctor_1.default.generateDoctorInfo(this.context.cwd).then((doctorInfo) => {
        console.error(chalk_1.default.red(`⚠️  发生错误`));
        console.error(chalk_1.default.red(`⚠️  ${err.name}: ${err.message}`));
        console.error('⚠️  版本号: %s', require('../../package.json').version);
        console.error('⚠️  常见问题: %s', chalk_1.default.cyan('http://url.royli.dev/7EMxu'));
        console.error('⚠️  加入交流群汇报问题 %s', chalk_1.default.cyan('https://t.me/surgiotg'));
        console.error();
        console.error(chalk_1.default.red(err.stack));
        console.error();
        doctorInfo.forEach((item) => {
            console.error(item);
        });
        console.error();
        process.exit(1);
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL2Vycm9yLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxrREFBMEI7QUFDMUIsK0RBQThDO0FBRXZDLE1BQU0sWUFBWSxHQUFHLFVBQXlCLEdBQVU7SUFDN0QsZ0JBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO1FBQ3JFLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RCxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwRSxPQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxlQUFLLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQztRQUN4RSxPQUFPLENBQUMsS0FBSyxDQUNYLGtCQUFrQixFQUNsQixlQUFLLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQ3BDLENBQUM7UUFDRixPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNoQixVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVoQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBcEJXLFFBQUEsWUFBWSxnQkFvQnZCIn0=