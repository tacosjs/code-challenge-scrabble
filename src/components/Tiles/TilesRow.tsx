import { Tile } from './Tiles'

type TilesRowProps = {
  letters: string[]
}

export function TilesRow({ letters }: TilesRowProps) {
  return (
    <div className="flex gap-1.5 flex-wrap justify-center">
      {letters.map((letter, i) => (
        <Tile key={`${letter}-${i}`} letter={letter} />
      ))}
    </div>
  )
}
