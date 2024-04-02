# Flashtex Gen

I use the Flashtex app to do spaced repitition, but I want to write the cards in markdown files for easier editing and
version control. This script converts markdown files to the Flashtex format.

## Usage

```bash
bun run src/index.ts "Deck Name" "output path" "input markdown files..."
```

In addition, a macros file will be generated from the combination of initial latex preludes in each file and written to
`$output-file-name.tex` next to the output file.

## Example Markdown File

```markdown
$$
Optional math prelude
$$

## Card name
... card contents ...

## Card name
... card contents ...
```
