.PHONY: build run clean docker-build docker-run

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

# Run everything with Docker Compose
docker-compose-up:
	docker compose up -d

docker-compose-down:
	docker compose down

# Show logs
logs:
	docker compose logs -f

.DEFAULT_GOAL := dev 