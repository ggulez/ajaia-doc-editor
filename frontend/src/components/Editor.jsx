import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { useEffect, useCallback } from 'react'

export default function Editor({ initialContent, onSave, readOnly = false }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent || '',
    editable: !readOnly,
  })

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent)
    }
  }, [initialContent])

  const handleSave = useCallback(() => {
    if (editor) onSave(editor.getHTML())
  }, [editor, onSave])

  useEffect(() => {
    const interval = setInterval(handleSave, 5000)
    return () => clearInterval(interval)
  }, [handleSave])

  if (!editor) return null

  return (
    <div style={styles.wrapper}>
      {!readOnly && (
        <div style={styles.toolbar}>
          <button style={editor.isActive('bold') ? styles.activeBtn : styles.toolBtn} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
          <button style={editor.isActive('italic') ? styles.activeBtn : styles.toolBtn} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
          <button style={editor.isActive('underline') ? styles.activeBtn : styles.toolBtn} onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
          <span style={styles.divider} />
          <button style={editor.isActive('heading', { level: 1 }) ? styles.activeBtn : styles.toolBtn} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
          <button style={editor.isActive('heading', { level: 2 }) ? styles.activeBtn : styles.toolBtn} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
          <span style={styles.divider} />
          <button style={editor.isActive('bulletList') ? styles.activeBtn : styles.toolBtn} onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet</button>
          <button style={editor.isActive('orderedList') ? styles.activeBtn : styles.toolBtn} onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbered</button>
          <span style={styles.divider} />
          <button style={styles.saveBtn} onClick={handleSave}>Save</button>
        </div>
      )}
      <div style={styles.editorArea}>
        <EditorContent editor={editor} style={styles.editor} />
      </div>
    </div>
  )
}

const styles = {
  wrapper: { maxWidth:'860px', margin:'2rem auto', background:'white', borderRadius:'8px', boxShadow:'0 1px 4px rgba(0,0,0,0.1)' },
  toolbar: { display:'flex', alignItems:'center', gap:'0.25rem', padding:'0.5rem 1rem', borderBottom:'1px solid #e5e7eb', flexWrap:'wrap' },
  toolBtn: { padding:'0.3rem 0.6rem', background:'transparent', border:'1px solid #e5e7eb', borderRadius:'4px', cursor:'pointer', fontSize:'0.85rem' },
  activeBtn: { padding:'0.3rem 0.6rem', background:'#dbeafe', border:'1px solid #93c5fd', borderRadius:'4px', cursor:'pointer', fontSize:'0.85rem' },
  saveBtn: { marginLeft:'auto', padding:'0.3rem 0.8rem', background:'#2563eb', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'0.85rem' },
  divider: { width:'1px', height:'20px', background:'#e5e7eb', margin:'0 0.25rem' },
  editorArea: { padding:'2rem' },
  editor: { minHeight:'500px', outline:'none', fontSize:'1rem', lineHeight:'1.7' }
}