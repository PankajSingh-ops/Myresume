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
import { projectsSchema } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/resume/RichTextEditor';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const formSchema = z.object({
    projects: z.array(projectsSchema)
});

type FormValues = z.infer<typeof formSchema>;

interface SortableProjectItemProps {
    id: string;
    index: number;
    project: FormValues['projects'][0];
    onRemove: () => void;
    register: any;
    watch: any;
    setValue: any;
    errors: any;
}

function SortableProjectItem({
    id, index, project, onRemove, register, watch, setValue, errors
}: SortableProjectItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const currentName = watch(`projects.${index}.name`) || '';
    const currentDescription = watch(`projects.${index}.description`) || '';
    const currentTechArray = watch(`projects.${index}.technologies`) || [];
    const currentBullets = watch(`projects.${index}.bullets`) || [];

    const techsText = currentTechArray.join(', ');
    const handleTechsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
        setValue(`projects.${index}.technologies`, arr, { shouldDirty: true });
    };

    const addBullet = () => {
        setValue(`projects.${index}.bullets`, [...currentBullets, ''], { shouldDirty: true });
    };

    const removeBullet = (bIndex: number) => {
        setValue(
            `projects.${index}.bullets`,
            currentBullets.filter((_: string, i: number) => i !== bIndex),
            { shouldDirty: true }
        );
    };

    const itemErrors = errors?.projects?.[index];

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
                                    {currentName || 'New Project'}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 -mr-2" onClick={(e) => { e.preventDefault(); onRemove(); }}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2">
                            <div className="space-y-1.5 md:col-span-2">
                                <Label>Project Name</Label>
                                <Input placeholder="E-commerce Platform" {...register(`projects.${index}.name`)} />
                                {itemErrors?.name && <p className="text-xs text-destructive">{itemErrors.name.message}</p>}
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <Label>Project URL / Link</Label>
                                <Input placeholder="https://github.com/myproject" {...register(`projects.${index}.url`)} />
                                {itemErrors?.url && <p className="text-xs text-destructive">{itemErrors.url.message}</p>}
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <Label>Technologies Used (Comma separated)</Label>
                                <Input
                                    placeholder="React, Node.js, PostgreSQL"
                                    defaultValue={techsText}
                                    onChange={handleTechsChange}
                                />
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <Label>Description</Label>
                                <RichTextEditor
                                    value={currentDescription}
                                    onChange={(val) => setValue(`projects.${index}.description`, val, { shouldDirty: true })}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2 mt-2">
                                <Label>Bullet Points</Label>
                                {currentBullets.map((bullet: string, bIndex: number) => (
                                    <div key={bIndex} className="flex gap-2 items-start">
                                        <div className="pt-2.5 pb-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-foreground/40 mt-0.5" />
                                        </div>
                                        <Textarea
                                            className="min-h-[40px] h-[40px] resize-none py-2"
                                            placeholder="What you achieved or implemented..."
                                            {...register(`projects.${index}.bullets.${bIndex}`)}
                                        />
                                        <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeBullet(bIndex)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                <Button type="button" variant="outline" size="sm" className="w-full mt-2 border-dashed" onClick={addBullet}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Bullet Point
                                </Button>
                            </div>

                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}


export function ProjectsForm() {
    const currentResume = useResumeStore((s) => s.currentResume);
    const updateCurrentResume = useResumeStore((s) => s.updateCurrentResume);

    const defaultValues = { projects: currentResume?.content?.projects || [] };

    const { register, control, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
        // @ts-ignore - Ignore strict Zod/react-hook-form type mismatches for defaults
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "projects",
    });

    // Auto-update store on form changes
    useEffect(() => {
        const subscription = watch((value) => {
            updateCurrentResume({
                content: {
                    ...currentResume?.content,
                    projects: value.projects as any
                }
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, currentResume, updateCurrentResume]);

    // Reset when resume ID changes
    useEffect(() => {
        if (currentResume?.content?.projects) {
            reset({ projects: currentResume.content.projects });
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
            name: '',
            technologies: [],
            bullets: []
        });
    };

    return (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <p className="text-sm text-muted-foreground mb-4">
                Highlight key technical projects, open source contributions, or personal work.
            </p>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="space-y-2">
                    <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                        {fields.map((field, index) => (
                            <SortableProjectItem
                                key={field.id}
                                id={field.id}
                                index={index}
                                project={field}
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
                <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
        </form>
    );
}
