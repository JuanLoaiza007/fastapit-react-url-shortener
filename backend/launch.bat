# Create and activate a virtual environment if not already created
python -m venv venv && .\venv\Scripts\Activate.ps1

# Install dependencies and run the server
pip install -r requirements.txt && uvicorn main:app --reload
