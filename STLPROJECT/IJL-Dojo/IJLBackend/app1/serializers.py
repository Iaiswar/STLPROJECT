from rest_framework import serializers
from .models import Device, KeypadEvent, VoteSession

class DeviceSerializer(serializers.ModelSerializer):
    events_count = serializers.SerializerMethodField()

    class Meta:
        model = Device
        fields = ['id', 'base_id', 'mode', 'info', 'status', 'created_at', 'updated_at', 'events_count']

    def get_events_count(self, obj):
        return obj.events.count()

class KeypadEventSerializer(serializers.ModelSerializer):
    device_info = DeviceSerializer(source='device', read_only=True)

    class Meta:
        model = KeypadEvent
        fields = ['id', 'device', 'device_info', 'key_id', 'key_sn', 'mode', 'timestamp', 'info', 'processed', 'created_at']

class VoteSessionSerializer(serializers.ModelSerializer):
    device_info = DeviceSerializer(source='device', read_only=True)

    class Meta:
        model = VoteSession
        fields = ['id', 'device', 'device_info', 'session_id', 'duration', 'config', 'status', 'started_at', 'ended_at']

        #-----------------------------------------------------------------------------------------------------------------------------------------------------


from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    employeeid = serializers.CharField(max_length=10)
    role = serializers.CharField(max_length=50)
    email = serializers.EmailField(max_length=100)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    hq = serializers.CharField(max_length=50)
    factory = serializers.CharField(max_length=50)
    department = serializers.CharField(max_length=50)
    status = serializers.BooleanField(default=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'employeeid', 'first_name', 'last_name',
            'role', 'hq', 'factory', 'department', 'status'
        ]

    def validate_email(self, value):
        """
        Validate email is not already in use.
        Accepts any valid email domain like gmail.com, yahoo.in, etc.
        """
        if User.objects.filter(email=value).exists():
            raise ValidationError("Email is already in use.")
        return value

    def validate_password(self, value):
        """
        Validate password strength:
        - Minimum 6 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        - At least one special character
        """
        if len(value) < 6:
            raise ValidationError("Password must be at least 6 characters long.")
        if not any(char.isupper() for char in value):
            raise ValidationError("Password must contain at least one uppercase letter.")
        if not any(char.islower() for char in value):
            raise ValidationError("Password must contain at least one lowercase letter.")
        if not any(char.isdigit() for char in value):
            raise ValidationError("Password must contain at least one number.")
        if not any(char in "!@#$%^&*()-_=+[]{}|;:',.<>?/" for char in value):
            raise ValidationError("Password must contain at least one special character (!@#$%^&*()-_=+[]{}|;:',.<>?/).")
        return value

    def create(self, validated_data):
        """
        Create a new user using create_user method from the User model.
        """
        try:
            return User.objects.create_user(
                email=validated_data['email'],
                employeeid=validated_data['employeeid'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                role=validated_data['role'],
                hq=validated_data['hq'],
                factory=validated_data['factory'],
                department=validated_data['department'],
                password=validated_data['password']
            )
        except Exception as e:
            raise serializers.ValidationError({'error': str(e)})

# (2) Serializer for the User Login

from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=100)
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email', '').strip()
        password = attrs.get('password', '')

        if not email or not password:
            raise ValidationError({'error': _('Email and password are required.')})

        #  Authenticate using email and password
        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if user is None:
            raise ValidationError({'error': _('Invalid email or password.')})

        #  Check if the user is active
        if not user.is_active:
            raise ValidationError({'error': _('This account is inactive. Please contact support.')})

        attrs['user'] = user
        return attrs



# (3) serializer for the User Logout

from rest_framework import serializers

class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

    def validate_refresh_token(self, value):
        if not value:
            raise serializers.ValidationError("Refresh token is required for logout.")
        return value









from rest_framework import serializers
from .models import HQ,Factory,Department,Level,Line

class HQSerializer(serializers.ModelSerializer):
    class Meta:
        model = HQ
        fields = ['id', 'name']


class FactorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Factory
        fields = ['id', 'name', 'hq']


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'factory']


class LineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Line
        fields = ['id', 'name', 'department']


class LevelSerializer(serializers.ModelSerializer):
    name_display = serializers.CharField(source='get_name_display', read_only=True)

    class Meta:
        model = Level
        fields = ['id', 'name', 'name_display', 'line']





from rest_framework import serializers
from .models import Days

class DaysSerializer(serializers.ModelSerializer):
    class Meta:
        model = Days
        fields = ['id', 'level', 'day']




# Notification IJL


from rest_framework import serializers
from .models import OperatorLevelTracking

class OperatorLevelTrackingSerializer(serializers.ModelSerializer):
    operator_name = serializers.CharField(source='operator.full_name', read_only=True)
    level_name = serializers.CharField(source='level.name', read_only=True)
    milestone_date = serializers.DateField(read_only=True)
    message = serializers.SerializerMethodField()

    class Meta:
        model = OperatorLevelTracking
        fields = ['id', 'operator_name', 'level_name', 'day', 'milestone_date', 'message']

    def get_message(self, obj):
        return f"{obj.operator.full_name} {obj.level.name} is going to complete today"



from rest_framework import serializers
from .models import OperatorLevelEmailTracking, TrackingEmail

class TrackingEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingEmail
        fields = ['email']

class OperatorLevelEmailTrackingSerializer(serializers.ModelSerializer):
    operator_name = serializers.CharField(source='operator.full_name', read_only=True)
    level_name = serializers.CharField(source='level.name', read_only=True)
    milestone_date = serializers.DateField(read_only=True)
    message = serializers.SerializerMethodField()
    emails = TrackingEmailSerializer(many=True, read_only=True)

    class Meta:
        model = OperatorLevelEmailTracking
        fields = ['id', 'operator_name', 'level_name', 'day', 'milestone_date', 'message', 'emails']

    def get_message(self, obj):
        return f"{obj.operator.full_name} {obj.level.name} is going to complete today"


#10 cycle IJL

from rest_framework import serializers
from .models import (
    OperatorMaster, OperatorPerformanceEvaluation,
    Tencycletopics, OperatorEvaluation, EvaluationTopicMarks
)

class OperatorMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatorMaster
        fields = [
            'id', 'sr_no', 'employee_code', 'full_name', 'date_of_join',
            'employee_pattern_category', 'designation', 'department', 'department_code',
        ]

class OperatorPerformanceEvaluationSerializer(serializers.ModelSerializer):
    cc_no = OperatorMasterSerializer()  # Nested OperatorMaster

    class Meta:
        model = OperatorPerformanceEvaluation
        fields = '__all__'

class TencycletopicsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tencycletopics
        fields = '__all__'

class OperatorEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatorEvaluation
        fields = '__all__'



class OperatorPerformanceEvaluationWriteSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OperatorPerformanceEvaluation
        fields = '__all__'



class EvaluationTopicMarksSerializer(serializers.ModelSerializer):
    employee_code = serializers.CharField(source='employee.cc_no.employee_code', read_only=True)
    employee = OperatorPerformanceEvaluationSerializer(read_only=True)  # NESTED!
    topic_name = TencycletopicsSerializer(read_only=True)
    days = OperatorEvaluationSerializer(read_only=True)

    total_score = serializers.SerializerMethodField()

    class Meta:
        model = EvaluationTopicMarks
        fields = '__all__'  # This will include all fields + nested + total_score

    def get_total_score(self, obj):
        marks = [
            obj.mark_1, obj.mark_2, obj.mark_3, obj.mark_4, obj.mark_5,
            obj.mark_6, obj.mark_7, obj.mark_8, obj.mark_9, obj.mark_10
        ]
        return sum(filter(None, marks))

class EvaluationTopicMarksWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationTopicMarks
        fields = '__all__'


# AR-VR IJL

from rest_framework import serializers
from .models import ARVRTrainingContent

class ARVRTrainingContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ARVRTrainingContent
        fields='__all__'


#10 cycle for level (new)


