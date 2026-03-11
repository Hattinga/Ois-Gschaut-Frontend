import { useState, useEffect } from 'react'

/**
 * Custom hook for fetching data from an API
 * @param {string} url - The URL to fetch from
 * @param {array} deps - Optional dependency array
 * @returns {object} Object containing data, loading state, and error
 */
export function useFetch(url, deps) {
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null,
    })

    useEffect(() => {
        let isMounted = true

        const fetchData = async () => {
            try {
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                if (isMounted) {
                    setState({ data, loading: false, error: null })
                }
            } catch (error) {
                if (isMounted) {
                    setState({
                        data: null,
                        loading: false,
                        error: error instanceof Error ? error : new Error('Unknown error'),
                    })
                }
            }
        }

        fetchData()

        return () => {
            isMounted = false
        }
    }, deps || [url])

    return state
}

/**
 * Custom hook for managing form state
 * @param {object} initialValues - Initial form values
 * @returns {object} Object with form values, handlers, and reset function
 */
export function useForm(initialValues) {
    const [values, setValues] = useState(initialValues)

    const handleChange = (e) => {
        const { name, value, type } = e.target
        setValues((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? e.target.checked
                    : type === 'number'
                        ? Number(value)
                        : value,
        }))
    }

    const reset = () => {
        setValues(initialValues)
    }

    return { values, handleChange, reset, setValues }
}

/**
 * Custom hook for managing local storage
 * @param {string} key - The storage key
 * @param {*} initialValue - The initial value if not found in storage
 * @returns {array} Tuple with stored value and setter function
 */
export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(error)
            return initialValue
        }
    })

    const setValue = (value) => {
        try {
            setStoredValue(value)
            window.localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error(error)
        }
    }

    return [storedValue, setValue]
}
