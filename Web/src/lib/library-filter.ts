import type { LibraryEntry } from "@backlog-defeater/api-client";
import type { LibraryFilterStatus } from "@/constants/library";

export function filterLibraryEntries(
    entries: LibraryEntry[],
    query: string,
    status: LibraryFilterStatus,
): LibraryEntry[] {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return entries.filter(
        (entry) =>
            (status === "all" || entry.status === status) &&
            (entry.game?.name ?? "").toLocaleLowerCase().includes(normalizedQuery),
    );
}
