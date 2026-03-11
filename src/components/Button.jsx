function Button({
    variant = 'primary',
    size = 'medium',
    isLoading = false,
    disabled = false,
    children,
    className = '',
    ...props
}) {
    const sizeClasses = {
        small: 'px-2 py-1 text-sm',
        medium: 'px-4 py-2',
        large: 'px-6 py-3 text-lg',
    }

    const variantClasses = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        secondary: 'bg-emerald-600 text-white hover:bg-emerald-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    }

    const baseClasses = 'rounded font-medium transition-all duration-200 cursor-pointer border-none shadow-md'
    const disabledClasses = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''

    const classes = [
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        disabledClasses,
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <button
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    )
}

export default Button
