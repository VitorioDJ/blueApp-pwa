import sys
import os

# Add the app directory to the PYTHONPATH
sys.path.insert(0, '/var/www/python/blueApp-pwa')

# Add the modules directory to the PYTHONPATH
sys.path.insert(0, '/var/www/python/blueApp-pwa/modules')

# Set the path to the virtual environment's site-packages
site_packages = '/var/www/python/blueApp-pwa/env/lib/python3.12/site-packages'
if site_packages not in sys.path:
    sys.path.insert(0, site_packages)

# Set the environment variables for the virtual environment
os.environ['VIRTUAL_ENV'] = '/var/www/python/blueApp-pwa/env'
os.environ['PATH'] = '/var/www/python/blueApp-pwa/env/bin:' + os.environ['PATH']
os.environ['PYTHONHOME'] = '/var/www/python/blueApp-pwa/env'

# Import the Flask application
from blueApp import app as application  # Import the app object from blueApp.py
