
import cgi
import os
import urllib

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

class KanjiTestPage(webapp.RequestHandler):
	def get(self, stuff): # Ignore any stuff after the base URL
		path = os.path.join(os.path.dirname(__file__), 'test.html')
		self.response.out.write(template.render(path, {}))


site = webapp.WSGIApplication([('/kanjitest(/.*)?', KanjiTestPage)], debug=True)

def main():
	run_wsgi_app(site)

if __name__ == '__main__':
	main()