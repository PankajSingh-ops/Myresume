'use client';

import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
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
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const PROFICIENCY_OPTIONS = [
    { value: 'native', label: 'Native / Bilingual' },
    { value: 'fluent', label: 'Fluent' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'basic', label: 'Basic' },
] as const;

const languageItemSchema = z.object({
    id: z.string(),
    language: z.string().min(1, 'Language is required'),
    proficiency: z.enum(['native', 'fluent', 'conversational', 'basic']),
});

const formSchema = z.object({
    languages: z.array(languageItemSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface SortableLanguageItemProps {
    id: string;
    index: number;
    onRemove: () => void;
    register: any;
    watch: any;
    setValue: any;
    errors: any;
}

function SortableLanguageItem({ id, index, onRemove, register, watch, setValue, errors }: SortableLanguageItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const language = watch(`languages.${index}.language`) || '';
    const proficiency = watch(`languages.${index}.proficiency`) || 'basic';
    const itemErrors = errors?.languages?.[index];

    const profLabel = PROFICIENCY_OPTIONS.find(p => p.value === proficiency)?.label || proficiency;

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 2 : 1 }}
            className={cn('rounded-md border bg-card text-card-foreground shadow-sm p-4', isDragging && 'opacity-50')}
        >
            <div className="flex items-start gap-3">
                <div {...attributes} {...listeners} className="mt-2 cursor-grab text-muted-foreground hover:text-foreground shrink-0">
                    <GripVertical className="h-4 w-4" />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3 items-start">
                    <div className="space-y-1.5">
                        <Label>Language</Label>
                        <Input placeholder="e.g. English, Hindi, Spanish" {...register(`languages.${index}.language`)} />
                        {itemErrors?.language && <p className="text-xs text-destructive">{itemErrors.language.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label>Proficiency</Label>
                        <Select
                            value={proficiency}
                            onValueChange={(val) => setValue(`languages.${index}.proficiency`, val, { shouldDirty: true })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                {PROFICIENCY_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="mt-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={(e) => { e.preventDefault(); onRemove(); }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export function LanguagesForm() {
    const currentResume = useResumeStore((s) => s.currentResume);
    const updateCurrentResume = useResumeStore((s) => s.updateCurrentResume);

    const defaultValues = { languages: currentResume?.content?.languages || [] };

    const { register, control, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'languages',
    });

    // Auto-update store
    useEffect(() => {
        const subscription = watch((value) => {
            updateCurrentResume({
                content: {
                    ...currentResume?.content,
                    languages: value.languages as any,
                },
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, currentResume, updateCurrentResume]);

    // Reset when resume ID changes
    useEffect(() => {
        if (currentResume?.content?.languages) {
            reset({ languages: currentResume.content.languages });
        }
    }, [currentResume?.id, reset]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((item) => item.id === active.id);
            const newIndex = fields.findIndex((item) => item.id === over.id);
            move(oldIndex, newIndex);
        }
    };

    const handleAdd = () => {
        append({ id: nanoid(), language: '', proficiency: 'basic' });
    };

    return (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <p className="text-sm text-muted-foreground mb-4">
                Add languages you speak and your proficiency level.
            </p>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="space-y-3">
                    <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                        {fields.map((field, index) => (
                            <SortableLanguageItem
                                key={field.id}
                                id={field.id}
                                index={index}
                                onRemove={() => remove(index)}
                                register={register}
                                watch={watch}
                                setValue={setValue}
                                errors={errors}
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            <Button type="button" variant="outline" className="w-full border-dashed py-8" onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" /> Add Language
            </Button>
        </form>
    );
}
