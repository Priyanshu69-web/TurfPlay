import Agenda from 'agenda';
import dotenv from 'dotenv';

dotenv.config();

const agenda = new Agenda({
    db: { address: process.env.MONGO_URI, collection: 'agendaJobs' }
});

agenda.on('ready', () => {
    console.log('Agenda started');
});

agenda.on('error', (err) => {
    console.log('Agenda connection error:', err);
});

export default agenda;