from rest_framework import serializers
from .models import (
    OperatorMaster, OperatorPerformanceEvaluationLevel,
    TencycletopicsLevel, OperatorEvaluationLevel, EvaluationTopicMarksLevel
)

class OperatorMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatorMaster
        fields = [
            'id', 'sr_no', 'employee_code', 'full_name', 'date_of_join',
            'employee_pattern_category', 'designation', 'department', 'department_code',
        ]

class OperatorPerformanceEvaluationLevelSerializer(serializers.ModelSerializer):
    cc_no_l = OperatorMasterSerializer()  # Nested OperatorMaster

    class Meta:
        model = OperatorPerformanceEvaluationLevel
        fields = '__all__'

class TencycletopicsLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TencycletopicsLevel
        fields = '__all__'

class OperatorEvaluationLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatorEvaluationLevel
        fields = '__all__'



class OperatorPerformanceEvaluationLevelWriteSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OperatorPerformanceEvaluationLevel
        fields = '__all__'



class EvaluationTopicMarksLevelSerializer(serializers.ModelSerializer):
    employee_code_l = serializers.CharField(source='employee_l.cc_no_l.employee_code', read_only=True)

    employee_l = OperatorPerformanceEvaluationLevelSerializer(read_only=True)  # NESTED!
    topic_name_l = TencycletopicsLevelSerializer(read_only=True)
    days_l = OperatorEvaluationLevelSerializer(read_only=True)

    total_score_l = serializers.SerializerMethodField()

    class Meta:
        model = EvaluationTopicMarksLevel
        fields = '__all__'  # This will include all fields + nested + total_score

    def get_total_score_l(self, obj):
        marks = [
            obj.mark_1, obj.mark_2, obj.mark_3, obj.mark_4, obj.mark_5,
            obj.mark_6, obj.mark_7, obj.mark_8, obj.mark_9, obj.mark_10
        ]
        return sum(filter(None, marks))

class EvaluationTopicMarksLevelWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationTopicMarksLevel
        fields = '__all__'




from rest_framework import serializers
from .models import SkillTraining

class SkillTrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillTraining
        fields = ['id', 'level', 'title']




from rest_framework import serializers
from .models import SubTopic

class SubTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTopic
        fields = ['id', 'skill_training','day','title']




from .models import SubTopicContent

class SubTopicContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTopicContent
        fields = ['id', 'subtopic', 'title']





from .models import TrainingContent

class TrainingContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingContent
        fields = ['id', 'subtopic_content', 'training_file', 'url_link', 'description']






from rest_framework import serializers
from .models import Test,  Question



class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer']


class TestSerializer(serializers.ModelSerializer):
    operators = serializers.PrimaryKeyRelatedField(
        queryset=OperatorMaster.objects.all(), many=True, required=False
    )
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = ['id', 'subtopic', 'test_name', 'questions_file', 'operators', 'questions']


from rest_framework import serializers
from .models import OperatorTestAssignment

class OperatorTestAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatorTestAssignment
        fields = '__all__'

from rest_framework import serializers
from .models import OperatorRemoteAssignment

class OperatorRemoteAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatorRemoteAssignment
        fields = '__all__'


# Score and TestSession serializers for dynamic skill assignment
from .models import Score, TestSession, Station

class ScoreSerializer(serializers.ModelSerializer):
    skill_name = serializers.ReadOnlyField()
    level_number = serializers.ReadOnlyField()
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)

    class Meta:
        model = Score
        fields = [
            'id', 'employee', 'employee_name', 'marks', 'test_name',
            'test', 'level', 'skill', 'skill_name', 'level_number',
            'created_at', 'percentage', 'passed'
        ]

class TestSessionSerializer(serializers.ModelSerializer):
    skill_name = serializers.ReadOnlyField()
    level_number = serializers.ReadOnlyField()
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)

    class Meta:
        model = TestSession
        fields = [
            'id', 'test_name', 'key_id', 'employee', 'employee_name',
            'level', 'skill', 'skill_name', 'level_number',
            'question_paper', 'created_at'
        ]













from .models import OperatorSkillLevel

class OperatorSkillLevelSerializer(serializers.ModelSerializer):
    level = LevelSerializer()
    trainings = SkillTrainingSerializer(many=True)

    class Meta:
        model = OperatorSkillLevel
        fields = [
            'id',
            'level',
            'trainings',
            'written_test_date',
            'written_test_score',
            'practical_test_date',
            'practical_test_score',
            'observation_start_date',
            'observation_end_date',
            'observation_score',
            'status',
        ]


from rest_framework import serializers
from .models import OperatorMaster
# adjust import as needed

class OperatorSkillMasterSerializer(serializers.ModelSerializer):
    skill_levels = OperatorSkillLevelSerializer(many=True, read_only=True)

    class Meta:
        model = OperatorMaster
        fields = [
            'id',
            'employee_code',   # E. Code
            'name',            # Name of Employee
            'sex',             # Gender
            'position',        # New: Position field
            'join_date',       # D.O.J
            'exit_date',       # D.O.E
            'total_years',     # Total of Year
            'section',         # Section
            'skill_levels',    # Related skill levels (unchanged)
        ]






from rest_framework import serializers
from .models import TrainingReport

class TrainingReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingReport
        fields = '__all__'




from rest_framework import serializers
from .models import UnifiedDefectReport

class UnifiedDefectReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnifiedDefectReport
        fields = '__all__'






from rest_framework import serializers
from .models import EmployeeMaster, TrainingActivity, OperatorMaster  # Assuming OperatorMaster exists


from rest_framework import serializers
from .models import EmployeeMaster, TrainingActivity, OperatorMaster


class TrainingActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingActivity
        fields = [
            'activity_no',
            'activity_content',
            'observance_standard',
            'day_15_result',
            'day_16_result',
            'day_17_result',
            'day_18_result',
            'day_19_result',
            'day_20_result',
            'day_21_result',
            'remarks',
        ]


class EmployeeMasterSerializer(serializers.ModelSerializer):
    activities = TrainingActivitySerializer(many=True)
    operator_name = serializers.CharField(write_only=True)
    operator_employee_code = serializers.CharField(write_only=True)

    class Meta:
        model = EmployeeMaster
        fields = [
            'id',
            'operator_name',
            'operator_employee_code',
            'doj',
            'trainer_name',
            'process_name',
            'line_name_or_no',
            'document_number',
            'revision_number_and_date',
            'effective_date',
            'retention_period_years',
            'activities',
        ]

    def create(self, validated_data):
        activities_data = validated_data.pop('activities')
        name = validated_data.pop('operator_name')
        emp_code = validated_data.pop('operator_employee_code')

        operator, _ = OperatorMaster.objects.get_or_create(
            name=name,
            employee_code=emp_code
        )

        employee = EmployeeMaster.objects.create(operator=operator, **validated_data)

        for activity_data in activities_data:
            TrainingActivity.objects.create(employee=employee, **activity_data)

        return employee

    def update(self, instance, validated_data):
        activities_data = validated_data.pop('activities', [])
        name = validated_data.pop('operator_name', None)
        emp_code = validated_data.pop('operator_employee_code', None)

        # Update related operator fields if provided
        if name and emp_code:
            operator, _ = OperatorMaster.objects.get_or_create(
                name=name,
                employee_code=emp_code
            )
            instance.operator = operator

        # Update fields of Employee model
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle activities: delete existing and recreate
        instance.activities.all().delete()
        for activity_data in activities_data:
            TrainingActivity.objects.create(employee=instance, **activity_data)

        return instance








from rest_framework import serializers
from .models import (
    LevelTwoSkillTraining,
    LevelTwoSection,
    LevelTwoTopic,
    LevelTwoSubTopic,
    LevelTwoUnit,
    LevelTwoSubUnit,
    LevelTwoTrainingContent,
)


class LevelTwoTrainingContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelTwoTrainingContent
        fields = '__all__'


class LevelTwoSubUnitSerializer(serializers.ModelSerializer):
    leveltwo_contents = LevelTwoTrainingContentSerializer(many=True, read_only=True)

    class Meta:
        model = LevelTwoSubUnit
        fields = '__all__'


