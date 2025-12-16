#!/bin/bash
export PYTHONPATH=..
uv run uvicorn backend.main:app --reload
