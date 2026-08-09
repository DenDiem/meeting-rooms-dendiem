# Meeting Rooms

A booking app for the meeting rooms of a single office. You sign in, look at a week of a room in
your own time zone, click a free slot and book it. Overlapping bookings are impossible.

## Stack

| part     | choice                                                                                |
| -------- | ------------------------------------------------------------------------------------- |
| monorepo | npm workspaces (`apps/api`, `apps/web`)                                               |
| API      | NestJS 11, Prisma 7, PostgreSQL 17, Zod, bcryptjs, Luxon                              |
| Web      | React 19, Vite, react-router, Redux Toolkit + RTK Query, react-hook-form, CSS modules |
| auth     | server sessions in the database behind an httpOnly cookie                             |

## Run everything with Docker

```
cp .env.example .env
make up
make seed
```

Open `http://localhost:5173`. That is the whole app: nginx serves the client and proxies `/api` to
the API container, so the browser talks to a single origin and the session cookie just works.

`make up` builds the images, waits for the database to become healthy and applies the migrations.
`make seed` fills the database with rooms, users and demo bookings — it is a separate step so that
you can restart the stack without losing your own data. `make reset` wipes the volume and starts
over, `make down` stops everything, `make logs` follows the logs.

Without `make`, the same thing is `docker compose up -d --build`, then
`docker compose exec api npm run db:seed -w @meeting-rooms/api`.

## Run locally

Node 22 or newer, plus Docker for the database only.

```
cp .env.example .env
npm ci
make db
npm run db:migrate -w @meeting-rooms/api
npm run db:seed -w @meeting-rooms/api
npm run dev
```

`npm run dev` starts the API on `http://localhost:3000` and the client on
`http://localhost:5173`. Vite proxies `/api` to the API, so again there is one origin.

If port 5432 is already taken on your machine, change `POSTGRES_PORT` and the port inside
`DATABASE_URL` in your `.env`; nothing else needs to know.

## Environment

Everything lives in `.env`, and `.env.example` is a working copy of it.

| variable                                                             | meaning                                                      |
| -------------------------------------------------------------------- | ------------------------------------------------------------ |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` | the database container                                       |
| `DATABASE_URL`                                                       | how the API reaches the database when it runs outside Docker |
| `API_PORT`, `WEB_PORT`                                               | ports for local development                                  |
| `SESSION_COOKIE_NAME`                                                | name of the session cookie                                   |
| `SESSION_COOKIE_SECURE`                                              | `true` behind HTTPS, `false` for local development           |
| `SESSION_TTL_DAYS`                                                   | how long a session stays valid                               |
| `OFFICE_TIMEZONE`, `OFFICE_OPEN_HOUR`, `OFFICE_CLOSE_HOUR`           | the working window, checked on the server                    |

## Demo data

Six rooms across three floors: Aquarium, Workshop, Mars, Apollo, Lighthouse, Observatory —
from 4 to 20 seats.

Two users, both with the password `password123`:

- `ivan@example.com` — Ivan Petrenko
- `olena@example.com` — Olena Kovalenko

Five demo bookings are placed in the week that starts next Monday, so the schedule always opens with
something in it and nothing lands in the past.

## Scripts

Run from the repository root; each one fans out to the workspaces.

| command                | what it does                               |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | API and client together                    |
| `npm run build`        | builds both                                |
| `npm test`             | unit tests                                 |
| `npm run typecheck`    | TypeScript over both workspaces            |
| `npm run lint`         | ESLint                                     |
| `npm run format:check` | Prettier                                   |
| `make check`           | all of the above in the order CI runs them |

## Tests

```
npm test
```

The suite covers the domain rules that decide whether a booking is legal: interval overlap,
alignment to the half-hour grid, the office window, and the order in which the rules are applied.
The cases the task calls out are all there — touching intervals are free, partial overlap, full
containment, identical intervals, the same hours on different days — plus daylight saving and a
`+05:45` time zone, because those are where a naive implementation breaks.

They are pure unit tests: no database, no HTTP, no Nest container. The whole run takes about
200 ms.

## How overlapping is prevented

Two independent layers, and the second one is the one that actually guarantees the invariant.

**A pure function** compares the requested interval with the bookings already in the room and
produces a message a person can act on. This is what you see in the dialog.

**A database constraint** makes an overlap impossible even if two requests arrive at the same
millisecond:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking" ADD CONSTRAINT "Booking_no_overlap"
    EXCLUDE USING gist ("roomId" WITH =, tstzrange("startsAt", "endsAt", '[)') WITH &&)
    WHERE ("canceledAt" IS NULL);
```

