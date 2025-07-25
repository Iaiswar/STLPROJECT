from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .views import (
    ARVRTrainingContentViewSet, AllEmployeesWithActiveSkillsView, AllPassedUsersView, CTQDefectsAllPlantsView, CompanyLogoViewSet, CurrentMonthDefectsDataView, CurrentMonthTrainingDataView, DaysViewSet, DefectsChartView, DepartmentByFactoryView, DepartmentHierarchyView, EmployeeByCodeView, EmployeeCardDetailsView, EmployeeMasterViewSet, EmployeeReportPDFView, EmployeeViewSet, EvaluationViewSet, FileDownloadView, HQViewSet, FactoryViewSet, DepartmentViewSet, HanContentViewSet, HanTrainingContentByContentID, HanTrainingContentCreateView, HanTrainingContentViewSet, HumanBodyCheckListCreateView, InternalRejectionView, Level2TrainingContentListCreateView, Level2TrainingContentRetrieveUpdateDestroyView, Level3TrainingContentListCreateView, Level3TrainingContentRetrieveUpdateDestroyView, LevelTwoSectionViewSet, LevelTwoSkillTrainingViewSet, LevelTwoSubTopicViewSet, LevelTwoSubUnitViewSet, LevelTwoTopicViewSet, LevelTwoTrainingContentViewSet, LevelTwoTrainingSubunitWiseContentViewSet, LevelTwoUnitViewSet, LineViewSet,
    LevelViewSet, LogoView, MSILDefectsView, MonthlySkillViewSet, MultiSkillingViewSet, NotificationViewSet, ObservationFailurePointViewSet, ObservationItemViewSet, ObservationResultViewSet, ObservationViewSet, OperationListViewSet, OperationViewSet, OperatorExcelUploadAPIView, OperatorExcelViewSet, OperatorLevelViewSet, OperatorMasterViewSet, OperatorPerformanceEvaluationViewSet, OperatorRemoteAssignmentViewSet, OperatorSkillLevelViewSet, OperatorTestAssignmentViewSet, OperatorsChartView,
    OperatorsJoinedVsTrainedView, PassedUsersWithDetailsView, PersonnelObservanceSheetViewSet, ProcessViewSet, QuestionViewSet, ReTrainingConfirmationViewSet, RemainingDepartmentsView, SendMailView, ShoContentViewSet, ShoTrainingContentByContentID, ShoTrainingContentCreateView, ShoTrainingContentViewSet, SkillEntryViewSet, SkillMatrixMetadataViewSet, SkillMatrixViewSet, SkillTrainingViewSet, SkillsListView, SubTopicContentViewSet, SubTopicDayViewSet, SubTopicViewSet, SubtopicWiseTrainingContentViewSet,
    TestViewSet, TrainerViewSet, TrainingActivityViewSet, TrainingContentCreateView, TrainingContentViewSet, TrainingPlansChartView, TrainingReportViewSet, TrainingSummaryView, UnifiedDefectReportViewSet, UploadedFileListView, UserInfoBodyCheckListView, UserInfoListCreateView, create_system_notification, create_test_notification, delete_all_notifications, get_operator_levels_by_department, get_today_milestones, notification_count, test_notifications, trigger_all_notification_types, trigger_employee_notification,update_skillmatrix_by_id,get_unique_departments,get_today_email_milestones,L2FileUploadViewSet, UnifiedDefectReportViewSet,get_today_milestones, NewAdvancedManpowerCTQViewSet,UploadAdvancedManpowerCTQView, ManpowerCTQTrendsView,ManagementReviewViewSet,ManagementReviewUploadView,OperatorRequirementViewSet, LevelsListView,ScheduledEmployeesSkillsView,
)
from django.conf.urls.static import static
from .views import SDCOrientationFeedbackViewSet
# from .views import JudgementCriteriaViewSet, TrainingCycleViewSet
from .views import SectionViewSet
# from .views import OperatorSkillMatrixViewSet

from .views import (
    OperatorPerformanceEvaluationViewSet,
    TencycletopicsViewSet,
    OperatorEvaluationViewSet,
    EvaluationTopicMarksViewSet
)
from .views import get_unique_departments

