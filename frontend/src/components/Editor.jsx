import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { useEffect, useCallback, useState } from 'react'

export default function Editor({ initialContent, onSave, readOnly = false }) {
  const [, forceUpdate] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent || '',
    editable: !readOnly,
    onSelectionUpdate: () => forceUpdate(n => n + 1),
    onTransaction: () => forceUpdate(n => n + 1),
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

  const btn = (active) => active ? styles.activeBtn : styles.toolBtn

  return (
    <div style={styles.wrapper}>
      {!readOnly && (
        <div style={styles.toolbar}>
          <button style={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
          <button style={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
          <button style={btn(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
          <span style={styles.divider} />
          <button style={btn(editor.isActive('heading', { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
          <button style={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
          <span style={styles.divider} />
          <button style={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• Bullet</button>
          <button style={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. Numbered</button>
          <span style={styles.divider} />
          <button style={styles.saveBtn} onClick={handleSave}>Save</button>
        </div>
      )}
      <div style={styles.editorArea}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

const styles = {
  wrapper: { maxWidth:'860px', margin:'2rem auto', background:'white', borderRadius:'8px', boxShadow:'0 1px 4px rgba(0,0,0,0.1)' },
  toolbar: { display:'flex', alignItems:'center', gap:'0.25rem', padding:'0.5rem 1rem', borderBottom:'1px solid #e5e7eb', flexWrap:'wrap' },
  toolBtn: { padding:'0.3rem 0.6rem', background:'transparent', border:'1px solid #e5e7eb', borderRadius:'4px', cursor:'pointer', fontSize:'0.85rem' },
  activeBtn: { padding:'0.3rem 0.6rem', background:'#dbeafe', border:'1px solid #93c5fd', borderRadius:'4px', cursor:'pointer', fontSize:'0.85rem', fontWeight:'bold' },
  saveBtn: { marginLeft:'auto', padding:'0.3rem 0.8rem', background:'#2563eb', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'0.85rem' },
  divider: { width:'1px', height:'20px', background:'#e5e7eb', margin:'0 0.25rem' },
  editorArea: { padding:'2rem' },
}
