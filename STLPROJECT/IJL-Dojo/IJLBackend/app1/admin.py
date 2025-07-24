from django.contrib import admin
from .models import Device, HanContent, HanTrainingContent, KeypadEvent, Level2TrainingContent, ShoContent, ShoTrainingContent, SubTopicContent, VoteSession

@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ['base_id', 'mode', 'status', 'created_at', 'updated_at']
    list_filter = ['status', 'mode', 'created_at']
    search_fields = ['base_id', 'info']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(KeypadEvent)
class KeypadEventAdmin(admin.ModelAdmin):
    list_display = ['key_id', 'key_sn', 'device', 'mode', 'processed', 'created_at']
    list_filter = ['processed', 'mode', 'created_at', 'device']
    search_fields = ['key_id', 'key_sn', 'info']
    readonly_fields = ['created_at']

@admin.register(VoteSession)
class VoteSessionAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'device', 'duration', 'status', 'started_at', 'ended_at']
    list_filter = ['status', 'started_at', 'device']
    search_fields = ['session_id', 'config']
    readonly_fields = ['started_at']

    #--------------------------------------------------------------------------------------------------------------------------------------------------------------
    from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, HQ, Factory, Department, Line, Level, SkillTraining

# Custom User Admin
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'employeeid', 'first_name', 'last_name', 'role', 'hq', 'factory', 'department', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active', 'hq', 'factory', 'department')
    search_fields = ('email', 'employeeid', 'first_name', 'last_name')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('employeeid', 'first_name', 'last_name', 'role')}),
        ('Organizational info', {'fields': ('hq', 'factory', 'department')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'employeeid', 'first_name', 'last_name', 'role', 'hq', 'factory', 'department', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )

admin.site.register(User, UserAdmin)

from .models import MultiSkilling
admin.site.register(MultiSkilling)

@admin.register(HQ)
class HQAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Factory)
class FactoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'hq')
    list_filter = ('hq',)
    search_fields = ('name',)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'factory')
    list_filter = ('factory',)
    search_fields = ('name',)


@admin.register(Line)
class LineAdmin(admin.ModelAdmin):
    list_display = ('name', 'department')
    list_filter = ('department',)
    search_fields = ('name',)


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'line')
    list_filter = ('name', 'line')
    search_fields = ('line__name',)


from .models import Days

@admin.register(Days)
class DaysAdmin(admin.ModelAdmin):
    list_display = ['id', 'day', 'level']
    list_filter = ['level']
    search_fields = ['day']




@admin.register(SkillTraining)
class SkillTrainingAdmin(admin.ModelAdmin):
    list_display = ('title', 'level')
    list_filter = ('level',)
    search_fields = ('title',)

from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from .models import SubTopic, TrainingContent, Test, Question


@admin.register(SubTopic)
class SubTopicAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'skill_training', 'day')
    list_filter = ('skill_training', 'day')




@admin.register(SubTopicContent)
class SubTopicContentAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'subtopic']
    search_fields = ['title']
    list_filter = ['subtopic']


    
@admin.register(TrainingContent)
class TrainingContentAdmin(admin.ModelAdmin):
    list_display = ('id','description')
    
    search_fields = ('description',)


