function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  const variantClass = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost:     'btn-ghost',
    accent:    'btn-accent',
    danger:    'btn bg-red-600 text-white hover:bg-red-500',
  }[variant] ?? 'btn-primary'

  const sizeClass = {
    sm:  'btn-sm',
    md:  'btn-md',
    lg:  'btn-lg',
    // legacy aliases
    small:  'btn-sm',
    medium: 'btn-md',
    large:  'btn-lg',
  }[size] ?? 'btn-md'

  return (
    <button
      className={`${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          Loading…
        </span>
      ) : children}
    </button>
  )
}

export default Button
