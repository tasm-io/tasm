defmodule Runner do
  use Application

  def start(_type, _args) do
    {serverPort, _} = Integer.parse(System.get_env("PORT"))
    dbPass = System.get_env("DB_PASS")

    children = [
      %{
        id: WebServer,
        start: {WebServer, :start, [serverPort, dbPass]}
      }
    ]

    Supervisor.start_link(children, strategy: :one_for_one)
  end
end
