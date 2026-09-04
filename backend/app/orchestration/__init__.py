"""State-driven orchestration package.

Consumers should import the concrete module they need. Avoiding eager imports
prevents a cycle through the persistence service.
"""

__all__: list[str] = []
