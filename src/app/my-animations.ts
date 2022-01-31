import { animate, query, stagger, style, transition, trigger } from "@angular/animations";

export const listAnim = trigger('listAnim', [
    transition('* => *', [
        query(':enter', [
            style({ opacity: 0, transform: 'translateX(-500px)', }),
            stagger('0.1s', animate('0.5s cubic-bezier(0, 1.4, 1, 1)'))
        ], { optional: true }),
        query(':leave', [
            stagger('0.1s', animate('0.2s', style({ opacity: 0 })))
        ], { optional: true })
    ])
]);

export const slideIn = trigger('slideIn', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100px)' }),
        animate('0.5s ease-out')
    ]),
    transition(':leave', [
        animate('0.5s ease-out', style({ opacity: 0, transform: 'translateX(-100px)' }))
    ])
]);