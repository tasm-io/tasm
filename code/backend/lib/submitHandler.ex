# Handle the incoming code submission request.
# Ensure the body of the request has text else throw a 400.
# If the body has text store the text in the DB and return the user the hash.

defmodule SubmitHandler do
    def init(req0, state) do
        handle(req0, state) # Send request to handler 
    end

    def handle(request, state) do
      body_check = :cowboy_req.has_body(request)
      case true do 
        ^body_check -> {ok, code, req} = :cowboy_req.read_body(request)
        hash = WebServer.hash_code(code)
        dbpid = List.first(state)
        WebServer.store(dbpid, code, hash)
        req = :cowboy_req.reply(
              200, # Response Code 
              %{"content-type" => "application/json"}, #Content Type
              "{'ID': '#{hash}'}", #Response
              request #Original Request 
            )
         {:ok, req, state}
       _ -> bad_request(request, state)
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