from .views import (
    OperatorPerformanceEvaluationLevelViewSet,
    TencycletopicsLevelViewSet,
    OperatorEvaluationLevelViewSet,
    EvaluationTopicMarksLevelViewSet
)

from .views import MachineAllocationViewSet,EmployeeMachineAllocationViewSet


from .views import Training_categoryViewSet, CurriculumViewSet, CurriculumContentViewSet, Trainer_nameViewSet, VenueViewSet, ScheduleViewSet, EmployeeAttendanceViewSet, RescheduleLogViewSet

# STL code start     NEW 

from .views import (
    STLDepartmentViewSet,
    IntakeSheetViewSet, IntakeEntryListView
)

app_name = 'app1'


# Setup router
router = DefaultRouter()

# STL code start


# Master Data
router.register(r'stl-departments', STLDepartmentViewSet, basename='stl-department')


# Intake Process
router.register(r'intake-sheets', IntakeSheetViewSet, basename='intake-sheet')




#AR-VR IJL

router.register(r'arvr-content', ARVRTrainingContentViewSet, basename='arvr-content')

#l2fileuploading

router.register(r'L2fileupload', L2FileUploadViewSet, basename='L2fileupload-')

# skill martix  IJL

# router.register(r'skill-matrix', SkillMatrixViewSet)
# router.register(r'sections', SectionViewSet, basename='sections')
# router.register(r'operations', OperationListViewSet)
# router.register(r'operator-levels', OperatorLevelViewSet)

router.register(r'skill-matrix', SkillMatrixViewSet)
router.register(r'sections', SectionViewSet, basename='sections')
# router.register(r'operations', OperationListViewSet)
router.register(r'operators', OperatorMasterViewSet)
router.register(r'operator-levels', OperatorLevelViewSet)
router.register(r'operationlist', OperationListViewSet)


router.register(r'multiskilling', MultiSkillingViewSet)
router.register(r'monthly-skills', MonthlySkillViewSet)



#SDC Orientation Feedback url  IJL

# router.register(r'sdc-feedback', SDCOrientationFeedbackViewSet, basename='sdc-feedback')




router.register(r'hq', HQViewSet)
router.register(r'factories', FactoryViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'lines', LineViewSet)
router.register(r'levels', LevelViewSet)


router.register(r'skill-trainings', SkillTrainingViewSet)
router.register(r'subtopics', SubTopicViewSet)
router.register(r'subtopics-day', SubTopicDayViewSet, basename='subtopics-day')
router.register(r'subtopic-contents', SubTopicContentViewSet)
router.register(r'days', DaysViewSet)
router.register(r'training-contents', TrainingContentViewSet)


router.register(r'tests', TestViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'operator-test-assignments', OperatorTestAssignmentViewSet)
router.register(r'operator-remote-assignments', OperatorRemoteAssignmentViewSet)

# Machine allocation IJL

router.register(r'machines', views.MachineViewSet, basename='machines') 
router.register(r'machine-allocations', MachineAllocationViewSet, basename='machineallocation')
router.register(r'employee-machine-allocations', EmployeeMachineAllocationViewSet, basename='employeemachineallocation')


router.register(r'skill-levels', OperatorSkillLevelViewSet, basename='operator-skill-level')



router.register(r'training-reports', TrainingReportViewSet)
router.register(r'unified-defect-reports', UnifiedDefectReportViewSet)




router.register(r'employees-master', EmployeeMasterViewSet)
router.register(r'training-activities', TrainingActivityViewSet)


router.register(r'level2-skill-trainings', LevelTwoSkillTrainingViewSet)
router.register(r'level2-sections', LevelTwoSectionViewSet)
router.register(r'level2-topics', LevelTwoTopicViewSet)
router.register(r'level2-subtopics', LevelTwoSubTopicViewSet)
router.register(r'level2-units', LevelTwoUnitViewSet)
router.register(r'level2-subunits', LevelTwoSubUnitViewSet)
router.register(r'level2-contents', LevelTwoTrainingContentViewSet)




router.register(r'subunitwise-training-content', LevelTwoTrainingSubunitWiseContentViewSet,basename='subunitwisetrainingcontent')
router.register(r'subtopicwisetrainingcontent', SubtopicWiseTrainingContentViewSet, basename='subtopicwisetrainingcontent')








