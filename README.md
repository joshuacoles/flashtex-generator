# Flashtex Gen

I use the [Flashtex](https://flashtex.app/) app to do spaced repitition, but I want to write the cards in markdown files for easier editing and
version control. This script converts markdown files to the `apkg` Anki format which Flashtex can import.

## Card Identity

Cards are identified by the deck name and the card title. If a card with the same title already exists in the deck,
it will be updated. If you don't change either of these, the card will be updated.

While I haven't checked, the Flashtex app adds a tag for the deck name and the generic `#anki` tag to each card, so I
suggest you don't use these tags in your cards, nor name the deck `anki`.

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
