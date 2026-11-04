export type LibraryStatus = 'playing' | 'completed' | 'planned';



export const statusOptions: { value: LibraryStatus; label: string }[] = [
    { value: 'playing', label: 'Playing' },
    { value: 'completed', label: 'Completed' },
    { value: 'planned', label: 'Planned' }
]