# Handles Web Server setup / routes

defmodule WebServer do
  use Application

  def start(serverPort, dbHost, dbUser, dbPass) do
    dispatch_config = build_dispatch_config(dbHost, dbUser, dbPass)

    {:ok, _} =
      :cowboy.start_clear(
        :https,
        [{:port, serverPort}],
        %{env: %{dispatch: dispatch_config}}
      )
  end

  def build_dispatch_config(dbHost, dbUser, dbPass) do
    :cowboy_router.compile([
      {:_,
       [
         {"/submit", SubmitHandler, [Psql.setup_db_connection(dbHost, dbUser, dbPass)]},
         {"/request", RequestHandler, [Psql.setup_db_connection(dbHost, dbUser, dbPass)]},
         {"/[share/[...]]", :cowboy_static, {:file, "/var/www/tasm.io/index.html"}},
         {"/[...]", :cowboy_static, {:dir, "/var/www/tasm.io"}},
         {"/[...]", :cowboy_static, {:dir, "/var/www/tasm.io/static"}}
       ]}
    ])
  end
end
