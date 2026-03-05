type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string
  placeholder: string
  maxLength?: number
}

export const Input = ({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
  ...props
}: InputProps) => {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      autoComplete="off"
      className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground font-mono uppercase tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
      {...props}
    />
  )
}
