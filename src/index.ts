import * as fs from "node:fs";
import * as path from "node:path";

import AnkiExport from "anki-apkg-export";

const [deckName, outputPath, ...files] = process.argv.slice(2);

if (files.length === 0) {
    console.error('No files were provided');
    console.error('Usage: node src/index.ts "Deck Name" "output.apkg" file1.md file2.md ...');
    process.exit(1);
}

interface Card {
    title: string
    content: string
}

interface File {
    mathPrelude: string
    cards: Card[]
}

function cardsFromFile(path: string): File {
    const markdown = fs.readFileSync('./5 Elastic Materials.md', 'utf8');
    const lines = markdown.split('\n');

    const h2Start = /^## /;
    let currentCard: Card | null = null;
    const cards = [];

    let mathPrelude = '';

    if (lines[0].startsWith('$$')) {
        let i = 1;
        for (; i < lines.length; i++) {
            if (lines[i].startsWith('$$')) {
                break
            }

            mathPrelude += lines[i] + '\n';
        }

        lines.splice(0, i + 1);
    }

    lines.splice(0, 0, mathPrelude)

    for (const line of lines) {
        if (h2Start.test(line)) {
            if (currentCard) {
                cards.push(currentCard);
            }

            currentCard = {
                title: line.replace(h2Start, ''),
                content: ''
            };
        } else if (currentCard) {
            currentCard.content += line + '\n';
        }
    }

    if (currentCard) {
        cards.push(currentCard);
    }

    return {
        mathPrelude,
        cards
    }
}

const parsedFiles = files.map(cardsFromFile);
const cards = parsedFiles.flatMap(file => file.cards);
const amalgamatedMathPrelude = parsedFiles.map(file => file.mathPrelude).join('\n');

const apkg = new AnkiExport(deckName);

for (const card of cards) {
    apkg.addCard(card.title, card.content);
}

const exportDb = false;

if (exportDb) {
    const db = apkg.db.export();
    fs.writeFileSync('./output.db', db, 'binary');
}

const zip = await apkg.save();
fs.writeFileSync(outputPath, zip, 'binary');
console.log(`Package has been generated: ${outputPath}`);

if (amalgamatedMathPrelude.trim() !== '') {
    const mathPath = path.basename(outputPath, '.apkg') + '.tex'
    fs.writeFileSync(mathPath, amalgamatedMathPrelude, 'utf8');
    console.log(`Math prelude has been generated: ${mathPath}`);
}
