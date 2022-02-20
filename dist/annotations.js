/*:
 * @target MZ
 * @plugindesc the gear plugin that rework the whole Menu System
 * @author Nio Kasgami
 * @base gear-inn-actions
 * @help
 *
 * @param args
 * @
 */


/*~struct~statusStruct:
 *
 * @param background
 * @desc the layered background
 * @type struct<TilingStruct>[]
 * @default []
 * 
 * @param actor
 * @desc the position of the actor sprite in the menu
 * @type struct<Actor>
 *
 * @param profile
 * @desc the setting for the actor profile text
 * @type struct<actorProfile>
 */

/*~struct~actorProfile:
 *
 * @param name
 * @type struct<TextContainer>
 * @param description
 * @type struct<TextContainer>
 *  
 */
/// COMMON STRUCT =======================================

/*~struct~TextContainer:
 * @param x
 * @type number
 * @param y
 * @type number
 * @param maxWidth
 * @type number
 * @param lineHeight
 * @type number
 *
 * @param align
 * @type select
 * @option LEFT
 * @value left
 * @option CENTER
 * @value center
 * @option RIGHT
 * @value right
 *
 */
/*~struct~TilingStruct:
 * @param bitmap
 * @type file
 * @dir img/menu/status
 * @param coords
 * @type struct<Points>
 * 
 * @param scroll
 * @type struct<Points>
 * 
 * @param type
 * @desc describe if the picture is an single image or a tiling image
 * @type select
 * @option SINGLE
 * @value 0
 * @option ANIMATED
 * @value 1
 * @option TILING
 * @value 2
 */

/*~struct~Actor:
 * @param x
 * @type number
 * @param y
 * @type number
 * @param pivot
 * @type struct<Points>
*/

/*~struct~Points:
 * @param x
 * @desc the x coordinates
 * @type number
 * @param y
 * @desc the y coordinates
 * @type number
 */
///========================================================


