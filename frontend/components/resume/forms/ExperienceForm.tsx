'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { GripVertical, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
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
import { experienceSchema } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RichTextEditor } from '@/components/resume/RichTextEditor';
import { AIImproveButton } from '@/components/resume/AIImproveButton';
import { useGenerateBullets, useImproveBullets } from '@/hooks/useAI';
import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// Form uses an array of experiences
const formSchema = z.object({
    experiences: z.array(experienceSchema)
});

type FormValues = z.infer<typeof formSchema>;

interface SortableExperienceItemProps {
    id: string;
    index: number;
    experience: FormValues['experiences'][0];
    onRemove: () => void;
    register: any;
    watch: any;
    setValue: any;
    errors: any;
}

function SortableExperienceItem({
    id, index, experience, onRemove, register, watch, setValue, errors
}: SortableExperienceItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const generateBulletsMutation = useGenerateBullets();
    const improveBulletsMutation = useImproveBullets();

    const currentCompany = watch(`experiences.${index}.company`) || '';
    const currentPosition = watch(`experiences.${index}.position`) || '';
    const currentDescription = watch(`experiences.${index}.description`) || '';
    const isCurrent = watch(`experiences.${index}.current`);
    const currentBullets = watch(`experiences.${index}.bullets`) || [];

    const handleGenerateBullets = async () => {
        const bullets = await generateBulletsMutation.mutateAsync({
            company: currentCompany || 'Unknown Company',
            role: currentPosition || 'Professional',
            responsibilities: currentDescription || ''
        });
        setValue(`experiences.${index}.bullets`, bullets, { shouldDirty: true });
    };

    const handleImproveBullets = async () => {
        if (!currentBullets.length) return;
        const improved = await improveBulletsMutation.mutateAsync({
            bullets: currentBullets,
            role: currentPosition || 'Professional'
        });
        setValue(`experiences.${index}.bullets`, improved, { shouldDirty: true });
    };

    const addBullet = () => {
        setValue(`experiences.${index}.bullets`, [...currentBullets, ''], { shouldDirty: true });
    };

    const removeBullet = (bIndex: number) => {
        setValue(
            `experiences.${index}.bullets`,
            currentBullets.filter((_: string, i: number) => i !== bIndex),
            { shouldDirty: true }
        );
    };

    const itemErrors = errors?.experiences?.[index];

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
                                    {currentPosition ? `${currentPosition} at ${currentCompany}` : 'New Experience'}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 -mr-2" onClick={(e) => { e.preventDefault(); onRemove(); }}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Company</Label>
                                <Input placeholder="Acme Corp" {...register(`experiences.${index}.company`)} />
                                {itemErrors?.company && <p className="text-xs text-destructive">{itemErrors.company.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Position / Title</Label>
                                <Input placeholder="Senior Widget Engineer" {...register(`experiences.${index}.position`)} />
                                {itemErrors?.position && <p className="text-xs text-destructive">{itemErrors.position.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Start Date</Label>
                                <Input type="month" {...register(`experiences.${index}.startDate`)} />
                                {itemErrors?.startDate && <p className="text-xs text-destructive">{itemErrors.startDate.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>End Date</Label>
                                <Input type="month" disabled={isCurrent} {...register(`experiences.${index}.endDate`)} />
                            </div>
                            <div className="flex items-center space-x-2 md:col-span-2">
                                <Checkbox
                                    id={`current-${id}`}
                                    checked={isCurrent}
                                    onCheckedChange={(c) => {
                                        setValue(`experiences.${index}.current`, !!c, { shouldDirty: true });
                                        if (c) setValue(`experiences.${index}.endDate`, undefined);
                                    }}
                                />
                                <Label htmlFor={`current-${id}`} className="font-normal">I currently work here</Label>
                            </div>

                            <div className="space-y-1.5 md:col-span-2 mt-2 rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-sm font-semibold">Description</Label>
                                </div>
                                <RichTextEditor
                                    value={currentDescription}
                                    onChange={(val) => setValue(`experiences.${index}.description`, val, { shouldDirty: true })}
                                />
                            </div>

                            <div className="space-y-3 md:col-span-2 mt-2 rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30 p-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-semibold">Bullet Points</Label>
                                    <div className="flex gap-2 flex-wrap justify-end">
                                        <AIImproveButton
                                            label="✨ Generate Bullets (2 credits)"
                                            cost={2}
                                            onImprove={handleGenerateBullets}
                                        />
                                        <AIImproveButton
                                            label="✨ Improve existing (2 credits)"
                                            cost={2}
                                            onImprove={handleImproveBullets}
                                            disabled={currentBullets.length === 0}
                                        />
                                    </div>
                                </div>

                                {currentBullets.map((bullet: string, bIndex: number) => (
                                    <div key={bIndex} className="flex gap-2 items-start group">
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-1.5">
                                            {bIndex + 1}
                                        </div>
                                        <Textarea
                                            className="min-h-[52px] h-[52px] resize-none py-2.5 bg-background"
                                            placeholder="Achieved X by implementing Y, resulting in Z..."
                                            {...register(`experiences.${index}.bullets.${bIndex}`)}
                                        />
                                        <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100 transition-opacity" onClick={() => removeBullet(bIndex)}>
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


export function ExperienceForm() {
    const currentResume = useResumeStore((s) => s.currentResume);
    const updateCurrentResume = useResumeStore((s) => s.updateCurrentResume);

    const defaultValues = { experiences: currentResume?.content?.experience || [] };

    const { register, control, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
        // @ts-ignore - Ignore strict Zod/react-hook-form type mismatches for defaults
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "experiences",
    });

    // Auto-update store on form changes
    useEffect(() => {
        const subscription = watch((value) => {
            updateCurrentResume({
                content: {
                    ...currentResume?.content,
                    experience: value.experiences as any
                }
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, currentResume, updateCurrentResume]);

    // Reset when resume ID changes
    useEffect(() => {
        if (currentResume?.content?.experience) {
            reset({ experiences: currentResume.content.experience });
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
            company: '',
            position: '',
            startDate: '',
            current: false,
            bullets: []
        });
    };

    return (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <p className="text-sm text-muted-foreground mb-4">
                List your relevant work experience, starting with the most recent.
            </p>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="space-y-2">
                    <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                        {fields.map((field, index) => (
                            <SortableExperienceItem
                                key={field.id}
                                id={field.id}
                                index={index}
                                experience={field}
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
                <Plus className="mr-2 h-4 w-4" /> Add Experience
            </Button>
        </form>
    );
}
