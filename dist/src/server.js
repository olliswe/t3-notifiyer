"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var jsdom_1 = require("jsdom");
var tabletojson_1 = require("tabletojson");
var puppeteer_1 = __importDefault(require("puppeteer"));
var cors_1 = __importDefault(require("cors"));
var getBCPData = function (eventUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, names, titles, armiesAndTeam, parsedResults;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer_1.default.launch()];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, page.goto(eventUrl)];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.waitForSelector('.title')];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.waitForSelector('select[name="playersTable_length"]')];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.select('select[name="playersTable_length"]', '-1')];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () { return Array.from(document === null || document === void 0 ? void 0 : document.querySelectorAll('.title')).map(function (node) { return node.textContent; }); })];
            case 7:
                names = _a.sent();
                return [4 /*yield*/, page.evaluate(function () { return Array.from(document === null || document === void 0 ? void 0 : document.querySelectorAll('.desc')).map(function (node) { return node.textContent; }); })];
            case 8:
                titles = _a.sent();
                armiesAndTeam = titles.map(function (title) {
                    if (!title) {
                        return { army: 'unknown', team: 'unknown' };
                    }
                    var titleArray = title.split('-');
                    if (titleArray.length === 0) {
                        return { army: 'unknown', team: 'unknown' };
                    }
                    if (titleArray.length === 2) {
                        return { army: titleArray[0].trim(), team: titleArray[1].trim() };
                    }
                    return { army: titleArray[0].trim(), team: '' };
                });
                parsedResults = names.map(function (name, index) {
                    var _a;
                    var army = armiesAndTeam[index].army;
                    var team = armiesAndTeam[index].team;
                    if (!name) {
                        return {
                            firstName: '',
                            lastName: '',
                            army: army,
                            team: team
                        };
                    }
                    var splitString = (_a = name.trim().match(/^(\S+)\s(.*)/)) === null || _a === void 0 ? void 0 : _a.slice(1);
                    if (splitString) {
                        return {
                            firstName: splitString[0],
                            lastName: splitString[1],
                            army: army,
                            team: team
                        };
                    }
                    return {
                        firstName: '',
                        lastName: '',
                        army: army,
                        team: team
                    };
                });
                return [4 /*yield*/, browser.close()];
            case 9:
                _a.sent();
                return [2 /*return*/, parsedResults];
        }
    });
}); };
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
var getT3PlayerData = function (_a) {
    var firstName = _a.firstName, lastName = _a.lastName;
    return __awaiter(void 0, void 0, void 0, function () {
        var htmlString, dom, resultTable, table, firstEntry, result, nickname;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, axios_1.default)('https://www.tabletopturniere.de/t3_ntr_search.php', {
                        data: "action=list&name=".concat(firstName, "&lastname=").concat(lastName, "&nickname=%25&gid=3&cid=1&list=2&submit=Suchen"),
                        method: 'POST',
                    })];
                case 1:
                    htmlString = _c.sent();
                    dom = new jsdom_1.JSDOM(htmlString.data);
                    resultTable = (_b = dom.window.document.querySelector('table[class="std"]')) === null || _b === void 0 ? void 0 : _b.outerHTML;
                    if (!resultTable || resultTable.includes('No match found...')) {
                        return [2 /*return*/, { success: false }];
                    }
                    table = tabletojson_1.Tabletojson.convert(resultTable);
                    if (table && table.length > 0) {
                        firstEntry = table[0];
                        if (firstEntry && firstEntry.length > 0) {
                            result = firstEntry[0];
                            nickname = result === null || result === void 0 ? void 0 : result.Nickname;
                            if (nickname) {
                                return [2 /*return*/, { success: true, nickname: nickname }];
                            }
                        }
                    }
                    return [2 /*return*/, { success: false }];
            }
        });
    });
};
app.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var firstName, lastName, _a, success, nickname;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                firstName = req.query.firstName;
                lastName = req.query.lastName;
                if (!(typeof firstName === 'string' && typeof lastName === 'string')) return [3 /*break*/, 2];
                return [4 /*yield*/, getT3PlayerData({ firstName: firstName, lastName: lastName })];
            case 1:
                _a = _b.sent(), success = _a.success, nickname = _a.nickname;
                if (success) {
                    res.send(nickname);
                    return [2 /*return*/];
                }
                _b.label = 2;
            case 2:
                res.send('Not found!');
                return [2 /*return*/];
        }
    });
}); });
app.get('/event', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var eventUrl, bcpData, withNicknames, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                eventUrl = req.query.link;
                if (!(typeof eventUrl === 'string')) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, getBCPData(eventUrl)];
            case 2:
                bcpData = _a.sent();
                return [4 /*yield*/, Promise.all(bcpData.map(function (name) { return __awaiter(void 0, void 0, void 0, function () {
                        var nickname;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getT3PlayerData(name)];
                                case 1:
                                    nickname = (_a.sent()).nickname;
                                    return [2 /*return*/, __assign(__assign({}, name), { nickname: nickname || 'unknown' })];
                            }
                        });
                    }); }))];
            case 3:
                withNicknames = _a.sent();
                res.send({ success: true, names: withNicknames });
                return [2 /*return*/];
            case 4:
                error_1 = _a.sent();
                res.send({ success: false });
                return [2 /*return*/];
            case 5:
                res.send({ success: false });
                return [2 /*return*/];
        }
    });
}); });
app.listen(3000, function () {
    console.log('Application started on port 3000!');
});
