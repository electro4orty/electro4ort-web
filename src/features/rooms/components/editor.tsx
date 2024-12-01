import { useEffect, useImperativeHandle, useState } from 'react';
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  convertToRaw,
  Editor as DraftEditor,
  EditorState,
  RichUtils,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Bold, Italic, Link, Underline } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import 'draft-js/dist/Draft.css';

function LinkComp({
  contentState,
  entityKey,
  children,
}: {
  contentState: ContentState;
  entityKey: string;
  children: React.ReactNode;
}) {
  const { url } = contentState.getEntity(entityKey).getData() as {
    url: string;
  };
  return (
    <a href={url} className="underline">
      {children}
    </a>
  );
}

function findLinkEntities(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      !!entityKey && contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
}

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: LinkComp,
  },
]);

interface EditorProps {
  editorRef: React.Ref<{
    getHtml: () => { html: string; text: string };
    clear: () => void;
  }>;
  disabled?: boolean;
  onChange: () => void;
  onEnter: () => void;
}

export default function Editor({
  editorRef,
  disabled,
  onChange,
  onEnter,
}: EditorProps) {
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorator)
  );

  const handleInlineClick = (value: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, value));
  };

  const createLink = () => {
    const selection = editorState.getSelection();
    const text = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getText();
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url: text }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    setEditorState(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
  };

  const removeLink = () => {
    setEditorState(
      RichUtils.toggleLink(editorState, editorState.getSelection(), null)
    );
  };

  const isOnLink = () => {
    try {
      const selection = editorState.getSelection();
      const content = editorState.getCurrentContent();
      const block = content.getBlockForKey(selection.getStartKey());
      const entityKey = block.getEntityAt(selection.getStartOffset());
      if (!entityKey) {
        return false;
      }

      const entity = content.getEntity(entityKey);

      return entity.getType() === 'LINK';
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useImperativeHandle(editorRef, () => ({
    getHtml: () => ({
      html: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      text: editorState.getCurrentContent().getPlainText(),
    }),
    clear: () => {
      setEditorState(EditorState.createEmpty());
    },
  }));

  useEffect(() => {
    onChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  return (
    <div>
      <div>
        <Toggle
          onClick={() => handleInlineClick('BOLD')}
          pressed={editorState.getCurrentInlineStyle().contains('BOLD')}
          disabled={disabled}
          size="sm"
        >
          <Bold />
        </Toggle>
        <Toggle
          onClick={() => handleInlineClick('ITALIC')}
          pressed={editorState.getCurrentInlineStyle().contains('ITALIC')}
          disabled={disabled}
          size="sm"
        >
          <Italic />
        </Toggle>
        <Toggle
          onClick={() => handleInlineClick('UNDERLINE')}
          pressed={editorState.getCurrentInlineStyle().contains('UNDERLINE')}
          disabled={disabled}
          size="sm"
        >
          <Underline />
        </Toggle>
        <Toggle
          onClick={() => (isOnLink() ? removeLink() : createLink())}
          pressed={isOnLink()}
          disabled={disabled}
          size="sm"
        >
          <Link />
        </Toggle>
      </div>

      <div
        className="[&>.DraftEditor-root]:border [&>.DraftEditor-root]:p-2 [&>.DraftEditor-root]:rounded-lg"
        onKeyDownCapture={(e) => {
          if (!e.shiftKey && e.code === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            onEnter();
          }
        }}
      >
        <DraftEditor
          placeholder="Write a message"
          editorState={editorState}
          onChange={disabled ? () => undefined : setEditorState}
        />
      </div>
    </div>
  );
}
