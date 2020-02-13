# Handles Web Server setup / routes

defmodule WebServer do
  use Application

  def start(serverPort, dbpass) do
    dispatch_config = build_dispatch_config(dbpass)

    {:ok, _} =
      :cowboy.start_clear(
        :http,
        [{:port, serverPort}],
        %{env: %{dispatch: dispatch_config}}
      )
  end

  def build_dispatch_config(dbpass) do
    :cowboy_router.compile([
      {:_,
       [
         # {"/", :cowboy_static, {:file, "/var/www/tasm.io/index.html"}},
         # {"/[...]", :cowboy_static, {:dir, "/var/www/tasm.io"}},
         # {"/[...]", :cowboy_static, {:dir, "/var/www/tasm.io/static"}},
         {"/submit", SubmitHandler, [Psql.setup_db_connection(dbpass)]},
         {"/request", RequestHandler, [Psql.setup_db_connection(dbpass)]}
       ]}
    ])
  end
end
