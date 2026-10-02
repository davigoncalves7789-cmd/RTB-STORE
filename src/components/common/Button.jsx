const VARIANTES = {
  primary: 'bg-neutral-900 text-white hover:bg-neutral-700',
  outline: 'border border-neutral-300 text-neutral-900 hover:bg-neutral-100',
}

export function Button({ variante = 'primary', className = '', ...props }) {
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTES[variante]} ${className}`}
      {...props}
    />
  )
}
