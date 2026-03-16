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
import { educationSchema } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/resume/RichTextEditor';
import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const formSchema = z.object({
    educations: z.array(educationSchema)
});

type FormValues = z.infer<typeof formSchema>;

interface SortableEducationItemProps {
    id: string;
    index: number;
    education: FormValues['educations'][0];
    onRemove: () => void;
    register: any;
    watch: any;
    setValue: any;
    errors: any;
}

function SortableEducationItem({
    id, index, education, onRemove, register, watch, setValue, errors
}: SortableEducationItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const currentInst = watch(`educations.${index}.institution`) || '';
    const currentDegree = watch(`educations.${index}.degree`) || '';
    const currentField = watch(`educations.${index}.field`) || '';
    const currentDescription = watch(`educations.${index}.description`) || '';

    const itemErrors = errors?.educations?.[index];

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
                                    {currentInst ? `${currentDegree}${currentField ? ` in ${currentField}` : ''} at ${currentInst}` : 'New Education'}
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
                                <Label>Institution / School</Label>
                                <Input placeholder="University of React" {...register(`educations.${index}.institution`)} />
                                {itemErrors?.institution && <p className="text-xs text-destructive">{itemErrors.institution.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Degree</Label>
                                <Input placeholder="Bachelor of Science" {...register(`educations.${index}.degree`)} />
                                {itemErrors?.degree && <p className="text-xs text-destructive">{itemErrors.degree.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Field of Study</Label>
                                <Input placeholder="Computer Science" {...register(`educations.${index}.field`)} />
                                {itemErrors?.field && <p className="text-xs text-destructive">{itemErrors.field.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Start Date</Label>
                                <Input type="month" {...register(`educations.${index}.startDate`)} />
                                {itemErrors?.startDate && <p className="text-xs text-destructive">{itemErrors.startDate.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>End Date (or expected)</Label>
                                <Input type="month" {...register(`educations.${index}.endDate`)} />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <Label>GPA (Optional)</Label>
                                <Input placeholder="3.8 / 4.0" {...register(`educations.${index}.gpa`)} />
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <div className="flex items-center justify-between mb-2">
                                    <Label>Description / Comments</Label>
                                </div>
                                <RichTextEditor
                                    value={currentDescription}
                                    onChange={(val) => setValue(`educations.${index}.description`, val, { shouldDirty: true })}
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}


export function EducationForm() {
    const currentResume = useResumeStore((s) => s.currentResume);
    const updateCurrentResume = useResumeStore((s) => s.updateCurrentResume);

    const defaultValues = { educations: currentResume?.content?.education || [] };

    const { register, control, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "educations",
    });

    // Auto-update store on form changes
    useEffect(() => {
        const subscription = watch((value) => {
            updateCurrentResume({
                content: {
                    ...currentResume?.content,
                    education: value.educations as any
                }
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, currentResume, updateCurrentResume]);

    // Reset when resume ID changes
    useEffect(() => {
        if (currentResume?.content?.education) {
            reset({ educations: currentResume.content.education });
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
            institution: '',
            degree: '',
            field: '',
            startDate: '',
        });
    };

    return (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <p className="text-sm text-muted-foreground mb-4">
                List your educational background, starting with the most recent.
            </p>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="space-y-2">
                    <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                        {fields.map((field, index) => (
                            <SortableEducationItem
                                key={field.id}
                                id={field.id}
                                index={index}
                                education={field}
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
                <Plus className="mr-2 h-4 w-4" /> Add Education
            </Button>
        </form>
    );
}
