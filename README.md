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

## Як зберігається час

У базі ts в ютс форматі, також я зберігаю часовий пояс роботи офісу щоб правильно перетворювати ютс
в нього, сітка малюється в часовому поясі користувача але час на який він забронюється буде все
рівно в часи роботи офісу

## Tests

`npm test` — unit tests for the domain rules, integration tests against a real PostgreSQL.
