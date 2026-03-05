import { Input } from './Input'
import { TilesRow } from './Tiles'

type BoardSectionProps = {
  label: string
  value: string | undefined
  setValueFn: (word: string | undefined) => void
  placeholder?: string
  maxLength?: number
}

export const BoardSection = ({
  label,
  value,
  setValueFn,
  placeholder,
  maxLength,
}: BoardSectionProps) => {
  const id = label.toLowerCase().replace(' ', '-')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValueFn(e.target.value)

  return (
    <section className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
      >
        {label}
      </label>

      <Input
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder ?? 'e.g. WIZ'}
        maxLength={maxLength}
      />

      {value && value.length > 0 && (
        <div className="mb-4">
          <TilesRow letters={value.split('')} />
        </div>
      )}
    </section>
  )
}
