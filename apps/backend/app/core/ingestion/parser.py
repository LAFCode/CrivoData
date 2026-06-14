"""File parser for supported formats (XLSX, CSV, PDF)."""

import io
import pandas as pd
from typing import Any
from abc import ABC, abstractmethod


class BaseParser(ABC):
    """Abstract base class for file parsers."""

    def parse(self, file_path: str) -> pd.DataFrame:
        """Parse a file and return a DataFrame (sync)."""
        ...

    def parse_bytes(self, content: bytes, filename: str) -> pd.DataFrame:
        """Parse raw bytes and return a DataFrame (sync)."""
        ...


class XLSXParser(BaseParser):
    """Parser for .xlsx files."""

    def parse(self, file_path: str) -> pd.DataFrame:
        return pd.read_excel(file_path, engine="openpyxl")

    def parse_bytes(self, content: bytes, filename: str) -> pd.DataFrame:
        return pd.read_excel(io.BytesIO(content), engine="openpyxl")


class CSVParser(BaseParser):
    """Parser for .csv files."""

    def parse(self, file_path: str) -> pd.DataFrame:
        return pd.read_csv(file_path)

    def parse_bytes(self, content: bytes, filename: str) -> pd.DataFrame:
        return pd.read_csv(io.BytesIO(content))


class PDFParser(BaseParser):
    """Parser for .pdf files — extracts text content as a single-row DataFrame."""

    def parse(self, file_path: str) -> pd.DataFrame:
        from PyPDF2 import PdfReader
        reader = PdfReader(file_path)
        text = "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
        return pd.DataFrame({"content": [text]})

    def parse_bytes(self, content: bytes, filename: str) -> pd.DataFrame:
        from PyPDF2 import PdfReader
        reader = PdfReader(io.BytesIO(content))
        text = "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
        return pd.DataFrame({"content": [text]})


def get_parser(file_type: str) -> BaseParser:
    """Factory function to get the appropriate parser for a file type."""
    parsers = {
        "xlsx": XLSXParser(),
        "csv": CSVParser(),
        "pdf": PDFParser(),
    }
    parser = parsers.get(file_type.lower())
    if parser is None:
        raise ValueError(f"Unsupported file type: {file_type}. Supported: {list(parsers.keys())}")
    return parser