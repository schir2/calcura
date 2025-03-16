<script setup lang="ts">
interface Props {
  modelValue: string
}
const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])
const editor = useEditor({
  content: "",
  extensions: [TiptapStarterKit],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML()) // Sync changes
  }
});

onBeforeUnmount(() => {
  unref(editor).destroy();
});
</script>

<template>
  <div>
    <div v-if="editor">
      <n-button
          @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :type="editor.isActive('bold') ? 'primary' : 'default'"
      >
        bold
      </n-button>
      <n-button
          @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :type="editor.isActive('italic') ? 'primary' : 'default'"
      >
        italic
      </n-button>
      <n-button
          @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :type="editor.isActive('strike') ? 'primary' : 'default'"
      >
        strike
      </n-button>
      <n-button
          @click="editor.chain().focus().toggleCode().run()"
          :disabled="!editor.can().chain().focus().toggleCode().run()"
          :type="editor.isActive('code') ? 'primary' : 'default'"
      >
        code
      </n-button>
      <n-button @click="editor.chain().focus().unsetAllMarks().run()">
        clear marks
      </n-button>
      <n-button @click="editor.chain().focus().clearNodes().run()">
        clear nodes
      </n-button>
      <n-button
          @click="editor.chain().focus().setParagraph().run()"
          :type="editor.isActive('paragraph') ? 'primary' : 'default'"
      >
        paragraph
      </n-button>
      <n-button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :type="editor.isActive('heading', { level: 1 })  ? 'primary' : 'default'"
      >
        h1
      </n-button>
      <n-button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :type="editor.isActive('heading', { level: 2 })  ? 'primary' : 'default'"
      >
        h2
      </n-button>
      <n-button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :type="editor.isActive('heading', { level: 3 })  ? 'primary' : 'default'"
      >
        h3
      </n-button>
      <n-button
          @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
          :type="editor.isActive('heading', { level: 4 })  ? 'primary' : 'default'"
      >
        h4
      </n-button>
      <n-button
          @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
          :type="editor.isActive('heading', { level: 5 })  ? 'primary' : 'default'"
      >
        h5
      </n-button>
      <n-button
          @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
          :type="editor.isActive('heading', { level: 6 })  ? 'primary' : 'default'"
      >
        h6
      </n-button>
      <n-button
          @click="editor.chain().focus().toggleBulletList().run()"
          :type="editor.isActive('bulletList') ? 'primary' : 'default'"
      >
        bullet list
      </n-button>
      <n-button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :type="editor.isActive('orderedList') ? 'primary' : 'default'"
      >
        ordered list
      </n-button>
      <n-button
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :type="editor.isActive('codeBlock') ? 'primary' : 'default'"
      >
        code block
      </n-button>
      <n-button
          @click="editor.chain().focus().toggleBlockquote().run()"
          :type="editor.isActive('blockquote') ? 'primary' : 'default'"
      >
        blockquote
      </n-button>
      <n-button @click="editor.chain().focus().setHorizontalRule().run()">
        horizontal rule
      </n-button>
      <n-button @click="editor.chain().focus().setHardBreak().run()">
        hard break
      </n-button>
      <n-button
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().chain().focus().undo().run()"
      >
        undo
      </n-button>
      <n-button
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().chain().focus().redo().run()"
      >
        redo
      </n-button>
    </div>
    <TiptapEditorContent class="prose prose-skin" :editor="editor" />
  </div>
</template>