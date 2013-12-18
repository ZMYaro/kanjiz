import cgi
import os

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

class MainPage(webapp.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/html;charset=utf-8'
		self.response.headers['X-UA-Compatible'] = 'chrome=1'
		
		user = users.get_current_user()
		if(user):
			templateVars = {'userEmail':user.email(), 'logoutURL':users.create_logout_url('/')}
		else:
			templateVars = {'loginURL':users.create_login_url(self.request.uri)}
		
		path = os.path.join(os.path.dirname(__file__), 'index.html')
		self.response.out.write(template.render(path, templateVars))

class LoginPage(webapp.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/html;charset=utf-8'
		self.response.headers['X-UA-Compatible'] = 'chrome=1'
		
		path = os.path.join(os.path.dirname(__file__), 'login.html')
		if self.request.get('app'):
			templateVars = {'loginURL':users.create_login_url('/' + self.request.get('app'))}
		else:
			templateVars = {'loginURL':users.create_login_url('/')}
		self.response.out.write(template.render(path, templateVars))

class ForbiddenPage(webapp.RequestHandler):
	def get(self):
		templateVars = {}
		if self.request.get('app'):
			templateVars = {'app':self.request.get('app')}
		path = os.path.join(os.path.dirname(__file__), '403.html')
		self.response.out.write(template.render(path, templateVars))
		self.response.set_status(403);

class NotFoundPage(webapp.RequestHandler):
	def get(self, page):
		path = os.path.join(os.path.dirname(__file__), '404.html')
		self.response.out.write(template.render(path, {}))
		self.response.set_status(404);

site = webapp.WSGIApplication([('/', MainPage),
                               ('/index\.html', MainPage),
                               ('/login', LoginPage),
                               ('/forbidden', ForbiddenPage),
                               ('/(.*)', NotFoundPage)],
                              debug=True)

def main():
	run_wsgi_app(site)

if __name__ == '__main__':
	main()
