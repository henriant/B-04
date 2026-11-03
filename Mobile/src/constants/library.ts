import { type LibraryStatus } from "@backlog-defeater/api-client";


export const STATUS_OPTIONS: { value: LibraryStatus; label: string }[] = [
    { value: 'playing', label: 'Playing' },
    { value: 'completed', label: 'Completed' },
    { value: 'planned', label: 'Planned' }
]