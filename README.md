# Meeting Rooms

Booking of meeting rooms: one week of one room at a time, 30-minute slots, bookings from 30 minutes
to 4 hours.

## Run

1. `cp .env.example .env`
2. `docker compose up -d --build`
3. `docker compose exec api npm run db:seed -w @meeting-rooms/api`

The app is at http://localhost:5173.

## Test accounts

| Email               | Password      |
| ------------------- | ------------- |
| `ivan@example.com`  | `password123` |
| `olena@example.com` | `password123` |

Registration prints the email confirmation link to the API log, since development has no mail
server: `docker compose logs api | grep "Confirmation link"`.

## Перевірка перетинів

2 шари перевірки, перша на рівні апі шукає чи немає часом перетинів в існуючій базі, і другий шар
констрейнт в самому постгресі який прямо не дозволяє два записи які перетинаються

Другий шар потрібен саме через одночасні запити: двоє можуть прочитати той самий вільний слот
раніше, ніж хтось із них запише, і перша перевірка цього не спіймає. Гонку зупиняє констрейнт — той,
хто програв, отримує 409.

## Як зберігається час

У базі ts в ютс форматі, також я зберігаю часовий пояс роботи офісу щоб правильно перетворювати ютс
в нього, сітка малюється в часовому поясі користувача але час на який він забронюється буде все
рівно в часи роботи офісу

## Extras

- `docker compose up` brings the database, the API and the client up together
- email confirmation in development: the link goes to the API log, and booking needs a confirmed address
- weekly recurring bookings, cancellable as one occurrence or as the whole series
- race protection, described above
- an in-app warning `NOTIFY_BEFORE_MINUTES` before a booking ends when the room is taken right after; it arrives once and never for a cancelled booking
- integration tests for overlaps and for the booking lifecycle
- rooms filtered by capacity
- the grid is usable on a phone

## Tests

```bash
npm ci
npm test
```

`npm test` covers the domain rules and needs no database. The integration tests do need one, so they
run separately against the database from `docker compose`:

```bash
npm run test:integration -w @meeting-rooms/api
```
