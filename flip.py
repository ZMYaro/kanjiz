#!/usr/bin/python
# -*- coding: utf-8 -*-

import cgi
import os
import urllib

from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

defaults = {
	'data':'{\"front\":\"english\", \"back\":\"kana\"}',
	#'backData':'kana',
	#'list':'[{\"english\":\"Welcome\", \"kana\":\"' + unicode('よこそう', 'utf-8') + '\", \"kanji\":\"' + unicode('よこそう', 'utf-8') + '\"}, {\"english\":\"To KanjiFlip_Z.\", \"kana\":\"KanjiFlip_Z.' + unicode('へ', 'utf-8') + '\", \"kanji\":\"KanjiFlip_Z.' + unicode('へ', 'utf-8') + '\"}]',
	'list':u'[{\"english\":\"Welcome\", \"kana\":\"よこそう\", \"kanji\":\"よこそう\"}, {\"english\":\"To KanjiFlip_Z.\", \"kana\":\"KanjiFlip_Z.へ\", \"kanji\":\"KanjiFlip_Z.へ\"}]',
	'cloudSave':'true'
}

testers = ['zmyaro@gmail.com','mangosteve@wow.com']

class FlipSettings(db.Model):
	user = db.UserProperty()
	data = db.StringProperty()
	list = db.TextProperty()
	cloudSave = db.StringProperty()

class FlipPage(webapp.RequestHandler):
	global testers
	
	def get(self):
		user = users.get_current_user()
		if user:
			if user.email() in testers:
				self.response.headers['Content-Type'] = 'text/html;charset=utf-8'
				self.response.headers['X-UA-Compatible'] = 'chrome=1'
		
				path = os.path.join(os.path.dirname(__file__), 'flip.html')
				self.response.out.write(template.render(path, {}))
			else:
				self.redirect('/forbidden?app=kanjiflip')
		else:
			self.redirect('/login?app=kanjiflip')

class SettingGetter(webapp.RequestHandler):
	def get(self, setting):
		global defaults
		
		self.response.headers['Access-Control-Allow-Origin'] = 'chrome-extension://cgdlfanepopcimpmhahpkklmheclflbe'
		
		user = users.get_current_user()
		if user:
			settings = FlipSettings.gql('WHERE user = :1', user).get()
			if not settings: 
				settings = FlipSettings()
				settings.user = user
				for default in defaults:
					setattr(settings, default, defaults[default]);
				settings.put()
			self.response.out.write(getattr(settings, setting, defaults[setting]))
				
		else:
			self.error(401) # ??
		
class SettingSetter(webapp.RequestHandler):
	def get(self, setting, value):
		user = users.get_current_user()
		if user and setting != 'user':
			settings = FlipSettings.gql('WHERE user = :1', user).get()
			if not settings: 
				settings = FlipSettings()
				settings.user = user
				for default in defaults:
					setattr(settings, default, defaults[default]);
				settings.put()
			setattr(settings, setting, unicode(urllib.unquote(value), 'utf-8'))
			settings.put()
		else:
			self.error(401) # ??

site = webapp.WSGIApplication(
                              [('/kanjiflip/settings/get/(.*)', SettingGetter),
                               ('/kanjiflip/settings/set/(.*?)/(.*)', SettingSetter),
                               ('/kanjiflip/?', FlipPage)],
                              debug=True)

def main():
	run_wsgi_app(site)

if __name__ == '__main__':
	main()
