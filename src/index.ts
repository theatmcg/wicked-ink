import { input } from '@inquirer/prompts';
import { JournalRepository } from './repositories/journal.repository.js';

const journal = new JournalRepository();

const entry = await input({
    message: 'How was your day?'
});

const savedPath = journal.save(entry);

console.log('\nJournal entry saved to:');
console.log(savedPath);