class LevelTwoUnitSerializer(serializers.ModelSerializer):
    subunits = LevelTwoSubUnitSerializer(many=True, read_only=True)
    day = serializers.SerializerMethodField()
    class Meta:
        model = LevelTwoUnit
        fields = '__all__'

    def get_day(self, obj):
        return obj.day.day

class LevelTwoUnitWiseSerializer(serializers.ModelSerializer):
    subunits = LevelTwoSubUnitSerializer(many=True, read_only=True)
    day = serializers.SerializerMethodField()

    class Meta:
        model = LevelTwoUnit
        fields ='__all__'

    def get_day(self, obj):
        return obj.day.day


class LevelTwoSubTopicSerializer(serializers.ModelSerializer):
    leveltwo_units = LevelTwoUnitSerializer(many=True, read_only=True)

    class Meta:
        model = LevelTwoSubTopic
        fields = '__all__'


class LevelTwoTopicSerializer(serializers.ModelSerializer):
    leveltwo_subtopics = LevelTwoSubTopicSerializer(many=True, read_only=True)
    leveltwo_units = LevelTwoUnitSerializer(many=True, read_only=True)

    class Meta:
        model = LevelTwoTopic
        fields = '__all__'


class LevelTwoSectionSerializer(serializers.ModelSerializer):
    leveltwo_topics = LevelTwoTopicSerializer(many=True, read_only=True)

    class Meta:
        model = LevelTwoSection
        fields = '__all__'


class LevelTwoSkillTrainingSerializer(serializers.ModelSerializer):
    leveltwo_sections = LevelTwoSectionSerializer(many=True, read_only=True)

    class Meta:
        model = LevelTwoSkillTraining
        fields = '__all__'






from rest_framework import serializers
from .models import OperatorLevelTracking

class OperatorLevelTrackingSerializer(serializers.ModelSerializer):
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    level_name = serializers.CharField(source='level.name', read_only=True)
    milestone_date = serializers.DateField(source='milestone_date', read_only=True)
    message = serializers.SerializerMethodField()

    class Meta:
        model = OperatorLevelTracking
        fields = ['id', 'operator_name', 'level_name', 'day', 'milestone_date', 'message']

    def get_message(self, obj):
        return f"{obj.operator.name} {obj.level.name} is going to complete today"



# Machine allocation IJL

from .models import Machine, MachineAllocation, OperatorMaster

from rest_framework import serializers
from .models import Machine

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['id', 'name', 'image', 'level', 'process', 'created_at', 'updated_at']


from rest_framework import serializers
from .models import Machine, MachineAllocation, OperatorMaster, OperationList, OperatorLevel

class MachineAllocationSerializer(serializers.ModelSerializer):
    machine = MachineSerializer(read_only=True)
    machine_id = serializers.PrimaryKeyRelatedField(
        queryset=Machine.objects.all(),
        source='machine',
        write_only=True
    )
    employee = serializers.StringRelatedField(read_only=True)
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=OperatorMaster.objects.all(),
        source='employee',
        write_only=True
    )

    class Meta:
        model = MachineAllocation
        fields = [
            'id',
            'machine', 'machine_id',
            'employee', 'employee_id',
            'allocated_at', 'approval_status'
        ]

    def validate(self, data):
        machine = data['machine']
        employee = data['employee']

        required_skill = machine.process.strip()  # operation name as skill
        required_level = machine.level

        # Get the operation matching the machine's process (skill)
        operation = OperationList.objects.filter(name__iexact=required_skill).first()
        if not operation:
            raise serializers.ValidationError(f"Operation '{required_skill}' not found.")

        # Get the operator's skill level for this operation
        operator_level = OperatorLevel.objects.filter(
            employee=employee,
            operation=operation
        ).first()

        if not operator_level:
            data['approval_status'] = 'pending'
            return data

        if operator_level.level >= required_level:
            data['approval_status'] = 'approved'
        else:
            data['approval_status'] = 'pending'

        return data

    def create(self, validated_data):
        allocation = MachineAllocation(**validated_data)
        allocation.save()
        return allocation

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance








# from rest_framework import serializers
# from .models import OperatorPerformanceEvaluation, TrainingCycle, JudgementCriteria


# class TrainingCycleSerializer(serializers.ModelSerializer):
#     """Serializer for TrainingCycle model"""
#     class Meta:
#         model = TrainingCycle
#         exclude = ['evaluation']  # evaluation will be set in parent serializer


# class JudgementCriteriaSerializer(serializers.ModelSerializer):
#     """Serializer for JudgementCriteria model"""
#     class Meta:
#         model = JudgementCriteria
#         exclude = ['evaluation']  # evaluation will be set in parent serializer




# class OperatorPerformanceEvaluationSerializer(serializers.ModelSerializer):
#     """Main serializer for OperatorPerformanceEvaluation with nested models"""
#     training_cycles = TrainingCycleSerializer(many=True)
#     judgement_criteria = JudgementCriteriaSerializer(many=True)
#     operator = OperatorMasterSerializer()

#     class Meta:
#         model = OperatorPerformanceEvaluation
#         fields = '__all__'

    # def create(self, validated_data):
    #     """Create evaluation with nested training cycles and judgement criteria"""
    #     training_cycles_data = validated_data.pop('training_cycles')
    #     judgement_criteria_data = validated_data.pop('judgement_criteria')
    #     operator_data = validated_data.pop('operator')

        # Get or create Operator
        # operator, _ = OperatorMaster.objects.get_or_create(
            # empid=operator_data['empid'],
            # defaults={'name': operator_data.get('name', '')}
        # )

        # Create Evaluation
        # evaluation = OperatorPerformanceEvaluation.objects.create(operator=operator, **validated_data)

        # Create related Training Cycles
        # for cycle in training_cycles_data:
        #     TrainingCycle.objects.create(evaluation=evaluation, **cycle)

        # Create related Judgement Criteria
        # for criteria in judgement_criteria_data:
        #     JudgementCriteria.objects.create(evaluation=evaluation, **criteria)

        # return evaluation

    # def update(self, instance, validated_data):
    #     """Update evaluation with nested training cycles and judgement criteria"""
    #     training_cycles_data = validated_data.pop('training_cycles', [])
    #     judgement_criteria_data = validated_data.pop('judgement_criteria', [])
    #     operator_data = validated_data.pop('operator', None)

        # Update operator if provided
        # if operator_data:
        #     operator, _ = OperatorMaster.objects.get_or_create(
                # empid=operator_data['empid'],
            #     defaults={'name': operator_data.get('name', '')}
            # )
            # instance.operator = operator

        # Update fields in main evaluation model
        # for attr, value in validated_data.items():
        #     setattr(instance, attr, value)
        # instance.save()

        # Delete and recreate training cycles
        # instance.training_cycles.all().delete()
        # for cycle in training_cycles_data:
        #     TrainingCycle.objects.create(evaluation=instance, **cycle)

        # Delete and recreate judgement criteria
        # instance.judgement_criteria.all().delete()
        # for criteria in judgement_criteria_data:
        #     JudgementCriteria.objects.create(evaluation=instance, **criteria)

        # return instance

# ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
# END: OPERATOR PERFORMANCE EVALUATION SERIALIZERS
# ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀


# ████████████████████████████████████████████████████████████████████████████████████████████████████████████
# PERSONNEL OBSERVANCE SHEET SERIALIZERS
# ████████████████████████████████████████████████████████████████████████████████████████████████████████████

from rest_framework import serializers
from .models import (
    Process, ObservationItem, PersonnelObservanceSheet,
    ObservationResult, ObservationFailurePoint, Evaluation
)

class ProcessSerializer(serializers.ModelSerializer):
    """Serializer for Process model"""
    class Meta:
        model = Process
        fields = '__all__'


class ObservationItemSerializer(serializers.ModelSerializer):
    """Serializer for ObservationItem model"""
    class Meta:
        model = ObservationItem
        fields = '__all__'


