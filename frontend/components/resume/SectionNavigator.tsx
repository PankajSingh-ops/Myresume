'use client';

import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/ui/button';

export const DEFAULT_SECTIONS = [
    { id: 'personalInfo', label: 'Personal Info' },
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'languages', label: 'Languages' },
];

export interface SectionNavigatorProps {
    activeSection: string;
    onSectionSelect: (id: string) => void;
}

interface SortableItemProps {
    id: string;
    label: string;
    isActive: boolean;
    onSelect: () => void;
}

function SortableItem({ id, label, isActive, onSelect }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group flex flex-col',
                isDragging && 'opacity-50',
            )}
        >
            <div
                className={cn(
                    'flex items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors',
                    isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
            >
                {/* Drag handle */}
                <div
                    className="cursor-grab text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing p-1 -ml-1 rounded"
                    {...attributes}
                    {...listeners}
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="h-4 w-4" />
                </div>

                {/* Clickable area to select section */}
                <button
                    className="flex-1 text-left py-1"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelect();
                    }}
                >
                    {label}
                </button>

                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}

export function SectionNavigator({ activeSection, onSectionSelect }: SectionNavigatorProps) {
    // Normally sectionOrder would come from resume.settings or similar
    // For now, we will use a local state initialized with the default sections
    // In a full implementation, you'd sync this with useResumeStore

    const [sections, setSections] = useState(DEFAULT_SECTIONS);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            // In full implementation, markDirty() and update resume
        }
    };

    return (
        <div className="flex h-full flex-col overflow-y-auto border-r bg-background p-4">
            <h2 className="mb-4 text-sm font-semibold tracking-tight text-muted-foreground uppercase">
                Resume Sections
            </h2>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="space-y-1">
                    <SortableContext
                        items={sections.map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {sections.map((section) => (
                            <SortableItem
                                key={section.id}
                                id={section.id}
                                label={section.label}
                                isActive={activeSection === section.id}
                                onSelect={() => onSectionSelect(section.id)}
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>
        </div>
    );
}
