import os
import time
import requests


class APIConfig:
    """
    Configuration settings for the external urlscan.io API service.

    Attributes:
        URLSCAN_API (str): The endpoint for submitting scans.
        RESULT_API (str): The endpoint for retrieving scan results.
        API_KEY (str): The API key for authenticating with urlscan.io.
    """
    URLSCAN_API = "https://urlscan.io/api/v1/scan/"
    RESULT_API = "https://urlscan.io/api/v1/result/"
    API_KEY = os.environ.get("URLSCAN_API_KEY", "")  # Set your API key in env


class UrlScanApiService:
    """
    Service class for interacting with the urlscan.io API.
    """

    @staticmethod
    def submit_scan(url):
        """
        Submits a URL to urlscan.io for scanning.

        Args:
            url (str): The URL to scan.

        Returns:
            dict: The JSON response from urlscan.io containing scan details.

        Raises:
            requests.HTTPError: If the API request fails.
        """
        headers = {
            "Content-Type": "application/json",
            "API-Key": APIConfig.API_KEY,
        }
        payload = {"url": url, "public": "on"}
        response = requests.post(
            APIConfig.URLSCAN_API,
            json=payload,
            headers=headers,
            timeout=15,
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def get_scan_result(uuid, max_wait=10):
        """
        Polls urlscan.io for the scan result by UUID.

        Args:
            uuid (str): The UUID of the scan to retrieve.
            max_wait (int): Maximum number of seconds to wait for the result.

        Returns:
            dict or None: The JSON result if available within max_wait,
            else None.
        """
        headers = {"API-Key": APIConfig.API_KEY}
        result_url = f"{APIConfig.RESULT_API}{uuid}/"
        for _ in range(max_wait):
            resp = requests.get(result_url, headers=headers, timeout=10)
            if resp.status_code == 200:
                return resp.json()
            time.sleep(1)
        return None
