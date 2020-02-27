# Handles setting up DB connection and performing DB actions.

defmodule Psql do
  def setup_db_connection(pw) do
    {:ok, pid} =
      Postgrex.start_link(
        hostname: "localhost",
        username: "tasm",
        password: pw,
        database: "tasm_code_safe"
      )

    pid
  end

  def store(pid, code, hash) do
    res = Postgrex.query!(pid, "SELECT * FROM code WHERE id = $1", [hash])
    x = res.num_rows
    case 0 do
      ^x -> Postgrex.query!(pid, "INSERT INTO code (id, code, created_on) VALUES ($1, $2, $3)", [
        hash,
        code,
        NaiveDateTime.utc_now()
      ])
      _ -> nil
    end
  end

  def retrieve(pid, id) do
    res = Postgrex.query!(pid, "SELECT * FROM code WHERE id = $1", [id])
    x = res.num_rows

    case 0 do
      ^x -> "This ID has no code stored on TASM."
      _ -> Enum.at(List.first(res.rows), 1)
    end
  end
end
