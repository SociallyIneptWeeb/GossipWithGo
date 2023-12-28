# GossipWithGo
 
A simple web forum built with React and Go.

## Technologies

Frontend: React with Material UI framework written in Typescript

Backend: Go with Fiber web framework and Gorm ORM library

Database: Postgresql

## Setup

### Install Git

Follow the instructions [here](https://git-scm.com/book/en/v2Getting-Started-Installing-Git) to install Git on your computer.

### Install Docker Compose

Follow these instructions [here](https://docs.docker.com/desktop/install/windows-install/) to install Docker Compose.

### Cloning this repository

Run this command to clone this entire repository.

```git clone https://github.com/SociallyIneptWeeb/GossipWithGo```

### Environment Variables (Optional)

You may update the [.env](.env) file with your preferred variables.

## Usage

In the root directory, run the following command to build and run the docker containers for frontend, backend and the postgres database. The database will also be automatically initialized with data.

```docker-compose up -d```

The frontend page can then be viewed at `http://localhost:3000`. You may then register a new account and login to view the home page. You may also login to any of the pre-initialized user accounts with the password `1234` for testing.
