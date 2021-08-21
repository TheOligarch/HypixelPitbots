var Util = require('../util')
var discordjsBaseCollection = require('../../../../../node_modules/discord.js/node_modules/@discordjs/collection')
var util = require('../../../../../node_modules/discord.js/src/util/Util.js')
/** 
 * internal guild cache handler
 * @extends {EventEmitter}
 */
class guildCacheHandler extends discordjsBaseCollection {

    toJSON() {
        return this.map((e:any) => (typeof e?.toJSON === 'function' ? e.toJSON() : util.flatten(e)));
      }
      
}
    module.exports = guildCacheHandler