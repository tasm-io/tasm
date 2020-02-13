# Handle the incoming code retrieval request.
# Ensure the params of the request has id else throw a 400.
# Attempt to retrieve the code with the id.

defmodule RequestHandler do
  def init(req0, state) do
    req = :cowboy_req.set_resp_header(<<"access-control-allow-methods">>, <<"GET, OPTIONS">>, req0)
    req2 = :cowboy_req.set_resp_header(<<"access-control-allow-origin">>, <<"*">>, req)
    handle(req2, state)
  end

  def retrieve_id_from(request) do
    qs = :cowboy_req.parse_qs(request)
    count = length(qs)

    case 0 do
      ^count ->
        ""

      _ ->
        {key, id} = List.first(qs)

        case "id" do
          ^key -> id
          _ -> ""
        end
    end
  end

  def handle(request, state) do
    id = retrieve_id_from(request)

    case "" do
      ^id ->
        GenericResponses.bad_request(request, state)

      _ ->
        dbpid = List.first(state)
        code = Psql.retrieve(dbpid, id)

        req =
          :cowboy_req.reply(
            # Response Code
            200,
            # Content Type
            %{"content-type" => "application/json"},
            # Response
            "{\"code\": \"#{code}\"}",
            # Original Request
            request
          )

        {:ok, req, state}
    end
  end

  def terminate(_reason, _request, _state) do
    :ok
  end
end
