defmodule GenericResponses do
  def bad_request(request, state) do
    req =
      :cowboy_req.reply(
        # Response Code
        400,
        # Content Type
        %{"content-type" => "text/plain"},
        # Response
        "",
        # Original Request
        request
      )

    {:ok, req, state}
  end
end
