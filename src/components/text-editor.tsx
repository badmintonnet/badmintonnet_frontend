"use client";

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

type QuillType = typeof import("quill");

export type RichTextEditorHandle = {
  getContent: () => string;
};

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  height?: string | number;
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  ({ value = "", onChange, height = 300 }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<QuillType["default"] | null>(null);
    const isSettingContent = useRef(false); // tránh loop khi set value
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (!isClient || !editorRef.current || quillRef.current) return;

      // Dynamic import Quill and its CSS only on client
      Promise.all([
        import("quill"),
        import("quill/dist/quill.snow.css"),
      ]).then(([QuillModule]) => {
        if (!editorRef.current || quillRef.current) return;

        quillRef.current = new QuillModule.default(editorRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link"],
              ["clean"],
            ],
          },
        });

        // Quill change listener
        quillRef.current.on("text-change", () => {
          if (quillRef.current) {
            isSettingContent.current = true;
            const html = quillRef.current.root.innerHTML;
            onChange?.(html);
            isSettingContent.current = false;
          }
        });
      });
    }, [onChange, isClient]);

    // Controlled: nếu value từ props thay đổi, cập nhật Quill
    useEffect(() => {
      if (
        quillRef.current &&
        !isSettingContent.current &&
        value !== quillRef.current.root.innerHTML
      ) {
        quillRef.current.root.innerHTML = value;
      }
    }, [value]);

    // Expose getContent qua ref
    useImperativeHandle(ref, () => ({
      getContent: () => quillRef.current?.root.innerHTML || "",
    }));

    return (
      <div style={{ height }}>
        <div ref={editorRef} style={{ height: "100%" }} />
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
