import os

from google.appengine.api import users

import jinja2
import webapp2


JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates/')),
	extensions=['jinja2.ext.autoescape'],
	autoescape=True)

class MainPage(webapp2.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/html;charset=utf-8'
		self.response.headers['X-UA-Compatible'] = 'chrome=1'
		
		user = users.get_current_user()
		if(user):
			templateVars = {'userEmail':user.email(), 'logoutURL':users.create_logout_url('/')}
		else:
			templateVars = {'loginURL':users.create_login_url(self.request.uri)}
		
		template = JINJA_ENVIRONMENT.get_template('index.html')
		self.response.write(template.render(templateVars))

class LoginPage(webapp2.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/html;charset=utf-8'
		self.response.headers['X-UA-Compatible'] = 'chrome=1'
		
		template = JINJA_ENVIRONMENT.get_template('login.html')
		if self.request.get('app'):
			templateVars = {'loginURL':users.create_login_url('/' + self.request.get('app'))}
		else:
			templateVars = {'loginURL':users.create_login_url('/')}
		self.response.write(template.render(templateVars))

class ForbiddenPage(webapp2.RequestHandler):
	def get(self):
		templateVars = {}
		if self.request.get('app'):
			templateVars = {'app':self.request.get('app')}
		template = JINJA_ENVIRONMENT.get_template('403.html')
		self.response.write(template.render(templateVars))
		self.response.set_status(403);

class NotFoundPage(webapp2.RequestHandler):
	def get(self, page):
		template = JINJA_ENVIRONMENT.get_template('404.html')
		self.response.write(template.render({}))
		self.response.set_status(404);

app = webapp2.WSGIApplication([
	('/', MainPage),
	('/index\.html', MainPage),
	('/login', LoginPage),
	('/forbidden', ForbiddenPage),
	('/(.*)', NotFoundPage)
], debug=True)