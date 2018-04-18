// Collection of all validation type
const validations = {
	'nonEmpty': nonEmpty,
	'maxCharacter': maxCharacter,
	'minCharacter': minCharacter,
	'complicateEasy': complicateEasy,
	'complicateNormal': complicateNormal,
	'complicateHard': complicateHard,
	'match': match,
	'email': email
}

// Collection of error messages
const errorMessages = {
	'nonEmpty': '+不能为空',
	'maxCharacter': '+不能长于>',
	'minCharacter': '+不能短于<',
	'complicateEasy': '+必须包含数字和字母,无空白',
	'complicateNormal': '+必须包含数字,小写字母,大写字母,无空白',
	'complicateHard': '+必须包含数字,小写字母,大写字母,特殊符号,无空白',
	'match': '必须与=一样',
	'email': '不符合邮箱格式'
}

// Constant variables
const defaultMaxCharacter = '20'
const defaultMinCharacter = '5'
const complicateEasyRegEx = '^(?=.*[a-zA-Z])(?=.*[0-9])\\S{0,}$'
const complicateNormalRegEx = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])\\S{0,}$'
const complicateHardRegEx = '^(?=.*[^a-zA-Z0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])\\S{0,}$'
const emailRegEx = '^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'

// Collection of all error message tags
const errorTags = {}

// Non empty check
function nonEmpty(str, attribute) {
	return str.length > 0
}

// Check if length is smaller than allowed
function maxCharacter(str, attribute) {
	attribute = attribute || defaultMaxCharacter
	return str.length <= parseInt(attribute)
}

// Check if length is greater than allowed
function minCharacter(str, attribute) {
	attribute = attribute || defaultMinCharacter
	return str.length >= parseInt(attribute)
}

function complicateEasy(str, attribute) {
	return matchRegEx(str, complicateEasyRegEx)
}

function complicateNormal(str, attribute) {
	return matchRegEx(str, complicateNormalRegEx)
}

function complicateHard(str, attribute) {
	return matchRegEx(str, complicateHardRegEx)
}

function match(str, attribute) {
	var target = document.getElementById(attribute)
	if (target) {
		return str.localeCompare(target.value) === 0
	}
	return false
}

function email(str, attribute) {
	return matchRegEx(str, emailRegEx)
}

// Regex match
function matchRegEx(str, regExStr) {
	var regEx = new RegExp(regExStr)
	return str.search(regEx) === 0
}

// Setup Object.keys for older browers
function init() {
	if (typeof Object.keys !== 'function') {
		(function() {
			var hasOwn = Object.prototype.hasOwnProperty
			Object.keys = ObjectKeys
			function ObjectKeys(obj) {
				var keys = [], name
				for (name in obj) {
					if (hasOwn.call(obj, name)) {
						keys.push(name)
					}
				}
				return keys
			}
		})()
	}
}

// Setup plugin
let ValidatorLite = {}
ValidatorLite.install = function(Vue, options) {
	init()
	Vue.directive('validate', {
		bind(el, binding, vnode, oldVnode) {
			let field = el.placeholder
			let keys = Object.keys(binding.modifiers) // validate types
			el.onblur = function() { // validate after user finish typing
				for (let key in keys) {
					let attribute = el.getAttribute(keys[key])
					if (!validations[keys[key]](el.value, attribute, el)) {
						errorTags[binding.arg].innerHTML = errorMessages[keys[key]].replace('+', field || '')
																					.replace('>', attribute || defaultMaxCharacter)
																					.replace('<', attribute || defaultMinCharacter)
																					.replace('=', (document.getElementById(attribute) ? document.getElementById(attribute).placeholder : ''))
						return false
					} else {
						errorTags[binding.arg].innerHTML = ''
					}
				}
				return true
			}
		}
	})
	Vue.directive('validation-error', {
		bind(el, binding, vnode, oldVnode) {
			errorTags[binding.arg] = el
		}
	})
	Vue.directive('validate-all', {
		bind(el, binding, vnode, oldVnode) {
			el.onclick = function() {
				let submitFlag = true
				let keys = binding.value
				for (let id in keys) {
					if (id === keys.length - 1) {
						continue
					}
					let input = document.getElementById(keys[id])
					if (input && !input.onblur()) {
						submitFlag = false
					}
				}
				if (submitFlag) {
					let foo = keys[keys.length - 1]
					foo()
				}
			}
		}
	})
}

export default ValidatorLite
