defmodule WebServer do
  def start(serverPort) do
    dispatch_config = build_dispatch_config()
    {:ok, _} =
      :cowboy.start_clear(
        :http,
        [{:port, serverPort}],
        %{env: %{dispatch: dispatch_config}}
      )
  end

  def build_dispatch_config do
    :cowboy_router.compile([
      {:_,
       [
         {"/", :cowboy_static, {:file, "/var/www/tasm.io/index.html"}},
         {"/[...]", :cowboy_static, {:dir, "/var/www/tasm.io"}},
         {"/[...]", :cowboy_static, {:dir, "/var/www/tasm.io/static"}}
       ]}
    ])
  end
end
