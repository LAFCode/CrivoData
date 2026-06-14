"""Tests for the validation engine and built-in rules."""

import pandas as pd
import pytest

from app.core.validation.engine import ValidationEngine, BaseValidator, ValidationResult
from app.core.validation.rules.column_check import (
    ColumnExistsValidator,
    DataTypeValidator,
    RangeValidator,
)


class TestColumnExistsValidator:
    def setup_method(self):
        self.validator = ColumnExistsValidator()
        self.df = pd.DataFrame({"col_a": [1, 2], "col_b": [3, 4]})

    def test_all_columns_exist(self):
        result = self.validator.validate(
            self.df, {"columns": ["col_a", "col_b"], "rule_id": 1, "rule_name": "check_ab"}
        )
        assert result.status == "pass"

    def test_missing_columns(self):
        result = self.validator.validate(
            self.df, {"columns": ["col_a", "col_c"], "rule_id": 2}
        )
        assert result.status == "fail"
        assert "col_c" in result.details["missing_columns"]


class TestDataTypeValidator:
    def setup_method(self):
        self.validator = DataTypeValidator()
        self.df = pd.DataFrame({"ints": [1, 2], "floats": [1.1, 2.2], "strings": ["a", "b"]})

    def test_correct_types(self):
        result = self.validator.validate(
            self.df, {"type_map": {"ints": "int", "floats": "float", "strings": "string"}}
        )
        assert result.status == "pass"

    def test_type_mismatch(self):
        result = self.validator.validate(
            self.df, {"type_map": {"ints": "string"}}
        )
        assert result.status == "fail"


class TestRangeValidator:
    def setup_method(self):
        self.validator = RangeValidator()
        self.df = pd.DataFrame({"value": [1, 5, 10, 15, 20]})

    def test_all_in_range(self):
        result = self.validator.validate(
            self.df, {"column": "value", "min": 0, "max": 25}
        )
        assert result.status == "pass"

    def test_out_of_range(self):
        result = self.validator.validate(
            self.df, {"column": "value", "min": 6, "max": 10}
        )
        assert result.status == "fail"
        assert result.details["total_violations"] == 4  # 1, 5, 15, 20 are outside


class TestValidationEngine:
    def setup_method(self):
        self.engine = ValidationEngine()
        self.engine.register_validator("column_exists", ColumnExistsValidator())
        self.engine.register_validator("range", RangeValidator())

    def test_run_rules_sync_passes(self):
        df = pd.DataFrame({"col_a": [1, 2], "col_b": [3, 4]})
        rules = [
            {"rule_type": "column_exists", "config": {"columns": ["col_a", "col_b"]}, "id": 1, "name": "exists"},
            {"rule_type": "range", "config": {"column": "col_a", "min": 0, "max": 10}, "id": 2, "name": "range"},
        ]
        results = self.engine.run_rules_sync(df, rules)
        assert all(r.status == "pass" for r in results)
        assert len(results) == 2

    def test_run_rules_sync_unknown_validator(self):
        df = pd.DataFrame({"a": [1]})
        rules = [{"rule_type": "unknown_type", "config": {}, "id": 1, "name": "unknown"}]
        results = self.engine.run_rules_sync(df, rules)
        assert len(results) == 1
        assert results[0].status == "error"