"""Validators for column existence, data type, and range checks."""

import pandas as pd

from app.core.validation.engine import BaseValidator, ValidationResult


class ColumnExistsValidator(BaseValidator):
    """Validates that required columns exist in a DataFrame."""

    def validate(self, data: pd.DataFrame, config: dict) -> ValidationResult:
        required_columns: list[str] = config.get("columns", [])
        missing = [col for col in required_columns if col not in data.columns]

        if missing:
            return ValidationResult(
                rule_id=config.get("rule_id"),
                rule_name=config.get("rule_name", "column_exists"),
                status="fail",
                details={
                    "missing_columns": missing,
                    "required_columns": required_columns,
                    "available_columns": list(data.columns),
                },
            )

        return ValidationResult(
            rule_id=config.get("rule_id"),
            rule_name=config.get("rule_name", "column_exists"),
            status="pass",
            details={"checked_columns": required_columns},
        )


class DataTypeValidator(BaseValidator):
    """Validates that specified columns have the expected data types."""

    def validate(self, data: pd.DataFrame, config: dict) -> ValidationResult:
        type_map: dict[str, str] = config.get("type_map", {})
        failures = []

        for col, expected_type in type_map.items():
            if col not in data.columns:
                failures.append({"column": col, "error": "column_not_found"})
                continue

            actual_dtype = str(data[col].dtype)
            # Simple type matching: "int", "float", "string", "datetime"
            matches = False
            if expected_type == "int" and "int" in actual_dtype:
                matches = True
            elif expected_type == "float" and "float" in actual_dtype:
                matches = True
            elif expected_type == "string" and "object" in actual_dtype:
                matches = True
            elif expected_type == "datetime" and "datetime" in actual_dtype:
                matches = True

            if not matches:
                failures.append(
                    {
                        "column": col,
                        "expected": expected_type,
                        "actual": actual_dtype,
                    }
                )

        if failures:
            return ValidationResult(
                rule_id=config.get("rule_id"),
                rule_name="data_type",
                status="fail",
                details={"failures": failures},
            )

        return ValidationResult(
            rule_id=config.get("rule_id"),
            rule_name="data_type",
            status="pass",
            details={"checked_columns": list(type_map.keys())},
        )


class RangeValidator(BaseValidator):
    """Validates that numeric columns fall within a specified range."""

    def validate(self, data: pd.DataFrame, config: dict) -> ValidationResult:
        column = config.get("column")
        min_val = config.get("min")
        max_val = config.get("max")

        if column is None or column not in data.columns:
            return ValidationResult(
                rule_id=config.get("rule_id"),
                rule_name="range",
                status="error",
                details={"error": f"Column '{column}' not found in data"},
            )

        violations = []
        for idx, value in data[column].items():
            if pd.isna(value):
                continue
            if min_val is not None and value < min_val:
                violations.append({"row": int(idx), "value": value, "reason": f"below minimum {min_val}"})
            elif max_val is not None and value > max_val:
                violations.append({"row": int(idx), "value": value, "reason": f"above maximum {max_val}"})

        if violations:
            return ValidationResult(
                rule_id=config.get("rule_id"),
                rule_name="range",
                status="fail",
                details={
                    "column": column,
                    "min": min_val,
                    "max": max_val,
                    "violations": violations[:100],  # Limit to 100 violations
                    "total_violations": len(violations),
                },
            )

        return ValidationResult(
            rule_id=config.get("rule_id"),
            rule_name="range",
            status="pass",
            details={"column": column, "min": min_val, "max": max_val, "total_checked": len(data)},
        )