"""Backend service implementations.

Keep this package initializer deliberately lightweight. Eager imports here used to
create a cycle between ``services.persistence`` and ``orchestration`` that made
otherwise valid direct imports fail depending on module import order.
"""

__all__: list[str] = []
