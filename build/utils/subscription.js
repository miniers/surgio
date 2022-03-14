"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSubscriptionUserInfo = exports.parseSubscriptionNode = exports.parseSubscriptionUserInfo = void 0;
const filesize_1 = __importDefault(require("filesize"));
const bytes_1 = __importDefault(require("bytes"));
const date_fns_1 = require("date-fns");
const parseSubscriptionUserInfo = (str) => {
    const res = {
        upload: 0,
        download: 0,
        total: 0,
        expire: 0,
    };
    str.split(';').forEach((item) => {
        if (!item) {
            return;
        }
        const pair = item.split('=');
        const value = Number(pair[1].trim());
        if (!Number.isNaN(value)) {
            res[pair[0].trim()] = Number(pair[1].trim());
        }
    });
    return res;
};
exports.parseSubscriptionUserInfo = parseSubscriptionUserInfo;
const parseSubscriptionNode = (dataString, expireString) => {
    // dataString => 剩余流量：57.37% 1.01TB
    // expireString => 过期时间：2020-04-21 22:27:38
    const dataMatch = dataString.match(/剩余流量：(\d{0,2}(\.\d{1,4})?)%\s(.*)$/);
    const expireMatch = expireString.match(/过期时间：(.*)$/);
    if (dataMatch && expireMatch) {
        const percent = Number(dataMatch[1]) / 100;
        const leftData = bytes_1.default.parse(dataMatch[3]);
        const total = Number((leftData / percent).toFixed(0));
        const expire = Math.floor(new Date(expireMatch[1]).getTime() / 1000);
        return {
            upload: 0,
            download: total - leftData,
            total,
            expire,
        };
    }
    else {
        return undefined;
    }
};
exports.parseSubscriptionNode = parseSubscriptionNode;
const formatSubscriptionUserInfo = (userInfo) => {
    return {
        upload: (0, filesize_1.default)(userInfo.upload),
        download: (0, filesize_1.default)(userInfo.download),
        used: (0, filesize_1.default)(userInfo.upload + userInfo.download),
        left: (0, filesize_1.default)(userInfo.total - userInfo.upload - userInfo.download),
        total: (0, filesize_1.default)(userInfo.total),
        expire: userInfo.expire
            ? `${(0, date_fns_1.format)(new Date(userInfo.expire * 1000), 'yyyy-MM-dd')} (${(0, date_fns_1.formatDistanceToNow)(new Date(userInfo.expire * 1000))})`
            : '无数据',
    };
};
exports.formatSubscriptionUserInfo = formatSubscriptionUserInfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL3N1YnNjcmlwdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3REFBZ0M7QUFDaEMsa0RBQTBCO0FBQzFCLHVDQUF1RDtBQUloRCxNQUFNLHlCQUF5QixHQUFHLENBQ3ZDLEdBQVcsRUFDVyxFQUFFO0lBQ3hCLE1BQU0sR0FBRyxHQUFHO1FBQ1YsTUFBTSxFQUFFLENBQUM7UUFDVCxRQUFRLEVBQUUsQ0FBQztRQUNYLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxFQUFFLENBQUM7S0FDVixDQUFDO0lBRUYsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUM5QixJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsT0FBTztTQUNSO1FBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFFckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEIsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUF2QlcsUUFBQSx5QkFBeUIsNkJBdUJwQztBQUVLLE1BQU0scUJBQXFCLEdBQUcsQ0FDbkMsVUFBa0IsRUFDbEIsWUFBb0IsRUFDYyxFQUFFO0lBQ3BDLG1DQUFtQztJQUNuQywyQ0FBMkM7SUFFM0MsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0lBQ3pFLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFckQsSUFBSSxTQUFTLElBQUksV0FBVyxFQUFFO1FBQzVCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDM0MsTUFBTSxRQUFRLEdBQUcsZUFBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUVyRSxPQUFPO1lBQ0wsTUFBTSxFQUFFLENBQUM7WUFDVCxRQUFRLEVBQUUsS0FBSyxHQUFHLFFBQVE7WUFDMUIsS0FBSztZQUNMLE1BQU07U0FDUCxDQUFDO0tBQ0g7U0FBTTtRQUNMLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0FBQ0gsQ0FBQyxDQUFDO0FBekJXLFFBQUEscUJBQXFCLHlCQXlCaEM7QUFFSyxNQUFNLDBCQUEwQixHQUFHLENBQ3hDLFFBQThCLEVBUTlCLEVBQUU7SUFDRixPQUFPO1FBQ0wsTUFBTSxFQUFFLElBQUEsa0JBQVEsRUFBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQ2pDLFFBQVEsRUFBRSxJQUFBLGtCQUFRLEVBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNyQyxJQUFJLEVBQUUsSUFBQSxrQkFBUSxFQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNuRCxJQUFJLEVBQUUsSUFBQSxrQkFBUSxFQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ3BFLEtBQUssRUFBRSxJQUFBLGtCQUFRLEVBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztRQUMvQixNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07WUFDckIsQ0FBQyxDQUFDLEdBQUcsSUFBQSxpQkFBTSxFQUNQLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQ2hDLFlBQVksQ0FDYixLQUFLLElBQUEsOEJBQW1CLEVBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHO1lBQ2hFLENBQUMsQ0FBQyxLQUFLO0tBQ1YsQ0FBQztBQUNKLENBQUMsQ0FBQztBQXZCVyxRQUFBLDBCQUEwQiw4QkF1QnJDIn0=