"use client";

import { useState } from "react";
import { statusOptions, type LibraryFilterStatus } from '@/constants/library';
import { LibraryList } from "./userComponents/LibraryList";

export function Filter (){
    const [status, setStatus] = useState<LibraryFilterStatus>('playing');
    return(
        <>
        <section className="filterRow">
                    {statusOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setStatus(option.value)}
                            className={`filterButton ${status === option.value ? 'active' : ''}`}
                        >
                            <p className="filterText">{option.label}</p>
                        </button>
                    ))}
            </section>

            <section className="my-games">
                <LibraryList query="" status={status}/>
            </section>
        </>
    )
}
