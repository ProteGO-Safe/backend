import os


STAGE = os.environ["STAGE"]
if STAGE == "DEVELOPMENT":
    BASE_URL = "https://europe-west3-protego-dev.cloudfunctions.net/"
elif STAGE == "PRODUCTION":
    BASE_URL = "https://europe-west3-protego-stag.cloudfunctions.net/"

else:
    raise Exception("Set STAGE= DEVELOPMENT or PRODUCTION")
