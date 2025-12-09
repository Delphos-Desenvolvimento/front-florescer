import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { FontFamily } from '@tiptap/extension-font-family';
import Heading from '@tiptap/extension-heading';
import { Box, IconButton, Divider, Tooltip, ButtonGroup, Select, MenuItem, FormControl } from '@mui/material';
import {
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    FormatListBulleted,
    FormatListNumbered,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    FormatAlignJustify,
    FormatQuote,
    Code,
    Undo,
    Redo
} from '@mui/icons-material';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    error?: boolean;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const getCurrentFontSize = () => {
        if (editor.isActive('heading', { level: 1 })) return 'h1';
        if (editor.isActive('heading', { level: 2 })) return 'h2';
        if (editor.isActive('heading', { level: 3 })) return 'h3';
        return 'normal';
    };

    const setFontSize = (size: string) => {
        if (size === 'normal') {
            editor.chain().focus().setParagraph().run();
        } else if (size === 'h1') {
            editor.chain().focus().setHeading({ level: 1 }).run();
        } else if (size === 'h2') {
            editor.chain().focus().setHeading({ level: 2 }).run();
        } else if (size === 'h3') {
            editor.chain().focus().setHeading({ level: 3 }).run();
        }
    };

    const getCurrentFont = () => {
        const fontFamily = editor.getAttributes('textStyle').fontFamily;
        return fontFamily || 'default';
    };

    const setFont = (font: string) => {
        if (font === 'default') {
            editor.chain().focus().unsetFontFamily().run();
        } else {
            editor.chain().focus().setFontFamily(font).run();
        }
    };

    const alignAllText = (alignment: 'left' | 'center' | 'right' | 'justify') => {
        // Select all content and apply alignment
        editor.chain().focus().selectAll().setTextAlign(alignment).run();
        // Deselect after applying
        editor.commands.setTextSelection(editor.state.selection.to);
    };

    return (
        <Box
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                p: 1,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                backgroundColor: '#f5f5f5',
                borderRadius: '4px 4px 0 0'
            }}
        >
            {/* Font Family Selector */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                    value={getCurrentFont()}
                    onChange={(e) => setFont(e.target.value)}
                    sx={{ fontSize: '0.875rem', height: 32 }}
                >
                    <MenuItem value="default">Padrão</MenuItem>
                    <MenuItem value="Arial" style={{ fontFamily: 'Arial' }}>Arial</MenuItem>
                    <MenuItem value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</MenuItem>
                    <MenuItem value="Courier New" style={{ fontFamily: 'Courier New' }}>Courier New</MenuItem>
                    <MenuItem value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</MenuItem>
                    <MenuItem value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</MenuItem>
                </Select>
            </FormControl>

            {/* Font Size Selector */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                    value={getCurrentFontSize()}
                    onChange={(e) => setFontSize(e.target.value)}
                    sx={{ fontSize: '0.875rem', height: 32 }}
                >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="h3">Título 3</MenuItem>
                    <MenuItem value="h2">Título 2</MenuItem>
                    <MenuItem value="h1">Título 1</MenuItem>
                </Select>
            </FormControl>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            <ButtonGroup size="small" variant="outlined">
                <Tooltip title="Negrito (Ctrl+B)">
                    <IconButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        color={editor.isActive('bold') ? 'primary' : 'default'}
                        size="small"
                    >
                        <FormatBold fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Itálico (Ctrl+I)">
                    <IconButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        color={editor.isActive('italic') ? 'primary' : 'default'}
                        size="small"
                    >
                        <FormatItalic fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Sublinhado (Ctrl+U)">
                    <IconButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        color={editor.isActive('underline') ? 'primary' : 'default'}
                        size="small"
                    >
                        <FormatUnderlined fontSize="small" />
                    </IconButton>
                </Tooltip>
            </ButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            <ButtonGroup size="small" variant="outlined">
                <Tooltip title="Lista com marcadores">
                    <IconButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        color={editor.isActive('bulletList') ? 'primary' : 'default'}
                        size="small"
                    >
                        <FormatListBulleted fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Lista numerada">
                    <IconButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        color={editor.isActive('orderedList') ? 'primary' : 'default'}
                        size="small"
                    >
                        <FormatListNumbered fontSize="small" />
                    </IconButton>
                </Tooltip>
            </ButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            <ButtonGroup size="small" variant="outlined">
                <Tooltip title="Alinhar todo texto à esquerda">
                    <IconButton
                        onClick={() => alignAllText('left')}
                        color={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
                        size="small"
                    >
                        <FormatAlignLeft fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Centralizar todo texto">
                    <IconButton
                        onClick={() => alignAllText('center')}
                        color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
                        size="small"
                    >
                        <FormatAlignCenter fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Alinhar todo texto à direita">
                    <IconButton
                        onClick={() => alignAllText('right')}
                        color={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
                        size="small"
                    >
                        <FormatAlignRight fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Justificar todo texto">
                    <IconButton
                        onClick={() => alignAllText('justify')}
                        color={editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'}
                        size="small"
                    >
                        <FormatAlignJustify fontSize="small" />
                    </IconButton>
                </Tooltip>
            </ButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            <ButtonGroup size="small" variant="outlined">
                <Tooltip title="Citação">
                    <IconButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        color={editor.isActive('blockquote') ? 'primary' : 'default'}
                        size="small"
                    >
                        <FormatQuote fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Código">
                    <IconButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        color={editor.isActive('codeBlock') ? 'primary' : 'default'}
                        size="small"
                    >
                        <Code fontSize="small" />
                    </IconButton>
                </Tooltip>
            </ButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            <ButtonGroup size="small" variant="outlined">
                <Tooltip title="Desfazer (Ctrl+Z)">
                    <span>
                        <IconButton
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            size="small"
                        >
                            <Undo fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Refazer (Ctrl+Y)">
                    <span>
                        <IconButton
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            size="small"
                        >
                            <Redo fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
            </ButtonGroup>
        </Box>
    );
};

export default function RichTextEditor({ content, onChange, error }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false, // Disable default heading to use custom config
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
            }),
            TextStyle,
            FontFamily,
            Color,
            Link.configure({
                openOnClick: false,
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            handlePaste: (view, event) => {
                const items = event.clipboardData?.items;
                if (!items) return false;

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];

                    if (item.type.indexOf('image') === 0) {
                        event.preventDefault();

                        // Count existing images in the editor
                        let imageCount = 0;
                        view.state.doc.descendants((node) => {
                            if (node.type.name === 'image') imageCount++;
                        });

                        // Check image count before adding
                        if (imageCount >= 2) {
                            alert('Você pode adicionar no máximo 2 imagens no artigo.');
                            return true;
                        }

                        const file = item.getAsFile();
                        if (!file) continue;

                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const base64 = e.target?.result as string;
                            if (base64 && editor) {
                                editor.chain().focus().setImage({ src: base64 }).run();
                            }
                        };
                        reader.readAsDataURL(file);
                        return true;
                    }
                }
                return false;
            },
        },
    });

    return (
        <Box
            sx={{
                border: '1px solid',
                borderColor: error ? 'error.main' : 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                '&:focus-within': {
                    borderColor: error ? 'error.main' : 'primary.main',
                    borderWidth: 2,
                },
            }}
        >
            <MenuBar editor={editor} />
            <Box
                sx={{
                    minHeight: 300,
                    maxHeight: 500,
                    overflow: 'auto',
                    p: 2,
                    backgroundColor: '#fff',
                    '& .ProseMirror': {
                        outline: 'none',
                        minHeight: 250,
                        '& p': {
                            margin: '0.5em 0',
                        },
                        '& h1, & h2, & h3': {
                            marginTop: '1em',
                            marginBottom: '0.5em',
                        },
                        '& ul, & ol': {
                            paddingLeft: '1.5em',
                        },
                        '& blockquote': {
                            borderLeft: '3px solid #ccc',
                            paddingLeft: '1em',
                            marginLeft: 0,
                            fontStyle: 'italic',
                        },
                        '& pre': {
                            backgroundColor: '#f5f5f5',
                            padding: '1em',
                            borderRadius: '4px',
                            overflow: 'auto',
                        },
                        '& code': {
                            backgroundColor: '#f5f5f5',
                            padding: '0.2em 0.4em',
                            borderRadius: '3px',
                            fontSize: '0.9em',
                        },
                        '& img': {
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            margin: '1em 0',
                            display: 'block',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        },
                    },
                }}
            >
                <EditorContent editor={editor} />
            </Box>
        </Box>
    );
}