# router.register(r'operator-evaluations', OperatorPerformanceEvaluationViewSet) # 📊 Operator performance evaluations
router.register(r'general-evaluations', EvaluationViewSet) # 📝 General evaluations
# router.register(r'training-cycles', TrainingCycleViewSet)   # 🔄 Training cycles
# router.register(r'judgement-criteria', JudgementCriteriaViewSet) # ⚖️ Evaluation criteria




router.register(r'processes', ProcessViewSet)              # ⚙️ Process management
router.register(r'observation-items', ObservationItemViewSet) # 🔍 Observation items
router.register(r'observance-sheets', PersonnelObservanceSheetViewSet)  # 📋 **MAIN NESTED ACCESS** - Observation sheets
router.register(r'observation-results', ObservationResultViewSet) # 📈 Observation results
router.register(r'observation-failures', ObservationFailurePointViewSet) # ❌ Failure points
router.register(r'observations', ObservationViewSet)       # 👁️ Individual observations





router.register(r'trainers', TrainerViewSet)               # 👨‍🏫 Trainer management
router.register(r'retraining-confirmations', ReTrainingConfirmationViewSet)  # 🔄 **MAIN NESTED ACCESS** - Retraining confirmations

# ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# 🛠️ SKILL MATRIX & OPERATIONS ENDPOINTS
# ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
router.register(r'operations', OperationViewSet)           # 🔧 Operation management
router.register(r'employees', EmployeeViewSet)             # 👥 Employee management
router.register(r'skills', SkillEntryViewSet)              # 🎯 Individual skill entries
router.register(r'metadata', SkillMatrixMetadataViewSet)   # 📊 Skill matrix metadata

# ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# 🏭 MACHINE MANAGEMENT ENDPOINTS (INTEGRATED)
# ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# router.register(r'machine-operators', views.EmployeeViewSet, basename='machine-operators')    # 👤 Machine operators
# router.register(r'machines', views.MachineViewSet, basename='machines')                              # 🏭 Machine management
# router.register(r'machine-allocations', views.MachineAllocationViewSet, basename='machine-allocations') # 🔗 Machine allocations
# router.register(r'bulk-operations', views.MachineAllocationBulkViewSet, basename='bulk-operations')  # 📦 Bulk operations

#10 cycle  IJL

router.register(r'operator-performance', OperatorPerformanceEvaluationViewSet)
router.register(r'topics', TencycletopicsViewSet)
router.register(r'operator-evaluation', OperatorEvaluationViewSet)
router.register(r'evaluation-topic-marks', EvaluationTopicMarksViewSet)

router.register(r'operators-master', OperatorMasterViewSet, basename='operator-master')
router.register(r'logos', CompanyLogoViewSet)

#10 cycle for level (new) 

router.register(r'operator-performance-level', OperatorPerformanceEvaluationLevelViewSet)
router.register(r'topics-level', TencycletopicsLevelViewSet)
router.register(r'operator-evaluation-level', OperatorEvaluationLevelViewSet)
router.register(r'evaluation-topic-marks-level', EvaluationTopicMarksLevelViewSet)


# Refreshment Training
router.register(r'training-categories', Training_categoryViewSet)
router.register(r'curriculums', CurriculumViewSet, basename='curriculum')
router.register(r'curriculum-contents', CurriculumContentViewSet, basename='curriculumcontent')
router.register(r'trainer_name', Trainer_nameViewSet)
router.register(r'venues', VenueViewSet)
router.register(r'schedules', ScheduleViewSet)
router.register(r'attendances', EmployeeAttendanceViewSet, basename='attendance')
router.register(r'reschedule-logs', RescheduleLogViewSet, basename='reschedulelog')


router.register(r'operators-excel', OperatorExcelViewSet, basename='operator-excel')
router.register(r'management-review', ManagementReviewViewSet, basename='management-review')
router.register(r'advanced-ctq', NewAdvancedManpowerCTQViewSet, basename='advanced-ctq')
router.register(r'operator-requirements', OperatorRequirementViewSet)
  
