import type { Category } from '@/types';

const img = (seed: string) => `https://picsum.photos/seed/${seed}/300/300`;

export const searchCategories: Category[] = [
  { id: 'music', name: 'Music', color: '#dc148c', imageUrl: img('cat-music') },
  {
    id: 'podcasts',
    name: 'Podcasts',
    color: '#006450',
    imageUrl: img('cat-podcasts'),
  },
  {
    id: 'live',
    name: 'Live Events',
    color: '#8d67ab',
    imageUrl: img('cat-live'),
  },
  {
    id: 'made-for-you',
    name: 'Made For You',
    color: '#1e3264',
    imageUrl: img('cat-mfy'),
  },
  {
    id: 'new',
    name: 'New Releases',
    color: '#e8115b',
    imageUrl: img('cat-new'),
  },
  { id: 'pop', name: 'Pop', color: '#148a08', imageUrl: img('cat-pop') },
  {
    id: 'hip-hop',
    name: 'Hip-Hop',
    color: '#bc5900',
    imageUrl: img('cat-hiphop'),
  },
  { id: 'rock', name: 'Rock', color: '#e91429', imageUrl: img('cat-rock') },
  {
    id: 'indie',
    name: 'Indie',
    color: '#8d67ab',
    imageUrl: img('cat-indie'),
  },
  {
    id: 'electronic',
    name: 'Electronic',
    color: '#0d73ec',
    imageUrl: img('cat-electro'),
  },
  { id: 'chill', name: 'Chill', color: '#7d4b32', imageUrl: img('cat-chill') },
  {
    id: 'workout',
    name: 'Workout',
    color: '#777777',
    imageUrl: img('cat-workout'),
  },
  { id: 'sleep', name: 'Sleep', color: '#503750', imageUrl: img('cat-sleep') },
  {
    id: 'country',
    name: 'Country',
    color: '#b06239',
    imageUrl: img('cat-country'),
  },
  { id: 'jazz', name: 'Jazz', color: '#608108', imageUrl: img('cat-jazz') },
  {
    id: 'classical',
    name: 'Classical',
    color: '#a0c3d2',
    imageUrl: img('cat-classical'),
  },
];