class ObservationResultSerializer(serializers.ModelSerializer):
    """Serializer for ObservationResult model"""
    class Meta:
        model = ObservationResult
        fields = '__all__'


class EvaluationSerializer(serializers.ModelSerializer):
    """Serializer for Evaluation model"""
    class Meta:
        model = Evaluation
        fields = '__all__'


class ObservationFailurePointSerializer(serializers.ModelSerializer):
    """Serializer for ObservationFailurePoint model with evaluations"""
    evaluations = EvaluationSerializer(many=True, read_only=True)

    class Meta:
        model = ObservationFailurePoint
        fields = '__all__'


class PersonnelObservanceSheetSerializer(serializers.ModelSerializer):
    """Main serializer for PersonnelObservanceSheet with nested results and failures"""
    results = ObservationResultSerializer(many=True)
    failures = ObservationFailurePointSerializer(many=True)

    class Meta:
        model = PersonnelObservanceSheet
        fields = '__all__'

    def create(self, validated_data):
        """Create observance sheet with nested results and failures"""
        results_data = validated_data.pop('results')
        failures_data = validated_data.pop('failures')

        sheet = PersonnelObservanceSheet.objects.create(**validated_data)

        for result in results_data:
            ObservationResult.objects.create(sheet=sheet, **result)

        for failure in failures_data:
            ObservationFailurePoint.objects.create(sheet=sheet, **failure)

        return sheet

    def update(self, instance, validated_data):
        """Update observance sheet with nested results and failures"""
        results_data = validated_data.pop('results', None)
        failures_data = validated_data.pop('failures', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if results_data is not None:
            instance.results.all().delete()
            for result in results_data:
                ObservationResult.objects.create(sheet=instance, **result)

        if failures_data is not None:
            instance.failures.all().delete()
            for failure in failures_data:
                ObservationFailurePoint.objects.create(sheet=instance, **failure)

        return instance

# ████████████████████████████████████████████████████████████████████████████████████████████████████████████
# END: PERSONNEL OBSERVANCE SHEET SERIALIZERS
# ████████████████████████████████████████████████████████████████████████████████████████████████████████████


# ☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰
# RE-TRAINING EFFECTIVENESS CONFIRMATION SERIALIZERS
# ☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰

from rest_framework import serializers
from .models import ReTrainingConfirmation, Observation, Trainer
from .models import OperatorMaster ,Trainer # Ensure correct import path

class ObservationSerializer(serializers.ModelSerializer):
    """Serializer for Observation model in re-training context"""
    class Meta:
        model = Observation
        fields = '__all__'


class TrainerSerializer(serializers.ModelSerializer):
    """Serializer for Trainer model"""
    class Meta:
        model = Trainer
        fields = '__all__'


class ReTrainingConfirmationSerializer(serializers.ModelSerializer):
    """Main serializer for ReTrainingConfirmation with nested observations"""
    observations = ObservationSerializer(many=True)
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    operator_code = serializers.CharField(source='operator.code', read_only=True)
    operator_join_date = serializers.DateField(source='operator.join_date', read_only=True)

    class Meta:
        model = ReTrainingConfirmation
        fields = [
            'id',
            'operator',
            'operator_name',
            'operator_code',
            'operator_join_date',
            'trainer',
            'process_name',
            'line_name_or_no',
            'created_at',
            'observations',
        ]

    def create(self, validated_data):
        """Create re-training confirmation with nested observations"""
        observations_data = validated_data.pop('observations')
        retraining_form = ReTrainingConfirmation.objects.create(**validated_data)

        for obs in observations_data:
            Observation.objects.create(retraining_form=retraining_form, **obs)

        return retraining_form

    def update(self, instance, validated_data):
        """Update re-training confirmation with nested observations"""
        observations_data = validated_data.pop('observations', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if observations_data:
            instance.observations.all().delete()
            for obs in observations_data:
                Observation.objects.create(retraining_form=instance, **obs)

        return instance

# ☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰
# END: RE-TRAINING EFFECTIVENESS CONFIRMATION SERIALIZERS
# ☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰☰


# ◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄
# SKILL MATRIX SERIALIZERS (OPERATION, EMPLOYEE, SKILL ENTRY, METADATA)
# ◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄

from rest_framework import serializers
from .models import Operation, Employee, SkillEntry, SkillMatrixMetadata

class OperationSerializer(serializers.ModelSerializer):
    """Serializer for Operation model in skill matrix context"""
    class Meta:
        model = Operation
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    """Serializer for Employee model in skill matrix context"""
    class Meta:
        model = Employee
        fields = '__all__'

class SkillEntrySerializer(serializers.ModelSerializer):
    """Serializer for SkillEntry model with employee and operation details"""
    employee_details = EmployeeSerializer(source='employee', read_only=True)
    operation_details = OperationSerializer(source='operation', read_only=True)

    class Meta:
        model = SkillEntry
        fields = [
            'id', 'employee', 'employee_details', 'operation', 'operation_details',
            'skill_level', 'certified_date', 'number_of_statuses', 'remarks',
            'total_skilled_persons', 'skill_percentage'
        ]

    def create(self, validated_data):
        """Create skill entry with validation for duplicate entries"""
        # Auto-fill fields if existing employee and operation match
        employee = validated_data.get('employee')
        operation = validated_data.get('operation')
        existing = SkillEntry.objects.filter(employee=employee, operation=operation).first()
        if existing:
            raise serializers.ValidationError("Skill Entry for this employee and operation already exists.")
        return super().create(validated_data)

class SkillMatrixMetadataSerializer(serializers.ModelSerializer):
    """Serializer for SkillMatrixMetadata model"""
    class Meta:
        model = SkillMatrixMetadata
        fields = '__all__'

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════

# class SkillMatrixSerializer(serializers.Serializer):
#     """Main composite serializer for complete skill matrix data"""
#     employee = EmployeeSerializer()
#     skills = SkillEntrySerializer(many=True)
#     metadata = SkillMatrixMetadataSerializer()

#     def create(self, validated_data):
#         """Create complete skill matrix with employee, skills, and metadata"""
#         employee_data = validated_data.pop('employee')
#         skills_data = validated_data.pop('skills')
#         metadata_data = validated_data.pop('metadata')

#         employee, _ = Employee.objects.get_or_create(code=employee_data['code'], defaults=employee_data)

#         skill_entries = []
#         for skill in skills_data:
#             skill['employee'] = employee
#             skill_entry = SkillEntry.objects.create(**skill)
#             skill_entries.append(skill_entry)

        # metadata = SkillMatrixMetadata.objects.create(**metadata_data)
        # return {
        #     'employee': employee,
        #     'skills': skill_entries,
        #     'metadata': metadata,
        # }

# ◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄
# END: SKILL MATRIX SERIALIZERS
# ◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄


# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
# ◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄
# Machine Allocation serializer (OPERATION, EMPLOYEE, SKILL ENTRY, METADATA)
# ◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄◄

# from rest_framework import serializers
# from django.core.exceptions import ValidationError as DjangoValidationError
# from .models import Machine, MachineAllocation, Employee

# class Employee(serializers.ModelSerializer):
#     """Serializer for Employee model"""
#     class Meta:
#         model = Employee
#         fields = '__all__'
#         read_only_fields = ('created_at', 'updated_at')



# class OperatorWithAllocationsSerializer(serializers.ModelSerializer):
#     """Nested serializer for Operator with their machine allocations"""
#     machine_allocations = MachineAllocationSerializer(many=True, read_only=True)
    
#     class Meta:
#         model = Employee
#         fields = '__all__'
#         read_only_fields = ('created_at', 'updated_at')

# class MachineAllocationCreateSerializer(serializers.ModelSerializer):
#     """Create serializer with auto-fill functionality"""
#     employee_name = serializers.CharField(write_only=True, required=False)
#     employee_code = serializers.CharField(write_only=True, required=False)
    
    # class Meta:
    #     model = MachineAllocation
    #     fields = '__all__'
    #     read_only_fields = ('created_at', 'updated_at')
    
    # def validate(self, data):
    #     """Auto-fill employee data and validate"""
    #     employee_name = data.pop('employee_name', None)
    #     employee_code = data.pop('employee_code', None)
        
    #     # Auto-fill employee if name and code provided
    #     if employee_name and employee_code:
    #         try:
    #             employee = Employee.objects.get(
    #                 name__iexact=employee_name.strip(),
    #                 emp_code__iexact=employee_code.strip()
    #             )
    #             data['employee'] = employee
    #         except Employee.DoesNotExist:
    #             raise serializers.ValidationError({
    #                 'employee': f"No employee found with name '{employee_name}' and code '{employee_code}'"
    #             })
            # except Employee.MultipleObjectsReturned:
        #         raise serializers.ValidationError({
        #             'employee': f"Multiple employees found with name '{employee_name}' and code '{employee_code}'"
        #         })
        
        # # Validate machine level
        # machine = data.get('machine')
        # level = data.get('level')
        
        # if machine and level:
        #     if level > machine.level:
        #         raise serializers.ValidationError({
        #             'level': f"The machine supports up to Level {machine.level}, but Level {level} was selected."
        #         })
        
        # return data

# class BulkMachineAllocationSerializer(serializers.Serializer):
#     """Serializer for bulk operations"""
#     machine_allocations = MachineAllocationCreateSerializer(many=True)
    
#     def create(self, validated_data):
#         allocations_data = validated_data['machine_allocations']
#         allocations = []
        
#         for allocation_data in allocations_data:
#             allocation = MachineAllocation.objects.create(**allocation_data)
#             allocations.append(allocation)
        
#         return {'machine_allocations': allocations}
    
#     def validate_machine_allocations(self, value):
#         """Validate bulk data"""
#         if not value:
#             raise serializers.ValidationError("At least one allocation is required.")
        
        # Check for duplicate machine-level combinations
        # machine_level_pairs = []
        # for allocation_data in value:
        #     machine = allocation_data.get('machine')
        #     level = allocation_data.get('level')
        #     if machine and level:
        #         pair = (machine.id, level)
        #         if pair in machine_level_pairs:
        #             raise serializers.ValidationError(
        #                 f"Duplicate allocation found for machine '{machine.name}' at Level {level}"
        #             )
        #         machine_level_pairs.append(pair)
        
        # return value

class AutoFillEmployeeSerializer(serializers.Serializer):
    """Serializer for auto-filling employee data"""
    name = serializers.CharField()
    emp_code = serializers.CharField()
    
    def validate(self, data):
        name = data.get('name', '').strip()
        emp_code = data.get('emp_code', '').strip()
        
        if not name or not emp_code:
            raise serializers.ValidationError("Both name and emp_code are required.")
        
        try:
            employee = Employee.objects.get(
                name__iexact=name,
                emp_code__iexact=emp_code
            )
            data['employee'] = employee
        except Employee.DoesNotExist:
            raise serializers.ValidationError(
                f"No employee found with name '{name}' and code '{emp_code}'"
            )
        except Employee.MultipleObjectsReturned:
            raise serializers.ValidationError(
                f"Multiple employees found with name '{name}' and code '{emp_code}'"
            )
        
        return data


# ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
# ║                                    END OF ALL SERIALIZERS                                                ║
# ║                                                                                                          ║
# ║  TOTAL SECTIONS COVERED:                                                                                 ║
# ║  1. Device, Keypad Event, and Vote Session Serializers                                                   ║
# ║  2. User Authentication Serializers (Register, Login, Logout)                                            ║
# ║  3. Organizational Structure Serializers (HQ, Factory, Department, Line, Level)                          ║
# ║  4. Training System Serializers (Days, Skill Training, SubTopic, Training Content)                       ║
# ║  5. Testing System Serializers (Operator, Question, Test, Assignments)                                   ║
# ║  6. Operator Performance Evaluation Serializers (10 Cycle)                                               ║
# ║  7. Personnel Observance Sheet Serializers                                                               ║
# ║  8. Re-Training Effectiveness Confirmation Serializers                                                   ║
# ║  9. Skill Matrix Serializers (Operation, Employee, Skill Entry, Metadata)                                ║
# ╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝





# IJL SKILLMATRIX SERIALIZERS

from rest_framework import serializers
from .models import (
    SkillMatrix, Section, OperationList, OperatorMaster,
    MultiSkilling, MonthlySkill
)

class SkillMatrixSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillMatrix
        fields = [
            'id','department','updated_on','next_review','doc_no','prepared_by','uploaded_by'
        ]

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'department', 'name']

class OperationListSerializer(serializers.ModelSerializer):
    section_name = serializers.CharField(source='section.name', read_only=True)
    department = serializers.CharField(source='matrix.department', read_only=True)
    class Meta:
        model = OperationList
        fields = ['id','matrix','department','section','section_name','number','name','minimum_skill_required']



class MultiSkillingSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    operation_name = serializers.CharField(source='operation.name', read_only=True)
    section_name = serializers.CharField(source='section.name', read_only=True)
    department_name = serializers.CharField(source='department.department', read_only=True)
    current_status = serializers.ReadOnlyField()
    class Meta:
        model = MultiSkilling
        fields = '__all__'

class MonthlySkillSerializer(serializers.ModelSerializer):
    employee_code = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    date_of_join = serializers.SerializerMethodField()
    designation = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    section = serializers.SerializerMethodField()
    operation = serializers.SerializerMethodField()
    operation_number = serializers.SerializerMethodField()
    skill_level = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    remarks = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    level = serializers.SerializerMethodField()  # Add level field

    class Meta:
        model = MonthlySkill
        fields = [
            'id', 'employee_code', 'full_name', 'date_of_join', 'designation', 'department',
            'section', 'operation', 'operation_number', 'skill_level', 'date', 'remarks', 'status', 'level'
        ]

    def get_employee_code(self, obj):
        return obj.multiskilling.employee.employee_code if obj.multiskilling and obj.multiskilling.employee else None

    def get_full_name(self, obj):
        return obj.multiskilling.employee.full_name if obj.multiskilling and obj.multiskilling.employee else None

    def get_date_of_join(self, obj):
        return obj.multiskilling.employee.date_of_join if obj.multiskilling and obj.multiskilling.employee else None

    def get_designation(self, obj):
        return obj.multiskilling.employee.designation if obj.multiskilling and obj.multiskilling.employee else None

    def get_department(self, obj):
        return obj.multiskilling.department.department if obj.multiskilling and obj.multiskilling.department else None

    def get_section(self, obj):
        return obj.multiskilling.section.name if obj.multiskilling and obj.multiskilling.section else None

    def get_operation(self, obj):
        return obj.multiskilling.operation.name if obj.multiskilling and obj.multiskilling.operation else None

    def get_operation_number(self, obj):
        return obj.multiskilling.operation.number if obj.multiskilling and obj.multiskilling.operation else None

    def get_skill_level(self, obj):
        return obj.multiskilling.skill_level if obj.multiskilling else None

    def get_date(self, obj):
        return obj.multiskilling.date if obj.multiskilling else None

    def get_remarks(self, obj):
        return obj.multiskilling.remarks if obj.multiskilling else None

    def get_status(self, obj):
        return obj.multiskilling.status if obj.multiskilling else None

    def get_level(self, obj):
        return obj.operator_level.level if obj.operator_level else None
    


from rest_framework import serializers
from .models import SkillMatrix, Section, OperationList

class OperationListSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationList
        fields = ['id', 'name', 'number', 'minimum_skill_required']

class SectionWithOperationsSerializer(serializers.ModelSerializer):
    operations = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = ['id', 'name', 'operations']

    def get_operations(self, obj):
        ops = OperationList.objects.filter(section=obj)
        return OperationListSimpleSerializer(ops, many=True).data


class SkillMatrixHierarchySerializer(serializers.ModelSerializer):
    sections = serializers.SerializerMethodField()
    operations_without_section = serializers.SerializerMethodField()

    class Meta:
        model = SkillMatrix
        fields = ['id', 'department', 'sections', 'operations_without_section']

    def get_sections(self, obj):
        sections = Section.objects.filter(department=obj)
        return SectionWithOperationsSerializer(sections, many=True).data

    def get_operations_without_section(self, obj):
        ops = OperationList.objects.filter(matrix=obj, section__isnull=True)
        return OperationListSimpleSerializer(ops, many=True).data



from rest_framework import serializers
from .models import OperatorLevel

class OperatorLevelSerializer(serializers.ModelSerializer):
    employee_full_name = serializers.SerializerMethodField()
    operation_name = serializers.SerializerMethodField()

    class Meta:
        model = OperatorLevel
        fields = [
            'id',
            'skill_matrix',
            'operation',
            'operation_name',
            'employee',
            'employee_full_name',
            'level',
        ]

    def get_employee_full_name(self, obj):
        return obj.employee.full_name if obj.employee else None

    def get_operation_name(self, obj):
        return obj.operation.name if obj.operation else None

# serializers.py
from rest_framework import serializers
from .models import OperatorLevel, OperatorMaster, SkillMatrix, OperationList

class FirstOperatorMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatorMaster
        fields = ['employee_code', 'name', 'join_date']

class FirstSkillMatrixSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillMatrix
        fields = ['shop_department', 'updated_on', 'next_review', 'reviewed_by', 'doc_no', 'rev_no', 'effective_date', 'page_no']

class FirstOperationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationList
        fields = ['name', 'minimum_skill_required', 'process_criticality']

class FirstOperatorLevelSerializer(serializers.ModelSerializer):
    employee = OperatorMasterSerializer()
    skill_matrix = SkillMatrixSerializer()
    operation = OperationListSerializer()

    class Meta:
        model = OperatorLevel
        fields = ['employee', 'skill_matrix', 'operation', 'level']





from rest_framework import serializers
from .models import SubTopic

class SubTopicDaySerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='day.day', read_only=True)  # This accesses the `day` field of the related `Days` model

    class Meta:
        model = SubTopic
        fields = ['id', 'skill_training', 'day', 'day_name', 'title']



