defmodule ElixirWebserver do
  def start() do
    dispatch_config = build_dispatch_config()

    {:ok, _} =
      :cowboy.start_clear(
        :http,
        [{:port, 8080}],
        %{env: %{dispatch: dispatch_config}}
      )
  end

  def build_dispatch_config do
    :cowboy_router.compile([
      {:_,
       [
         {"/[...]", :cowboy_static, {:dir, "/var/www/tasm.io/"}}
         {"/static/[...]", :cowboy_static, {:dir, "/var/www/tasm.io/"}}
       ]}
    ])
  end
end
