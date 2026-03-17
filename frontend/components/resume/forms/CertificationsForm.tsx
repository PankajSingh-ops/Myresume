'use client';

import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { GripVertical, Plus, Trash2, Award, ExternalLink } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const certificationItemSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Certification name is required'),
    issuer: z.string().min(1, 'Issuer is required'),
    date: z.string(),
    url: z.string().optional(),
});

const formSchema = z.object({
    certifications: z.array(certificationItemSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface SortableCertItemProps {
    id: string;
    index: number;
    onRemove: () => void;
    register: any;
    watch: any;
    errors: any;
}

function SortableCertItem({ id, index, onRemove, register, watch, errors }: SortableCertItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const name = watch(`certifications.${index}.name`) || '';
    const issuer = watch(`certifications.${index}.issuer`) || '';
    const itemErrors = errors?.certifications?.[index];

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 2 : 1 }}
            className={cn('mb-4 rounded-md border bg-card text-card-foreground shadow-sm', isDragging && 'opacity-50')}
        >
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1" className="border-b-0">
                    <div className="flex items-center pe-4 pt-1">
                        <div {...attributes} {...listeners} className="p-3 cursor-grab text-muted-foreground hover:text-foreground">
                            <GripVertical className="h-4 w-4" />
                        </div>
                        <AccordionTrigger className="flex-1 hover:no-underline py-2">
                            <div className="flex flex-col text-left">
                                <span className="font-medium text-sm">
                                    {name ? `${name}${issuer ? ` — ${issuer}` : ''}` : 'New Certification'}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 -mr-2"
                            onClick={(e) => { e.preventDefault(); onRemove(); }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5 md:col-span-2">
                                <Label>Certification Name</Label>
                                <Input placeholder="AWS Certified Solutions Architect" {...register(`certifications.${index}.name`)} />
                                {itemErrors?.name && <p className="text-xs text-destructive">{itemErrors.name.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Issuing Organization</Label>
                                <Input placeholder="Amazon Web Services" {...register(`certifications.${index}.issuer`)} />
                                {itemErrors?.issuer && <p className="text-xs text-destructive">{itemErrors.issuer.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Date Earned</Label>
                                <Input type="month" {...register(`certifications.${index}.date`)} />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <Label>Credential URL (Optional)</Label>
                                <Input type="url" placeholder="https://credential.example.com/verify/..." {...register(`certifications.${index}.url`)} />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export function CertificationsForm() {
    const currentResume = useResumeStore((s) => s.currentResume);
    const updateCurrentResume = useResumeStore((s) => s.updateCurrentResume);

    const defaultValues = { certifications: currentResume?.content?.certifications || [] };

    const { register, control, watch, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'certifications',
    });

    // Auto-update store
    useEffect(() => {
        const subscription = watch((value) => {
            updateCurrentResume({
                content: {
                    ...currentResume?.content,
                    certifications: value.certifications as any,
                },
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, currentResume, updateCurrentResume]);

    // Reset when resume ID changes
    useEffect(() => {
        if (currentResume?.content?.certifications) {
            reset({ certifications: currentResume.content.certifications });
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
        append({ id: nanoid(), name: '', issuer: '', date: '', url: '' });
    };

    return (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <p className="text-sm text-muted-foreground mb-4">
                Add professional certifications, licenses, or credentials.
            </p>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="space-y-2">
                    <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                        {fields.map((field, index) => (
                            <SortableCertItem
                                key={field.id}
                                id={field.id}
                                index={index}
                                onRemove={() => remove(index)}
                                register={register}
                                watch={watch}
                                errors={errors}
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            <Button type="button" variant="outline" className="w-full border-dashed py-8" onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" /> Add Certification
            </Button>
        </form>
    );
}
