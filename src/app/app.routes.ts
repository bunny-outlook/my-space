import { Routes } from '@angular/router';
import { Notes} from './components/notes/notes';
import { Schedule } from './components/schedule/schedule';
import { Day } from './components/day/day';

export const routes: Routes = [
    {
        path: '',
        component: Schedule,
        title: 'Home'
    },
    {
        path: "notes",
        component: Notes,
        title: 'Notes'
    },
    {
        path: "day",
        component: Day,
        title: 'Day'
    },
];
