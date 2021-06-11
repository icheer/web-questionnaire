import { writable, get } from 'svelte/store';
import { tick } from 'svelte';

export const quizData = writable({});
export const questions = writable([]);
export const answers = writable({});
