"""Validation engine - core logic for running validation rules against data."""

from abc import ABC, abstractmethod
from typing import Any


class ValidationResult:
    """Result of a single validation rule execution."""

    def __init__(
        self,
        rule_id: int | None,
        rule_name: str,
        status: str,  # "pass", "fail", "error"
        details: dict | None = None,
    ):
        self.rule_id = rule_id
        self.rule_name = rule_name
        self.status = status
        self.details = details or {}


class BaseValidator(ABC):
    """Abstract base class for all validation rules."""

    async def validate_async(self, data: Any, config: dict) -> ValidationResult:
        """Async validation (defaults to calling sync validate)."""
        return self.validate(data, config)

    @abstractmethod
    def validate(self, data: Any, config: dict) -> ValidationResult:
        """Execute validation logic synchronously. Must be implemented by subclasses."""
        ...


class ValidationEngine:
    """Orchestrates validation of data against a sequence of rules."""

    def __init__(self):
        self._validators: dict[str, BaseValidator] = {}

    def register_validator(self, rule_type: str, validator: BaseValidator) -> None:
        """Register a validator for a specific rule type."""
        self._validators[rule_type] = validator

    def get_validator(self, rule_type: str) -> BaseValidator | None:
        """Get a registered validator by rule type."""
        return self._validators.get(rule_type)

    async def run_rules(
        self,
        data: Any,
        rules: list[dict],
    ) -> list[ValidationResult]:
        """Run a list of rules against data and return results (async)."""
        results: list[ValidationResult] = []

        for rule in rules:
            rule_type = rule.get("rule_type", "")
            rule_config = rule.get("config", {})
            rule_id = rule.get("id")
            rule_name = rule.get("name", rule_type)

            validator = self.get_validator(rule_type)
            if validator is None:
                results.append(
                    ValidationResult(
                        rule_id=rule_id,
                        rule_name=rule_name,
                        status="error",
                        details={"error": f"No validator registered for rule type: {rule_type}"},
                    )
                )
                continue

            try:
                result = await validator.validate_async(data, rule_config)
                results.append(result)
            except Exception as exc:
                results.append(
                    ValidationResult(
                        rule_id=rule_id,
                        rule_name=rule_name,
                        status="error",
                        details={"error": str(exc)},
                    )
                )

        return results

    def run_rules_sync(
        self,
        data: Any,
        rules: list[dict],
    ) -> list[ValidationResult]:
        """Run a list of rules against data and return results (sync)."""
        results: list[ValidationResult] = []

        for rule in rules:
            rule_type = rule.get("rule_type", "")
            rule_config = rule.get("config", {})
            rule_id = rule.get("id")
            rule_name = rule.get("name", rule_type)

            validator = self.get_validator(rule_type)
            if validator is None:
                results.append(
                    ValidationResult(
                        rule_id=rule_id,
                        rule_name=rule_name,
                        status="error",
                        details={"error": f"No validator registered for rule type: {rule_type}"},
                    )
                )
                continue

            try:
                result = validator.validate(data, rule_config)
                results.append(result)
            except Exception as exc:
                results.append(
                    ValidationResult(
                        rule_id=rule_id,
                        rule_name=rule_name,
                        status="error",
                        details={"error": str(exc)},
                    )
                )

        return results


# Global validation engine instance
engine = ValidationEngine()