"""Celery tasks for async validation processing."""

from datetime import datetime, timezone
from typing import Any

from app.core.config import settings
from app.core.ingestion.parser import get_parser
from app.core.validation.engine import engine as validation_engine
from app.workers.celery_app import celery_app


@celery_app.task(bind=True, name="process_submission")
def process_submission(
    self,
    submission_id: int,
    file_path: str,
    file_type: str,
    rules: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Process a submission: parse the file and run validation rules.
    This is a Celery task — all DB updates happen via the API calling this task.
    """
    try:
        # 1. Parse the file
        parser = get_parser(file_type)
        data = parser.parse(file_path)

        # 2. Run validation rules
        results = validation_engine.run_rules_sync(data, rules)

        # 3. Build result summary
        result_list = []
        for r in results:
            result_list.append({
                "rule_id": r.rule_id,
                "rule_name": r.rule_name,
                "status": r.status,
                "details": r.details,
            })

        total_rules = len(results)
        passed = sum(1 for r in results if r.status == "pass")
        failed = sum(1 for r in results if r.status in ("fail", "error"))

        return {
            "submission_id": submission_id,
            "status": "completed",
            "total_rules": total_rules,
            "passed": passed,
            "failed": failed,
            "results": result_list,
        }

    except Exception as exc:
        return {
            "submission_id": submission_id,
            "status": "failed",
            "error": str(exc),
            "results": [],
        }