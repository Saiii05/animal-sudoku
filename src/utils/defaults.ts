import { Animal } from "../types";
export const DEFAULT_ANIMALS: Animal[] = [
  { id: '1', char: '🦁', name: 'Lion' },
  { id: '2', char: '🐘', name: 'Elephant' },
  { id: '3', char: '🐸', name: 'Frog' },
  { id: '4', char: '🐼', name: 'Panda' },
  { id: '5', char: '🦄', name: 'Unicorn' },
  { id: '6', char: '🐙', name: 'Octopus' },
  { id: '7', char: '🦉', name: 'Owl' },
  { id: '8', char: '🦊', name: 'Fox' },
  { id: '9', char: '🐨', name: 'Koala' },
];
export const GALLERY_POOL = [
  ...DEFAULT_ANIMALS,
  { id: '10', char: '🐧', name: 'Penguin' }, { id: '11', char: '🐯', name: 'Tiger' }, { id: '12', char: '🐵', name: 'Monkey' },
  { id: '13', char: '🐷', name: 'Pig' }, { id: '14', char: '🐹', name: 'Hamster' }, { id: '15', char: '🐰', name: 'Rabbit' },
  { id: '16', char: '🐻', name: 'Bear' }, { id: '17', char: '🐣', name: 'Chick' }, { id: '18', char: '🐢', name: 'Turtle' },
  { id: '19', char: '🦕', name: 'Dino' },
];
