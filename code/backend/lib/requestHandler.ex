# Handle the incoming code retrieval request.
# Ensure the params of the request has id else throw a 400.
# Attempt to retrieve the code with the id.

defmodule RequestHandler do
    def init(req0, state) do
        handle(req0, state)
    end

    def retrieve_id_from(request) do
      qs = :cowboy_req.parse_qs(request)
      {key, id} = List.first(qs)
      case "id" do 
       ^key -> id
       _ -> ""
      end 
    end


    def handle(request, state) do 
      id = retrieve_id_from(request)
      case "" do 
        ^id -> bad_request(request, state)
        _ -> dbpid = List.first(state)
        code = WebServer.retrieve(dbpid, id)
        req = :cowboy_req.reply(
              200, # Response Code 
              %{"content-type" => "application/json"}, #Content Type
              "{'code': '#{code}'}", #Response
              request #Original Request 
            )
            {:ok, req, state}
      end 
    end 


    def bad_request(request, state) do
      req = :cowboy_req.reply(
              400, # Response Code 
              %{"content-type" => "text/plain"}, #Content Type
              "", #Response
              request #Original Request 
            )
            {:ok, req, state}
    end

    def terminate(_reason, _request, _state) do
      :ok
    end
  end
