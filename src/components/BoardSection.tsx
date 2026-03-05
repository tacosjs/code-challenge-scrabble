import { Input } from './Input'
import { TilesRow } from './Tiles'

type BoardSectionProps = {
  label: string
  value: string | undefined
  setValueFn: (word: string | undefined) => void
  maxLength?: number
}

export const BoardSection = ({
  label,
  value,
  setValueFn,
  maxLength,
}: BoardSectionProps) => {
  const id = label.toLowerCase().replace(' ', '-')
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValueFn(e.target.value)
        }
        placeholder="e.g. WIZ"
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
