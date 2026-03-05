type TileProps = {
  letter: string
}

export function Tile({ letter }: TileProps) {
  return (
    <div
      className="size-12  flex items-center justify-center bg-amber-50 rounded-md shadow-sm border font-bold text-lg uppercase select-none"
      data-letter={letter}
    >
      {letter}
    </div>
  )
}
