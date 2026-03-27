/**
 * String manipulation utilities
 */

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function camelToKebab(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

export function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

/**
 * Number utilities
 */

export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount)
}

export function roundToDecimals(num, decimals = 2) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Date utilities
 */

export function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date)
}

export function isToday(date) {
    const today = new Date()
    return date.toDateString() === today.toDateString()
}

/**
 * Array utilities
 */

export function removeDuplicates(array) {
    return [...new Set(array)]
}

export function groupBy(array, key) {
    return array.reduce(
        (result, item) => {
            const groupKey = key(item)
            if (!result[groupKey]) {
                result[groupKey] = []
            }
            result[groupKey].push(item)
            return result
        },
        {},
    )
}

/**
 * Validation utilities
 */

export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function isValidUrl(url) {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}
