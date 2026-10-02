import { Skeleton } from '../common/Skeleton'

/**
 * Mantém exatamente as mesmas proporções do ProductCard (aspect-square +
 * as mesmas alturas de texto) para que a troca skeleton → card real não
 * cause layout shift.
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-neutral-200">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}
