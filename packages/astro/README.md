# @feitio/astro

Feitio's components for Astro, and the single source of each component's HTML: the React port
([`@feitio/react`](https://www.npmjs.com/package/@feitio/react)) is tested to render the very same
markup.

```sh
npm install @feitio/core @feitio/astro
```

```astro
---
import '@feitio/core/css/fonts.css';
import '@feitio/core/css/feitio.css';
import Button from '@feitio/astro/Button.astro';
import Field from '@feitio/astro/Field.astro';
import Stack from '@feitio/astro/Stack.astro';
import TextInput from '@feitio/astro/TextInput.astro';
---
<Stack gap={5}>
  <Field label="Name" for="name" hint="Shown in the notification">
    <TextInput id="name" describedBy="name-hint" />
  </Field>
  <Button variant="primary" type="submit">Save</Button>
</Stack>
```

- Components with a behavior (Menu, Notice) bring their script; for Dialog, the form controls and
  the scroll helpers, call [`@feitio/vanilla`](https://www.npmjs.com/package/@feitio/vanilla) once
  on the page.
- Icons read the sprite at `/feitio/icons/sprite.svg` (copy `@feitio/core/icons/sprite.svg` there),
  or wherever each component's `sprite` prop says.

Every component, when to use it and when not to: https://made-by-maid.github.io/feitio/

MIT.
