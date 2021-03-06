# Elixir Webserver

Serves the main Tasm Application through a reverse proxy alongside Nginx. Also acts as a JSON API serving shared code when users visit a shared code URL.

## Installation

- Install Elixir. 
- Run mix deps.get to get the dependancies.
- Run iex -S mix to start an interactive shell
- Type WebServer.start() to start the webserver. 
- Ensure there is a reverse proxy to the designated port, (default 8080).

# Deployment

- Install Elixir 
- Run mix deps.get 
- Set MIX_ENV=prod 
- Run mix release
- You now have a binary :)

# Environment Variables 

The webserver expects two environment variables to set upon running. 

- dbPass : The password for the database.
- port : The port to run the webserver on.