class QuestionResource(resources.ModelResource):
    test = fields.Field(
        column_name='test',
        attribute='test',
        widget=ForeignKeyWidget(Test)
    )

    class Meta:
        model = Question
        fields = ('test', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer')



@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question', 'test')
    list_filter = ('test',)
    resource_class = QuestionResource  # to enable import-export if needed


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('test_name', 'subtopic')
    list_filter = ('subtopic',)
    search_fields = ('test_name',)
    filter_horizontal = ('operators',)


from django.contrib import admin
from .models import OperatorTestAssignment

@admin.register(OperatorTestAssignment)
class OperatorTestAssignmentAdmin(admin.ModelAdmin):
    list_display = ('operator', 'test', 'assigned_on')
    list_filter = ('assigned_on', 'operator', 'test')
    search_fields = ('operator__name', 'test__name')

from django.contrib import admin
from .models import OperatorRemoteAssignment

@admin.register(OperatorRemoteAssignment)
class OperatorRemoteAssignmentAdmin(admin.ModelAdmin):
    list_display = ('operator', 'device', 'key_id', 'assigned_on')
    search_fields = ('operator__name', 'device__base_id', 'key_id')
    list_filter = ('assigned_on',)








from django.contrib import admin
from .models import TrainingReport, UnifiedDefectReport

@admin.register(TrainingReport)
class TrainingReportAdmin(admin.ModelAdmin):
    list_display = ('month', 'new_operators_joined', 'new_operators_trained', 'total_trainings_planned', 'total_trainings_actual')
    list_filter = ('month',)
    search_fields = ('month',)

from django.contrib import admin
from .models import UnifiedDefectReport

@admin.register(UnifiedDefectReport)
class UnifiedDefectReportAdmin(admin.ModelAdmin):
    list_display = (
        'month',
        'category',
        'total_defects',
        'ctq_defects',
        'total_internal_rejection',
        'ctq_internal_rejection',
    )
    list_filter = ('category', 'month')
    search_fields = ('category',)

    ordering = ('-month',)
















from django.contrib import admin
from .models import (
    LevelTwoSkillTraining,
    LevelTwoSection,
    LevelTwoTopic,
    LevelTwoSubTopic,
    LevelTwoUnit,
    LevelTwoSubUnit,
    LevelTwoTrainingContent,
)

# Inline for LevelTwoTrainingContent inside LevelTwoSubUnit
class LevelTwoTrainingContentInline(admin.TabularInline):
    model = LevelTwoTrainingContent
    extra = 1

# Inline for LevelTwoSubUnit inside LevelTwoUnit
class LevelTwoSubUnitInline(admin.TabularInline):
    model = LevelTwoSubUnit
    extra = 1
    show_change_link = True

# Inline for LevelTwoUnit inside LevelTwoTopic and LevelTwoSubTopic
class LevelTwoUnitInline(admin.TabularInline):
    model = LevelTwoUnit
    extra = 1
    show_change_link = True

# Inline for LevelTwoSubTopic inside LevelTwoTopic
class LevelTwoSubTopicInline(admin.TabularInline):
    model = LevelTwoSubTopic
    extra = 1
    show_change_link = True

# Inline for LevelTwoTopic inside LevelTwoSection
class LevelTwoTopicInline(admin.TabularInline):
    model = LevelTwoTopic
    extra = 1
    show_change_link = True

# Inline for LevelTwoSection inside LevelTwoSkillTraining
class LevelTwoSectionInline(admin.TabularInline):
    model = LevelTwoSection
    extra = 1
    show_change_link = True


@admin.register(LevelTwoSkillTraining)
class LevelTwoSkillTrainingAdmin(admin.ModelAdmin):
    list_display = ['title', 'level']
    inlines = [LevelTwoSectionInline]


@admin.register(LevelTwoSection)
class LevelTwoSectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'skill_training']
    inlines = [LevelTwoTopicInline]


@admin.register(LevelTwoTopic)
class LevelTwoTopicAdmin(admin.ModelAdmin):
    list_display = ['title', 'section']
    inlines = [LevelTwoSubTopicInline, LevelTwoUnitInline]


@admin.register(LevelTwoSubTopic)
class LevelTwoSubTopicAdmin(admin.ModelAdmin):
    list_display = ['title', 'topic']
    inlines = [LevelTwoUnitInline]


@admin.register(LevelTwoUnit)
class LevelTwoUnitAdmin(admin.ModelAdmin):
    list_display = ['id', 'topic', 'subtopic', 'day', 'content']
    inlines = [LevelTwoSubUnitInline]


@admin.register(LevelTwoSubUnit)
class LevelTwoSubUnitAdmin(admin.ModelAdmin):
    list_display = ['title', 'unit']
    inlines = [LevelTwoTrainingContentInline]


@admin.register(LevelTwoTrainingContent)
class LevelTwoTrainingContentAdmin(admin.ModelAdmin):
    list_display = ['subunit', 'description', 'training_file', 'url_link']














