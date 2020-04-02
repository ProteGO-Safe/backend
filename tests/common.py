import os


STAGE = os.environ['STAGE']
if STAGE == 'DEVELOPMENT':
    BASE_URL = 'https://europe-west3-anna-dev-272212.cloudfunctions.net/'
elif STAGE == 'PRODUCTION':
    # todo: add staging address
    BASE_URL = 'https://europe-west3-anna-dev-272212.cloudfunctions.net/'

else:
    raise Exception('Set STAGE= DEVELOPMENT or PRODUCTION')
