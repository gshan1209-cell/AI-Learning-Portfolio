from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler

from _ensemble_runtime import ValidationError, predict, runtime_status

MAX_BODY_BYTES = 64 * 1024


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        self._send_json(200, runtime_status())

    def do_POST(self) -> None:
        try:
            raw_length = self.headers.get("Content-Length", "0")
            length = int(raw_length)
            if length <= 0:
                self._send_json(400, {"ok": False, "error": "empty_body", "message": "請提供 JSON Request Body。"})
                return
            if length > MAX_BODY_BYTES:
                self._send_json(413, {"ok": False, "error": "payload_too_large", "message": "Request Body 超過 64KB。"})
                return

            raw = self.rfile.read(length)
            try:
                payload = json.loads(raw.decode("utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                self._send_json(400, {"ok": False, "error": "invalid_json", "message": "請提供有效 JSON。"})
                return

            result = predict(payload)
            self._send_json(200, {"ok": True, **result})
        except ValidationError as error:
            self._send_json(422, {"ok": False, "error": "invalid_input", "message": str(error)})
        except Exception:
            self._send_json(
                503,
                {
                    "ok": False,
                    "error": "model_runtime_unavailable",
                    "message": "模型目前無法載入或推論；請稍後再試。",
                },
            )

    def log_message(self, format: str, *args) -> None:
        # Do not log request bodies or demographic values.
        return
