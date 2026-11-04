export type LibraryStatus = 'playing' | 'completed' | 'planned';
export type LibraryFilterStatus = LibraryStatus | 'all';



export const statusOptions: { value: LibraryFilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'playing', label: 'Playing' },
    { value: 'completed', label: 'Completed' },
    { value: 'planned', label: 'Planned' }
]