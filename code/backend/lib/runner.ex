defmodule Runner do
  use Application

  def start(_type, _args) do
    {serverPort, _} = Integer.parse(System.get_env("PORT"))
    dbHost = System.get_env("DB_HOST")
    dbUser = System.get_env("DB_USER")
    dbPass = System.get_env("DB_PASS")

    children = [
      %{
        id: WebServer,
        start: {WebServer, :start, [serverPort, dbHost, dbUser, dbPass]}
      }
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
