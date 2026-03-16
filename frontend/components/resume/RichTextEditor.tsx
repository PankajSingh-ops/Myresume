'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: false,
                codeBlock: false,
                blockquote: false,
                horizontalRule: false,
                strike: false,
                code: false,
            }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            // Don't trigger onChange if content is just empty tags
            const html = editor.getHTML();
            onChange(html === '<p></p>' ? '' : html);
        },
        editorProps: {
            attributes: {
                class:
                    'min-h-[150px] w-full px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none prose prose-sm dark:prose-invert max-w-none',
            },
        },
    });

    // Sync external value changes to editor (e.g. from AI improve)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className={cn('flex flex-col space-y-1', className)}>
            <div className="flex items-center gap-1 rounded-md border border-input bg-transparent p-1 shadow-sm">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    aria-label="Toggle bold"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    aria-label="Toggle italic"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <div className="mx-1 h-4 w-[1px] bg-border" />
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    aria-label="Toggle bulleted list"
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    aria-label="Toggle ordered list"
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
            </div>
            <div className="max-h-[300px] overflow-y-auto rounded-md border border-input bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
