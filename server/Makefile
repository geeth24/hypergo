.PHONY: build run clean docker-build docker-run db-init db-migrate

build:
	go build -o bin/hypergo ./cmd/hypergo

run: build
	./bin/hypergo

dev:
	go run ./cmd/hypergo/main.go

clean:
	rm -rf bin

docker-build:
	docker build -t hypergo .

docker-run:
	docker run -p 8079:8079 hypergo

# Database related commands
db-init:
	docker-compose up -d db
	sleep 3
	docker-compose exec db psql -U postgres -c "CREATE DATABASE hypergo;"

db-migrate:
	docker-compose exec db psql -U postgres -d hypergo -f /scripts/migration.sql

# Combined commands for development
setup: docker-build db-init db-migrate docker-run 