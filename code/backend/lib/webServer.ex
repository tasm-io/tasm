# Handles Web Server setup / routes 
# Handles DB interactions and hashing 

defmodule WebServer do
  def start(serverPort, dbpass) do
    dispatch_config = build_dispatch_config(dbpass)
    {:ok, _} =
      :cowboy.start_clear(
        :http,
        [{:port, serverPort}],
        %{env: %{dispatch: dispatch_config}}
      )
  end

  def setup_db_connection(pw) do
    {:ok, pid} = Postgrex.start_link(hostname: "tasm.io", username: "tasm", password: pw, database: "tasm_code_safe")
    pid
  end

  def build_dispatch_config(dbpass) do
    :cowboy_router.compile([
      {:_,
       [
         #{"/", :cowboy_static, {:file, "/var/www/tasm.io/index.html"}},
         #{"/[...]", :cowboy_static, {:dir, "/var/www/tasm.io"}},
         #{"/[...]", :cowboy_static, {:dir, "/var/www/tasm.io/static"}},
         {"/submit", SubmitHandler, [setup_db_connection(dbpass)]},
         {"/request", RequestHandler, [setup_db_connection(dbpass)]},
       ]}
    ])
  end

  def hash_code(code) do 
    :crypto.hash(:sha256, code) |> Base.encode64
  end

  def store(pid, code, hash) do
    Postgrex.query!(pid, "INSERT INTO code (id, code, created_on) VALUES ($1, $2, $3)", [hash, code, NaiveDateTime.utc_now])
  end

  def retrieve(pid, id) do 
    IO.inspect(id)
    res = Postgrex.query!(pid, "SELECT * FROM code WHERE id = $1", [id])
    #t = IEx.Info.info(res.rows)
    x = res.num_rows
    case 0 do 
      ^x -> "This ID has no code stored on TASM."
      _ -> Enum.at(List.first(res.rows), 1)
    end 
  end 

end
