import json
import urllib

import oauth2 # https://github.com/simplegeo/python-oauth2

# Fake OpenID for dev server.
DEFAULT_USER_ID = 'https://www.google.com/accounts/o8/id?id=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

CONFIG = {
	'oauth_consumer_key': 'anonymous',
	'oauth_consumer_secret': 'anonymous',
	'license_server': 'https://www.googleapis.com',
	'license_path': '%(server)s/chromewebstore/v1/licenses/%(appid)s/%(userid)s',
	'oauth_token': 'INSERT OAUTH TOKEN HERE',
	'oauth_token_secret': 'INSERT OAUTH TOKEN SECRET HERE',
	'app_id': 'INSERT APPLICATION ID HERE'
}

def checkUserAuth(user):
	user_id = user.federated_identity()
	# If there is no OpenID, use the default.
	if not user_id:
		user_id = DEFAULT_USER_ID
	
	url = CONFIG['license_path'] % {
		'server': CONFIG['license_server'],
		'appid': CONFIG['app_id'],
		'userid': urllib.quote_plus(user_id)
	}
	
	token = oauth2.Token(**{
		'key': CONFIG['oauth_token'],
		'secret': CONFIG['oauth_token_secret']
	})
	consumer = oauth2.Consumer(**{
		'key': CONFIG['oauth_consumer_key'],
		'secret': CONFIG['oauth_consumer_secret']
	})
	client = oauth2.Client(**{
		'consumer': consumer,
		'token': token
	})
	response, content = client.request(url, 'GET')
	
	return parseAccess(content)

def parseAccess(respText):
	respJSON = json.loads(respText)
	if 'result' in respJSON:
		return respJSON['result'] != 'NO'
	# If there was an error, assume the user has permission instead of
	# potentially blocking a valid user.
	return True