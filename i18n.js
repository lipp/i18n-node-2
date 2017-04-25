/**
 * @author  John Resig <jeresig@gmail.com>
 * @author  Originally by Marcus Spiegel <marcus.spiegel@gmail.com>
 * @link    https://github.com/jeresig/i18n-node
 * @license http://opensource.org/licenses/MIT
 *
 * @version 0.4.7
 */

// dependencies
var vsprintf = require("sprintf").vsprintf


function dotNotation (obj, is, value) {
	if (obj.hasOwnProperty(is)) {
		return obj[is]
	}

	if (typeof is === 'string') {
		return dotNotation(obj, is.split('.'), value)
	} else if (is.length === 1 && value !== undefined) {
		return obj[is[0]] = value
	} else if (is.length === 0) {
		return obj
	} else {
		if (obj.hasOwnProperty(is[0])) {
			return dotNotation(obj[is[0]], is.slice(1), value)
		} else {
			return obj[is.join('.')] = is.join('.')
		}
	}
}

var i18n = module.exports = function (opt) {
	// Copy over options
	for (var prop in opt) {
		this[prop] = opt[prop]
	}
}

i18n.version = "0.4.7"

i18n.prototype = {
	__: function () {
		var msg = this.translate(this.locale, arguments[0])

		if (arguments.length > 1) {
			msg = vsprintf(msg, Array.prototype.slice.call(arguments, 1))
		}

		return msg
	},

	__n: function (pathOrSingular, countOrPlural, additionalOrCount) {
		var msg
		if (typeof countOrPlural === 'number') {
			var path = pathOrSingular
			var count = countOrPlural
			msg = this.translate(this.locale, path)

			msg = vsprintf(parseInt(count, 10) > 1 ? msg.other : msg.one, Array.prototype.slice.call(arguments, 1))
		} else {
			var singular = pathOrSingular
			var plural = countOrPlural
			var count = additionalOrCount
			msg = this.translate(this.locale, singular, plural)

			msg = vsprintf(parseInt(count, 10) > 1 ? msg.other : msg.one, [count])

			if (arguments.length > 3) {
				msg = vsprintf(msg, Array.prototype.slice.call(arguments, 3))
			}
		}

		return msg
	},

	setLocale: function (locale) {
		if (!this.locales[locale]) {
      throw new Error('unknown locale: ' + locale)
    }
    this.locale = locale
		return
	},

	getLocale: function () {
		return this.locale
	},

	// read locale file, translate a msg and write to fs if new
	translate: function (locale, singular, plural) {
		return dotNotation(this.locales[locale], singular, plural ? { one: singular, other: plural } : undefined)
	}

}
