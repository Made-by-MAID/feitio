# Space and density

## One ruler

Every gap comes from seven steps.

| Token     | Size | Use                     |
| --------- | ---- | ----------------------- |
| `space-1` | 4px  | Icon and word           |
| `space-2` | 8px  | Inside a control        |
| `space-3` | 16px | Between items of a list |
| `space-4` | 24px | Inside a block          |
| `space-5` | 40px | Padding of a block      |
| `space-6` | 64px | Between blocks          |
| `space-7` | 96px | Between sections        |

## Density depends on the screen

Reading pages breathe. Work screens, with tables and forms to scan and act on in batches, are
compact. Set `data-density="compact"` on the work area; it tightens table cells and controls and
leaves text alone. Changing density animates; rows grow and shrink, they do not jump.

## Avoid

- A gap that is not on the ruler.
- A compact reading page, or a sparse table that fits five rows on a screen.
