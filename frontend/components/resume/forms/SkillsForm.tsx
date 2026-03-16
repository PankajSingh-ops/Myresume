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
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useResumeStore } from '@/store/resumeStore';
import { skillsSchema } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AIImproveButton } from '@/components/resume/AIImproveButton';
import { useSuggestSkills } from '@/hooks/useAI';
import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
    skills: z.array(skillsSchema)
});

type FormValues = z.infer<typeof formSchema>;

interface SortableSkillItemProps {
    id: string;
    index: number;
    skill: FormValues['skills'][0];
    onRemove: () => void;
    register: any;
    watch: any;
    setValue: any;
    errors: any;
}

function SortableSkillItem({
    id, index, skill, onRemove, register, watch, setValue, errors
}: SortableSkillItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const suggestSkillsMutation = useSuggestSkills();
    const currentResume = useResumeStore(s => s.currentResume);

    const currentCategory = watch(`skills.${index}.category`) || '';
    const currentItems: string[] = watch(`skills.${index}.items`) || [];

    // Helper: string to array and vice versa for simple textarea editing
    const itemsText = currentItems.join(', ');

    const handleItemsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
        setValue(`skills.${index}.items`, arr, { shouldDirty: true });
    };

    const handleSuggestSkills = async () => {
        const role = currentResume?.content?.personalInfo?.title || 'Professional';
        const newSkills = await suggestSkillsMutation.mutateAsync({
            role,
            currentSkills: currentItems
        });

        // newSkills response is { technical: string[], soft: string[] }. Let's combine them securely to avoid iteration errors
        const combinedSkills = [...(newSkills.technical || []), ...(newSkills.soft || [])];

        // Merge without duplicates
        const merged = Array.from(new Set([...currentItems, ...combinedSkills]));
        setValue(`skills.${index}.items`, merged, { shouldDirty: true });
    };

    const itemErrors = errors?.skills?.[index];

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 2 : 1 }}
            className={cn("mb-4 rounded-md border bg-card text-card-foreground shadow-sm", isDragging && "opacity-50")}
        >
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1" className="border-b-0">
                    <div className="flex items-center pe-4 pt-1">
                        <div
                            {...attributes}
                            {...listeners}
                            className="p-3 cursor-grab text-muted-foreground hover:text-foreground"
                        >
                            <GripVertical className="h-4 w-4" />
                        </div>
                        <AccordionTrigger className="flex-1 hover:no-underline py-2">
                            <div className="flex flex-col text-left">
                                <span className="font-medium text-sm">
                                    {currentCategory || 'New Skill Group'}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 -mr-2" onClick={(e) => { e.preventDefault(); onRemove(); }}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                                <Label>Category Name (e.g. Frontend, Tools, Languages)</Label>
                                <Input placeholder="Languages" {...register(`skills.${index}.category`)} />
                                {itemErrors?.category && <p className="text-xs text-destructive">{itemErrors.category.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between mb-2">
                                    <Label>Skills (Comma separated)</Label>
                                    <AIImproveButton
                                        label="✨ Suggest Skills (2 credits)"
                                        cost={2}
                                        onImprove={handleSuggestSkills}
                                    />
                                </div>
                                <Textarea
                                    placeholder="React, TypeScript, Node.js..."
                                    defaultValue={itemsText}
                                    onChange={handleItemsChange}
                                    className="min-h-[80px]"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export function SkillsForm() {
    const currentResume = useResumeStore((s) => s.currentResume);
    const updateCurrentResume = useResumeStore((s) => s.updateCurrentResume);

    const defaultValues = { skills: currentResume?.content?.skills || [] };

    const { register, control, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
        // @ts-ignore - Ignore strict Zod/react-hook-form type mismatches for defaults
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "skills",
    });

    // Auto-update store on form changes
    useEffect(() => {
        const subscription = watch((value) => {
            updateCurrentResume({
                content: {
                    ...currentResume?.content,
                    skills: value.skills as any
                }
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, currentResume, updateCurrentResume]);

    // Reset when resume ID changes
    useEffect(() => {
        if (currentResume?.content?.skills) {
            reset({ skills: currentResume.content.skills });
        }
    }, [currentResume?.id, reset]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex(item => item.id === active.id);
            const newIndex = fields.findIndex(item => item.id === over.id);
            move(oldIndex, newIndex);
        }
    };

    const handleAdd = () => {
        append({
            id: nanoid(),
            category: '',
            items: []
        });
    };

    return (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <p className="text-sm text-muted-foreground mb-4">
                Group your skills by category for better readability.
            </p>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="space-y-2">
                    <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                        {fields.map((field, index) => (
                            <SortableSkillItem
                                key={field.id}
                                id={field.id}
                                index={index}
                                skill={field}
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
                <Plus className="mr-2 h-4 w-4" /> Add Skill Group
            </Button>
        </form>
    );
}
