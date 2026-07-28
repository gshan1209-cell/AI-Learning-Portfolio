#!/usr/bin/env python3
"""
CWA Open Data Scraper

Imported from gshan1209-cell/cwa_scraper as the migration reference
implementation for the AI Learning Portfolio monorepo.
"""

import argparse
import json
import os
import sys
from datetime import datetime

import requests
from dotenv import load_dotenv

load_dotenv()


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Download forecast dataset files from the Taiwan Central Weather Administration (CWA)."
    )
    parser.add_argument(
        "-k",
        "--api-key",
        type=str,
        default=os.getenv("CWA_API_KEY"),
        help="CWA API Authorization Code. Can also be set in .env as CWA_API_KEY.",
    )
    parser.add_argument(
        "-d",
        "--dataset",
        type=str,
        default="F-A0010-001",
        help="Dataset identifier (default: F-A0010-001).",
    )
    parser.add_argument(
        "-f",
        "--format",
        type=str,
        choices=["JSON", "XML"],
        default="JSON",
        help="Output data format (default: JSON).",
    )
    parser.add_argument(
        "-o",
        "--out-dir",
        type=str,
        default="downloads",
        help="Directory to save downloaded files (default: downloads).",
    )
    parser.add_argument(
        "--no-pretty",
        action="store_true",
        help="Disable JSON pretty printing.",
    )
    return parser.parse_args()


def preview_json_data(data):
    """Print a compact preview of common CWA forecast response shapes."""
    try:
        if "cwaopendata" in data:
            cwa = data["cwaopendata"]
            title = cwa.get("datasetName", "一週農業氣象預報")
            metadata = cwa.get("resources", {}).get("resource", {}).get("metadata", {})
            issue_time = metadata.get("temporal", {}).get("issueTime", "未知時間")
            print(f"\n[預覽] 資料集名稱: {title}")
            print(f"[預覽] 發布時間: {issue_time}")

            agr = (
                cwa.get("resources", {})
                .get("resource", {})
                .get("data", {})
                .get("agrWeatherForecasts", {})
            )
            profile = agr.get("weatherProfile", "")
            if profile:
                print(f"\n[預覽] 天氣概況:\n{profile}")

            locations = agr.get("weatherForecasts", {}).get("location", [])
            if locations:
                print("\n[預覽] 各地區預報 (前 3 天):")
                for loc in locations:
                    loc_name = loc.get("locationName", "未知區域")
                    print(f"  ● {loc_name}:")
                    wx_daily = loc.get("weatherElements", {}).get("Wx", {}).get("daily", [])
                    mint_daily = loc.get("weatherElements", {}).get("MinT", {}).get("daily", [])
                    maxt_daily = loc.get("weatherElements", {}).get("MaxT", {}).get("daily", [])
                    for index in range(min(3, len(wx_daily))):
                        date = wx_daily[index].get("dataDate", "")
                        weather = wx_daily[index].get("weather", "")
                        min_temp = mint_daily[index].get("temperature", "") if index < len(mint_daily) else ""
                        max_temp = maxt_daily[index].get("temperature", "") if index < len(maxt_daily) else ""
                        temp = f" ({min_temp}~{max_temp}°C)" if min_temp or max_temp else ""
                        print(f"    - {date}: {weather}{temp}")
            else:
                print("[預覽] 未找到區域預報資料。")
        elif "records" in data:
            records = data["records"]
            dataset_info = records.get("datasetInfo", {})
            title = dataset_info.get("datasetName", "一週農業氣象預報")
            update_time = dataset_info.get("updateDate", "Unknown")
            print(f"\n[Preview] Dataset: {title}")
            print(f"[Preview] Last Update: {update_time}")

            locations = records.get("location", []) or records.get("agriculturalInfo", {}).get("location", [])
            if locations:
                print(f"[Preview] Found forecasts for {len(locations)} locations/regions:")
                for loc in locations[:4]:
                    print(f"  - {loc.get('locationName', 'Unknown Location')}")
            else:
                print("[Preview] Retrieved JSON record keys:", list(records.keys()))
        else:
            print("[Preview] Retrieved JSON format differs from typical CWA API responses.")
    except Exception as error:
        print(f"[Preview Warning] Could not parse forecast preview: {error}")


def main():
    args = parse_arguments()
    api_key = args.api_key

    if not api_key:
        if sys.stdin.isatty():
            print("CWA API Authorization Code was not found in environment or arguments.")
            try:
                api_key = input("Please enter your CWA API Key: ").strip()
            except KeyboardInterrupt:
                print("\nOperation cancelled.")
                sys.exit(1)
        if not api_key:
            print("Error: CWA API key is required.", file=sys.stderr)
            sys.exit(1)

    fmt = args.format.upper()
    url = f"https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/{args.dataset}"
    params = {"Authorization": api_key, "format": fmt}

    print(f"Connecting to CWA Open Data Platform: {args.dataset} ({fmt})...")
    try:
        response = requests.get(url, params=params, timeout=30)
        if response.status_code == 401:
            print("Error 401: Unauthorized. Check the CWA API Key.", file=sys.stderr)
            sys.exit(1)
        if response.status_code == 404:
            print(f"Error 404: Dataset '{args.dataset}' not found.", file=sys.stderr)
            sys.exit(1)
        response.raise_for_status()
    except requests.exceptions.RequestException as error:
        print(f"HTTP request failed: {error}", file=sys.stderr)
        sys.exit(1)

    os.makedirs(args.out_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    extension = fmt.lower()
    filepath = os.path.join(args.out_dir, f"{args.dataset}_{timestamp}.{extension}")

    try:
        if fmt == "JSON":
            try:
                json_data = response.json()
                if isinstance(json_data, dict) and json_data.get("success") == "false":
                    print(f"API Error: {json_data.get('message', 'Unknown API error')}", file=sys.stderr)
                    sys.exit(1)
                with open(filepath, "w", encoding="utf-8") as output:
                    json.dump(json_data, output, ensure_ascii=False, indent=None if args.no_pretty else 2)
                preview_json_data(json_data)
            except json.JSONDecodeError:
                with open(filepath, "wb") as output:
                    output.write(response.content)
        else:
            with open(filepath, "wb") as output:
                output.write(response.content)
            if fmt == "XML":
                print(f"\n[Preview] XML snippet:\n{response.text[:400]}...")
    except IOError as error:
        print(f"Failed to write file: {error}", file=sys.stderr)
        sys.exit(1)

    print(f"Saved dataset file to: {os.path.abspath(filepath)}")
    print("Scraping process finished successfully!")


if __name__ == "__main__":
    main()
