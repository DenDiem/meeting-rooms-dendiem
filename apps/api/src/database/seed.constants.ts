export const SALT_ROUNDS = 10;

export const SEED_ROOMS = [
  { name: 'Aquarium', floor: 1, capacity: 6 },
  { name: 'Workshop', floor: 1, capacity: 20 },
  { name: 'Mars', floor: 2, capacity: 4 },
  { name: 'Apollo', floor: 2, capacity: 10 },
  { name: 'Lighthouse', floor: 3, capacity: 8 },
  { name: 'Observatory', floor: 3, capacity: 14 },
];

export const SEED_USERS = [
  { name: 'Ivan Petrenko', email: 'ivan@example.com', password: 'password123' },
  { name: 'Olena Kovalenko', email: 'olena@example.com', password: 'password123' },
];

export const SEED_BOOKINGS = [
  { room: 'Apollo', user: 'ivan@example.com', title: 'Retrospective', day: -5, from: 15, to: 16 },
  { room: 'Mars', user: 'olena@example.com', title: 'Hiring call', day: -3, from: 11, to: 12 },
  {
    room: 'Aquarium',
    user: 'ivan@example.com',
    title: 'Sprint planning',
    day: 0,
    from: 10,
    to: 11,
  },
  { room: 'Aquarium', user: 'olena@example.com', title: 'Design sync', day: 0, from: 11, to: 12 },
  { room: 'Mars', user: 'olena@example.com', title: 'One-on-one', day: 1, from: 9.5, to: 10.5 },
  { room: 'Apollo', user: 'ivan@example.com', title: 'Quarterly review', day: 2, from: 14, to: 18 },
  { room: 'Observatory', user: 'olena@example.com', title: 'Standup', day: 3, from: 12, to: 12.5 },
  {
    room: 'Lighthouse',
    user: 'ivan@example.com',
    title: 'Roadmap review',
    day: 8,
    from: 13,
    to: 15,
  },
];
