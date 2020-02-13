# Handle the incoming code submission request.
# Ensure the body of the request has text else throw a 400.
# If the body has text store the text in the DB and return the user the hash.

defmodule SubmitHandler do

  def init(req0, state) do
    req = :cowboy_req.set_resp_header(<<"access-control-allow-methods">>, <<"POST, OPTIONS">>, req0)
    req2 = :cowboy_req.set_resp_header(<<"access-control-allow-origin">>, <<"*">>, req)
    handle(req2, state)
  end

  def handle(request, state) do
    body_check = :cowboy_req.has_body(request)

    case true do
      ^body_check ->
        {:ok, code, req} = :cowboy_req.read_body(request)
        hash = hash_code(code)
        dbpid = List.first(state)
        Psql.store(dbpid, code, hash)

        req =
          :cowboy_req.reply(
            # Response Code
            200,
            # Content Type
            %{"content-type" => "application/json"},
            # Response
            "{'ID': '#{hash}'}",
            # Original Request
            req
          )

        {:ok, req, state}

      _ ->
        GenericResponses.bad_request(request, state)
    end
  end

  def terminate(_reason, _request, _state) do
    :ok
  end

  def hash_code(code) do
    :crypto.hash(:sha256, code) |> Base.encode64()
  end
end
