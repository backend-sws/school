"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import CommonApi from "@/lib/api/commonApi";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  ImagePlus,
  Heading1,
  Heading2,
  Heading3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  function MenuButton({
    onClick,
    isActive,
    icon: Icon,
    tooltip,
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    tooltip: string;
  }) {
    return (
      <Button
        onClick={onClick}
        type="button"
        variant={isActive ? "default" : "ghost"}
        size="icon"
        title={tooltip}
        className={cn(
          "w-8 h-8 rounded-md transition-all duration-300 p-0 shadow-none",
          isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-primary hover:bg-accent"
        )}
      >
        <Icon className="h-4 w-4" />
      </Button>
    );
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image,
    ],
    content: value ?? "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Sync editor content when value changes externally (e.g. form reset) - skip when editor is focused to avoid disrupting typing
  useEffect(() => {
    if (!editor || value === undefined || value === null) return;
    const isFocused = editor.isFocused;
    if (isFocused) return;
    const currentHtml = editor.getHTML();
    const normalizedValue = (value as string).trim() || "<p></p>";
    if (currentHtml !== normalizedValue) {
      editor.commands.setContent(normalizedValue, { emitUpdate: false });
    }
  }, [value, editor]);

  // Commands
  const setHeading = (level: 1 | 2 | 3) =>
    editor?.chain().focus().toggleHeading({ level }).run();
  const setBold = () => editor?.chain().focus().toggleBold().run();
  const setItalic = () => editor?.chain().focus().toggleItalic().run();
  const setStrike = () => editor?.chain().focus().toggleStrike().run();
  const setBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const setOrderedList = () =>
    editor?.chain().focus().toggleOrderedList().run();
  const setBlockquote = () => editor?.chain().focus().toggleBlockquote().run();
  const setCodeBlock = () => editor?.chain().focus().toggleCodeBlock().run();
  const undo = () => editor?.chain().focus().undo().run();
  const redo = () => editor?.chain().focus().redo().run();

  // Image upload handler
  const addImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await CommonApi.uploadImage(file);
    console.log("url,", res);
    if (res.url) {
      editor?.chain().focus().setImage({ src: res.url }).run();
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) addImage(file);
  };

  // Command insertion helper (can be used for other templates later)
  const insertContent = (content: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(content).run();
  };

  if (!editor) return null;

  return (
    <div className="border border-input rounded-lg bg-background overflow-hidden transition-all duration-300 focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary group/editor">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1.5 bg-accent/30 border-b border-border">
        {/* Text Formatting Group */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-border">
          <MenuButton
            onClick={() => setHeading(1)}
            isActive={editor.isActive("heading", { level: 1 })}
            icon={Heading1}
            tooltip="Heading 1"
          />
          <MenuButton
            onClick={() => setHeading(2)}
            isActive={editor.isActive("heading", { level: 2 })}
            icon={Heading2}
            tooltip="Heading 2"
          />
          <MenuButton
            onClick={() => setHeading(3)}
            isActive={editor.isActive("heading", { level: 3 })}
            icon={Heading3}
            tooltip="Heading 3"
          />
        </div>

        {/* Style Group */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-border">
          <MenuButton
            onClick={setBold}
            isActive={editor.isActive("bold")}
            icon={Bold}
            tooltip="Bold"
          />
          <MenuButton
            onClick={setItalic}
            isActive={editor.isActive("italic")}
            icon={Italic}
            tooltip="Italic"
          />
          <MenuButton
            onClick={setStrike}
            isActive={editor.isActive("strike")}
            icon={Strikethrough}
            tooltip="Strikethrough"
          />
        </div>

        {/* List Group */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-border">
          <MenuButton
            onClick={setBulletList}
            isActive={editor.isActive("bulletList")}
            icon={List}
            tooltip="Bullet List"
          />
          <MenuButton
            onClick={setOrderedList}
            isActive={editor.isActive("orderedList")}
            icon={ListOrdered}
            tooltip="Numbered List"
          />
        </div>

        {/* Block Group */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-border">
          <MenuButton
            onClick={setBlockquote}
            isActive={editor.isActive("blockquote")}
            icon={Quote}
            tooltip="Quote"
          />
          <MenuButton
            onClick={setCodeBlock}
            isActive={editor.isActive("codeBlock")}
            icon={Code}
            tooltip="Code Block"
          />
        </div>

        {/* History Group */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-border">
          <MenuButton onClick={undo} icon={Undo} tooltip="Undo" />
          <MenuButton onClick={redo} icon={Redo} tooltip="Redo" />
        </div>

        {/* Media Group */}
        <div className="flex items-center gap-0.5 px-1.5 ">
          <MenuButton onClick={handleImageClick} icon={ImagePlus} tooltip="Insert Image" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="tiptap prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none"
      />
    </div>
  );
}

