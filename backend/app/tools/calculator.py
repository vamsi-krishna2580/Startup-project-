import ast
import operator
from typing import Union, Dict, Any

# Safe operators for mathematical evaluation
_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}

def _eval_node(node: ast.AST) -> Union[int, float]:
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return node.value
    elif isinstance(node, ast.BinOp):
        left = _eval_node(node.left)
        right = _eval_node(node.right)
        op_type = type(node.op)
        if op_type not in _OPERATORS:
            raise ValueError(f"Unsupported operator: {op_type.__name__}")
        if op_type in (ast.Div, ast.FloorDiv, ast.Mod) and right == 0:
            raise ZeroDivisionError("Division by zero in calculation")
        return _OPERATORS[op_type](left, right)
    elif isinstance(node, ast.UnaryOp):
        operand = _eval_node(node.operand)
        op_type = type(node.op)
        if op_type not in _OPERATORS:
            raise ValueError(f"Unsupported unary operator: {op_type.__name__}")
        return _OPERATORS[op_type](operand)
    else:
        raise ValueError(f"Unsupported syntax in expression: {ast.dump(node)}")

class CalculatorTool:
    """
    Deterministic Arithmetic Tool.
    Performs verified mathematical evaluations without relying on LLM arithmetic hallucination.
    """
    name: str = "calculator"
    description: str = "Safely evaluate mathematical expressions (e.g., '150000 / 12', '2400 * 0.35')."

    @staticmethod
    def execute(expression: str) -> Dict[str, Any]:
        cleaned = expression.strip().replace(",", "")
        try:
            tree = ast.parse(cleaned, mode="eval")
            result = _eval_node(tree.body)
            # Format nicely
            rounded = round(result, 4) if isinstance(result, float) else result
            return {
                "success": True,
                "expression": cleaned,
                "result": rounded,
                "formatted": f"{rounded:,.2f}" if isinstance(rounded, (int, float)) else str(rounded)
            }
        except Exception as e:
            return {
                "success": False,
                "expression": expression,
                "error": str(e)
            }