#SDC Orientation Feedback url  IJL

router.register(r'sdc-feedback', SDCOrientationFeedbackViewSet, basename='sdc-feedback')

# hanchou&shoku chou

router.register(r'han-content', HanContentViewSet)
router.register(r'han-training-content', HanTrainingContentViewSet)
router.register(r'sho-content', ShoContentViewSet)
router.register(r'sho-training-content', ShoTrainingContentViewSet)



# Notification System
router.register(r'notifications', NotificationViewSet, basename='notifications')


router.register(r'sdc-orientation-feedback', SDCOrientationFeedbackViewSet, basename='sdc-orientation-feedback')

# router.register(r'scheduled-employees-skills', )





# router.register(r'skill-matrix', OperatorSkillMatrixViewSet)
# router.register(r'operations', OperationListViewSet)
# router.register(r'operator-levels', OperatorLevelViewSet)

# Combine all URL patterns
urlpatterns = [
 
    # Web interface
    # path('', views.dashboard, name='dashboard'),
   
    # API endpoints
    path('api/devices/', views.DeviceListView.as_view(), name='device-list'),
    path('api/devices/<int:base_id>/', views.DeviceDetailView.as_view(), name='device-detail'),
    path('api/events/', views.KeypadEventListView.as_view(), name='event-list'),
    path('api/vote-sessions/', views.VoteSessionListView.as_view(), name='vote-session-list'),

    # Service control
    path('api/service/start/', views.start_service, name='start-service'),
    path('api/service/stop/', views.stop_service, name='stop-service'),
    path('api/service/status/', views.service_status, name='service-status'),
    path('api/stats/', views.stats, name='stats'),

    # Authentication
    path('register/', views.RegisterView.as_view(), name="register"),
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('logout/', views.LogoutAPIView.as_view(), name="logout"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),




    path('training-summary/', TrainingSummaryView.as_view()),
    path('operators-joined-vs-trained/', OperatorsJoinedVsTrainedView.as_view()),
    path('msil-defects/', MSILDefectsView.as_view()),
    path('ctq-defects-all-plants/', CTQDefectsAllPlantsView.as_view()),
    path('internal-rejection/', InternalRejectionView.as_view()),



     path('employee/<str:employee_code>/', EmployeeByCodeView.as_view(), name='employee-by-code'),



    path('trainingcontent/create/', TrainingContentCreateView.as_view(), name='trainingcontent-create'),

    path('milestone/alerts/', get_today_milestones, name='milestone-alerts'),
    path('milestone/email/alerts/', get_today_email_milestones, name='email_milestone-alerts'),



    path('unit/<int:unit_id>/', views.get_unit_by_id, name='get_unit_by_id'),
    path('level2-units/topic/<int:topic_id>/', views.get_units_by_topic),
    path('units/by-subtopic/<int:subtopic_id>/', views.get_units_by_subtopic, name='get_units_by_subtopic'),
     




     path('send-mail/', SendMailView.as_view(), name='send-mail'),

     path('skill-matrix/', SkillMatrixViewSet.as_view({'get': 'list', 'post': 'create'}), name='skill-matrix'),  # 💾 **MAIN DATA SAVER** - Skill matrix bulk operations

    # ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
    # 🏭 MACHINE MANAGEMENT DETAILED ENDPOINTS
    # ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
    path('api/machine-operators/', include([
        # Custom actions for machine operators
        path('auto-fill-check/', views.EmployeeViewSet.as_view({'post': 'auto_fill_check'}), name='machine-operators-auto-fill'),
        path('<int:pk>/with-allocations/', views.EmployeeViewSet.as_view({'get': 'with_allocations'}), name='machine-operators-with-allocations'),
    ])),
    
    # path('api/machines/', include([
    #     # Custom actions for machines
    #     path('<int:pk>/with-allocations/', views.MachineViewSet.as_view({'get': 'with_allocations'}), name='machines-with-allocations'),
    #     path('<int:pk>/available-levels/', views.MachineViewSet.as_view({'get': 'available_levels'}), name='machines-available-levels'),
    # ])),
    
    # path('api/machine-allocations/', include([
    #     # Custom actions for machine allocations
    #     path('bulk-create/', views.MachineAllocationViewSet.as_view({'post': 'bulk_create'}), name='machine-allocations-bulk-create'),
    #     path('by-machine/', views.MachineAllocationViewSet.as_view({'get': 'by_machine'}), name='machine-allocations-by-machine'),
    #     path('by-employee/', views.MachineAllocationViewSet.as_view({'get': 'by_employee'}), name='machine-allocations-by-employee'),
    #     path('auto-fill/', views.MachineAllocationViewSet.as_view({'post': 'auto_fill_allocation'}), name='machine-allocations-auto-fill'),
    # ])),
    
    # Complete operations endpoints
    # path('api/complete/', include([
    #     path('setup/', views.MachineAllocationBulkViewSet.as_view({'post': 'create_complete_setup'}), name='complete-setup'),
    #     path('data/', views.MachineAllocationBulkViewSet.as_view({'get': 'get_complete_data'}), name='complete-data'),
    # ])),


    # path('operator-levels/<str:department>/', get_operator_levels_by_department),


    # For skill matrix IJL

    path('departments/', get_unique_departments, name='unique-departments'),


    path('operator-levels/<str:department>/', get_operator_levels_by_department, name='operator-levels-by-department'),
    path('update-skillmatrix/<int:id>/', update_skillmatrix_by_id, name='update-skillmatrix-by-id'),



    # Excel upload for operator master IJL

    path('upload-operator-excel/', OperatorExcelUploadAPIView.as_view(), name='upload-operator-excel'),




    path('upload-operator-excel/', OperatorExcelUploadAPIView.as_view(), name='upload-operator-excel'),
   # key event

    path('api/key-events/create/', views.KeyEventCreateView.as_view()),
    path('api/key-events/latest/', views.LatestKeyEventView.as_view()),
    path('api/connect-events/create/', views.connect_event_create, name='connect_event_create'),
    path('api/vote-events/create/', views.vote_event_create, name='vote_event_create'),
    path('api/question-papers/', views.QuizQuestionPaperListCreateView.as_view()),
    path('api/questions/by-paper/<int:paper_id>/', views.QuizQuestionsByPaperView.as_view()),
    path('api/questions/', views.QuizQuestionListCreateView.as_view()),
    path('api/questions/<int:pk>/', views.QuizQuestionDetailView.as_view()),

  

    path('api/employees/', views.OperatorListCreateView.as_view(), name='employee_list_create'),

    path('api/start-test/', views.StartTestSessionView.as_view(), name='start_test_session'),
    path('api/end-test/', views.EndTestSessionView.as_view(), name='end_test_session'),
    path('api/scores/', views.ScoreListView.as_view(), name='score_list'),
    path('api/test-session/map/', views.KeyIdToEmployeeNameMap.as_view(), name='keyid-name-map'),
    path('api/past-sessions/', views.PastTestSessionsView.as_view()),
    path('api/scores-by-session/<str:name>/', views.ScoresByTestView.as_view()),
    path('api/score-summary/', views.ResultSummaryAPIView.as_view(), name='score-summary'),
    path('api/skills/', SkillsListView.as_view(), name='skills-list'),
    path('api/levels/', LevelsListView.as_view(), name='levels-list'),
    path('api/scores-by-session/<path:session_key>/', views.ScoresBySessionView.as_view(), name='scores-by-session'),
    path('api/employee-skill-matrix/<int:employee_id>/', views.EmployeeSkillMatrixView.as_view(), name='employee-skill-matrix'),
    path('api/recent-skill-updates/', views.RecentSkillMatrixUpdatesView.as_view(), name='recent-skill-updates'),
    path('api/skill-matrix/', views.SkillMatrixView.as_view(), name='skill-matrix'),
    path('api/skill-matrix/<str:department>/', views.SkillMatrixView.as_view(), name='skill-matrix-department'),
    

    path('employee-report/', EmployeeReportPDFView.as_view(), name='employee-report'),
    # path('employee-report/', EmployeeReportPDFView.as_view(), name='employee_report_pdf'),
    path('manpower-ctq-trends/', ManpowerCTQTrendsView.as_view(), name='manpower-ctq-trends'),
    path('upload-management-review/', ManagementReviewUploadView.as_view(), name='upload-management-review'),
    path('upload-ctq/', UploadAdvancedManpowerCTQView.as_view(), name='upload_ctq'),

    path('api/logo/', LogoView.as_view()),


    # exam tool
    path('download-all/', UploadedFileListView.as_view(), name='download_all_files'),
    path('download-file/<int:file_id>/', FileDownloadView.as_view(), name='download_file'),

    path('leveltwo-contents/', Level2TrainingContentListCreateView.as_view(),name='leveltwo-content-list-create'),
    path('leveltwo-contents/<int:pk>/', Level2TrainingContentRetrieveUpdateDestroyView.as_view(), name='leveltwo-content-retrieve-update-destroy'),
    path('levelthree-contents/',Level3TrainingContentListCreateView.as_view(),name='levelthree-content-list-create'),
    path('levelthree-contents/<int:pk>/', Level3TrainingContentRetrieveUpdateDestroyView.as_view(),name='levelthree-content-retrieve-update-destroy'),



    path('departments-by-factory/', DepartmentByFactoryView.as_view(), name='departments-by-factory'),


     # han&sho
    path('han-training-content/create/', HanTrainingContentCreateView.as_view()),
    path('sho-training-content/create/', ShoTrainingContentCreateView.as_view(), name='sho-training-content-create'),
    path('han-training-content-by-id/<int:han_content_id>/', HanTrainingContentByContentID.as_view(), name='han_training_by_content_id'),
    path('Sho-training-content-by-id/<int:sho_content_id>/', ShoTrainingContentByContentID.as_view(), name='sho-training-content-by-id'),
    # end


    # start management
    path('current-month/training-data/', CurrentMonthTrainingDataView.as_view(), name='current-month-training-data'),
    path('current-month/defects-data/', CurrentMonthDefectsDataView.as_view(), name='current-month-defects-data'),
    path('chart/operators/', OperatorsChartView.as_view(), name='operators-chart'),
    path('chart/training-plans/', TrainingPlansChartView.as_view(), name='training-plans-chart'),
    path('chart/defects-msil/', DefectsChartView.as_view(), name='defects-msil-chart'),
    # end


    path('department-hierarchy/', DepartmentHierarchyView.as_view(), name='department-hierarchy'),

    path('employees-with-active-skills/', AllEmployeesWithActiveSkillsView.as_view(), name='employees-with-active-skills'),

    #emp history 
    path('employee-card-details/', EmployeeCardDetailsView.as_view(), name='employee-card-details'),


    # Notification System URLs
    path('api/notifications/count/', notification_count, name='notification-count'),
    path('api/notifications/system/', create_system_notification, name='create-system-notification'),
    path('api/notifications/test/', create_test_notification, name='create-test-notification'),
    path('api/notifications/debug/', test_notifications, name='test-notifications'),
    path('api/notifications/trigger-employee/', trigger_employee_notification, name='trigger-employee-notification'),
    path('api/notifications/trigger-all-types/', trigger_all_notification_types, name='trigger-all-notification-types'),
    path('api/notifications/delete_all/', delete_all_notifications, name='delete-all-notifications'),



    path('temp-user-info/', UserInfoListCreateView.as_view(), name='create_user_info'),
    path('human-body-checks/', HumanBodyCheckListCreateView.as_view(), name='human-body-check-create'),
    path('human-body-checks/list/', HumanBodyCheckListCreateView.as_view(), name='human-body-check-list'),

    path('passed-users/', PassedUsersWithDetailsView.as_view(), name='passed-users'),
    path('allpassed-users/', AllPassedUsersView.as_view(), name='all_passed_users'),
    path('user-body-checks/', UserInfoBodyCheckListView.as_view(), name='user_body_check_list'),
    path('remaining-departments/', RemainingDepartmentsView.as_view(), name='remaining-departments'),
    path('scheduled-employees-skills/', ScheduledEmployeesSkillsView.as_view(), name='scheduled-employees-skills'),

    # STL NEW URLS

    path('intake-entries/', IntakeEntryListView.as_view(), name='intake-entries-list'),


    # Router URLs
    path('', include(router.urls)),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve media files in debug mode
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
