"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_CACHE_PREFIX = exports.RedisKeys = void 0;
var RedisKeys;
(function (RedisKeys) {
    RedisKeys["AccessIp"] = "access_ip";
    RedisKeys["AUTH_TOKEN_PREFIX"] = "auth:token:";
    RedisKeys["AUTH_PERM_PREFIX"] = "auth:permission:";
    RedisKeys["AUTH_PASSWORD_V_PREFIX"] = "auth:passwordVersion:";
    RedisKeys["ONLINE_USER_PREFIX"] = "online:user:";
    RedisKeys["TOKEN_BLACKLIST_PREFIX"] = "token:blacklist:";
})(RedisKeys || (exports.RedisKeys = RedisKeys = {}));
exports.API_CACHE_PREFIX = 'api-cache:';
//# sourceMappingURL=cache.constant.js.map