The range is half-open, `[)`, so a booking that ends at 11:00 and one that starts at 11:00 do not
collide. The constraint is partial — cancelled bookings are excluded, which is what lets a slot be
reused after a cancellation. A violation surfaces as SQLSTATE `23P01`, which the API turns into
`409 Conflict` with a readable message instead of a stack trace.

A check for the same table refuses a booking whose end is not after its start, so the range can
never be empty or inverted.

This was verified by firing five identical requests in parallel: one booking was created, four came
back as `409`, and the table held exactly one row.

## How time is stored

Everything is stored in UTC in `timestamptz` columns. No offsets are stored anywhere.

The browser renders in the viewer's own zone. The server validates the working window in the
office's zone, which is an IANA name (`Europe/Kyiv`), so daylight saving is handled by the time zone
database rather than by arithmetic. Alignment to the half-hour grid is also checked in the office
zone — in a zone such as `Asia/Kathmandu` (+05:45) an instant that looks aligned in UTC is not
aligned locally.

## API

Everything is under the `/api` prefix. Every route except registration and login requires the
session cookie.

| method   | route                    | purpose                                              |
| -------- | ------------------------ | ---------------------------------------------------- |
| `POST`   | `/api/auth/register`     | create an account and open a session                 |
| `POST`   | `/api/auth/login`        | open a session                                       |
| `GET`    | `/api/auth/me`           | the current user, `401` when signed out              |
| `POST`   | `/api/auth/logout`       | revoke the session                                   |
| `GET`    | `/api/rooms`             | rooms, optionally `?minCapacity=`                    |
| `GET`    | `/api/bookings/schedule` | one room for one week: `?roomId=&week=`              |
| `POST`   | `/api/bookings`          | create a booking                                     |
| `GET`    | `/api/bookings/mine`     | own bookings: `?scope=upcoming\|past&page=&perPage=` |
| `DELETE` | `/api/bookings/:id`      | cancel own booking                                   |
| `GET`    | `/api/health`            | liveness plus a database ping                        |

## Why sessions and not JWT

The guard has to read the database on every request anyway, to know that the user still exists. A
stateless token would not have saved that round trip, and it would have made signing out a promise
rather than a fact. A session row can be revoked, and the moment it is, the cookie is worthless.

The cookie is `httpOnly` and `sameSite=lax`, so client-side scripts cannot read it. The database
stores only the SHA-256 hash of the token — a leaked database dump does not hand anyone a working
session.

## Project layout

```
apps/
  api/           NestJS: modules with a folder per kind of file
    src/
      common/    cross-module helpers, pipes, filters
      config/    configuration defaults
      database/  Prisma module and service
      modules/   auth, rooms, bookings, health
    prisma/      schema, migrations, seed
    tests/       unit tests, split by domain
  web/           React
    src/
      _components/  presentational building blocks
      _domain/      models, guards, validators, services
      modules/      feature folders: auth, bookings
      store/        Redux store, RTK Query endpoints, slices
docker/          Dockerfiles and the nginx config
```

Only repositories and filter builders know that Prisma exists; nothing above them sees a `Prisma.*`
type. On the client, only RTK Query endpoints know about HTTP.

## From the bonus list

- **One command to start everything** — `make up` builds and runs the database, the API and the
  client, and applies migrations on the way.
- **Protection against a race** — the `EXCLUDE USING gist` constraint described above.
- **Filtering rooms by capacity** — a filter in the toolbar, applied on the server, and kept in the
  store so it survives navigation.
