# @feitio/react

Feitio's components for React. They render the same HTML as the Astro components
(`@feitio/astro`), and a test in the repository holds them to it.

```sh
npm install @feitio/core @feitio/react
```

```tsx
import '@feitio/core/css/fonts.css';
import '@feitio/core/css/feitio.css';
import { Button, Notice, Stack } from '@feitio/react';

export function Saved() {
  return (
    <Stack gap={3}>
      <Notice status="ok" title="Salvo" timeout={5000} />
      <Button variant="primary">Continuar</Button>
    </Stack>
  );
}
```

- **Behaviors wire themselves.** Menu, Notice, Dialog, Switch, SegmentedControl, TimeInput,
  FilterField, ScrollFade, BackToTop and AppShell bring their JavaScript (from `@feitio/vanilla`)
  when they mount. Nothing to call.
- **Notices from code.** `const { show, close } = useNotices()`, then `show(element)` with the
  element a Notice's `ref` points to.
- **Feedback from state.** A StatusOverlay follows its `state` and `label` props.
- **Icons** come from `/feitio/icons/sprite.svg` (copy `@feitio/core/icons/sprite.svg` there), or
  from wherever `<FeitioProvider sprite="...">` says.
- **Controls are uncontrolled**: `value`, `checked` and `on` are where they start; `onChange` tells
  what changed.

The guidelines, every component and when not to use it: https://feitio.bymaid.com/
