
from django.conf.urls import url, include
from rest_framework import routers
from . import views

# for static files
from django.conf import settings
from django.conf.urls.static import static


router = routers.DefaultRouter()
router.register(r'questionnaireHEPY', views.QuestionnaireHEPY)
router.register(r'questionsHEPY', views.QuestionSetHEPY) # get every question from HEPY questionnaire
router.register(r'answersHEPY', views.AnswerSetForHEPY)
router.register(r'disablesHEPY', views.DisableForHEPY)
router.register(r'answerWeightsHEPY', views.AnswerWeightForHEPY)
router.register(r'sendAnswersHEPY', views.SendAnswersHEPY)

urlpatterns = [
    # API
    url(r'^$', views.AspoIndexRedirect.as_view(permanent=False), name='index'),
    # url(r'home', views.home, name='home'),
    # url(r'menu', views.menu, name='menu'),
    # url(r'footer', views.footer, name='footer'),

    # REST rotuer urls
    url(r'^rest/', include(router.urls)),

    # REST views
    url(r'^api', include('rest_framework.urls', namespace='rest_framework')),

    # View for static pages
    # url(r'.*', views.any, name='any'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
