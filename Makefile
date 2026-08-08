.PHONY: up down restart db logs ps migrate seed reset install dev check

up:
	docker compose up -d --build

down:
	docker compose down

restart: down up

db:
	docker compose up -d db

logs:
	docker compose logs -f

ps:
	docker compose ps

migrate:
	docker compose exec api npm run db:deploy -w @meeting-rooms/api

seed:
	docker compose exec api npm run db:seed -w @meeting-rooms/api

reset:
	docker compose down -v
	docker compose up -d --build

install:
	npm ci

dev:
	npm run dev

check:
	npm run format:check
	npm run lint
	npm run build
	npm run typecheck
	npm test