# easy test


# serializers.py
from rest_framework import serializers
from .models import EmployeeMaster

class EmployeeNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeMaster
        fields = ['id', 'name']  # Include 'id' optionally


# serializers.py
from rest_framework import serializers
from .models import EmployeeMaster

class EmployeeNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeMaster
        fields = ['id', 'name']  # Include 'id' optionally


# easy test


from rest_framework import serializers
from .models import  *


class KeyEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyEvent
        fields = '__all__'

class ConnectEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectEvent
        fields = '__all__'




class VoteEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteEvent
        fields = '__all__'

# dynamic questions



class QuizQuestionPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestionPaper
        fields = ['id', 'name']


class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_index', 'question_paper']




class TestSessionSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    level_name = serializers.CharField(source='level.name', default='', read_only=True)
    skill_name = serializers.CharField(source='skill.skill', default='', read_only=True)

    class Meta:
        model = TestSession
        fields = ['id', 'key_id', 'employee', 'employee_name', 'level', 'level_name', 'skill', 'skill_name']





class ScoreSerializer(serializers.ModelSerializer):
    employee_id = serializers.IntegerField(source='employee.id')
    name = serializers.CharField(source='employee.full_name')
    section = serializers.CharField(source='employee.section', default='')
    level_name = serializers.CharField(source='level.name', default='')
    skill_name = serializers.CharField(source='skill.skill', default='')
    percentage = serializers.SerializerMethodField()
    total_questions = serializers.SerializerMethodField() 

    class Meta:
        model = Score
        fields = ['employee_id', 'name', 'section', 'level_name', 'skill_name', 'marks', 'percentage', 'total_questions']

    def get_percentage(self, obj):
        total = self.get_total_questions(obj)
        return (obj.marks / total) * 100 if total > 0 else 0

    def get_total_questions(self, obj):
        if obj.test:
            return obj.test.questions.count()
        return 0





class SimpleScoreSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField()
    name = serializers.CharField()
    marks = serializers.IntegerField()
    percentage = serializers.FloatField()
    level_name = serializers.CharField()
    skill_name = serializers.CharField()
    section = serializers.CharField()

from rest_framework import serializers
from .models import CompanyLogo

class CompanyLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyLogo
        fields = ['id', 'name', 'logo', 'uploaded_at']



# Refreshment Training

#serializers.py 

from rest_framework import serializers
from .models import Training_category, Curriculum, CurriculumContent, Trainer_name, Venues, Schedule, OperatorMaster,EmployeeAttendance,RescheduleLog

class Training_categorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Training_category
        fields = '__all__'

class CurriculumSerializer(serializers.ModelSerializer):
    category = Training_categorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Training_category.objects.all(), source='category', write_only=True)

    class Meta:
        model = Curriculum
        fields = ['id', 'category', 'category_id', 'topic', 'description']

class CurriculumContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurriculumContent
        fields = '__all__'

class Trainer_nameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer_name
        fields = '__all__'

class VenuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venues
        fields = '__all__'

class RefresherOperatorMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatorMaster
        fields = ['id', 'employee_code', 'full_name']

class ScheduleSerializer(serializers.ModelSerializer):
    training_category = Training_categorySerializer(read_only=True)
    training_category_id = serializers.PrimaryKeyRelatedField(queryset=Training_category.objects.all(), source='training_category', write_only=True)

    training_name = CurriculumSerializer(read_only=True)
    training_name_id = serializers.PrimaryKeyRelatedField(queryset=Curriculum.objects.all(), source='training_name', write_only=True)

    trainer = Trainer_nameSerializer(read_only=True)
    trainer_id = serializers.PrimaryKeyRelatedField(queryset=Trainer_name.objects.all(), source='trainer', write_only=True)

    venue = VenuesSerializer(read_only=True)
    venue_id = serializers.PrimaryKeyRelatedField(queryset=Venues.objects.all(), source='venue', write_only=True)

    employees = RefresherOperatorMasterSerializer(many=True, read_only=True)
    employee_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=OperatorMaster.objects.all(), write_only=True, source='employees')

    class Meta:
        model = Schedule
        fields = ['id', 'training_category', 'training_category_id', 'training_name', 'training_name_id',
                  'trainer', 'trainer_id', 'venue', 'venue_id', 'status', 'date', 'time',
                  'employees','employee_ids']


class EmployeeAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAttendance
        fields = [
            'id',
            'schedule',
            'employee',
            'status',
            'notes',
            'reschedule_date',
            'reschedule_time',
            'reschedule_reason',
            'updated_at',
        ]
        read_only_fields = ['updated_at']


class RescheduleLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RescheduleLog
        fields='__all__'

from .models import ManagementReview

class TrainingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagementReview
        fields = ['month_year', 'new_operators_joined', 'new_operators_trained', 
                 'total_training_plans', 'total_trainings_actual']

class DefectsDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagementReview
        fields = ['month_year', 'total_defects_msil', 'ctq_defects_msil', 
                 'total_defects_tier1', 'ctq_defects_tier1', 
                 'total_internal_rejection', 'ctq_internal_rejection']

class OperatorsChartSerializer(serializers.ModelSerializer):
    year = serializers.SerializerMethodField()
    operators_joined = serializers.IntegerField(source='new_operators_joined')
    operators_trained = serializers.IntegerField(source='new_operators_trained')
    
    class Meta:
        model = ManagementReview
        fields = ['year', 'month_year', 'operators_joined', 'operators_trained']
    
    def get_year(self, obj):
        return obj.month_year.year

class TrainingPlansChartSerializer(serializers.ModelSerializer):
    year = serializers.SerializerMethodField()
    training_plans = serializers.IntegerField(source='total_training_plans')
    trainings_actual = serializers.IntegerField(source='total_trainings_actual')
    
    class Meta:
        model = ManagementReview
        fields = ['year', 'month_year', 'training_plans', 'trainings_actual']
    
    def get_year(self, obj):
        return obj.month_year.year
    


    
