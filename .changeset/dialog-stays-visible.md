---
"@feitio/core": patch
---

An open Dialog shows again. `components.css` had a second `.feitio-dialog[open]` rule with `opacity: 0` outside its `@starting-style`, so every open Dialog stayed invisible behind its backdrop. A test now refuses an open state hidden that way.