from django.contrib import admin
from .models import OperatorLevelTracking

admin.site.register(OperatorLevelTracking)







from django.contrib import admin
from .models import OperatorMaster
from import_export.admin import ImportExportModelAdmin
from .resources import OperatorMasterResource

@admin.register(OperatorMaster)
class OperatorMasterAdmin(ImportExportModelAdmin):
    resource_class = OperatorMasterResource
    list_display = (
        'sr_no',
        'employee_code',
        'full_name',
        'date_of_join',
        'employee_pattern_category',
        'designation',
        'department',
        'department_code'
    )
    list_filter = ('designation', 'department')
    search_fields = ('employee_code', 'full_name')




from django.contrib import admin
from .models import ARVRTrainingContent

@admin.register(ARVRTrainingContent)
class ARVRTrainingContentAdmin(admin.ModelAdmin):
    list_display = ('id', 'description', 'arvr_file')
    search_fields = ('description',)

# IJL SKILL MATRIX

from django.contrib import admin
from .models import SkillMatrix, OperationList, OperatorLevel, Section

@admin.register(SkillMatrix)
class SkillMatrixAdmin(admin.ModelAdmin):
    list_display = ('department', 'updated_on', 'next_review', 'doc_no', 'prepared_by', 'uploaded_by')
    search_fields = ('department', 'prepared_by', 'uploaded_by')
    list_filter = ('updated_on', 'next_review')

@admin.register(OperationList)
class OperationListAdmin(admin.ModelAdmin):
    list_display = ('name', 'matrix', 'minimum_skill_required', 'section')
    search_fields = ('name',)
    list_filter = ('minimum_skill_required', 'section')

@admin.register(OperatorLevel)
class OperatorLevelAdmin(admin.ModelAdmin):
    list_display = ('employee', 'operation', 'skill_matrix', 'level')
    search_fields = ('employee__name', 'operation__name', 'skill_matrix__department')
    list_filter = ('level', 'skill_matrix')

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('name',)




from django.contrib import admin
from .models import (
    Question,

)




from django.contrib import admin
from .models import QuizQuestionPaper, QuizQuestion

@admin.register(QuizQuestionPaper)
class QuizQuestionPaperAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'question_paper', 'correct_index')
    list_filter = ('question_paper',)
    search_fields = ('question_text',)


from django.contrib import admin
from .models import Station

@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = ('station_number', 'skill', 'minimum_skill_required', 'min_operator_required')
    search_fields = ('station_number', 'skill', 'minimum_skill_required')
    list_filter = ('skill', 'minimum_skill_required')


@admin.register(Level2TrainingContent)
class Level2TrainingContentAdmin(admin.ModelAdmin):
    list_display = ('topic', 'description', 'training_file', 'url_link', 'created_at')
    search_fields = ('description', 'topic__title')
    list_filter = ('created_at', 'updated_at')

from django.contrib import admin
from .models import Level3TrainingContent

@admin.register(Level3TrainingContent)
class Level3TrainingContentAdmin(admin.ModelAdmin):
    list_display = ('id', 'topic', 'description', 'created_at', 'updated_at')
    search_fields = ('description', 'topic__title')
    list_filter = ('created_at', 'updated_at')


from django.contrib import admin
from .models import UploadedFile

@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ['title', 'uploaded_at']


# han chou& shoko chou

from django.contrib import admin
from .models import SkillsList

@admin.register(SkillsList)
class SkillsListAdmin(admin.ModelAdmin):
    list_display = ('id', 'skill')
    search_fields = ('skill',)

admin.site.register(HanContent)
admin.site.register(HanTrainingContent)
admin.site.register(ShoContent)
admin.site.register(ShoTrainingContent)

from django.contrib import admin
from .models import Score

@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = (
        'employee',
        'marks',
        'percentage',
        'passed',
        'test_name',
        'test',
        'level',
        'skill',
        'created_at',
    )
    list_filter = ('test_name', 'test', 'level', 'skill', 'passed', 'created_at')
    search_fields = ('employee__name', 'employee__pay_code', 'test_name')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
