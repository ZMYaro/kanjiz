import cgi

from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

class SopaRedirect(webapp.RequestHandler):
	def get(self, page):
		self.redirect('http://50.57.164.155/')

site = webapp.WSGIApplication(
                              [('/(.*)', SopaRedirect)],
                              debug=True)

def main():
	run_wsgi_app(site)

if __name__ == '__main__':
	main()