from rest_framework import serializers
from .models import ManagementReview

class DefectsChartSerializer(serializers.ModelSerializer):
    year = serializers.SerializerMethodField()
    defects_msil = serializers.IntegerField(source='total_defects_msil')  # renaming, valid
    ctq_defects_msil = serializers.IntegerField()  # FIXED: no need for source

    class Meta:
        model = ManagementReview
        fields = ['year', 'month_year', 'defects_msil', 'ctq_defects_msil']

    def get_year(self, obj):
        return obj.month_year.year



from rest_framework import serializers

class ManagementReviewUploadSerializer(serializers.Serializer):
    file = serializers.FileField()





# serializers.py

from rest_framework import serializers
from .models import ManagementReview

class ManagementReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagementReview
        fields = '__all__'


from rest_framework import serializers
from .models import CompanyLogo

class CompanyLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyLogo
        fields = ['id', 'name', 'logo', 'uploaded_at']


from rest_framework import serializers
from .models import AdvancedManpowerCTQ, Factory, Department

class NewAdvancedManpowerCTQSerializer(serializers.ModelSerializer):
    factory_name = serializers.CharField(source='factory.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = AdvancedManpowerCTQ
        fields = [
            'id',
            'month_year_ctq',
            'total_stations_ctq',
            'operator_required_ctq',
            'operator_availability_ctq',
            'buffer_manpower_required_ctq',
            'buffer_manpower_availability_ctq',
            'attrition_trend_ctq',
            'absentee_trend_ctq',
            'planned_units_ctq',
            'actual_production_ctq',
            'factory',             # writeable field (ID)
            'department',          # writeable field (ID)
            'factory_name',        # read-only field for display
            'department_name'      # read-only field for display
        ]


# serializers.py


from rest_framework import serializers
from .models import AdvancedManpowerCTQ

class OperatorTrendSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField()

    class Meta:
        model = AdvancedManpowerCTQ
        fields = ['month', 'operator_required_ctq', 'operator_availability_ctq']

    def get_month(self, obj):
        return obj.month_year_ctq.strftime('%B %Y')  # Example: "July 2025"







# serializers.py

class BufferManpowerTrendSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField()

    class Meta:
        model = AdvancedManpowerCTQ
        fields = ['month', 'buffer_manpower_required_ctq', 'buffer_manpower_availability_ctq']

    def get_month(self, obj):
        return obj.month_year_ctq.strftime('%B %Y')  # e.g., "July 2025"





# serializers.py

class AttritionTrendSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField()

    class Meta:
        model = AdvancedManpowerCTQ
        fields = ['month', 'attrition_trend_ctq']

    def get_month(self, obj):
        return obj.month_year_ctq.strftime('%B %Y')  # Example: "July 2025"





# serializers.py

class AbsenteeTrendSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField()

    class Meta:
        model = AdvancedManpowerCTQ
        fields = ['month', 'absentee_trend_ctq']

    def get_month(self, obj):
        return obj.month_year_ctq.strftime('%B %Y')  # e.g., "July 2025"




# serializers.py

from rest_framework import serializers
from .models import AdvancedManpowerCTQ

class AdvancedManpowerCTQSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdvancedManpowerCTQ
        fields = [
            'month_year_ctq',
            'total_stations_ctq',
            'operator_required_ctq',
            'operator_availability_ctq',
            'buffer_manpower_required_ctq',
            'buffer_manpower_availability_ctq',
        ]




# serializers.py

from rest_framework import serializers
from .models import AdvancedManpowerCTQ

class OperatorTrendSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField()

    class Meta:
        model = AdvancedManpowerCTQ
        fields = ['month', 'operator_required_ctq', 'operator_availability_ctq']

    def get_month(self, obj):
        return obj.month_year_ctq.strftime('%B %Y')  # Example: "July 2025"







# serializers.py

class BufferManpowerTrendSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField()

    class Meta:
        model = AdvancedManpowerCTQ
        fields = ['month', 'buffer_manpower_required_ctq', 'buffer_manpower_availability_ctq']

    def get_month(self, obj):
        return obj.month_year_ctq.strftime('%B %Y')  # e.g., "July 2025"





# serializers.py

class AttritionTrendSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField()

    class Meta:
        model = AdvancedManpowerCTQ
        fields = ['month', 'attrition_trend_ctq']

    def get_month(self, obj):
        return obj.month_year_ctq.strftime('%B %Y')  # Example: "July 2025"





# serializers.py

class AbsenteeTrendSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField()

    class Meta:
        model = AdvancedManpowerCTQ
        fields = ['month', 'absentee_trend_ctq']

    def get_month(self, obj):
        return obj.month_year_ctq.strftime('%B %Y')  # e.g., "July 2025"


from rest_framework import serializers
from .models import OperatorRequirement, Factory, Department

class OperatorRequirementSerializer(serializers.ModelSerializer):
    factory_name = serializers.SerializerMethodField()
    department_name = serializers.SerializerMethodField()

    class Meta:
        model = OperatorRequirement
        fields = [
            'id',
            'factory',
            'department',
            'month',
            'level',
            'operator_required',
            'operator_available',
            'factory_name',
            'department_name',
        ]

    def get_factory_name(self, obj):
        return obj.factory.name if obj.factory else None

    def get_department_name(self, obj):
        return obj.department.name if obj.department else None

    def validate(self, data):
        factory = data.get('factory')
        department = data.get('department')

        # Optional: Validate department belongs to the selected factory
        if department and factory and department.factory_id != factory.id:
            raise serializers.ValidationError("The selected department does not belong to the given factory.")
        return data
      
# l2fileuloading
from rest_framework import serializers
from .models import L2FileUpload

class L2FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = L2FileUpload
        fields='__all__'

# exam tool
from rest_framework import serializers
from .models import UploadedFile

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ['id', 'title', 'file', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


from rest_framework import serializers
from .models import Level2TrainingContent

class Level2TrainingContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level2TrainingContent
        fields = [
            'id',
            'topic',
            'description',
            'training_file',
            'url_link',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.training_file:
            representation['training_file'] = instance.training_file.url
        return representation
    
from rest_framework import serializers
from .models import Level3TrainingContent

class Level3TrainingContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level3TrainingContent
        fields = [
            'id',
            'topic',
            'description',
            'training_file',
            'url_link',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.training_file:
            representation['training_file'] = instance.training_file.url
        return representation



from rest_framework import serializers
from .models import SkillsList

class SkillsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillsList
        fields = ['id', 'skill']



# han chou & shoku chou 

from .models import HanContent
from .models import HanTrainingContent

class HanContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HanContent
        fields = ['id', 'title']


class HanTrainingContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HanTrainingContent
        fields = ['id', 'han_content', 'training_file', 'url_link', 'description']

from .models import ShoContent, ShoTrainingContent
from rest_framework import serializers


class ShoContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoContent
        fields = ['id', 'title']


class ShoTrainingContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoTrainingContent
        fields = ['id', 'sho_content', 'training_file', 'url_link', 'description']
# end


#Employee Card 


class OperatorCardSkillSerializer(serializers.ModelSerializer):
    operator_name = serializers.CharField(source='employee.full_name', read_only=True)
    operation_name = serializers.CharField(source='operation.name', read_only=True)
    skill_matrix_name = serializers.CharField(source='skill_matrix.shop_department', read_only=True)

    class Meta:
        model = OperatorLevel
        fields = '__all__'
        # fields = [
        #     'id',
        #     'operator_name',
        #     'operation_name',
        #     'skill_matrix_name',
        #     'level',
        #     'created_at',
        #     'remarks',
        # ]






from rest_framework import serializers
from .models import Score

class CardScoreSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)

    class Meta:
        model = Score
        fields = [
            'id',
            'employee_name',
            'test_name',
            'marks',
            'created_at',
            'percentage',
            'passed',
        ]






from rest_framework import serializers
from .models import MultiSkilling

class CardMultiSkillingSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    station_number = serializers.SerializerMethodField()
    skill_level_value = serializers.CharField(source='skill_level', read_only=True)
    department_name = serializers.CharField(source='department.department', read_only=True)
    class Meta:
        model = MultiSkilling
        fields = '__all__'
        # fields = [
        #     'id',
        #     'employee_name',
        #     'station_number',
        #     # 'skill',
        #     'skill_level_value',
        #     # 'start_date',
        #     # 'end_date',
        #     # 'notes',
        #     'status',
        #     'reason',
        #     'refreshment_date',
        #     'department_name',
        # ]

    def get_station_number(self, obj):
        # Return a default station number or extract from related data if available
        return getattr(obj.section, 'id', None) if obj.section else None







from rest_framework import serializers
from .models import Schedule

class CardRefreshmentTrainingSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    card_no = serializers.CharField(source='employee.employee_code', read_only=True)
    venue_name = serializers.CharField(source='venue.name', read_only=True)
    trainer_name = serializers.CharField(source='trainer.name', read_only=True)
    training_topic = serializers.CharField(source='training_name.topic', read_only=True)

    class Meta:
        model = Schedule
        fields = "__all__"



# ==================== NOTIFICATION SERIALIZERS ====================

from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Notification model with comprehensive data formatting
    """
    recipient_name = serializers.SerializerMethodField()
    operator_name = serializers.SerializerMethodField()
    level_name = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    is_recent = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'notification_type', 'recipient',
            'recipient_name', 'recipient_email', 'operator', 'operator_name',
            'level', 'level_name', 'training_schedule', 'is_read', 'is_sent',
            'read_at', 'created_at', 'sent_at', 'metadata', 'priority',
            'time_ago', 'is_recent'
        ]
        read_only_fields = ['id', 'created_at', 'sent_at', 'time_ago', 'is_recent']

    def get_recipient_name(self, obj):
        """Get recipient's full name"""
        if obj.recipient:
            return f"{obj.recipient.first_name} {obj.recipient.last_name}".strip()
        return None

    def get_operator_name(self, obj):
        """Get operator's full name"""
        if obj.operator:
            return obj.operator.full_name
        return None

    def get_level_name(self, obj):
        """Get level display name"""
        if obj.level:
            return obj.level.get_name_display()
        return None

    def get_time_ago(self, obj):
        """Get human-readable time difference"""
        from django.utils import timezone
        from datetime import timedelta

        now = timezone.now()
        diff = now - obj.created_at

        if diff.days > 0:
            return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        else:
            return "Just now"

    def get_is_recent(self, obj):
        """Check if notification is recent (within last 24 hours)"""
        from django.utils import timezone
        from datetime import timedelta

        return obj.created_at > timezone.now() - timedelta(hours=24)


class NotificationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating notifications
    """
    class Meta:
        model = Notification
        fields = [
            'title', 'message', 'notification_type', 'recipient',
            'recipient_email', 'operator', 'level', 'training_schedule',
            'priority', 'metadata'
        ]

    def validate(self, data):
        """Validate that at least one recipient is specified"""
        if not data.get('recipient') and not data.get('recipient_email'):
            raise serializers.ValidationError(
                "Either recipient or recipient_email must be specified."
            )
        return data


class NotificationUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating notification status
    """
    class Meta:
        model = Notification
        fields = ['is_read', 'read_at']

    def update(self, instance, validated_data):
        """Custom update to handle read status changes"""
        if 'is_read' in validated_data:
            if validated_data['is_read'] and not instance.is_read:
                # Mark as read
                instance.mark_as_read()
            elif not validated_data['is_read'] and instance.is_read:
                # Mark as unread
                instance.mark_as_unread()
        return instance


class NotificationStatsSerializer(serializers.Serializer):
    """
    Serializer for notification statistics
    """
    total_count = serializers.IntegerField()
    unread_count = serializers.IntegerField()
    read_count = serializers.IntegerField()
    recent_count = serializers.IntegerField()
    by_type = serializers.DictField()
    by_priority = serializers.DictField()


# end





from rest_framework import serializers
from .models import OperatorMaster

class CardEmployeeMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatorMaster
        fields = '__all__'




from rest_framework import serializers
from .models import UserInfo

class UserInfoSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    phoneNumber = serializers.CharField(source='phone_number')
    tempId = serializers.CharField(source='temp_id', read_only=True)

    class Meta:
        model = UserInfo
        fields = ['id', 'firstName', 'lastName', 'tempId', 'email', 'phoneNumber', 'sex', 'created_at', 'updated_at', 'is_active']
        extra_kwargs = {
            'email': {'required': False, 'allow_null': True},
            'phoneNumber': {'required': True},
            'sex': {'required': True}
        }

    def create(self, validated_data):
        return UserInfo.objects.create(**validated_data)
    
from rest_framework import serializers
from .models import HumanBodyCheck

class HumanBodyCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = HumanBodyCheck
        fields = '__all__'
        read_only_fields = ['check_date', 'overall_status']
        
    def validate(self, data):
        # Ensure temp_id is provided
        if not data.get('temp_id'):
            raise serializers.ValidationError("temp_id is required")
            
        # Validate status fields
        status_fields = [
            'color_vision', 'eye_movement', 'fingers_functionality',
            'hand_deformity', 'joint_mobility', 'hearing', 'bending_ability'
        ]
        
        for field in status_fields:
            if field in data and data[field] not in ['pass', 'fail', 'pending']:
                raise serializers.ValidationError(f"{field} must be 'pass', 'fail', or 'pending'")
                
        return data
    

class ListUserInfoWithBodyCheckSerializer(serializers.ModelSerializer):
    body_checks = serializers.SerializerMethodField()

    class Meta:
        model = UserInfo
        fields = [
            'first_name', 'last_name', 'temp_id', 'email', 'phone_number', 
            'sex', 'created_at', 'is_active', 'body_checks'
        ]

    def get_body_checks(self, obj):
        checks = HumanBodyCheck.objects.filter(temp_id=obj.temp_id)
        return HumanBodyCheckSerializer(checks, many=True).data
                                        



#SDC Orientation Feedback Serializer
from rest_framework import serializers
from .models import SDCOrientationFeedback

class SDCOrientationFeedbackSerializer(serializers.ModelSerializer):
    trainee_name = serializers.SerializerMethodField()
    sr_no = serializers.SerializerMethodField()
    doj = serializers.SerializerMethodField()

    class Meta:
        model = SDCOrientationFeedback
        fields = [
            'id',
            'user',
            'temp_id',
            'date_of_training',
            'department',
            'trainer_name',
            'not_understood',
            'good',
            'very_good',
            'better',
            'best',
            'suggestion',
            'trainee_signature',
            'training_incharge_signature',
            'trainee_name',
            'sr_no',
            'doj',
        ]

    def get_trainee_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}" if obj.user else "Unknown"

    def get_sr_no(self, obj):
        return getattr(obj.user, 'sr_no', None)

    def get_doj(self, obj):
        return getattr(obj.user, 'date_of_join', None)
















from rest_framework import serializers
from .models import UserInfo, HumanBodyCheck, SDCOrientationFeedback

class FetchHumanBodyCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = HumanBodyCheck
        fields = '__all__'

class FetchSDCOrientationFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDCOrientationFeedback
        fields = '__all__'

class FetchUserInfoSerializer(serializers.ModelSerializer):
    body_check = serializers.SerializerMethodField()
    orientation_feedbacks = FetchSDCOrientationFeedbackSerializer(many=True, read_only=True)

    class Meta:
        model = UserInfo
        fields = [
           'id', 'first_name', 'last_name', 'temp_id', 'email', 'phone_number',
            'sex', 'created_at', 'updated_at', 'is_active',
            'body_check', 'orientation_feedbacks'
        ]

    def get_body_check(self, obj):
        body_check = HumanBodyCheck.objects.filter(temp_id=obj.temp_id, overall_status='pass').first()
        return FetchHumanBodyCheckSerializer(body_check).data if body_check else None



