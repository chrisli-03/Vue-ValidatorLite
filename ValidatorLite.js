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
	'nonEmpty': '+ cannot be empty',
	'maxCharacter': '+ cannot be longer than > characters',
	'minCharacter': '+ cannot be shorter than < characters',
	'complicateEasy': '+ must contain 1 or more number and alphabet, no whitespace',
	'complicateNormal': '+ must contain 1 or more number, uppercase and lowercase alphabet, no whitespace',
	'complicateHard': '+ must contain 1 ore more number, uppercase, lowercase and special character',
	'match': 'does not match =',
	'email': 'invalid email'
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
