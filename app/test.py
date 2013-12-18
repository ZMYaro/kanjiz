
import os

import jinja2
import webapp2

JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'],
	autoescape=True)

class KanjiTestPage(webapp2.RequestHandler):
	def get(self, stuff): # Ignore any stuff after the base URL
		template = JINJA_ENVIRONMENT.get_template('test.html')
		self.response.write(template.render({}))


app = webapp2.WSGIApplication([('/kanjitest(/.*)?', KanjiTestPage)], debug=True)

