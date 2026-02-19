import inngest
from app.shared.infrastructure.inngest_client import inngest_client

@inngest_client.create_function(
    fn_id="hello-world",
    trigger=inngest.TriggerEvent(event="app/hello.world"),
)
async def hello_world(ctx: inngest.Context, step: inngest.Step):
    """
    A simple Hello World workflow to verify Inngest setup.
    """
    await step.run("print-hello", lambda: print("Hello from Inngest!"))
    
    return {"message": "Hello World executed successfully!"}
