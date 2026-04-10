import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Minus } from 'lucide-react';
import DOMPurify from 'dompurify';
import { cn } from '../../lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className, minHeight = '100px' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || `<p></p>`,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Normalize empty editor to empty string
      onChange(html === '<p></p>' ? '' : html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none text-slate-700',
        style: `min-height: ${minHeight}`,
      },
    },
  });

  if (!editor) return null;

  const ToolBtn = ({ onClick, active, title, children }: {
    onClick: () => void; active?: boolean; title: string; children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'p-1.5 rounded text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer',
        active && 'bg-slate-200 text-slate-800'
      )}
    >
      {children}
    </button>
  );

  return (
    <div className={cn('border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <ToolBtn
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold size={13} />
        </ToolBtn>
        <ToolBtn
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic size={13} />
        </ToolBtn>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <ToolBtn
          title="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List size={13} />
        </ToolBtn>
        <ToolBtn
          title="Numbered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered size={13} />
        </ToolBtn>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <ToolBtn
          title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={13} />
        </ToolBtn>
      </div>
      {/* Editor area */}
      <div className="px-3 py-2 bg-white dark:bg-slate-700 relative">
        {!value && (
          <p className="absolute top-2 left-3 text-sm text-slate-400 pointer-events-none select-none">
            {placeholder ?? 'Write notes here…'}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

// Read-only renderer for notes stored as HTML
export function RichTextContent({ html, className }: { html: string; className?: string }) {
  if (!html) return null;
  return (
    <div
      className={cn('prose prose-sm max-w-none text-slate-700 dark:text-slate-300', className)}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
}
