import { type ReactElement, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  FilterField,
  Menu,
  Notice,
  SegmentedControl,
  StatusOverlay,
  Switch,
  TimeInput,
  useNotices,
} from '../src/index.ts';

/** The page the browser test drives: one of each component that has a behavior. */
export function App(): ReactElement {
  const [view, setView] = useState('Lista');
  const [state, setState] = useState<'ok' | undefined>(undefined);
  const saved = useRef<HTMLDivElement>(null);
  const { show } = useNotices();
  return (
    <main id="content">
      <h1>Feitio React</h1>
      <Menu
        id="lang"
        label="PT"
        items={[
          { text: 'Português', href: '#pt', current: true },
          { text: 'English', href: '#en' },
          { text: 'Español', href: '#es' },
        ]}
      />
      <Switch label="Avisos" />
      <SegmentedControl
        label="Vista"
        options={['Lista', 'Grade']}
        value={view}
        onChange={setView}
      />
      <p id="view">{view}</p>
      <TimeInput cycle="12" />
      <Notice title="Fechável" close id="closable" />
      <Notice title="Salvo" status="ok" timeout={60000} hidden id="saved" ref={saved} />
      <Button id="show" onClick={() => saved.current && show(saved.current)}>
        Mostrar aviso
      </Button>
      <Button data-open-dialog="erase">Apagar tudo</Button>
      <Dialog
        id="erase"
        title="Apagar tudo?"
        action="Apagar"
        danger
        confirmWord={{ word: 'APAGAR', label: 'Digite APAGAR' }}
      >
        Não tem volta.
      </Dialog>
      <FilterField id="filter" list="fruits" label="Filtrar" />
      <ul id="fruits">
        <li data-search="maçã">Maçã</li>
        <li data-search="banana">Banana</li>
        <li data-search="manga">Manga</li>
      </ul>
      <StatusOverlay state={state} label={state ? 'Salvo' : ''}>
        <Button id="save" onClick={() => setState('ok')}>
          Salvar
        </Button>
      </StatusOverlay>
    </main>
  );
}
