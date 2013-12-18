# coding=utf-8

import os
import urllib

import jinja2
import webapp2

from google.appengine.api import users
from google.appengine.ext import db

JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates/')),
	extensions=['jinja2.ext.autoescape'],
	autoescape=True)

defaults = {
	'data':'{\"front\":\"english\", \"back\":\"kana\"}',
	#'backData':'kana',
	'list':u'[{\"english\":\"Welcome\", \"kana\":\"よこそう\", \"kanji\":\"よこそう\"}, {\"english\":\"To KanjiFlip_Z.\", \"kana\":\"KanjiFlip_Z.へ\", \"kanji\":\"KanjiFlip_Z.へ\"}]',
	'cloudSave':'true'
}

testers = ['zmyaro@gmail.com','mangosteve@wow.com']

class FlipSettings(db.Model):
	user = db.UserProperty()
	data = db.StringProperty()
	list = db.TextProperty()
	cloudSave = db.StringProperty()

class FlipPage(webapp2.RequestHandler):
	def get(self):
		user = users.get_current_user()
		if user:
			self.response.headers['Content-Type'] = 'text/html;charset=utf-8'
			self.response.headers['X-UA-Compatible'] = 'chrome=1'
	
			template = JINJA_ENVIRONMENT.get_template('flip.html')
			self.response.write(template.render({}))
		else:
			self.redirect('/login?app=kanjiflip')

class SettingGetter(webapp2.RequestHandler):
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
			self.response.write(getattr(settings, setting, defaults[setting]))
				
		else:
			self.error(401) # ??
		
class SettingSetter(webapp2.RequestHandler):
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

app = webapp2.WSGIApplication([
	('/kanjiflip/settings/get/(.*)', SettingGetter),
	('/kanjiflip/settings/set/(.*?)/(.*)', SettingSetter),
	('/kanjiflip/?', FlipPage)
], debug=True)